import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser, getUserLikes, likeProduct, unlikeProduct } from "../utils/users";

type LikesContextValue = {
	likedIds: Set<number>;
	toggleLike: (id: number) => void;
	isLiked: (id: number) => boolean;
	isLoading: boolean;
};

const LIKES_STORAGE_KEY = 'user_likes_storage';
const CURRENT_USER_ID_KEY = 'current_user_id';

const LikesContext = createContext<LikesContextValue | undefined>(undefined);

export const LikesProvider = ({ children }: { children: React.ReactNode }) => {
	const [likedIdsState, setLikedIdsState] = useState<Set<number>>(new Set());
	const [isLoading, setIsLoading] = useState(false);
	const [currentUserId, setCurrentUserId] = useState<number | null>(null);

	// Load user's likes from AsyncStorage on mount
	useEffect(() => {
		loadPersistence();
	}, []);

	const loadPersistence = async () => {
		try {
			const storedUserId = await AsyncStorage.getItem(CURRENT_USER_ID_KEY);
			const user = await getCurrentUser();
			const userId = user.id;

			if (storedUserId !== String(userId)) {
				// Different user - load from API
				try {
					const apiLikes = await getUserLikes(userId);
					setLikedIdsState(new Set(apiLikes));
					setCurrentUserId(userId);
					await AsyncStorage.setItem(CURRENT_USER_ID_KEY, String(userId));
					await AsyncStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify({ likedProductIds: apiLikes }));
				} catch {
					setLikedIdsState(new Set());
					setCurrentUserId(userId);
					await AsyncStorage.setItem(CURRENT_USER_ID_KEY, String(userId));
					await AsyncStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify({ likedProductIds: [] }));
				}
			} else {
				// Same user, first try to load from API, fallback to storage
				setCurrentUserId(userId);
				try {
					const apiLikes = await getUserLikes(userId);
					setLikedIdsState(new Set(apiLikes));
					// Update storage with API data
					await AsyncStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify({ likedProductIds: apiLikes }));
				} catch {
					// Fallback to storage
					const storedLikes = await AsyncStorage.getItem(LIKES_STORAGE_KEY);
					if (storedLikes) {
						const likesData = JSON.parse(storedLikes);
						setLikedIdsState(new Set(likesData.likedProductIds || []));
					}
				}
			}
		} catch (error) {
			console.error('Failed to load persistence:', error);
		}
	};

	// Save likes to AsyncStorage whenever they change
	useEffect(() => {
		if (currentUserId) {
			saveLikesToStorage();
		}
	}, [likedIdsState, currentUserId]);

	const saveLikesToStorage = async () => {
		try {
			const likesData = { likedProductIds: Array.from(likedIdsState) };
			await AsyncStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likesData));
		} catch (error) {
			console.error('Failed to save likes to storage:', error);
		}
	};

	const toggleLike = useCallback(async (productId: number) => {
		const isCurrentlyLiked = likedIdsState.has(productId);

		// Optimistically update UI state first
		setLikedIdsState((prev) => {
			const next = new Set(prev);
			if (next.has(productId)) {
				next.delete(productId);
			} else {
				next.add(productId);
			}
			return next;
		});

		try {
			setIsLoading(true);
			if (isCurrentlyLiked) {
				await unlikeProduct(productId);
			} else {
				await likeProduct(productId);
			}
		} catch (error) {
			console.error('Failed to toggle like:', error);
			// Revert optimistic update on failure
			setLikedIdsState((prev) => {
				const next = new Set(prev);
				if (isCurrentlyLiked) {
					next.add(productId);
				} else {
					next.delete(productId);
				}
				return next;
			});
		} finally {
			setIsLoading(false);
		}
	}, [likedIdsState]);

	const isLiked = useCallback((id: number) => likedIdsState.has(id), [likedIdsState]);

	const value = useMemo(
		() => ({ likedIds: likedIdsState, toggleLike, isLiked, isLoading }),
		[likedIdsState, toggleLike, isLiked, isLoading]
	);

	return <LikesContext.Provider value={value}>{children}</LikesContext.Provider>;
};

export const useLikes = () => {
	const ctx = useContext(LikesContext);
	if (!ctx) {
		throw new Error("useLikes must be used within LikesProvider");
	}
	return ctx;
};

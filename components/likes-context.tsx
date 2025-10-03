import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toggleLike as apiToggleLike, getUserLikes } from "@/utils/api";

type LikesContextValue = {
	likedIds: Set<number>;
	toggleLike: (id: number) => Promise<void>;
	isLiked: (id: number) => boolean;
	loading: boolean;
};

const LikesContext = createContext<LikesContextValue | undefined>(undefined);

export const LikesProvider = ({ children }: { children: React.ReactNode }) => {
	const [likedIdsState, setLikedIdsState] = useState<Set<number>>(new Set());
	const [loading, setLoading] = useState(true);

	// Charger les likes de l'utilisateur au démarrage
	useEffect(() => {
		const loadUserLikes = async () => {
			try {
				const likes = await getUserLikes();
				const likedIds = new Set(likes.map((like: any) => like.produitId));
				setLikedIdsState(likedIds);
			} catch (error) {
				console.error('Erreur chargement likes:', error);
			} finally {
				setLoading(false);
			}
		};
		loadUserLikes();
	}, []);

	const toggleLike = useCallback(async (id: number) => {
		try {
			const liked = await apiToggleLike(id);
			setLikedIdsState((prev) => {
				const next = new Set(prev);
				if (liked) {
					next.add(id);
				} else {
					next.delete(id);
				}
				return next;
			});
		} catch (error) {
			console.error('Erreur toggle like:', error);
			// En cas d'erreur, on ne change pas l'état local
		}
	}, []);

	const isLiked = useCallback((id: number) => likedIdsState.has(id), [likedIdsState]);

	const value = useMemo(
		() => ({ likedIds: likedIdsState, toggleLike, isLiked, loading }),
		[likedIdsState, toggleLike, isLiked, loading]
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

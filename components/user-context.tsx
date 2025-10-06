import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser, isAuthenticated } from '../utils/users';

type User = {
	name: string;
	email: string;
	photoUri?: string;
	telephone?: string;
	localisation?: string;
};

type UserContextValue = {
	user: User;
	updateUser: (updates: Partial<User>) => void;
	logout: () => void;
};

const defaultUser: User = {
	name: "Amaka",
	email: "Amaka@gmail.com",
	photoUri: undefined,
};

const STORAGE_KEY = 'user_profile_data';

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [userState, setUserState] = useState<User>(defaultUser);

	// Load saved profile data and authenticated user data on component mount
	useEffect(() => {
		const loadProfileData = async () => {
			try {
				// First check if user is authenticated and load authenticated user data
				const authenticated = await isAuthenticated();
				if (authenticated) {
					try {
						const authUser = await getCurrentUser();
						setUserState(prev => ({
							...prev,
							name: authUser.nom,
							email: authUser.email,
							telephone: authUser.telephone,
							localisation: authUser.localisation,
							// Keep existing photoUri if any
						}));
					} catch (authError) {
						console.error('Failed to load authenticated user data:', authError);
						// Fall back to saved data if auth fails
					}
				}

				// Load additional profile data (like photoUri) from AsyncStorage
				const savedData = await AsyncStorage.getItem(STORAGE_KEY);
				if (savedData) {
					const parsedData = JSON.parse(savedData);
					setUserState(prev => ({ ...prev, ...parsedData }));
				}
			} catch (error) {
				console.error('Failed to load profile data:', error);
			}
		};
		loadProfileData();
	}, []);

	const updateUser = useCallback((updates: Partial<User>) => {
		setUserState((prev) => {
			const newState = { ...prev, ...updates };
			// Persist non-default user data to AsyncStorage
			if (newState.name !== defaultUser.name ||
				newState.email !== defaultUser.email ||
				newState.photoUri !== undefined) {
				const dataToSave = {
					name: newState.name !== defaultUser.name ? newState.name : undefined,
					email: newState.email !== defaultUser.email ? newState.email : undefined,
					photoUri: newState.photoUri
				};
				AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave)).catch(error => {
					console.error('Failed to save profile data:', error);
				});
			}
			return newState;
		});
	}, []);

	const logout = useCallback(() => {
		setUserState(defaultUser);
		AsyncStorage.removeItem(STORAGE_KEY).catch(error => {
			console.error('Failed to clear profile data:', error);
		});
	}, []);

	const value = useMemo(() => ({ user: userState, updateUser, logout }), [userState, updateUser, logout]);

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
	const ctx = useContext(UserContext);
	if (!ctx) throw new Error("useUser must be used within UserProvider");
	return ctx;
};

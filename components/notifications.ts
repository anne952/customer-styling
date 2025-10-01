import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function configureNotifications() {
	Notifications.setNotificationHandler({
		handleNotification: async () => ({
			shouldShowAlert: true,
			shouldPlaySound: false,
			shouldSetBadge: false,
			// iOS specific fields required by NotificationBehavior in newer SDKs
			shouldShowBanner: true,
			shouldShowList: true,
		}),
	});

	const { status: existingStatus } = await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;
	if (existingStatus !== 'granted') {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}
	if (finalStatus !== 'granted') {
		return null;
	}

	if (Platform.OS === 'android') {
		await Notifications.setNotificationChannelAsync('orders', {
			name: 'Commandes',
			importance: Notifications.AndroidImportance.DEFAULT,
		});
	}

	try {
		const token = await Notifications.getExpoPushTokenAsync();
		return token.data;
	} catch {
		return null;
	}
}

export async function notifyOrderAccepted(orderId: string) {
	await Notifications.scheduleNotificationAsync({
		content: { title: 'Commande acceptée', body: `Votre commande ${orderId} a été acceptée.` },
		trigger: null,
		identifier: `order-accepted-${orderId}`,
	});
}

export async function notifyOrderDelivered(orderId: string) {
	await Notifications.scheduleNotificationAsync({
		content: { title: 'Commande livrée', body: `Votre commande ${orderId} est livrée.` },
		trigger: null,
		identifier: `order-delivered-${orderId}`,
	});
}

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { authService } from './authService';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.isConfigured = false;
  }

  async configure() {
    if (this.isConfigured) return;

    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return;
      }

      // Get push token
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Push token:', token);

      // Register token with backend
      await this.registerPushToken(token);

      this.isConfigured = true;
      console.log('✅ Notifications configured successfully');

    } catch (error) {
      console.error('Error configuring notifications:', error);
    }
  }

  async registerPushToken(token) {
    try {
      // This would be called after user login
      // You might want to store the token in your auth context
      await authService.updateProfile({ pushToken: token });
      console.log('Push token registered with backend');
    } catch (error) {
      console.error('Error registering push token:', error);
    }
  }

  // Schedule a local notification
  async scheduleLocalNotification(title, body, data = {}) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
      },
      trigger: null, // Send immediately
    });
  }

  // Schedule game reminder
  async scheduleGameReminder(game, minutesBefore = 30) {
    const gameTime = new Date(game.time); // Assuming game.time is a Date object
    const triggerTime = new Date(gameTime.getTime() - minutesBefore * 60000);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Game Starting Soon!`,
        body: `${game.away_team} vs ${game.home_team} starts in ${minutesBefore} minutes`,
        data: { gameId: game.id, type: 'game_reminder' },
        sound: 'default',
      },
      trigger: {
        date: triggerTime,
      },
    });
  }

  // Cancel all scheduled notifications
  async cancelAllScheduledNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Get notification permissions status
  async getPermissionStatus() {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  }
}

export default new NotificationService();

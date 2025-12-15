import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, logEvent, setUserProperties, setUserId } from 'firebase/analytics';

class FirebaseService {
  constructor() {
    this.initialized = false;
    this.analytics = null;
  }

  initialize = () => {
    if (this.initialized || getApps().length > 0) {
      return;
    }

    const firebaseConfig = {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };

    try {
      const app = initializeApp(firebaseConfig);
      this.analytics = getAnalytics(app);
      this.initialized = true;
      console.log('✅ Firebase Analytics initialized');
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
  };

  // Screen tracking
  trackScreenView = (screenName, screenClass = '') => {
    if (!this.analytics) return;
    
    logEvent(this.analytics, 'screen_view', {
      firebase_screen: screenName,
      firebase_screen_class: screenClass,
      timestamp: Date.now(),
    });
  };

  // Button click tracking
  trackButtonClick = (buttonName, location = '', params = {}) => {
    if (!this.analytics) return;
    
    logEvent(this.analytics, 'button_click', {
      button_name: buttonName,
      location,
      ...params,
      timestamp: Date.now(),
    });
  };

  // Purchase tracking
  trackPurchase = (transactionId, value, currency = 'USD', items = []) => {
    if (!this.analytics) return;
    
    logEvent(this.analytics, 'purchase', {
      transaction_id: transactionId,
      value,
      currency,
      items: JSON.stringify(items),
      timestamp: Date.now(),
    });
  };

  // Subscription tracking
  trackSubscription = (event, subscriptionData) => {
    if (!this.analytics) return;
    
    logEvent(this.analytics, `subscription_${event}`, {
      ...subscriptionData,
      timestamp: Date.now(),
    });
  };

  // Set user properties
  setUserProperties = (properties) => {
    if (!this.analytics) return;
    
    setUserProperties(this.analytics, properties);
  };

  // Set user ID
  setUserId = (userId) => {
    if (!this.analytics) return;
    
    setUserId(this.analytics, userId);
  };
}

export default new FirebaseService();

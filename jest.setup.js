// jest.setup.js - Better setup for React 18 + Expo 50

// Mock AsyncStorage properly
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(JSON.stringify({ test: 'data' }))),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

// Mock react-native-purchases
jest.mock('react-native-purchases', () => ({
  setup: jest.fn(),
  getCustomerInfo: jest.fn(() => Promise.resolve({ 
    activeSubscriptions: [],
    entitlements: { active: {} }
  })),
  getOfferings: jest.fn(() => Promise.resolve({
    current: {
      availablePackages: []
    }
  })),
  restorePurchases: jest.fn(() => Promise.resolve({})),
  purchasePackage: jest.fn(() => Promise.resolve({})),
  setAttributes: jest.fn(() => Promise.resolve({})),
  setDebugLogsEnabled: jest.fn(),
}));

// Mock other native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}));
jest.mock('react-native/Libraries/LogBox/LogBox', () => ({
  ignoreLogs: jest.fn(),
  ignoreAllLogs: jest.fn(),
}));

// Mock expo modules
jest.mock('expo-linear-gradient', () => 'LinearGradient');
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

// Mock react-navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useFocusEffect: jest.fn(),
}));

// Mock react-native-screens
jest.mock('react-native-screens', () => ({}));

// Suppress specific warnings in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    // Suppress act warnings and other common test warnings
    if (typeof args[0] === 'string') {
      if (args[0].includes('Warning: An update to %s inside a test was not wrapped in act')) {
        return;
      }
      if (args[0].includes('Warning: React.createElement: type is invalid')) {
        return;
      }
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Global timeout
jest.setTimeout(15000);

// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

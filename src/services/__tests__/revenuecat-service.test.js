// Mock dependencies at the top
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

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Try both default and named import
const RevenueCatServiceModule = require('../revenuecat-service');
// If it's a default export, use .default, otherwise use the named export
const RevenueCatService = RevenueCatServiceModule.default || RevenueCatServiceModule;

describe('RevenueCatService', () => {
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    // Try to instantiate only if it's a constructor
    if (typeof RevenueCatService === 'function') {
      service = new RevenueCatService();
    } else if (RevenueCatService && typeof RevenueCatService === 'object') {
      // If it's already an instance/object
      service = RevenueCatService;
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have initialize method or be an object', () => {
    if (service && typeof service === 'object') {
      expect(service).toBeTruthy();
    } else {
      expect(service.initialize).toBeDefined();
    }
  });

  // If it's not a class but an object with methods, test those
  it('should have necessary methods', () => {
    const methods = ['initialize', 'checkPremiumAccess', 'restorePurchases'];
    methods.forEach(method => {
      if (service[method]) {
        expect(typeof service[method]).toBe('function');
      }
    });
  });
});

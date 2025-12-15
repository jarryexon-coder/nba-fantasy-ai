// Service exports - Centralized imports
export { default as apiClient } from './api';
export { default as nbaService } from './nbaService';
export { default as authService } from './authService';
export { default as backendAuthService } from './backendAuthService';
export { default as favoritesService } from './favoritesService';
export { default as liveGamesService } from './liveGamesService';
export { default as notificationService } from './notificationService';

// Test all services connection
export const testAllServices = async () => {
  console.log('🧪 Testing all service connections via tunnel...');
  try {
    const results = await Promise.allSettled([
      // Add service connection tests here
    ]);
    console.log('✅ All services tested via tunnel');
    return results;
  } catch (error) {
    console.error('❌ Service connection test failed:', error);
    throw error;
  }
};

import { AppRegistry, NativeModules } from 'react-native';
import App from './App';

console.log('>>> [TRACE] INDEX.JS START - NativeModules:', Object.keys(NativeModules).length);

// Add a timeout to check if bridge is alive
setTimeout(() => {
  console.log('>>> [TRACE] 2-second bridge heartbeat - Bridge is responsive');
}, 2000);

// --- ADDED DEBUGGING CODE FROM FILE 1 ---
// Attempt to manually probe the bridge and trigger a reload
setTimeout(async () => {
  console.log('>>> [TRACE] Attempting to manually invalidate bridge...');
  
  // Try to force a bridge teardown (simulating what Fast Refresh does)
  if (global.__r) {
    console.log('>>> [TRACE] React instance found');
  }
  
  // Check DevSettings module (often involved in reloads)
  if (NativeModules.DevSettings) {
    console.log('>>> [TRACE] DevSettings module exists:', 
      Object.keys(NativeModules.DevSettings));
    
    // Try to trigger a reload manually
    try {
      await NativeModules.DevSettings.reload();
      console.log('>>> [TRACE] Manual reload triggered');
    } catch (e) {
      console.log('>>> [TRACE] Manual reload failed:', e.message);
    }
  }
}, 5000);
// --- END OF ADDED CODE ---

AppRegistry.registerComponent('main', () => App);
console.log('>>> [TRACE] INDEX.JS REGISTRATION COMPLETE <<<');

// File: src/hooks/useDailyLocks.js
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// REMOVED: import { AccessContext } from '../navigation/MainNavigator';

const useDailyLocks = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dailyUnlocks, setDailyUnlocks] = useState(0);
  const [lastResetDate, setLastResetDate] = useState(null);

  const checkAndResetDailyUnlocks = useCallback(async () => {
    try {
      const today = new Date().toDateString();
      const storedDate = await AsyncStorage.getItem('lastResetDate');
      
      if (storedDate !== today) {
        // Reset to 5 daily unlocks
        await AsyncStorage.setItem('dailyUnlocks', '5');
        await AsyncStorage.setItem('lastResetDate', today);
        setDailyUnlocks(5);
        setLastResetDate(today);
        return 5;
      }
      
      const unlocks = parseInt(await AsyncStorage.getItem('dailyUnlocks') || '5');
      setDailyUnlocks(unlocks);
      setLastResetDate(storedDate);
      return unlocks;
    } catch (error) {
      console.error('Error checking/resetting daily unlocks:', error);
      return 5; // Default fallback
    }
  }, []);

  const useDailyUnlock = useCallback(async () => {
    try {
      const currentUnlocks = await checkAndResetDailyUnlocks();
      if (currentUnlocks > 0) {
        const newUnlocks = currentUnlocks - 1;
        await AsyncStorage.setItem('dailyUnlocks', newUnlocks.toString());
        setDailyUnlocks(newUnlocks);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error using daily unlock:', error);
      return false;
    }
  }, [checkAndResetDailyUnlocks]);

  useEffect(() => {
    const initialize = async () => {
      try {
        const unlocks = await checkAndResetDailyUnlocks();
        setHasAccess(unlocks > 0);
      } catch (error) {
        console.error('Error initializing daily locks:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [checkAndResetDailyUnlocks]);

  return {
    hasAccess,
    loading,
    dailyUnlocks,
    useDailyUnlock,
    checkAndResetDailyUnlocks
  };
};

export default useDailyLocks;

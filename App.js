import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/theme/ThemeContext';
import GroupedTabNavigator from './src/navigation/GroupedTabNavigator';

// Suppress specific warnings temporarily
LogBox.ignoreLogs([
  'Encountered two children with the same key',
  'VirtualizedLists should never be nested',
  'Non-serializable values were found in the navigation state',
]);

export default function App() {
  useEffect(() => {
    // You can remove this suppression once app is stable
    console.log('App starting...');
  }, []);

  return (
    <ThemeProvider>
      <NavigationContainer>
        <GroupedTabNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import ALL your enhanced screens - This is your complete list.
import HomeScreen from './src/screens/HomeScreen-Enhanced-v2';  // Fixed: Changed to match actual filename
import PlayerStatsScreen from './src/screens/PlayerStatsScreen-enhanced';
import FantasyScreen from './src/screens/FantasyScreen-enhanced-v2';
import LiveGamesScreen from './src/screens/LiveGamesScreen-enhanced';
import SportsNewsHub from './src/screens/SportsNewsHub-enhanced';
import NHLScreen from './src/screens/NHLScreen-enhanced';
import NFLScreen from './src/screens/NFLScreen-enhanced';
import AnalyticsScreen from './src/screens/AnalyticsScreen-enhanced';
import DailyPicksScreen from './src/screens/DailyPicksScreen-enhanced';

const Tab = createBottomTabNavigator();

export default function App() {
  // Optional: Keep your API health check if you want.
  useEffect(() => {
    console.log('🚀 Sports Analytics App Starting...');
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            
            // Icon mapping for all 9 tabs
            if (route.name === 'Home') {
              iconName = focused ? 'basketball' : 'basketball-outline';
            } else if (route.name === 'Stats') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            } else if (route.name === 'Fantasy') {
              iconName = focused ? 'trophy' : 'trophy-outline';
            } else if (route.name === 'Live') {
              iconName = focused ? 'tv' : 'tv-outline';
            } else if (route.name === 'Headlines') {
              iconName = focused ? 'newspaper' : 'newspaper-outline';
            } else if (route.name === 'NHL') {
              iconName = focused ? 'snow' : 'snow-outline';
            } else if (route.name === 'NFL') {
              iconName = focused ? 'american-football' : 'american-football-outline';
            } else if (route.name === 'Analytics') {
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
            } else if (route.name === 'DailyPicks') {
              iconName = focused ? 'sparkles' : 'sparkles-outline';
            } else {
              iconName = 'help-circle-outline';
            }
            
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#3b82f6', // Blue
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#f1f5f9',
            height: 60,
            paddingBottom: 5,
            paddingTop: 5,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '500',
          },
          headerShown: false, // Hides the header on all tabs
        })}
      >
        {/* Define all 9 tabs */}
        <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'NBA' }} />
        <Tab.Screen name="Stats" component={PlayerStatsScreen} />
        <Tab.Screen name="NHL" component={NHLScreen} />
        <Tab.Screen name="NFL" component={NFLScreen} />
        <Tab.Screen name="Fantasy" component={FantasyScreen} />
        <Tab.Screen name="Live" component={LiveGamesScreen} options={{ tabBarLabel: 'Live' }} />
        <Tab.Screen name="Headlines" component={SportsNewsHub} />
        <Tab.Screen name="Analytics" component={AnalyticsScreen} />
        <Tab.Screen name="DailyPicks" component={DailyPicksScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

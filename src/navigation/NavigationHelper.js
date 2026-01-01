// src/navigation/NavigationHelper.js
import { useNavigation } from '@react-navigation/native';

export const useAppNavigation = () => {
  const navigation = useNavigation();
  
  return {
    // Navigate to specific screens
    goToLogin: () => navigation.navigate('Login'),
    goToMainTabs: () => navigation.navigate('MainTabs'),
    goToPremium: () => navigation.navigate('Premium'),
    goToBetting: () => navigation.navigate('Betting'),
    goToSearch: () => navigation.navigate('SearchScreen'),
    goToTeamSelection: () => navigation.navigate('TeamSelectionScreen'),
    
    // Navigate within All Access category
    goToHome: () => navigation.navigate('AllAccess', { screen: 'Home' }),
    goToLiveGames: () => navigation.navigate('AllAccess', { screen: 'LiveGames' }),
    goToNHL: () => navigation.navigate('AllAccess', { screen: 'NHL' }),
    
    // Navigate within Premium Access category
    goToNFL: () => navigation.navigate('PremiumAccess', { screen: 'NFL' }),
    goToPlayerStats: () => navigation.navigate('PremiumAccess', { screen: 'PlayerStats' }),
    goToPlayerProfile: () => navigation.navigate('PremiumAccess', { screen: 'PlayerProfile' }),
    goToGameDetails: () => navigation.navigate('PremiumAccess', { screen: 'GameDetails' }),
    goToFantasy: () => navigation.navigate('PremiumAccess', { screen: 'Fantasy' }),
    
    // Navigate within Winners Circle category
    goToPredictions: () => navigation.navigate('WinnersCircle', { screen: 'Predictions' }),
    goToParlayBuilder: () => navigation.navigate('WinnersCircle', { screen: 'ParlayBuilder' }),
    goToDailyPicks: () => navigation.navigate('WinnersCircle', { screen: 'DailyPicks' }),
    goToSportsNewsHub: () => navigation.navigate('WinnersCircle', { screen: 'SportsNewsHub' }),
    goToAnalytics: () => navigation.navigate('WinnersCircle', { screen: 'Analytics' }),
    
    // Navigate within Misc category
    goToSettings: () => navigation.navigate('Settings', { screen: 'Settings' }),
    goToEditorUpdates: () => navigation.navigate('Settings', { screen: 'EditorUpdates' }),
    
    // Common navigation actions
    goBack: () => navigation.goBack(),
    resetToHome: () => navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    }),
  };
};

// Screen names constants
export const SCREENS = {
  // Main stacks
  LOGIN: 'Login',
  MAIN_TABS: 'MainTabs',
  
  // Categories
  ALL_ACCESS: 'AllAccess',
  PREMIUM_ACCESS: 'PremiumAccess',
  WINNERS_CIRCLE: 'WinnersCircle',
  SETTINGS: 'Settings',
  
  // Individual screens
  HOME: 'Home',
  LIVE_GAMES: 'LiveGames',
  NHL: 'NHL',
  NFL: 'NFL',
  PLAYER_STATS: 'PlayerStats',
  PLAYER_PROFILE: 'PlayerProfile',
  GAME_DETAILS: 'GameDetails',
  FANTASY: 'Fantasy',
  PREDICTIONS: 'Predictions',
  PARLAY_BUILDER: 'ParlayBuilder',
  DAILY_PICKS: 'DailyPicks',
  SPORTS_NEWS_HUB: 'SportsNewsHub',
  ANALYTICS: 'Analytics',
  SETTINGS_SCREEN: 'Settings',
  EDITOR_UPDATES: 'EditorUpdates',
  SEARCH: 'SearchScreen',
  TEAM_SELECTION: 'TeamSelectionScreen',
  BETTING: 'Betting',
  PREMIUM: 'Premium',
};

// src/screens/AnalyticsScreen-enhanced.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Switch,
  Platform,
  FlatList,
  Image,
  Alert,
  Share,
  SafeAreaView,
} from 'react-native';
import ProgressBar from 'react-native-animated-progress';
import CircularProgress from '../components/CircularProgress';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/api-service';
import { useSportsData } from '../hooks/useSportsData';
import SearchBar from '../components/SearchBar';
import { useSearch } from '../providers/SearchProvider';

// NEW: Import navigation helper
import { useAppNavigation } from '../navigation/NavigationHelper';

// NEW: Import RevenueCatGate component
import RevenueCatGate from '../components/RevenueCatGate';
import ErrorBoundary from '../components/ErrorBoundary';

const { width } = Dimensions.get('window');

// Analytics helper function
const logAnalyticsEvent = async (eventName, eventParams = {}) => {
  try {
    // Always create the event data
    const eventData = {
      event: eventName,
      params: eventParams,
      timestamp: new Date().toISOString(),
      platform: Platform.OS,
    };

    // Only log to console in development mode
    if (__DEV__) {
      console.log(`📊 Analytics Event: ${eventName}`, eventParams);
    }

    // Only use Firebase analytics on web in production mode
    if (Platform.OS === 'web' && !__DEV__ && typeof window !== 'undefined') {
      try {
        const firebaseApp = await import('firebase/app');
        const firebaseAnalytics = await import('firebase/analytics');
        
        let app;
        if (firebaseApp.getApps().length === 0) {
          const firebaseConfig = {
            apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyCi7YQ-vawFT3sIr1i8yuhhx-1vSplAneA",
            authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "nba-fantasy-ai.firebaseapp.com",
            projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "nba-fantasy-ai",
            storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "nba-fantasy-ai.appspot.com",
            messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "718718403866",
            appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:718718403866:web:e26e10994d62799a048379",
            measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-BLTPX9LJ7K"
          };
          
          app = firebaseApp.initializeApp(firebaseConfig);
        } else {
          app = firebaseApp.getApp();
        }
        
        const analytics = firebaseAnalytics.getAnalytics(app);
        if (analytics) {
          await firebaseAnalytics.logEvent(analytics, eventName, eventParams);
        }
      } catch (firebaseError) {
        // Firebase analytics error - fail silently in production
      }
    }
    
    try {
      const existingEvents = JSON.parse(await AsyncStorage.getItem('analytics_events') || '[]');
      existingEvents.push(eventData);
      if (existingEvents.length > 100) {
        existingEvents.splice(0, existingEvents.length - 100);
      }
      await AsyncStorage.setItem('analytics_events', JSON.stringify(existingEvents));
    } catch (storageError) {
      // Storage error - fail silently
    }
  } catch (error) {
    // General error - fail silently
  }
};

const AnalyticsScreen = () => {
  // NEW: Use the app navigation helper instead of regular useNavigation
  const navigation = useAppNavigation();
  
  const { searchHistory, addToSearchHistory } = useSearch();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSport, setSelectedSport] = useState('NBA');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [dateRange, setDateRange] = useState('Season');
  const [showPredictions, setShowPredictions] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareTeam1, setCompareTeam1] = useState(null);
  const [compareTeam2, setCompareTeam2] = useState(null);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Use sports data hook for real-time data
  const { data: sportsData, refreshAllData } = useSportsData({
    autoRefresh: true,
    refreshInterval: 60000
  });

  // NEW: Navigation helper functions
  const handleNavigateToPlayerStats = (player) => {
    navigation.goToPlayerStats();
    logAnalyticsEvent('analytics_navigate_player_stats', {
      player_name: player?.name || 'Unknown',
      screen_name: 'Analytics'
    });
  };

  const handleNavigateToPredictions = () => {
    navigation.goToPredictions();
    logAnalyticsEvent('analytics_navigate_predictions', {
      screen_name: 'Analytics'
    });
  };

  const handleNavigateToFantasy = () => {
    navigation.goToFantasy();
    logAnalyticsEvent('analytics_navigate_fantasy', {
      screen_name: 'Analytics'
    });
  };

  const handleNavigateToGameDetails = (gameId) => {
    navigation.goToGameDetails(gameId);
    logAnalyticsEvent('analytics_navigate_game_details', {
      game_id: gameId,
      screen_name: 'Analytics'
    });
  };

  const handleNavigateToDailyPicks = () => {
    navigation.goToDailyPicks();
    logAnalyticsEvent('analytics_navigate_daily_picks', {
      screen_name: 'Analytics'
    });
  };

  const handleNavigateToParlayBuilder = () => {
    navigation.goToParlayBuilder();
    logAnalyticsEvent('analytics_navigate_parlay_builder', {
      screen_name: 'Analytics'
    });
  };

  const handleNavigateToSportsNews = () => {
    navigation.goToSportsNews();
    logAnalyticsEvent('analytics_navigate_sports_news', {
      screen_name: 'Analytics'
    });
  };

  // NEW: Navigation menu component
  const renderNavigationMenu = () => (
    <View style={styles.navigationMenu}>
      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => handleNavigateToPlayerStats({ name: 'Player Stats' })}
        activeOpacity={0.7}
      >
        <Ionicons name="stats-chart" size={20} color="#14b8a6" />
        <Text style={styles.navButtonText}>Player Stats</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => handleNavigateToPredictions()}
        activeOpacity={0.7}
      >
        <Ionicons name="trending-up" size={20} color="#14b8a6" />
        <Text style={styles.navButtonText}>AI Predict</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => handleNavigateToParlayBuilder()}
        activeOpacity={0.7}
      >
        <Ionicons name="trending-up" size={20} color="#14b8a6" />
        <Text style={styles.navButtonText}>Parlay</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => handleNavigateToFantasy()}
        activeOpacity={0.7}
      >
        <Ionicons name="trophy" size={20} color="#14b8a6" />
        <Text style={styles.navButtonText}>Fantasy</Text>
      </TouchableOpacity>
    </View>
  );

  const sports = ['NBA', 'NFL', 'NHL', 'MLB', 'MLS'];
  const metrics = ['overview', 'trends', 'teams', 'players', 'predictions', 'advanced'];
  const teams = [
    'All Teams', 'Golden State Warriors', 'Los Angeles Lakers', 'Boston Celtics', 
    'Miami Heat', 'Denver Nuggets', 'Milwaukee Bucks', 'Philadelphia 76ers'
  ];
  const dateRanges = ['Today', 'Week', 'Month', 'Season', 'Last Season'];
  
  // Add quickMatchups array for comparison tools
  const quickMatchups = ['Lakers vs Warriors', 'Celtics vs Heat', 'Knicks vs Bulls', 'Nuggets vs Suns'];

  const sportsDataState = {
    NBA: {
      overview: {
        totalGames: 1230,
        avgPoints: 112.4,
        homeWinRate: '58.2%',
        avgMargin: 11.8,
        overUnder: '54% Over',
        keyTrend: 'Points up +3.2% from last season',
      },
      teams: {
        bestOffense: 'Milwaukee Bucks (118.3 PPG)',
        bestDefense: 'Cleveland Cavaliers (106.9 PPG)',
        mostImproved: 'Oklahoma City Thunder (+12 wins)',
        surpriseTeam: 'Orlando Magic',
      },
      players: {
        scoringLeader: 'Luka Dončić (34.6 PPG)',
        efficiencyLeader: 'Nikola Jokić (32.8 PER)',
        clutchPlayer: 'Stephen Curry (58% FG in clutch)',
        risingStar: 'Anthony Edwards',
      },
      trends: [
        { name: '3-Point Attempts', value: 35.2, change: '+4.8%', direction: 'up' },
        { name: 'Free Throw Rate', value: 0.218, change: '-2.1%', direction: 'down' },
        { name: 'Pace', value: 99.3, change: '+1.2%', direction: 'up' },
        { name: 'Turnovers', value: 13.8, change: '-0.8%', direction: 'down' },
      ],
      predictions: [
        { game: 'Lakers vs Warriors', prediction: 'Warriors -4.5', confidence: 72 },
        { game: 'Celtics vs Heat', prediction: 'Over 215.5', confidence: 68 },
        { game: 'Nuggets vs Suns', prediction: 'Nuggets ML', confidence: 81 },
      ],
      advancedStats: {
        pace: 99.3,
        offRating: 114.2,
        defRating: 111.8,
        netRating: 2.4,
        trueShooting: 58.1,
        assistRatio: 62.3,
      },
    },
    NFL: {
      overview: {
        totalGames: 272,
        avgPoints: 43.8,
        homeWinRate: '55.1%',
        avgMargin: 10.2,
        overUnder: '48% Over',
        keyTrend: 'Passing yards up +7.1%',
      },
      teams: {
        bestOffense: 'Miami Dolphins (29.9 PPG)',
        bestDefense: 'Baltimore Ravens (16.1 PPG)',
        mostImproved: 'Houston Texans (+7 wins)',
        surpriseTeam: 'Detroit Lions',
      },
      players: {
        passingLeader: 'Dak Prescott (4,516 yards)',
        rushingLeader: 'Christian McCaffrey (1,459 yards)',
        receivingLeader: 'Tyreek Hill (1,799 yards)',
        defensivePlayer: 'Myles Garrett (14 sacks)',
      },
      trends: [
        { name: 'Pass Attempts', value: 34.8, change: '+3.2%', direction: 'up' },
        { name: 'Run Rate', value: 42.1, change: '-1.8%', direction: 'down' },
        { name: 'Red Zone Efficiency', value: '55.2%', change: '+2.4%', direction: 'up' },
        { name: 'Turnovers', value: 1.9, change: '-0.3%', direction: 'down' },
      ],
      predictions: [
        { game: 'Chiefs vs Bills', prediction: 'Bills +2.5', confidence: 65 },
        { game: '49ers vs Cowboys', prediction: 'Under 48.5', confidence: 71 },
        { game: 'Eagles vs Seahawks', prediction: 'Eagles -3', confidence: 69 },
      ],
      advancedStats: {
        yardsPerPlay: 5.4,
        thirdDownPct: 40.2,
        redZonePct: 55.8,
        turnoverMargin: 0.3,
        timeOfPossession: 30.2,
        explosivePlayRate: 12.8,
      },
    },
    NHL: {
      overview: {
        totalGames: 1312,
        avgGoals: 6.1,
        homeWinRate: '53.8%',
        avgMargin: 2.4,
        overUnder: '52% Over',
        keyTrend: 'Power play success up +2.8%',
      },
      teams: {
        bestOffense: 'Colorado Avalanche (3.68 GPG)',
        bestDefense: 'Boston Bruins (2.12 GAA)',
        mostImproved: 'New Jersey Devils (+22 points)',
        surpriseTeam: 'Seattle Kraken',
      },
      players: {
        scoringLeader: 'Connor McDavid (153 points)',
        goalLeader: 'Auston Matthews (69 goals)',
        assistLeader: 'Leon Draisaitl (86 assists)',
        goalieLeader: 'Linus Ullmark (.938 SV%)',
      },
      trends: [
        { name: 'Power Play %', value: '22.7%', change: '+2.8%', direction: 'up' },
        { name: 'Penalty Kill %', value: '82.1%', change: '+1.2%', direction: 'up' },
        { name: 'Shots per Game', value: 31.4, change: '+0.8%', direction: 'up' },
        { name: 'Hits per Game', value: 21.8, change: '-1.1%', direction: 'down' },
      ],
      predictions: [
        { game: 'Maple Leafs vs Canadiens', prediction: 'Maple Leafs -1.5', confidence: 75 },
        { game: 'Bruins vs Rangers', prediction: 'Over 6.0', confidence: 63 },
        { game: 'Oilers vs Golden Knights', prediction: 'Oilers ML', confidence: 70 },
      ],
      advancedStats: {
        corsiForPct: 52.1,
        fenwickForPct: 51.8,
        pdo: 100.2,
        expectedGoals: 3.12,
        highDangerChances: 11.4,
        savePercentage: 0.912,
      },
    },
  };

  // Sample data for trends
  const pointsTrendData = [
    { month: 'Oct', value: 108.2 },
    { month: 'Nov', value: 110.5 },
    { month: 'Dec', value: 112.4 },
    { month: 'Jan', value: 113.8 },
    { month: 'Feb', value: 112.1 },
    { month: 'Mar', value: 111.9 },
  ];

  const teamComparisonData = [
    { category: 'Offense', value: 85 },
    { category: 'Defense', value: 72 },
    { category: 'Rebounding', value: 88 },
    { category: 'Assists', value: 79 },
    { category: 'Shooting', value: 82 },
  ];

  // Log screen view on mount
  useEffect(() => {
    logAnalyticsEvent('analytics_screen_view', {
      sport: selectedSport,
      metric: selectedMetric,
    });
    
    loadData();
  }, [selectedSport]);

  const loadData = async () => {
    try {
      console.log(`📈 Loading ${selectedSport} analytics...`);
      setLoading(true);
      
      // Log analytics for data load
      await logAnalyticsEvent('analytics_data_load', {
        sport: selectedSport,
        metric: selectedMetric,
        team: selectedTeam,
        date_range: dateRange,
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`✅ Loaded analytics for ${selectedSport}`);
      
      setLastUpdated(new Date());
      setLoading(false);
    } catch (error) {
      console.log('Error loading analytics:', error.message);
      
      // Log error analytics
      await logAnalyticsEvent('analytics_load_error', {
        error: error.message,
        sport: selectedSport,
      });
      
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    
    // Log refresh analytics
    await logAnalyticsEvent('analytics_refresh', {
      sport: selectedSport,
      metric: selectedMetric,
    });
    
    // Refresh using the hook
    await refreshAllData();
    
    setLastUpdated(new Date());
    setRefreshing(false);
  };

  const handleRefresh = () => {
    logAnalyticsEvent('analytics_manual_refresh');
    refreshAllData();
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    addToSearchHistory(query);
    
    logAnalyticsEvent('analytics_search', {
      query: query,
      sport: selectedSport,
    });
  };

  const renderHeader = () => (
    <LinearGradient
      colors={['#0f766e', '#14b8a6']}
      style={styles.header}
    >
      <View style={styles.headerTop}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.headerSearchButton}
          onPress={async () => {
            await logAnalyticsEvent('analytics_search_toggle', {
              action: 'open_search',
            });
            setSearchModalVisible(true);
          }}
        >
          <Ionicons name="search-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.headerContent}>
        <Text style={styles.title}>Sports Analytics Pro</Text>
        <Text style={styles.subtitle}>Advanced metrics & performance insights</Text>
        <View style={styles.statsRow}>
          <TouchableOpacity 
            style={styles.stat}
            onPress={() => setShowAnalyticsModal(true)}
          >
            <Ionicons name="analytics" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.statText}>Advanced Analytics</Text>
          </TouchableOpacity>
          <View style={styles.stat}>
            <Ionicons name="trending-up" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.statText}>Real-time Data</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="git-network" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.statText}>AI Models</Text>
          </View>
        </View>
      </View>

      {/* NEW: Add navigation menu to header */}
      <View style={styles.navigationMenuContainer}>
        {renderNavigationMenu()}
      </View>
    </LinearGradient>
  );

  const renderSearchModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={searchModalVisible}
      onRequestClose={() => setSearchModalVisible(false)}
    >
      <View style={styles.searchModalContainer}>
        <View style={styles.searchModalHeader}>
          <TouchableOpacity 
            onPress={() => setSearchModalVisible(false)}
            style={styles.modalBackButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Search Analytics</Text>
        </View>

        <SearchBar
          placeholder="Search teams, players, metrics..."
          onSearch={handleSearch}
          searchHistory={searchHistory}
          style={styles.gameSearchBar}
        />

        <FlatList
          data={[]} // You can populate this with actual search results
          keyExtractor={(item, index) => `search-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.searchResultItem}
              onPress={() => {
                setSearchModalVisible(false);
              }}
            >
              <View style={styles.searchResultIcon}>
                <Ionicons name="analytics" size={20} color="#14b8a6" />
              </View>
              <View style={styles.searchResultContent}>
                <Text style={styles.searchResultTitle}>Search Result</Text>
                <Text style={styles.searchResultSubtitle}>
                  Analytics data for your search
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.noResults}>
              <Ionicons name="search-outline" size={48} color="#ccc" />
              <Text style={styles.noResultsText}>
                {searchQuery ? 'No results found' : 'Search for analytics data'}
              </Text>
            </View>
          }
        />
      </View>
    </Modal>
  );

  const renderAnalyticsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showAnalyticsModal}
      onRequestClose={() => setShowAnalyticsModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <LinearGradient
            colors={['#0f766e', '#14b8a6']}
            style={styles.modalHeader}
          >
            <Text style={styles.modalTitle}>Analytics Dashboard</Text>
            <TouchableOpacity 
              onPress={() => setShowAnalyticsModal(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
          
          <ScrollView style={styles.modalBody}>
            <View style={styles.analyticsSection}>
              <Text style={styles.sectionTitle}>📊 Performance Metrics</Text>
              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>87.3%</Text>
                  <Text style={styles.metricLabel}>Model Accuracy</Text>
                  <ProgressBar
                    progress={0.873}
                    height={6}
                    backgroundColor="#0f766e"
                    style={{ width: 100 }}
                  />
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>1247</Text>
                  <Text style={styles.metricLabel}>Total Predictions</Text>
                  <ProgressBar
                    progress={1}
                    height={6}
                    backgroundColor="#3b82f6"
                    style={{ width: 100 }}
                  />
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>95.2%</Text>
                  <Text style={styles.metricLabel}>Data Uptime</Text>
                  <ProgressBar
                    progress={0.952}
                    height={6}
                    backgroundColor="#10b981"
                    style={{ width: 100 }}
                  />
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>24/7</Text>
                  <Text style={styles.metricLabel}>Live Updates</Text>
                  <ProgressBar
                    progress={1}
                    height={6}
                    backgroundColor="#f59e0b"
                    style={{ width: 100 }}
                  />
                </View>
              </View>
            </View>
            
            <View style={styles.analyticsSection}>
              <Text style={styles.sectionTitle}>🎯 Quick Navigation</Text>
              <View style={styles.quickNavigation}>
                <TouchableOpacity 
                  style={styles.quickNavButton}
                  onPress={() => {
                    setShowAnalyticsModal(false);
                    handleNavigateToPredictions();
                  }}
                >
                  <Ionicons name="trending-up" size={20} color="#0f766e" />
                  <Text style={styles.quickNavText}>AI Predict</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickNavButton}
                  onPress={() => {
                    setShowAnalyticsModal(false);
                    handleNavigateToParlayBuilder();
                  }}
                >
                  <Ionicons name="stats-chart" size={20} color="#0f766e" />
                  <Text style={styles.quickNavText}>Parlay</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickNavButton}
                  onPress={() => {
                    setShowAnalyticsModal(false);
                    handleNavigateToFantasy();
                  }}
                >
                  <Ionicons name="trophy" size={20} color="#0f766e" />
                  <Text style={styles.quickNavText}>Fantasy</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickNavButton}
                  onPress={() => {
                    setShowAnalyticsModal(false);
                    handleNavigateToSportsNews();
                  }}
                >
                  <Ionicons name="newspaper" size={20} color="#0f766e" />
                  <Text style={styles.quickNavText}>News Hub</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.analyticsSection}>
              <Text style={styles.sectionTitle}>🤖 AI Model Details</Text>
              <View style={styles.modelDetails}>
                <View style={styles.modelDetail}>
                  <View style={[styles.modelIcon, { backgroundColor: '#8b5cf620' }]}>
                    <Ionicons name="git-network" size={18} color="#8b5cf6" />
                  </View>
                  <View style={styles.modelDetailText}>
                    <Text style={styles.modelDetailTitle}>Neural Network v4.2</Text>
                    <Text style={styles.modelDetailSubtitle}>Deep learning architecture</Text>
                  </View>
                </View>
                
                <View style={styles.modelDetail}>
                  <View style={[styles.modelIcon, { backgroundColor: '#10b98120' }]}>
                    <Ionicons name="server" size={18} color="#10b981" />
                  </View>
                  <View style={styles.modelDetailText}>
                    <Text style={styles.modelDetailTitle}>50K+ Training Games</Text>
                    <Text style={styles.modelDetailSubtitle}>Historical data analysis</Text>
                  </View>
                </View>
                
                <View style={styles.modelDetail}>
                  <View style={[styles.modelIcon, { backgroundColor: '#f59e0b20' }]}>
                    <Ionicons name="trending-up" size={18} color="#f59e0b" />
                  </View>
                  <View style={styles.modelDetailText}>
                    <Text style={styles.modelDetailTitle}>Real-time Updates</Text>
                    <Text style={styles.modelDetailSubtitle}>Live data integration</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowAnalyticsModal(false)}
            >
              <Text style={styles.modalButtonText}>Close Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderMetricTabs = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.metricsScroll}
    >
      {metrics.map((metric, index) => (
        <TouchableOpacity
          key={metric}
          style={[
            styles.metricTab,
            selectedMetric === metric && styles.activeMetricTab
          ]}
          onPress={async () => {
            await logAnalyticsEvent('analytics_select_metric', {
              previous_metric: selectedMetric,
              new_metric: metric,
              sport: selectedSport,
            });
            setSelectedMetric(metric);
          }}
        >
          <Text style={[
            styles.metricText,
            selectedMetric === metric && styles.activeMetricText
          ]}>
            {metric.charAt(0).toUpperCase() + metric.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderDataVisualization = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📊 Data Visualization</Text>
      
      {/* Points Trend (Chart Replacement) */}
      <View style={styles.trendContainer}>
        <Text style={styles.trendTitle}>Points Per Game Trend</Text>
        <View style={styles.trendBarsContainer}>
          {pointsTrendData.map((item, index) => (
            <View key={index} style={styles.trendBarColumn}>
              <View style={styles.trendBarBackground}>
                <View 
                  style={[
                    styles.trendBarFill,
                    { height: `${(item.value / 120) * 100}%`, backgroundColor: '#14b8a6' }
                  ]}
                />
              </View>
              <Text style={styles.trendMonthText}>{item.month}</Text>
              <Text style={styles.trendValueText}>{item.value}</Text>
            </View>
          ))}
        </View>
        <View style={styles.trendLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#14b8a6' }]} />
            <Text style={styles.legendText}>Points Per Game</Text>
          </View>
        </View>
      </View>
      
      {/* Team Comparison (Chart Replacement) */}
      <View style={styles.comparisonContainer}>
        <Text style={styles.trendTitle}>Team Comparison</Text>
        <View style={styles.comparisonBarsContainer}>
          {teamComparisonData.map((item, index) => (
            <View key={index} style={styles.comparisonRow}>
              <Text style={styles.comparisonCategory}>{item.category}</Text>
              <View style={styles.comparisonBarBackground}>
                <View 
                  style={[
                    styles.comparisonBarFill,
                    { width: `${item.value}%`, backgroundColor: '#3b82f6' }
                  ]}
                />
              </View>
              <Text style={styles.comparisonValue}>{item.value}%</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Ionicons name="speedometer" size={24} color="#3b82f6" />
          <Text style={styles.metricValue}>
            {sportsDataState[selectedSport]?.advancedStats?.pace || 0}
          </Text>
          <Text style={styles.metricLabel}>Pace</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="trending-up" size={24} color="#10b981" />
          <Text style={styles.metricValue}>
            {sportsDataState[selectedSport]?.advancedStats?.offRating || 0}
          </Text>
          <Text style={styles.metricLabel}>Off Rating</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="shield" size={24} color="#ef4444" />
          <Text style={styles.metricValue}>
            {sportsDataState[selectedSport]?.advancedStats?.defRating || 0}
          </Text>
          <Text style={styles.metricLabel}>Def Rating</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="pulse" size={24} color="#8b5cf6" />
          <Text style={styles.metricValue}>
            {sportsDataState[selectedSport]?.advancedStats?.netRating || 0}
          </Text>
          <Text style={styles.metricLabel}>Net Rating</Text>
        </View>
      </View>
    </View>
  );

  const renderComparisonTools = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🔄 Comparison Tools</Text>
        <TouchableOpacity 
          style={styles.compareToggle}
          onPress={async () => {
            const newCompareMode = !compareMode;
            await logAnalyticsEvent('analytics_toggle_compare', {
              enabled: newCompareMode,
              sport: selectedSport,
            });
            setCompareMode(newCompareMode);
          }}
        >
          <Ionicons 
            name={compareMode ? "toggle" : "toggle-outline"} 
            size={24} 
            color={compareMode ? "#14b8a6" : "#6b7280"} 
          />
          <Text style={[
            styles.compareToggleText,
            compareMode && styles.compareToggleTextActive
          ]}>
            Compare
          </Text>
        </TouchableOpacity>
      </View>
      
      {compareMode ? (
        <View style={styles.comparisonInterface}>
          <View style={styles.teamSelectors}>
            <TouchableOpacity 
              style={styles.teamSelector}
              onPress={async () => {
                const newTeam = compareTeam1 ? null : 'Lakers';
                await logAnalyticsEvent('analytics_select_compare_team', {
                  team: newTeam,
                  position: 'team1',
                });
                setCompareTeam1(newTeam);
              }}
            >
              <Text style={styles.teamSelectorText}>
                {compareTeam1 || 'Select Team 1'}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#6b7280" />
            </TouchableOpacity>
            
            <Text style={styles.vsText}>VS</Text>
            
            <TouchableOpacity 
              style={styles.teamSelector}
              onPress={async () => {
                const newTeam = compareTeam2 ? null : 'Warriors';
                await logAnalyticsEvent('analytics_select_compare_team', {
                  team: newTeam,
                  position: 'team2',
                });
                setCompareTeam2(newTeam);
              }}
            >
              <Text style={styles.teamSelectorText}>
                {compareTeam2 || 'Select Team 2'}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          {compareTeam1 && compareTeam2 && (
            <View style={styles.comparisonResults}>
              <View style={styles.comparisonMetric}>
                <Text style={styles.comparisonMetricLabel}>Offensive Rating</Text>
                <View style={styles.comparisonBarContainer}>
                  <View style={[styles.comparisonBar, { width: '75%' }]}>
                    <Text style={styles.comparisonBarText}>115.2</Text>
                  </View>
                  <View style={[styles.comparisonBar, { width: '68%', backgroundColor: '#3b82f6' }]}>
                    <Text style={styles.comparisonBarText}>108.7</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.comparisonMetric}>
                <Text style={styles.comparisonMetricLabel}>Defensive Rating</Text>
                <View style={styles.comparisonBarContainer}>
                  <View style={[styles.comparisonBar, { width: '62%', backgroundColor: '#ef4444' }]}>
                    <Text style={styles.comparisonBarText}>111.4</Text>
                  </View>
                  <View style={[styles.comparisonBar, { width: '58%', backgroundColor: '#dc2626' }]}>
                    <Text style={styles.comparisonBarText}>107.9</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.comparisonMetric}>
                <Text style={styles.comparisonMetricLabel}>Net Rating</Text>
                <View style={styles.comparisonBarContainer}>
                  <View style={[styles.comparisonBar, { width: '45%' }]}>
                    <Text style={styles.comparisonBarText}>+3.8</Text>
                  </View>
                  <View style={[styles.comparisonBar, { width: '52%', backgroundColor: '#3b82f6' }]}>
                    <Text style={styles.comparisonBarText}>+0.8</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.quickComparison}>
          <Text style={styles.quickComparisonTitle}>Quick Comparisons</Text>
          <View style={styles.quickComparisonGrid}>
            {quickMatchups.map((matchup, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.quickComparisonCard}
                onPress={async () => {
                  await logAnalyticsEvent('analytics_select_quick_matchup', {
                    matchup: matchup,
                    sport: selectedSport,
                  });
                  // Here you could navigate to detailed comparison
                }}
              >
                <Text style={styles.quickComparisonText}>{matchup}</Text>
                <Ionicons name="analytics" size={16} color="#14b8a6" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderPredictiveAnalytics = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🔮 Predictive Analytics</Text>
      
      <View style={styles.predictiveCard}>
        <LinearGradient
          colors={['#1e293b', '#334155']}
          style={styles.predictiveContent}
        >
          <View style={styles.predictiveHeader}>
            <Ionicons name="analytics" size={24} color="#60a5fa" />
            <Text style={styles.predictiveTitle}>AI-Powered Predictions</Text>
          </View>
          
          <View style={styles.predictionModels}>
            <View style={styles.predictionModel}>
              <Text style={styles.modelName}>Neural Network v4</Text>
              <Text style={styles.modelAccuracy}>78.3% Accuracy</Text>
            </View>
            <View style={styles.predictionModel}>
              <Text style={styles.modelName}>Ensemble Model</Text>
              <Text style={styles.modelAccuracy}>82.1% Accuracy</Text>
            </View>
            <View style={styles.predictionModel}>
              <Text style={styles.modelName}>Time Series</Text>
              <Text style={styles.modelAccuracy}>74.8% Accuracy</Text>
            </View>
          </View>
          
          <View style={styles.predictiveInsights}>
            <Text style={styles.insightsTitle}>Key Insights:</Text>
            <View style={styles.insightItem}>
              <Ionicons name="checkmark-circle" size={14} color="#10b981" />
              <Text style={styles.insightText}>Home teams show 8.2% advantage this season</Text>
            </View>
            <View style={styles.insightItem}>
              <Ionicons name="checkmark-circle" size={14} color="#10b981" />
              <Text style={styles.insightText}>Rest advantage correlates with +5.7 point margin</Text>
            </View>
            <View style={styles.insightItem}>
              <Ionicons name="checkmark-circle" size={14} color="#10b981" />
              <Text style={styles.insightText}>Teams coming off 3+ day breaks win 61.4% of games</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
      
      <TouchableOpacity 
        style={styles.simulateButton}
        onPress={async () => {
          await logAnalyticsEvent('analytics_run_simulation', {
            sport: selectedSport,
            metric: selectedMetric,
          });
          setShowPredictions(true);
        }}
      >
        <Ionicons name="play-circle" size={20} color="#14b8a6" />
        <Text style={styles.simulateButtonText}>Run Game Simulation</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFiltersModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showFilters}
      onRequestClose={async () => {
        await logAnalyticsEvent('analytics_close_filters');
        setShowFilters(false);
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Analytics Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Time Period</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {dateRanges.map((range, index) => (
                  <TouchableOpacity
                    key={range}
                    style={[
                      styles.filterChip,
                      dateRange === range && styles.filterChipActive
                    ]}
                    onPress={async () => {
                      await logAnalyticsEvent('analytics_select_date_range', {
                        previous_range: dateRange,
                        new_range: range,
                      });
                      setDateRange(range);
                    }}
                  >
                    <Text style={[
                      styles.filterChipText,
                      dateRange === range && styles.filterChipTextActive
                    ]}>
                      {range}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Team Selection</Text>
              <View style={styles.teamDropdown}>
                <Text style={styles.dropdownLabel}>Select Team:</Text>
                <TouchableOpacity style={styles.dropdownButton}>
                  <Text style={styles.dropdownText}>{selectedTeam}</Text>
                  <Ionicons name="chevron-down" size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Data Types</Text>
              <View style={styles.dataTypeOptions}>
                <View style={styles.dataTypeOption}>
                  <Switch
                    value={true}
                    onValueChange={() => {}}
                    trackColor={{ false: '#e5e7eb', true: '#14b8a6' }}
                  />
                  <Text style={styles.dataTypeText}>Basic Stats</Text>
                </View>
                <View style={styles.dataTypeOption}>
                  <Switch
                    value={true}
                    onValueChange={() => {}}
                    trackColor={{ false: '#e5e7eb', true: '#14b8a6' }}
                  />
                  <Text style={styles.dataTypeText}>Advanced Metrics</Text>
                </View>
                <View style={styles.dataTypeOption}>
                  <Switch
                    value={false}
                    onValueChange={() => {}}
                    trackColor={{ false: '#e5e7eb', true: '#14b8a6' }}
                  />
                  <Text style={styles.dataTypeText}>Player Tracking</Text>
                </View>
                <View style={styles.dataTypeOption}>
                  <Switch
                    value={true}
                    onValueChange={() => {}}
                    trackColor={{ false: '#e5e7eb', true: '#14b8a6' }}
                  />
                  <Text style={styles.dataTypeText}>Predictive Models</Text>
                </View>
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.modalButtonSecondary}
              onPress={async () => {
                await logAnalyticsEvent('analytics_reset_filters');
                setSelectedTeam('All Teams');
                setDateRange('Season');
                setShowFilters(false);
              }}
            >
              <Text style={styles.modalButtonSecondaryText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={async () => {
                await logAnalyticsEvent('analytics_apply_filters', {
                  team: selectedTeam,
                  date_range: dateRange,
                });
                setShowFilters(false);
              }}
            >
              <Text style={styles.modalButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderRefreshIndicator = () => (
    <View style={styles.refreshIndicator}>
      <Ionicons name="time" size={14} color="#6b7280" />
      <Text style={styles.refreshText}>
        Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
      <TouchableOpacity onPress={onRefresh}>
        <Ionicons name="refresh" size={16} color="#14b8a6" style={styles.refreshIcon} />
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    switch(selectedMetric) {
      case 'overview':
        return (
          <>
            {renderDataVisualization()}
            {renderPredictiveAnalytics()}
          </>
        );
      case 'trends':
        return (
          <>
            {renderDataVisualization()}
          </>
        );
      case 'teams':
        return (
          <>
            {renderComparisonTools()}
          </>
        );
      case 'advanced':
        return (
          <>
            {renderPredictiveAnalytics()}
          </>
        );
      default:
        return (
          <>
            {renderDataVisualization()}
          </>
        );
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#14b8a6" />
        <Text style={styles.loadingText}>Loading Sports Analytics...</Text>
      </View>
    );
  }

  // Wrap the main screen content with RevenueCatGate
  return (
    <RevenueCatGate 
      requiredEntitlement="daily_locks"
      featureName="Advanced Analytics"
    >
      <ErrorBoundary 
        fallback={
          <View style={styles.errorContainer}>
            <Text>Analytics data unavailable</Text>
          </View>
        }
      >
        <SafeAreaView style={styles.container}>
          {renderHeader()}
          {renderRefreshIndicator()}
          
          <ScrollView
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                colors={['#14b8a6']}
                tintColor="#14b8a6"
              />
            }
            contentContainerStyle={styles.scrollContent}
            style={styles.scrollView}
          >
            {renderMetricTabs()}
            {renderContent()}
            {renderComparisonTools()}
            
            <TouchableOpacity 
              onPress={async () => {
                await logAnalyticsEvent('analytics_navigate_to_fantasy_dashboard');
                handleNavigateToFantasy();
              }}
              style={[styles.fantasyButton, { marginHorizontal: 15, marginTop: 10 }]}
            >
              <Ionicons name="stats-chart" size={24} color="#8b5cf6" />
              <Text style={styles.fantasyButtonText}>Fantasy Sports Dashboard</Text>
            </TouchableOpacity>
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Analytics powered by machine learning models trained on 10+ years of data.
                Data updates every 15 minutes.
              </Text>
            </View>
          </ScrollView>
          
          {renderFiltersModal()}
          {renderSearchModal()}
          {renderAnalyticsModal()}
        </SafeAreaView>
      </ErrorBoundary>
    </RevenueCatGate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerSearchButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    marginTop: 5,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 5,
  },
  navigationMenuContainer: {
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 8,
  },
  navigationMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navButton: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  navButtonText: {
    color: 'white',
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
  },
  refreshIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  refreshText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 6,
  },
  refreshIcon: {
    marginLeft: 10,
  },
  metricsScroll: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#f8fafc',
  },
  metricTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeMetricTab: {
    backgroundColor: '#14b8a6',
  },
  metricText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeMetricText: {
    color: 'white',
  },
  section: {
    margin: 15,
    marginTop: 0,
    backgroundColor: '#f8fafc',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f8fafc',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 15,
    backgroundColor: '#f8fafc',
  },
  trendContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 15,
    textAlign: 'center',
  },
  trendBarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    marginBottom: 10,
  },
  trendBarColumn: {
    alignItems: 'center',
    flex: 1,
  },
  trendBarBackground: {
    height: 100,
    width: 25,
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  trendBarFill: {
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  trendMonthText: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 5,
  },
  trendValueText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 2,
  },
  trendLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6b7280',
  },
  comparisonContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  comparisonBarsContainer: {
    marginTop: 10,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  comparisonCategory: {
    fontSize: 12,
    color: '#6b7280',
    width: 80,
  },
  comparisonBarBackground: {
    flex: 1,
    height: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  comparisonBarFill: {
    height: '100%',
    borderRadius: 8,
  },
  comparisonValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    width: 40,
    textAlign: 'right',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
  },
  metricCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginVertical: 5,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  compareToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  compareToggleText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
  compareToggleTextActive: {
    color: '#14b8a6',
    fontWeight: '500',
  },
  comparisonInterface: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teamSelectors: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  teamSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  teamSelectorText: {
    fontSize: 14,
    color: '#1f2937',
  },
  vsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
    marginHorizontal: 10,
  },
  comparisonResults: {
    marginTop: 10,
  },
  comparisonMetric: {
    marginBottom: 15,
  },
  comparisonMetricLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  comparisonBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
  },
  comparisonBar: {
    height: '100%',
    backgroundColor: '#14b8a6',
    borderRadius: 6,
    marginRight: 5,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  comparisonBarText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  quickComparison: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickComparisonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 15,
  },
  quickComparisonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickComparisonCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  quickComparisonText: {
    fontSize: 14,
    color: '#1f2937',
  },
  predictiveCard: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: '#1e293b',
  },
  predictiveContent: {
    padding: 25,
  },
  predictiveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  predictiveTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  predictionModels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  predictionModel: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  modelName: {
    fontSize: 12,
    color: '#cbd5e1',
    marginBottom: 4,
  },
  modelAccuracy: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  predictiveInsights: {
    marginTop: 10,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 10,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#cbd5e1',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  simulateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#14b8a6',
  },
  simulateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14b8a6',
    marginLeft: 8,
  },
  fantasyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 15,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  fantasyButtonText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  modalBody: {
    padding: 20,
  },
  filterSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: '#14b8a6',
  },
  filterChipText: {
    fontSize: 14,
    color: '#6b7280',
  },
  filterChipTextActive: {
    color: 'white',
  },
  teamDropdown: {
    marginTop: 10,
  },
  dropdownLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dropdownText: {
    fontSize: 14,
    color: '#1f2937',
  },
  dataTypeOptions: {
    marginTop: 10,
  },
  dataTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dataTypeText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 12,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#14b8a6',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalButtonSecondary: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  modalButtonSecondaryText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  modalCloseButton: {
    padding: 4,
  },
  analyticsSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  quickNavButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    minWidth: 80,
  },
  quickNavText: {
    fontSize: 12,
    color: '#0f766e',
    marginTop: 4,
    fontWeight: '500',
  },
  modelDetails: {
    marginTop: 12,
  },
  modelDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  modelIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  modelDetailText: {
    marginLeft: 10,
    flex: 1,
  },
  modelDetailTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  modelDetailSubtitle: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  searchModalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  gameSearchBar: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  searchResultIcon: {
    marginRight: 12,
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  searchResultSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  noResultsText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 12,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default AnalyticsScreen;

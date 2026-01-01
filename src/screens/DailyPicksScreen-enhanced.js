// src/screens/DailyPicksScreen-FIXED.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Simple RevenueCatGate placeholder
const RevenueCatGate = ({ children }) => {
  return <>{children}</>;
};

export default function DailyPicksScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [picks] = useState([
    {
      id: 1,
      sport: 'NFL',
      game: 'Chiefs vs Ravens',
      pick: 'Chiefs -3.5',
      confidence: 'High',
      odds: '-110',
      expert: 'Mike T.',
      record: '42-28'
    },
    {
      id: 2,
      sport: 'NBA',
      game: 'Lakers vs Celtics',
      pick: 'Over 225.5',
      confidence: 'Medium',
      odds: '-105',
      expert: 'Sarah J.',
      record: '38-31'
    },
    {
      id: 3,
      sport: 'NHL',
      game: 'Maple Leafs vs Bruins',
      pick: 'Maple Leafs ML',
      confidence: 'High',
      odds: '+120',
      expert: 'David L.',
      record: '45-26'
    },
    {
      id: 4,
      sport: 'NFL',
      game: 'Bills vs Dolphins',
      pick: 'Bills -6.5',
      confidence: 'Medium',
      odds: '-115',
      expert: 'Mike T.',
      record: '42-28'
    },
    {
      id: 5,
      sport: 'NBA',
      game: 'Warriors vs Suns',
      pick: 'Suns +2.5',
      confidence: 'High',
      odds: '+100',
      expert: 'Sarah J.',
      record: '38-31'
    }
  ]);

  const loadPicks = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    loadPicks();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case 'High': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ef4444" />
        <Text style={styles.loadingText}>Loading Expert Picks...</Text>
      </View>
    );
  }

  return (
    <RevenueCatGate>
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#0f172a', '#1e293b']}
          style={styles.gradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Expert Selections</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="filter" size={22} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#ef4444"
                colors={['#ef4444']}
              />
            }
            showsVerticalScrollIndicator={false}
          >
            {/* Stats Banner */}
            <View style={styles.statsBanner}>
              <LinearGradient
                colors={['#ef4444', '#dc2626']}
                style={styles.statsGradient}
              >
                <Text style={styles.statsTitle}>Daily Performance</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>68%</Text>
                    <Text style={styles.statLabel}>Win Rate</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>+42.5u</Text>
                    <Text style={styles.statLabel}>Profit</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>5-2</Text>
                    <Text style={styles.statLabel}>Yesterday</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Picks List */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Today's Top Picks</Text>
              
              {picks.map((pick) => (
                <TouchableOpacity 
                  key={pick.id}
                  style={styles.pickCard}
                >
                  <View style={styles.pickHeader}>
                    <View style={styles.sportBadge}>
                      <Text style={styles.sportText}>{pick.sport}</Text>
                    </View>
                    <View style={[styles.confidenceBadge, { backgroundColor: getConfidenceColor(pick.confidence) + '20' }]}>
                      <Ionicons name="trending-up" size={14} color={getConfidenceColor(pick.confidence)} />
                      <Text style={[styles.confidenceText, { color: getConfidenceColor(pick.confidence) }]}>
                        {pick.confidence}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.gameText}>{pick.game}</Text>
                  <Text style={styles.pickText}>{pick.pick}</Text>

                  <View style={styles.pickDetails}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Odds</Text>
                      <Text style={styles.detailValue}>{pick.odds}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Expert</Text>
                      <Text style={styles.detailValue}>{pick.expert}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Record</Text>
                      <Text style={styles.detailValue}>{pick.record}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Bottom Spacer */}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </RevenueCatGate>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  filterButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  statsBanner: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statsGradient: {
    padding: 20,
  },
  statsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#fecaca',
    fontSize: 12,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  pickCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  pickHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sportBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sportText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  gameText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pickText: {
    color: '#f59e0b',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  pickDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 12,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 32,
  },
});

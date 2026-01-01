// src/screens/PlayerStatsScreen-FIXED.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function PlayerStatsScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [players] = useState([
    {
      id: 1,
      name: 'Patrick Mahomes',
      team: 'Chiefs',
      position: 'QB',
      stats: {
        passingYards: '4,250',
        touchdowns: '35',
        interceptions: '12',
        rating: '105.2'
      },
      value: 'High'
    },
    {
      id: 2,
      name: 'Christian McCaffrey',
      team: '49ers',
      position: 'RB',
      stats: {
        rushingYards: '1,459',
        touchdowns: '14',
        receptions: '67',
        fantasyPoints: '325'
      },
      value: 'Very High'
    },
    {
      id: 3,
      name: 'Tyreek Hill',
      team: 'Dolphins',
      position: 'WR',
      stats: {
        receivingYards: '1,799',
        touchdowns: '13',
        receptions: '119',
        fantasyPoints: '298'
      },
      value: 'High'
    },
    {
      id: 4,
      name: 'Josh Allen',
      team: 'Bills',
      position: 'QB',
      stats: {
        passingYards: '4,306',
        touchdowns: '29',
        interceptions: '18',
        rating: '92.2'
      },
      value: 'Medium'
    },
    {
      id: 5,
      name: 'Justin Jefferson',
      team: 'Vikings',
      position: 'WR',
      stats: {
        receivingYards: '1,074',
        touchdowns: '5',
        receptions: '68',
        fantasyPoints: '192'
      },
      value: 'Medium'
    }
  ]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ef4444" />
        <Text style={styles.loadingText}>Loading Player Data...</Text>
      </View>
    );
  }

  const getValueColor = (value) => {
    switch (value) {
      case 'Very High': return '#10b981';
      case 'High': return '#22c55e';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  return (
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
          <Text style={styles.headerTitle}>Player Metrics</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={22} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Stats Overview */}
          <View style={styles.statsOverview}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Top Players</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>325</Text>
              <Text style={styles.statLabel}>High Score</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>92%</Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>14</Text>
              <Text style={styles.statLabel}>Avg TDs</Text>
            </View>
          </View>

          {/* Player List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Players Analysis</Text>
            
            {players.map((player) => (
              <TouchableOpacity 
                key={player.id}
                style={styles.playerCard}
                onPress={() => navigation.navigate('PlayerDashboard', { playerId: player.id })}
              >
                <View style={styles.playerHeader}>
                  <View style={styles.playerInfo}>
                    <View style={styles.playerAvatar}>
                      <Text style={styles.playerInitial}>
                        {player.name.charAt(0)}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.playerName}>{player.name}</Text>
                      <Text style={styles.playerDetails}>
                        {player.team} • {player.position}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.valueBadge, { backgroundColor: getValueColor(player.value) + '20' }]}>
                    <Text style={[styles.valueText, { color: getValueColor(player.value) }]}>
                      {player.value}
                    </Text>
                  </View>
                </View>

                <View style={styles.statsGrid}>
                  {Object.entries(player.stats).map(([key, value]) => (
                    <View key={key} style={styles.statItem}>
                      <Text style={styles.statItemValue}>{value}</Text>
                      <Text style={styles.statItemLabel}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bottom Spacer */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
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
  statsOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 8,
  },
  statCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
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
  playerCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  playerInitial: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  playerName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  playerDetails: {
    color: '#94a3b8',
    fontSize: 14,
  },
  valueBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  valueText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  statItemValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statItemLabel: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 32,
  },
});

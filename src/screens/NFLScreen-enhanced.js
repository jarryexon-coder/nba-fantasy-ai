// src/screens/NFLScreen-enhanced-FIXED.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSearch } from '../providers/SearchProvider';

export default function NFLScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [nflData, setNflData] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(1);
  
  const { searchQuery } = useSearch();

  const loadNFLData = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock NFL data
      const mockData = {
        currentWeek: selectedWeek,
        standings: [
          { team: 'Kansas City Chiefs', wins: 12, losses: 5, conference: 'AFC' },
          { team: 'Baltimore Ravens', wins: 13, losses: 4, conference: 'AFC' },
          { team: 'San Francisco 49ers', wins: 12, losses: 5, conference: 'NFC' },
          { team: 'Detroit Lions', wins: 12, losses: 5, conference: 'NFC' },
          { team: 'Buffalo Bills', wins: 11, losses: 6, conference: 'AFC' },
          { team: 'Dallas Cowboys', wins: 12, losses: 5, conference: 'NFC' },
        ],
        topPlayers: [
          { name: 'Patrick Mahomes', team: 'Chiefs', stats: '4250 yards, 35 TDs' },
          { name: 'Lamar Jackson', team: 'Ravens', stats: '3678 yards, 27 TDs' },
          { name: 'Christian McCaffrey', team: '49ers', stats: '1459 yards, 14 TDs' },
          { name: 'Tyreek Hill', team: 'Dolphins', stats: '1799 yards, 13 TDs' },
        ],
        upcomingGames: [
          { home: 'Chiefs', away: 'Ravens', time: 'Sunday 3:00 PM' },
          { home: '49ers', away: 'Lions', time: 'Sunday 6:30 PM' },
          { home: 'Bills', away: 'Chiefs', time: 'Next Sunday 1:00 PM' },
        ]
      };
      
      setNflData(mockData);
      
    } catch (error) {
      console.error('Error loading NFL data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedWeek]);

  useEffect(() => {
    loadNFLData();
  }, [loadNFLData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNFLData(true);
  }, [loadNFLData]);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ef4444" />
        <Text style={styles.loadingText}>Loading NFL Data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e293b']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Ionicons name="american-football" size={28} color="#dc2626" />
            <Text style={styles.headerTitle}>NFL Analytics</Text>
          </View>
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
          {/* Week Selector */}
          <View style={styles.weekSelector}>
            <Text style={styles.weekLabel}>Week {selectedWeek}</Text>
            <View style={styles.weekButtons}>
              <TouchableOpacity 
                style={styles.weekButton}
                onPress={() => setSelectedWeek(Math.max(1, selectedWeek - 1))}
              >
                <Ionicons name="chevron-back" size={20} color="#94a3b8" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.weekButton}
                onPress={() => setSelectedWeek(Math.min(18, selectedWeek + 1))}
              >
                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Standings Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="trophy" size={24} color="#f59e0b" />
              <Text style={styles.cardTitle}>Current Standings</Text>
            </View>
            
            {nflData?.standings.map((team, index) => (
              <View key={index} style={styles.standingsRow}>
                <View style={styles.teamInfo}>
                  <View style={[styles.conferenceBadge, { 
                    backgroundColor: team.conference === 'AFC' ? '#dc262620' : '#3b82f620' 
                  }]}>
                    <Text style={[styles.conferenceText, {
                      color: team.conference === 'AFC' ? '#dc2626' : '#3b82f6'
                    }]}>
                      {team.conference}
                    </Text>
                  </View>
                  <Text style={styles.teamName}>{team.team}</Text>
                </View>
                <Text style={styles.teamRecord}>{team.wins}-{team.losses}</Text>
              </View>
            ))}
          </View>

          {/* Top Players Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="person" size={24} color="#8b5cf6" />
              <Text style={styles.cardTitle}>Top Players</Text>
            </View>
            
            {nflData?.topPlayers.map((player, index) => (
              <View key={index} style={styles.playerRow}>
                <View>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.playerTeam}>{player.team}</Text>
                </View>
                <Text style={styles.playerStats}>{player.stats}</Text>
              </View>
            ))}
          </View>

          {/* Upcoming Games Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="calendar" size={24} color="#10b981" />
              <Text style={styles.cardTitle}>Upcoming Games</Text>
            </View>
            
            {nflData?.upcomingGames.map((game, index) => (
              <View key={index} style={styles.gameRow}>
                <View style={styles.gameTeams}>
                  <Text style={styles.gameTeam}>{game.away}</Text>
                  <Text style={styles.vsText}>@</Text>
                  <Text style={styles.gameTeam}>{game.home}</Text>
                </View>
                <Text style={styles.gameTime}>{game.time}</Text>
              </View>
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  filterButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  weekSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#1e293b',
    marginBottom: 16,
  },
  weekLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekButtons: {
    flexDirection: 'row',
  },
  weekButton: {
    padding: 8,
    marginLeft: 12,
    backgroundColor: '#334155',
    borderRadius: 8,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  standingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conferenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  conferenceText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  teamName: {
    color: '#cbd5e1',
    fontSize: 16,
  },
  teamRecord: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  playerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  playerTeam: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 2,
  },
  playerStats: {
    color: '#f59e0b',
    fontSize: 14,
    textAlign: 'right',
  },
  gameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  gameTeams: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameTeam: {
    color: '#cbd5e1',
    fontSize: 16,
  },
  vsText: {
    color: '#94a3b8',
    fontSize: 14,
    marginHorizontal: 8,
  },
  gameTime: {
    color: '#f59e0b',
    fontSize: 14,
  },
  bottomSpacer: {
    height: 32,
  },
});

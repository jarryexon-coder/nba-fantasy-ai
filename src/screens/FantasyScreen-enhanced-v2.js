// src/screens/FantasyScreen-FIXED.js
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

export default function FantasyScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fantasyData] = useState({
    topPlayers: [
      { id: 1, name: 'Patrick Mahomes', team: 'Chiefs', position: 'QB', points: 325.5, trend: 'up' },
      { id: 2, name: 'Christian McCaffrey', team: '49ers', position: 'RB', points: 312.8, trend: 'up' },
      { id: 3, name: 'Justin Jefferson', team: 'Vikings', position: 'WR', points: 298.3, trend: 'down' },
      { id: 4, name: 'Travis Kelce', team: 'Chiefs', position: 'TE', points: 284.7, trend: 'up' },
      { id: 5, name: 'Josh Allen', team: 'Bills', position: 'QB', points: 276.2, trend: 'steady' },
    ],
    sleepers: [
      { id: 1, name: 'Jordan Love', team: 'Packers', position: 'QB', value: 'High', matchup: 'Favorable' },
      { id: 2, name: 'James Cook', team: 'Bills', position: 'RB', value: 'Medium', matchup: 'Neutral' },
      { id: 3, name: 'Chris Olave', team: 'Saints', position: 'WR', value: 'High', matchup: 'Favorable' },
    ],
    busts: [
      { id: 1, name: 'Aaron Jones', team: 'Packers', position: 'RB', risk: 'High', reason: 'Injury concerns' },
      { id: 2, name: 'DeAndre Hopkins', team: 'Titans', position: 'WR', risk: 'Medium', reason: 'Tough matchup' },
    ]
  });

  const loadData = () => {
    console.log('📡 Fantasy advice: Loading data...');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    console.log('🔄 Refreshing fantasy data...');
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text style={styles.loadingText}>Loading Fantasy Tools...</Text>
      </View>
    );
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return 'arrow-up';
      case 'down': return 'arrow-down';
      case 'steady': return 'remove';
      default: return 'help';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return '#10b981';
      case 'down': return '#ef4444';
      case 'steady': return '#f59e0b';
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
          <Text style={styles.headerTitle}>Fantasy Tools</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings" size={22} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#8b5cf6"
              colors={['#8b5cf6']}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Card */}
          <View style={styles.welcomeCard}>
            <LinearGradient
              colors={['#8b5cf6', '#7c3aed']}
              style={styles.welcomeGradient}
            >
              <Ionicons name="trophy" size={32} color="#fff" />
              <Text style={styles.welcomeTitle}>Fantasy Dashboard</Text>
              <Text style={styles.welcomeText}>
                Expert insights, player projections, and lineup optimizers
              </Text>
            </LinearGradient>
          </View>

          {/* Top Players Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="star" size={24} color="#f59e0b" />
              <Text style={styles.sectionTitle}>Top Players</Text>
            </View>
            
            <View style={styles.card}>
              {fantasyData.topPlayers.map((player) => (
                <TouchableOpacity 
                  key={player.id}
                  style={styles.playerRow}
                  onPress={() => navigation.navigate('PlayerDashboard', { playerId: player.id })}
                >
                  <View style={styles.playerInfo}>
                    <View style={styles.positionBadge}>
                      <Text style={styles.positionText}>{player.position}</Text>
                    </View>
                    <View>
                      <Text style={styles.playerName}>{player.name}</Text>
                      <Text style={styles.playerTeam}>{player.team}</Text>
                    </View>
                  </View>
                  <View style={styles.playerStats}>
                    <Text style={styles.pointsText}>{player.points}</Text>
                    <View style={styles.trendContainer}>
                      <Ionicons 
                        name={getTrendIcon(player.trend)} 
                        size={16} 
                        color={getTrendColor(player.trend)} 
                      />
                      <Text style={[styles.trendText, { color: getTrendColor(player.trend) }]}>
                        {player.trend}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sleepers Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="moon" size={24} color="#3b82f6" />
              <Text style={styles.sectionTitle}>Sleepers & Values</Text>
            </View>
            
            <View style={styles.card}>
              {fantasyData.sleepers.map((sleeper) => (
                <View key={sleeper.id} style={styles.sleeperRow}>
                  <View style={styles.sleeperInfo}>
                    <Text style={styles.sleeperName}>{sleeper.name}</Text>
                    <Text style={styles.sleeperDetails}>
                      {sleeper.team} • {sleeper.position}
                    </Text>
                  </View>
                  <View style={styles.sleeperTags}>
                    <View style={[styles.tag, { backgroundColor: '#10b98120' }]}>
                      <Text style={[styles.tagText, { color: '#10b981' }]}>
                        Value: {sleeper.value}
                      </Text>
                    </View>
                    <View style={[styles.tag, { backgroundColor: '#3b82f620' }]}>
                      <Text style={[styles.tagText, { color: '#3b82f6' }]}>
                        {sleeper.matchup}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Busts Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="warning" size={24} color="#ef4444" />
              <Text style={styles.sectionTitle}>Potential Busts</Text>
            </View>
            
            <View style={styles.card}>
              {fantasyData.busts.map((bust) => (
                <View key={bust.id} style={styles.bustRow}>
                  <View style={styles.bustInfo}>
                    <Text style={styles.bustName}>{bust.name}</Text>
                    <Text style={styles.bustDetails}>
                      {bust.team} • {bust.position}
                    </Text>
                  </View>
                  <View style={styles.bustReason}>
                    <View style={[styles.riskBadge, { backgroundColor: '#ef444420' }]}>
                      <Text style={[styles.riskText, { color: '#ef4444' }]}>
                        Risk: {bust.risk}
                      </Text>
                    </View>
                    <Text style={styles.reasonText}>{bust.reason}</Text>
                  </View>
                </View>
              ))}
            </View>
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
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  welcomeCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  welcomeGradient: {
    padding: 24,
    alignItems: 'center',
  },
  welcomeTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  welcomeText: {
    color: '#e2e8f0',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  positionBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },
  positionText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  playerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  playerTeam: {
    color: '#94a3b8',
    fontSize: 14,
  },
  playerStats: {
    alignItems: 'flex-end',
  },
  pointsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  sleeperRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  sleeperInfo: {
    marginBottom: 8,
  },
  sleeperName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  sleeperDetails: {
    color: '#94a3b8',
    fontSize: 14,
  },
  sleeperTags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bustRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  bustInfo: {
    marginBottom: 8,
  },
  bustName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  bustDetails: {
    color: '#94a3b8',
    fontSize: 14,
  },
  bustReason: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reasonText: {
    color: '#cbd5e1',
    fontSize: 14,
    flex: 1,
  },
  bottomSpacer: {
    height: 32,
  },
});

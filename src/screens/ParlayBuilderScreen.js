// src/screens/ParlayBuilderScreen-FIXED.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ParlayBuilderScreen({ navigation }) {
  const [parlayName, setParlayName] = useState('My Parlay');
  const [selectedGames, setSelectedGames] = useState([
    { id: 1, game: 'Chiefs -3.5', odds: '-110', sport: 'NFL' },
    { id: 2, game: 'Lakers Over 225.5', odds: '-105', sport: 'NBA' },
    { id: 3, game: 'Maple Leafs ML', odds: '+120', sport: 'NHL' },
  ]);

  const availableGames = [
    { id: 1, game: 'Chiefs -3.5', odds: '-110', sport: 'NFL' },
    { id: 2, game: 'Ravens +3.5', odds: '-110', sport: 'NFL' },
    { id: 3, game: 'Lakers Over 225.5', odds: '-105', sport: 'NBA' },
    { id: 4, game: 'Celtics Under 225.5', odds: '-105', sport: 'NBA' },
    { id: 5, game: 'Maple Leafs ML', odds: '+120', sport: 'NHL' },
    { id: 6, game: 'Bruins +1.5', odds: '-140', sport: 'NHL' },
    { id: 7, game: 'Dodgers -1.5', odds: '+150', sport: 'MLB' },
    { id: 8, game: 'Yankees Over 8.5', odds: '-115', sport: 'MLB' },
  ];

  const addToParlay = (game) => {
    if (selectedGames.length >= 5) {
      Alert.alert('Limit Reached', 'Maximum 5 games per parlay');
      return;
    }
    
    if (!selectedGames.find(g => g.id === game.id)) {
      setSelectedGames([...selectedGames, game]);
    }
  };

  const removeFromParlay = (gameId) => {
    setSelectedGames(selectedGames.filter(game => game.id !== gameId));
  };

  const calculateTotalOdds = () => {
    if (selectedGames.length === 0) return '+0';
    
    // Simplified calculation
    const baseOdds = selectedGames.length * 100;
    return `+${baseOdds * 2}`;
  };

  const calculatePotentialWin = (stake) => {
    if (selectedGames.length === 0) return 0;
    
    const odds = parseInt(calculateTotalOdds().replace('+', ''));
    return (stake * odds / 100).toFixed(2);
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
          <Text style={styles.headerTitle}>Parlay Architect</Text>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={() => Alert.alert('Saved', 'Parlay saved successfully!')}
          >
            <Ionicons name="save" size={22} color="#10b981" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Parlay Builder Card */}
          <View style={styles.builderCard}>
            <View style={styles.cardHeader}>
              <TextInput
                style={styles.parlayNameInput}
                value={parlayName}
                onChangeText={setParlayName}
                placeholder="Enter parlay name"
                placeholderTextColor="#64748b"
              />
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => setSelectedGames([])}
              >
                <Ionicons name="trash" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>

            {/* Selected Games */}
            <View style={styles.selectedSection}>
              <Text style={styles.sectionTitle}>Selected Games ({selectedGames.length})</Text>
              
              {selectedGames.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="add-circle" size={48} color="#94a3b8" />
                  <Text style={styles.emptyStateText}>Add games to build your parlay</Text>
                </View>
              ) : (
                <View style={styles.selectedGamesList}>
                  {selectedGames.map((game) => (
                    <TouchableOpacity 
                      key={`selected-${game.id}`} // FIXED: Added key
                      style={styles.selectedGameItem}
                      onPress={() => removeFromParlay(game.id)}
                    >
                      <View style={styles.gameInfo}>
                        <Text style={styles.gameText}>{game.game}</Text>
                        <Text style={styles.gameSport}>{game.sport}</Text>
                      </View>
                      <View style={styles.gameOdds}>
                        <Text style={styles.oddsText}>{game.odds}</Text>
                        <Ionicons name="close-circle" size={20} color="#ef4444" />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Parlay Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Odds</Text>
                <Text style={styles.statValue}>{calculateTotalOdds()}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Games</Text>
                <Text style={styles.statValue}>{selectedGames.length}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Potential Win</Text>
                <Text style={styles.statValue}>${calculatePotentialWin(100)}</Text>
              </View>
            </View>
          </View>

          {/* Available Games */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Games</Text>
            
            <View style={styles.availableGamesGrid}>
              {availableGames.map((game) => (
                <TouchableOpacity 
                  key={`available-${game.id}`} // FIXED: Added key
                  style={styles.gameCard}
                  onPress={() => addToParlay(game)}
                >
                  <View style={styles.gameCardHeader}>
                    <View style={styles.sportBadge}>
                      <Text style={styles.sportText}>{game.sport}</Text>
                    </View>
                    <Ionicons name="add-circle" size={20} color="#10b981" />
                  </View>
                  <Text style={styles.gameCardText}>{game.game}</Text>
                  <Text style={styles.gameCardOdds}>{game.odds}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => navigation.navigate('Predictions')}
            >
              <Ionicons name="bulb" size={20} color="#f59e0b" />
              <Text style={styles.secondaryButtonText}>View Predictions</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => Alert.alert('Place Bet', 'Parlay placed successfully!')}
              disabled={selectedGames.length === 0}
            >
              <Ionicons name="cash" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Place Parlay</Text>
            </TouchableOpacity>
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
  saveButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  builderCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  parlayNameInput: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 12,
  },
  clearButton: {
    padding: 8,
  },
  selectedSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    color: '#94a3b8',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  selectedGamesList: {
    gap: 8,
  },
  selectedGameItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  gameInfo: {
    flex: 1,
  },
  gameText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  gameSport: {
    color: '#94a3b8',
    fontSize: 14,
  },
  gameOdds: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  oddsText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  availableGamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gameCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  gameCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sportBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sportText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gameCardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  gameCardOdds: {
    color: '#10b981',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#10b981',
  },
  secondaryButton: {
    backgroundColor: '#334155',
    borderWidth: 1,
    borderColor: '#475569',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#f59e0b',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 32,
  },
});

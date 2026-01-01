import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PredictionsScreen({ navigation }) {
  const predictions = [
    { id: 1, sport: 'NFL', teams: 'Chiefs vs 49ers', prediction: 'Chiefs by 3.5', confidence: '85%' },
    { id: 2, sport: 'NBA', teams: 'Lakers vs Celtics', prediction: 'Celtics by 7', confidence: '78%' },
    { id: 3, sport: 'NHL', teams: 'Maple Leafs vs Canadiens', prediction: 'Maple Leafs by 2', confidence: '82%' },
    { id: 4, sport: 'MLB', teams: 'Yankees vs Dodgers', prediction: 'Dodgers by 1', confidence: '74%' },
    { id: 5, sport: 'NFL', teams: 'Bills vs Dolphins', prediction: 'Bills by 4.5', confidence: '80%' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="trending-up" size={32} color="#8b5cf6" />
          <Text style={styles.title}>AI Predictions</Text>
          <Text style={styles.subtitle}>Powered by Machine Learning</Text>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🎯 AI Prediction Engine</Text>
          <Text style={styles.infoText}>
            Our AI analyzes thousands of data points including:
            • Team performance metrics
            • Player statistics
            • Weather conditions
            • Historical matchups
            • Injury reports
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Top Predictions</Text>
          {predictions.map((pred) => (
            <View key={pred.id} style={styles.predictionCard}>
              <View style={styles.predictionHeader}>
                <View style={[styles.sportBadge, { backgroundColor: getSportColor(pred.sport) }]}>
                  <Text style={styles.sportText}>{pred.sport}</Text>
                </View>
                <Text style={styles.confidence}>Confidence: {pred.confidence}</Text>
              </View>
              
              <Text style={styles.matchup}>{pred.teams}</Text>
              <View style={styles.predictionResult}>
                <Ionicons name="arrow-forward" size={20} color="#10b981" />
                <Text style={styles.predictionText}>{pred.prediction}</Text>
              </View>
              
              <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.detailsButtonText}>View Detailed Analysis</Text>
                <Ionicons name="chevron-forward" size={16} color="#8b5cf6" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Prediction Accuracy</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>78.5%</Text>
              <Text style={styles.statLabel}>Overall Accuracy</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>82.3%</Text>
              <Text style={styles.statLabel}>NFL Predictions</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>75.1%</Text>
              <Text style={styles.statLabel}>NBA Predictions</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>80.7%</Text>
              <Text style={styles.statLabel}>MLB Predictions</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Betting')}
        >
          <Ionicons name="cash" size={24} color="#fff" />
          <Text style={styles.ctaButtonText}>View Betting Recommendations</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function getSportColor(sport) {
  const colors = {
    'NFL': '#dc2626',
    'NBA': '#2563eb',
    'NHL': '#0891b2',
    'MLB': '#ca8a04',
  };
  return colors[sport] || '#7c3aed';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { 
    padding: 20, 
    backgroundColor: '#1e293b', 
    borderBottomWidth: 1, 
    borderBottomColor: '#334155' 
  },
  headerContent: {
    alignItems: 'center',
  },
  title: { 
    color: '#fff', 
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: { 
    color: '#8b5cf6', 
    fontSize: 16, 
    textAlign: 'center', 
    marginTop: 5,
    fontWeight: '600'
  },
  content: { flex: 1, padding: 16 },
  infoCard: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
  },
  infoTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingLeft: 8,
  },
  predictionCard: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sportBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  sportText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  confidence: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '600',
  },
  matchup: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  predictionResult: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  predictionText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  detailsButtonText: {
    color: '#8b5cf6',
    fontSize: 14,
    fontWeight: '600',
  },
  statsSection: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#1e293b',
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: '#7c3aed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
});

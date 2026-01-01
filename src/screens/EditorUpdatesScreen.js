// src/screens/EditorUpdatesScreen-simple.js
import React, { useState, useEffect } from 'react';
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
import { Ionicons } from '@expo/vector-icons';

export default function EditorUpdatesScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updates, setUpdates] = useState([]);

  const loadUpdates = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock updates
      const mockUpdates = [
        {
          id: 1,
          title: 'Market Trends: NFL Playoffs',
          content: 'Betting lines shifting significantly for Chiefs vs Ravens matchup.',
          time: '2 hours ago',
          type: 'trend'
        },
        {
          id: 2,
          title: 'Injury Report Update',
          content: 'Key player questionable for Sunday games. Monitor practice reports.',
          time: '4 hours ago',
          type: 'injury'
        },
        {
          id: 3,
          title: 'Weather Alert',
          content: 'Snow expected in Buffalo, may affect game conditions.',
          time: '6 hours ago',
          type: 'weather'
        },
        {
          id: 4,
          title: 'Line Movement',
          content: 'Public money heavy on the underdog, causing line adjustments.',
          time: '1 day ago',
          type: 'line'
        },
        {
          id: 5,
          title: 'Expert Consensus',
          content: 'Top analysts leaning towards the over in tonight\'s NBA matchup.',
          time: '2 days ago',
          type: 'consensus'
        }
      ];
      
      setUpdates(mockUpdates);
      
    } catch (error) {
      console.error('Error loading updates:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUpdates();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadUpdates(true);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'trend': return '#ef4444';
      case 'injury': return '#f59e0b';
      case 'weather': return '#3b82f6';
      case 'line': return '#8b5cf6';
      case 'consensus': return '#10b981';
      default: return '#94a3b8';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'trend': return 'trending-up';
      case 'injury': return 'medkit';
      case 'weather': return 'cloud';
      case 'line': return 'pulse';
      case 'consensus': return 'people';
      default: return 'information-circle';
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ef4444" />
        <Text style={styles.loadingText}>Loading Market Moves...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Market Moves</Text>
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
        <View style={styles.updatesContainer}>
          {updates.map((update) => (
            <TouchableOpacity key={update.id} style={styles.updateCard}>
              <View style={styles.updateHeader}>
                <View style={[styles.typeBadge, { backgroundColor: getTypeColor(update.type) + '20' }]}>
                  <Ionicons name={getTypeIcon(update.type)} size={16} color={getTypeColor(update.type)} />
                  <Text style={[styles.typeText, { color: getTypeColor(update.type) }]}>
                    {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                  </Text>
                </View>
                <Text style={styles.updateTime}>{update.time}</Text>
              </View>
              
              <Text style={styles.updateTitle}>{update.title}</Text>
              <Text style={styles.updateContent}>{update.content}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
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
    backgroundColor: '#1e293b',
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
  updatesContainer: {
    padding: 16,
  },
  updateCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  updateTime: {
    color: '#64748b',
    fontSize: 12,
  },
  updateTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 24,
  },
  updateContent: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 32,
  },
});

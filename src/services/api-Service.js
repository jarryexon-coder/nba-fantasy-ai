// Production-ready API service
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

class ApiService {
  constructor() {
    // Use the same base URL as nbaService.js (ngrok for development)
    // Or use environment variable if available
    this.BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://pleasing-determination-production.up.railway.app';
    this.API_VERSION = 'v1';
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    
    this.cache = new Map();
    this.requestQueue = new Map();
    
    console.log('🔧 API Service using URL:', this.BASE_URL); // Debug log
  }

  // ... [ALL OTHER METHODS REMAIN THE SAME - shortened for brevity] ...

  // ========================
  // SPORTS DATA METHODS
  // ========================

  /**
   * Fetch NBA games.
   * @returns {Promise} List of NBA games.
   */
  getGames = async (options = {}) => {
    return this.request('GET', `/api/nba/games`, null, options);
  };

  /**
   * Fetch all news, optionally filtered by sport.
   * @returns {Promise} News data, likely structured by sport (e.g., { nba: [...], nfl: [...] }).
   */
  getNewsAll = async (options = {}) => {
    return this.request('GET', `/api/news/all`, null, options);
  };

  /**
   * Fetch NHL games.
   * @returns {Promise} List of NHL games.
   */
  getNHLGames = async (options = {}) => {
    return this.request('GET', `/api/nhl/games`, null, options);
  };

  /**
   * Fetch NFL games.
   * @returns {Promise} List of NFL games.
   */
  getNFLGames = async (options = {}) => {
    return this.request('GET', `/api/nfl/games`, null, options);
  };

  /**
   * Fetch daily expert picks.
   * @returns {Promise} List of daily picks.
   */
  getDailyPicks = async (options = {}) => {
    return this.request('GET', `/api/picks/daily`, null, options);
  };

  // --- Optional: Additional methods your other service files might need ---
  /**
   * Fetch NBA player stats.
   */
  getPlayerStats = async (playerId, options = {}) => {
    return this.request('GET', `/api/nba/player/${playerId}`, null, options);
  };

  /**
   * Fetch live game data.
   */
  getLiveGames = async (options = {}) => {
    return this.request('GET', `/api/games/live`, null, options);
  };

  /**
   * Fetch NHL standings.
   */
  getNHLStandings = async (options = {}) => {
    return this.request('GET', `/api/nhl/standings`, null, options);
  };

  /**
   * Fetch AI-generated predictions.
   */
  getAiPredictions = async (options = {}) => {
    return this.request('GET', `/api/predictions/ai`, null, options);
  };
}

export default new ApiService();

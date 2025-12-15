// NBA API Service - Using environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://unrelaxed-unsatisfiable-amal.ngrok-free.dev';

console.log('🔧 NBA Service using API URL:', API_BASE_URL);

export const nbaService = {
  // Test backend connection
  testConnection: async () => {
    try {
      console.log('🧪 Testing connection to:', `${API_BASE_URL}/api/health`);
      const response = await fetch(`${API_BASE_URL}/api/health`);
      const data = await response.json();
      console.log('✅ Backend connection successful:', data);
      return data;
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      throw error;
    }
  },

  // Get player stats
  getPlayerStats: async (playerName) => {
    try {
      console.log(`📊 Fetching stats for: ${playerName}`);
      const response = await fetch(`${API_BASE_URL}/api/nba/player/${encodeURIComponent(playerName)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Error fetching player stats:', error);
      throw error;
    }
  },

  // Get today's games
  getTodaysGames: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/nba/games/today`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Error fetching games:', error);
      throw error;
    }
  },

  // Get betting insights
  getBettingInsights: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/nba/betting/insights`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Error fetching betting insights:', error);
      throw error;
    }
  },

  // Get fantasy advice
  getFantasyAdvice: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/nba/fantasy/advice`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Error fetching fantasy advice:', error);
      throw error;
    }
  },

  // User authentication
  registerUser: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  },

  loginUser: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  }
};

export default nbaService;

// src/providers/SearchProvider.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const SearchContext = createContext();

// Provider component
export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  // Perform search function
  const performSearch = async (query) => {
    if (!query || query.trim() === '') {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchQuery(query);

    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock search results
      const mockResults = [
        { id: 1, name: `${query} Result 1`, type: 'player', sport: 'NFL' },
        { id: 2, name: `${query} Result 2`, type: 'team', sport: 'NBA' },
        { id: 3, name: `${query} Result 3`, type: 'game', sport: 'MLB' },
        { id: 4, name: `${query} Result 4`, type: 'player', sport: 'NHL' },
        { id: 5, name: `${query} Result 5`, type: 'stat', sport: 'All' },
      ];
      
      setSearchResults(mockResults);
      
      // Add to search history
      setSearchHistory(prev => {
        const newHistory = [query, ...prev.filter(h => h !== query)].slice(0, 10);
        return newHistory;
      });
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  // Value provided to consumers
  const value = {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    isSearching,
    setIsSearching,
    searchHistory,
    performSearch,
    clearSearch,
    clearSearchHistory,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

// Custom hook to use search context
export function useSearch() {
  const context = useContext(SearchContext);
  
  if (!context) {
    console.error('useSearch must be used within SearchProvider');
    throw new Error('useSearch must be used within SearchProvider');
  }
  
  return context;
}

/**
 * Search Screen - IMPLEMENTED
 * 
 * Allows users to search articles with:
 * - Search input field
 * - Search history (stored in SQLite)
 * - Results list from API
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, spacing, layout } from '../styles';
import { getSearchHistory, addSearchKeyword } from '../database';
import SearchHistoryList from '../components/SearchHistoryList';

const SearchScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  // Load search history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  /**
   * Load search history from database
   */
  const loadHistory = async () => {
    try {
      const history = await getSearchHistory();
      setSearchHistory(history);
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  /**
   * Perform search
   */
  const handleSearch = async (keyword = searchText) => {
    const searchKeyword = keyword.trim();
    
    if (!searchKeyword) {
      Alert.alert('Empty Search', 'Please enter a search term');
      return;
    }

    if (searchKeyword.length < 3) {
      Alert.alert('Search Too Short', 'Please enter at least 3 characters');
      return;
    }

    try {
      setLoading(true);
      setShowHistory(false);
      setHasSearched(true);

      // Save to search history
      const updatedHistory = await addSearchKeyword(searchKeyword);
      setSearchHistory(updatedHistory);

      // Call search API
      const response = await fetch(`https://epp.f418.eu/search/${encodeURIComponent(searchKeyword)}`);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Search Error', 'Failed to search. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle history item tap
   */
  const handleHistoryPress = (keyword) => {
    setSearchText(keyword);
    handleSearch(keyword);
  };

  /**
   * Clear search and show history
   */
  const handleClear = () => {
    setSearchText('');
    setSearchResults([]);
    setShowHistory(true);
    setHasSearched(false);
  };

  /**
   * Navigate to article detail
   */
  const handleArticlePress = (article) => {
    navigation.navigate('ArticleDetail', {
      label: article.label || article.strLabel,
      title: article.title,
    });
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search articles..."
          placeholderTextColor={colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={() => handleSearch()}
          returnKeyType="search"
          autoFocus
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <MaterialIcons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}

      {/* Search History */}
      {!loading && showHistory && (
        <SearchHistoryList
          history={searchHistory}
          onPress={handleHistoryPress}
        />
      )}

      {/* Search Results */}
      {!loading && !showHistory && hasSearched && (
        <ScrollView style={styles.resultsContainer}>
          {searchResults.length > 0 ? (
            <>
              <Text style={styles.resultsCount}>
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </Text>
              {searchResults.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.resultItem}
                  onPress={() => handleArticlePress(item)}
                >
                  <Text style={styles.resultTitle}>{item.title}</Text>
                  {item.teaser && (
                    <Text style={styles.resultTeaser} numberOfLines={3}>
                      {item.teaser}
                    </Text>
                  )}
                  {item.searchRelevance && (
                    <Text style={styles.resultRelevance}>
                      Relevance: {item.searchRelevance}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="search-off" size={64} color={colors.inactive} />
              <Text style={styles.emptyText}>No results found</Text>
              <Text style={styles.emptySubtext}>Try a different search term</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    margin: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: layout.borderRadius.medium,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    fontSize: fonts.sizes.medium,
    color: colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fonts.sizes.medium,
    color: colors.textSecondary,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsCount: {
    padding: spacing.md,
    fontSize: fonts.sizes.small,
    color: colors.textSecondary,
    fontWeight: fonts.weights.semibold,
  },
  resultItem: {
    backgroundColor: colors.white,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: layout.borderRadius.small,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  resultTitle: {
    fontSize: fonts.sizes.medium,
    fontWeight: fonts.weights.semibold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  resultTeaser: {
    fontSize: fonts.sizes.small,
    color: colors.text,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  resultRelevance: {
    fontSize: fonts.sizes.tiny || 12,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xxl * 2,
  },
  emptyText: {
    fontSize: fonts.sizes.large,
    fontWeight: fonts.weights.semibold,
    color: colors.text,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: fonts.sizes.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});

export default SearchScreen;
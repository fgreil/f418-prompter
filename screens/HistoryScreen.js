/**
 * History Screen
 * 
 * Displays articles user has viewed, grouped by date
 * This screen is accessible via the bottom tab navigation
 */

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, fonts, spacing, icons, layout } from '../styles';
import { getViewHistory, addToViewHistory } from '../database';

const HistoryScreen = ({ navigation }) => {
  const [historyGroups, setHistoryGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load history when screen mounts
  useEffect(() => {
    loadHistory();
  }, []);

  // Reload history when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [])
  );

  /**
   * Load view history from database
   */
  const loadHistory = async () => {
    try {
      setLoading(true);
      const groups = await getViewHistory();
      setHistoryGroups(groups);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Navigate to article detail
   */
  const handleArticlePress = async (article) => {
    // Add to history again (updates timestamp)
    await addToViewHistory(article);
    
    navigation.navigate('ArticleDetail', {
      label: article.label,
      title: article.title,
    });
  };

  // Empty state
  if (!loading && historyGroups.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons 
          name={icons.history} 
          size={layout.iconSizes.extraLarge || 80} 
          color={colors.inactive} 
        />
        <Text style={styles.emptyTitle}>No History Yet</Text>
        <Text style={styles.emptyText}>
          Articles you view will appear here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={historyGroups}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.dateSection}>
            <Text style={styles.dateHeader}>{item.title}</Text>
            {item.data.map((article, index) => (
              <TouchableOpacity
                key={`${article.label}-${index}`}
                style={styles.articleCard}
                onPress={() => handleArticlePress(article)}
              >
                {/* Article Image */}
                {article.image ? (
                  <Image
                    source={{ uri: article.image }}
                    style={styles.articleImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.articleImage, styles.placeholderImage]}>
                    <MaterialIcons name="article" size={32} color={colors.inactive} />
                  </View>
                )}
                
                {/* Article Info */}
                <View style={styles.articleInfo}>
                  <Text style={styles.articleTitle} numberOfLines={2}>
                    {article.title}
                  </Text>
                  {article.teaser && (
                    <Text style={styles.articleTeaser} numberOfLines={2}>
                      {article.teaser}
                    </Text>
                  )}
                </View>
                
                {/* Arrow Icon */}
                <MaterialIcons 
                  name="chevron-right" 
                  size={24} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: fonts.sizes.large,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontSize: fonts.sizes.small,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  dateSection: {
    marginBottom: spacing.lg,
  },
  dateHeader: {
    fontSize: fonts.sizes.small,
    fontWeight: fonts.weights.semibold,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    textTransform: 'uppercase',
  },
  articleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.xs,
    borderRadius: layout.borderRadius.small,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  articleImage: {
    width: 60,
    height: 60,
    borderRadius: layout.borderRadius.small,
    marginRight: spacing.md,
  },
  placeholderImage: {
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleInfo: {
    flex: 1,
  },
  articleTitle: {
    fontSize: fonts.sizes.medium,
    fontWeight: fonts.weights.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  articleTeaser: {
    fontSize: fonts.sizes.small,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});

export default HistoryScreen;
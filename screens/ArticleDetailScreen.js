/**
 * Article Detail Screen
 * 
 * Fetches and displays full article from API
 * Shows title, image, teaser, and full markdown description
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { colors, fonts, spacing } from '../styles';

const ArticleDetailScreen = ({ route, navigation }) => {
  const { label, title } = route.params; // Receive article label and title
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set navigation title
    navigation.setOptions({ title: title || 'Article' });
    
    // Fetch article
    fetchArticle();
  }, []);

  /**
   * Fetch article from API
   */
  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`https://edm.f418.eu/article/${label}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch article: ${response.status}`);
      }
      
      const data = await response.json();
      setArticle(data);
    } catch (err) {
      console.error('Error fetching article:', err);
      setError(err.message);
      Alert.alert('Error', 'Failed to load article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading article...</Text>
      </View>
    );
  }

  // Error state
  if (error || !article) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load article</Text>
        <Text style={styles.errorDetail}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={styles.title}>{article.title}</Text>

        {/* Image */}
        {article.image && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: article.image }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}

        {/* Teaser */}
        {article.teaser && (
          <Text style={styles.teaser}>{article.teaser}</Text>
        )}

        {/* Description (Markdown) */}
        {article.description && (
          <View style={styles.descriptionContainer}>
            <Markdown style={markdownStyles}>
              {article.description}
            </Markdown>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    fontSize: fonts.sizes.h1,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  imageContainer: {
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
  },
  teaser: {
    fontSize: fonts.sizes.medium,
    color: colors.text,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  descriptionContainer: {
    marginTop: spacing.md,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fonts.sizes.medium,
    color: colors.text,
  },
  errorText: {
    fontSize: fonts.sizes.large,
    color: colors.error || '#d32f2f',
    marginBottom: spacing.sm,
  },
  errorDetail: {
    fontSize: fonts.sizes.small,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

// Markdown styles
const markdownStyles = {
  body: {
    color: colors.black || '#000',
    fontSize: fonts.sizes.medium,
    lineHeight: 24,
  },
  heading1: {
    fontSize: fonts.sizes.h1,
    fontWeight: fonts.weights.bold,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    color: colors.primary,
  },
  heading2: {
    fontSize: fonts.sizes.h2,
    fontWeight: fonts.weights.bold,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    color: colors.primary,
  },
  heading3: {
    fontSize: fonts.sizes.h3,
    fontWeight: fonts.weights.bold,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    color: colors.primary,
  },
  strong: {
    fontWeight: fonts.weights.bold,
  },
  em: {
    fontStyle: 'italic',
  },
  link: {
    color: colors.link,
    textDecorationLine: 'underline',
  },
  bullet_list: {
    marginVertical: spacing.xs,
  },
  ordered_list: {
    marginVertical: spacing.xs,
  },
  list_item: {
    marginVertical: 2,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: spacing.sm,
  },
};

export default ArticleDetailScreen;
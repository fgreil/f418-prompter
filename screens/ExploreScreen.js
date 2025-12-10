/**
 * Explore Screen
 * 
 * Displays a horizontal carousel of markdown content from the database
 * Users can swipe left/right to navigate between content items
 * Shows pagination dots at the bottom to indicate position
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { getContent } from '../database';
import { colors, fonts, spacing, layout } from '../styles';
import { addToViewHistory } from '../database';

const { width } = Dimensions.get('window');

const ExploreScreen = () => {
  // State for content items from database
  const [content, setContent] = useState([]);
  // Current carousel page index
  const [currentIndex, setCurrentIndex] = useState(0);
  // Loading state while fetching from database
  const [loading, setLoading] = useState(true);
  // Reference to the ScrollView for programmatic control
  const scrollViewRef = useRef(null);

  // Load content from database on component mount
  useEffect(() => {
    loadContent();
  }, []);

  /**
   * Load markdown content from SQLite database
   */
  const loadContent = async () => {
    try {
      const data = await getContent();
      setContent(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading content:', error);
      setLoading(false);
    }
  };

  /**
   * Update current index when user scrolls
   * Calculates which page is currently visible
   */
  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
 /**
 * Handle article press - navigate to detail and add to history
 */
const handleArticlePress = async (item) => {
  // For now, we'll treat the first H1 as the title
  const titleMatch = item.markdown.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : 'Article';
  
  // Create article object for history
  const article = {
    label: `content-${item.id}`, // Use DB id as label
    title: title,
    image: '', // No image in current content
    teaser: item.markdown.substring(0, 150) + '...', // First 150 chars
  };
  
  // Add to history
  await addToViewHistory(article);
  
  // For local content, we could either:
  // 1. Navigate to ArticleDetail (but it expects an API call)
  // 2. Keep current behavior (just swipe through carousel)
  // 3. Create a local article viewer
  
  // Option: Show alert for now
  Alert.alert('Article', 'This is local content. Full article view coming soon!');
 };

  return (
    <View style={styles.container}>
      {/* Horizontal scrollable carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled // Snap to page boundaries
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {/* Render each content item as a page */}
			{content.map((item) => (
			  <TouchableOpacity
				key={item.id}
				activeOpacity={0.9}
				onPress={() => handleArticlePress(item)}
			  >
				<ScrollView
				  style={styles.itemContainer}
				  contentContainerStyle={styles.itemContent}
				>
				  <Markdown style={markdownStyles}>
					{item.markdown}
				  </Markdown>
				</ScrollView>
			  </TouchableOpacity>
			))}
      </ScrollView>
      
      {/* Pagination dots indicator */}
      <View style={styles.pagination}>
        {content.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot // Highlight current page
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  itemContainer: {
    width: width, // Each page is full screen width
  },
  itemContent: {
    padding: spacing.lg,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: colors.background,
  },
  dot: {
    width: layout.iconSizes.small,
    height: layout.iconSizes.small,
    borderRadius: layout.borderRadius.small,
    backgroundColor: colors.inactive,
    marginHorizontal: spacing.xs,
  },
  activeDot: {
    backgroundColor: colors.activeDot,
    width: layout.iconSizes.medium,
    height: layout.iconSizes.medium,
    borderRadius: layout.borderRadius.medium,
  },
});

// Custom styles for markdown rendering
const markdownStyles = {
  body: {
    color: colors.black,
    fontSize: fonts.sizes.medium,
  },
  heading1: {
    fontSize: fonts.sizes.h1,
    fontWeight: fonts.weights.bold,
    marginTop: 10,
    marginBottom: 10,
    color: colors.primary,
  },
  heading2: {
    fontSize: fonts.sizes.h2,
    fontWeight: fonts.weights.bold,
    marginTop: 10,
    marginBottom: 8,
    color: colors.primary,
  },
  heading3: {
    fontSize: fonts.sizes.h3,
    fontWeight: fonts.weights.bold,
    marginTop: 8,
    marginBottom: 6,
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
    marginTop: 5,
    marginBottom: 5,
  },
  ordered_list: {
    marginTop: 5,
    marginBottom: 5,
  },
  list_item: {
    marginTop: 3,
    marginBottom: 3,
  },
};

export default ExploreScreen;
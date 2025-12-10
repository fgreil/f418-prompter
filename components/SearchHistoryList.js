/**
 * Search History List Component
 * 
 * Displays search history with clock icons
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, spacing } from '../styles';

const SearchHistoryList = ({ history, onPress }) => {
  if (!history || history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="search" size={64} color={colors.inactive} />
        <Text style={styles.emptyTitle}>No Search History</Text>
        <Text style={styles.emptyText}>
          Your previous searches will appear here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recent Searches</Text>
      {history.map((keyword, index) => (
        <TouchableOpacity
          key={index}
          style={styles.historyItem}
          onPress={() => onPress(keyword)}
        >
          <MaterialIcons name="history" size={20} color={colors.textSecondary} />
          <Text style={styles.historyText}>{keyword}</Text>
          <MaterialIcons name="arrow-forward" size={20} color={colors.inactive} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: fonts.sizes.small,
    fontWeight: fonts.weights.semibold,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginBottom: spacing.xs,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  historyText: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: fonts.sizes.medium,
    color: colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: fonts.sizes.large,
    fontWeight: fonts.weights.semibold,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontSize: fonts.sizes.small,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default SearchHistoryList;
/**
 * History Screen
 * 
 * Placeholder screen showing a history icon and "Not yet implemented" message
 * This screen is accessible via the bottom tab navigation
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts, spacing, icons, layout } from '../styles';

const HistoryScreen = () => {
  return (
    <View style={styles.container}>
      {/* Large history/clock icon */}
      <MaterialIcons 
        name={icons.history} 
        size={layout.iconSizes.large} 
        color={colors.primary} 
      />
      {/* Placeholder message */}
      <Text style={styles.text}>Not yet implemented</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: fonts.sizes.large,
    color: colors.text,
    marginTop: spacing.lg,
  },
});

export default HistoryScreen;

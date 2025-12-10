/**
 * Custom Drawer Component
 * 
 * Renders the right-side drawer with SVG graphics and informational text
 * The drawer closes when tapped anywhere
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, fonts, spacing } from '../styles';

const CustomDrawer = ({ navigation }) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => navigation.closeDrawer()}
      activeOpacity={1} // No opacity change when pressed
    >
      <View style={styles.content}>
        {/* SVG Star Icon */}
        <View style={styles.svgContainer}>
          <Svg width="120" height="120" viewBox="0 0 120 120">
            {/* Purple circle background */}
            <Circle cx="60" cy="60" r="50" fill={colors.primary} />
            {/* White star in the center */}
            <Path
              d="M 60 20 L 70 50 L 100 50 L 75 70 L 85 100 L 60 80 L 35 100 L 45 70 L 20 50 L 50 50 Z"
              fill={colors.white}
            />
          </Svg>
        </View>
        
        {/* Informational text */}
        <Text style={styles.text}>
          Welcome to the Explore App!{'\n\n'}
          This is a custom drawer with SVG graphics.{'\n\n'}
          Tap anywhere to close this drawer.
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xxl, // Extra padding at top for status bar
  },
  svgContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  text: {
    fontSize: fonts.sizes.medium,
    lineHeight: 24,
    color: colors.text,
    textAlign: 'center',
  },
});

export default CustomDrawer;

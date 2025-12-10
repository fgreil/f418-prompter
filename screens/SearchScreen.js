/**
 * Search Screen
 * 
 * Placeholder screen showing "Not yet implemented" message
 * This screen is opened when tapping the search icon in the header
 * Has a back arrow in the header to return to the main screens
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../styles';

const SearchScreen = () => {
  return (
    <View style={styles.container}>
      {/* Centered placeholder message */}
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
  },
});

export default SearchScreen;

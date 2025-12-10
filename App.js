/**
 * Main App Component
 * 
 * Sets up the navigation structure with:
 * - Bottom tab navigation (Explore, Favorites, History)
 * - Stack navigation for the Search screen and Info panel
 * - Custom header with purple background
 * - Sliding info panel from the right (1/3 width)
 */

import React, { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity, ActivityIndicator, View, Text, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

// Import all screens
import ExploreScreen from './screens/ExploreScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import HistoryScreen from './screens/HistoryScreen';
import SearchScreen from './screens/SearchScreen';
import ArticleDetailScreen from './screens/ArticleDetailScreen';

// Import database and styles
import { initDatabase } from './database';
import { colors, fonts, spacing, icons, layout } from './styles';

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PANEL_WIDTH = SCREEN_WIDTH * 0.67; // 2/3 of screen width

/**
 * Sliding Info Panel Component
 * Slides in from the left side, 2/3 screen width
 */
function SlidingInfoPanel({ visible, onClose }) {
  const slideAnim = useRef(new Animated.Value(-PANEL_WIDTH)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -PANEL_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <View style={styles.panelContainer} pointerEvents={visible ? 'auto' : 'none'}>
      {/* Overlay background */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: slideAnim.interpolate({
              inputRange: [-PANEL_WIDTH, 0],
              outputRange: [0, 1],
            }),
          },
        ]}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>
      
      {/* Sliding panel */}
      <Animated.View
        style={[
          styles.panel,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <ScrollView style={styles.panelContent}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <MaterialIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>

          {/* SVG Star Icon */}
          <View style={styles.svgContainer}>
            <Svg width="80" height="80" viewBox="0 0 120 120">
              <Circle cx="60" cy="60" r="50" fill={colors.primary} />
              <Path
                d="M 60 20 L 70 50 L 100 50 L 75 70 L 85 100 L 60 80 L 35 100 L 45 70 L 20 50 L 50 50 Z"
                fill={colors.white}
              />
            </Svg>
          </View>
          
          <Text style={styles.panelTitle}>f418-prompter</Text>
          <Text style={styles.panelText}>
            Welcome to the Explore App!{'\n\n'}
            This app demonstrates markdown content with SQLite storage.{'\n\n'}
            Swipe right or tap outside to close.
          </Text>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

/**
 * Bottom Tab Navigator
 * Contains the three main screens: Explore, Favorites, History
 */
function TabNavigator() {
  const [panelVisible, setPanelVisible] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ navigation }) => ({
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.white,
          },
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: fonts.weights.bold,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => setPanelVisible(true)}
              style={{ marginLeft: spacing.md }}
            >
              <MaterialIcons 
                name={icons.menu} 
                size={layout.iconSizes.header} 
                color={colors.white} 
              />
            </TouchableOpacity>
          ),
          // NEW: Add search icon to all tabs
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Search')}
              style={{ marginRight: spacing.md }}
            >
              <MaterialIcons 
                name="search" 
                size={layout.iconSizes.header} 
                color={colors.white} 
              />
            </TouchableOpacity>
          ),
        })}
      >
        {/* Explore tab with globe icon */}
        <Tab.Screen
          name="Explore"
          component={ExploreScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name={icons.public} size={size} color={color} />
            ),
          }}
        />
        {/* Favorites tab with heart icon */}
        <Tab.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name={icons.favorite} size={size} color={color} />
            ),
          }}
        />
        {/* History tab with clock icon */}
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name={icons.history} size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      
      <SlidingInfoPanel 
        visible={panelVisible} 
        onClose={() => setPanelVisible(false)} 
      />
    </>
  );
}

/**
 * Root Stack Navigator
 * Wraps TabNavigator and adds Search screen
 */
function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: fonts.weights.bold,
          },
          title: 'Search',
        }}
      />
	  <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: fonts.weights.bold,
          },
          title: '',
        }}
      />
    </Stack.Navigator>
  );
}

/**
 * Main App Component
 * Initializes database and sets up the root navigation stack
 */
export default function App() {
  const [isReady, setIsReady] = useState(false);

  // Initialize database on app startup
  useEffect(() => {
    const prepare = async () => {
      try {
        await initDatabase();
        setIsReady(true);
      } catch (error) {
        console.error('Error initializing database:', error);
        setIsReady(true); // Continue even if database init fails
      }
    };

    prepare();
  }, []);

  // Show loading spinner while initializing
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* Light status bar for dark purple header */}
      <StatusBar style="light" />
      <RootStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  panelContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  panel: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: PANEL_WIDTH,
    backgroundColor: colors.white,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  panelContent: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xxl,
  },
  closeIcon: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
  },
  svgContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  panelTitle: {
    fontSize: fonts.sizes.large,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  panelText: {
    fontSize: fonts.sizes.small,
    lineHeight: 20,
    color: colors.text,
    textAlign: 'center',
  },
});
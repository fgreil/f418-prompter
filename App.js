/**
 * Main App Component
 * 
 * Sets up the navigation structure with:
 * - Bottom tab navigation (Explore, Favorites, History)
 * - Right-side drawer navigation (hamburger menu)
 * - Stack navigation for the Search screen
 * - Custom header with purple background
 */

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';

// Import all screens
import ExploreScreen from './screens/ExploreScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import HistoryScreen from './screens/HistoryScreen';
import SearchScreen from './screens/SearchScreen';
import CustomDrawer from './components/CustomDrawer';

// Import database and styles
import { initDatabase } from './database';
import { colors, fonts, spacing, icons, layout } from './styles';

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

/**
 * Bottom Tab Navigator
 * Contains the three main screens: Explore, Favorites, History
 */
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,     // Purple when active
        tabBarInactiveTintColor: colors.textSecondary, // Gray when inactive
        tabBarStyle: {
          backgroundColor: colors.white,
        },
        headerShown: false, // Header is handled by DrawerNavigator
      }}
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
  );
}

/**
 * Drawer Navigator
 * Wraps the TabNavigator and provides:
 * - Custom header with purple background
 * - Hamburger menu button (opens drawer from right)
 * - Search icon button (navigates to Search screen)
 */
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={({ navigation, route }) => {
        // Get current screen name for header title
        const routeName = route.state
          ? route.state.routes[route.state.index].name
          : 'Explore';

        return {
          // Purple header styling
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: fonts.weights.bold,
          },
          headerTitle: routeName,
          // Hamburger menu button on the left
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.toggleDrawer()}
              style={{ marginLeft: spacing.md }}
            >
              <MaterialIcons 
                name={icons.menu} 
                size={layout.iconSizes.header} 
                color={colors.white} 
              />
            </TouchableOpacity>
          ),
          // Search icon button on the right
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Search')}
              style={{ marginRight: spacing.md }}
            >
              <MaterialIcons 
                name={icons.search} 
                size={layout.iconSizes.header} 
                color={colors.white} 
              />
            </TouchableOpacity>
          ),
          drawerPosition: 'right', // Drawer slides in from right side
          drawerStyle: {
            width: layout.drawerWidth, // 75% of screen width
          },
        };
      }}
    >
      <Drawer.Screen name="Main" component={TabNavigator} />
    </Drawer.Navigator>
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
      <Stack.Navigator>
        {/* Main app with drawer and tabs */}
        <Stack.Screen
          name="Home"
          component={DrawerNavigator}
          options={{ headerShown: false }} // Drawer has its own header
        />
        {/* Search screen with back button */}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { RootStackParamList, MainTabParamList } from './types'

// Screens
import HomeScreen from '../screens/Home'
import CategoriesScreen from '../screens/Categories'
import SearchScreen from '../screens/Search'
import SavedNewsScreen from '../screens/SavedNews'
import ProfileScreen from '../screens/Profile'
import ArticleScreen from '../screens/Article'
import AuthScreen from '../screens/Auth'
import CategoryArticlesScreen from '../screens/CategoryArticles'

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<MainTabParamList>()

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Categories" 
        component={CategoriesScreen}
        options={{
          tabBarLabel: 'Categories',
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
        }}
      />
      <Tab.Screen 
        name="SavedNews" 
        component={SavedNewsScreen}
        options={{
          tabBarLabel: 'Saved',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  )
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen 
          name="Article" 
          component={ArticleScreen}
          options={{
            headerShown: true,
            title: 'Article',
          }}
        />
        <Stack.Screen 
          name="CategoryArticles" 
          component={CategoryArticlesScreen}
          options={{
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

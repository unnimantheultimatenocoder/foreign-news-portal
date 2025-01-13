import React, { useCallback } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'
import NewsCard from '../components/NewsCard'
import { Article } from '../types/article'
import { useSavedArticles } from '../hooks/useSavedArticles'
import { useAuthContext } from '../contexts/AuthContext'

export default function SavedNewsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const { user, isAuthenticated } = useAuthContext()

  const {
    data: articles = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useSavedArticles(user?.id, {
    enabled: isAuthenticated,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })

  const renderItem = useCallback(
    ({ item }: { item: Article }) => <NewsCard article={item} />,
    []
  )

  const keyExtractor = useCallback((item: Article) => item.id, [])

  if (!isAuthenticated) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.messageText}>
          Sign in to view your saved articles
        </Text>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (isLoading && !articles.length) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          Unable to load saved articles. Please check your connection.
        </Text>
        <TouchableOpacity
          style={[styles.signInButton, styles.retryButton]}
          onPress={() => refetch()}
        >
          <Text style={styles.signInButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              You haven't saved any articles yet
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 16,
  },
  messageText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  signInButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButton: {
    marginTop: 16,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})

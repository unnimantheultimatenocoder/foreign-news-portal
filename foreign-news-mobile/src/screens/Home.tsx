import React, { useCallback } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
} from 'react-native'
import NewsCard from '../components/NewsCard'
import { Article } from '../types/article'
import { useOfflineArticles } from '../hooks/useOfflineArticles'

export default function HomeScreen() {
  const {
    data: articles = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useOfflineArticles({
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })

  const renderItem = useCallback(
    ({ item }: { item: Article }) => <NewsCard article={item} />,
    []
  )

  const keyExtractor = useCallback((item: Article) => item.id, [])

  if (isLoading && !articles.length) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  if (isError && !articles.length) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          Unable to load articles. Please check your connection.
        </Text>
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
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No articles available</Text>
          </View>
        }
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
  },
})

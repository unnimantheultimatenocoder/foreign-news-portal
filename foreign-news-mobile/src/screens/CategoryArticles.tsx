import React, { useCallback, useLayoutEffect } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
} from 'react-native'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { RootStackParamList } from '../navigation/types'
import { useCategoryArticles } from '../hooks/useCategoryArticles'
import NewsCard from '../components/NewsCard'
import { Article } from '../types/article'

type CategoryArticlesRouteProp = RouteProp<RootStackParamList, 'CategoryArticles'>

export default function CategoryArticlesScreen() {
  const route = useRoute<CategoryArticlesRouteProp>()
  const navigation = useNavigation()
  const { categoryId, categoryName } = route.params

  useLayoutEffect(() => {
    navigation.setOptions({
      title: categoryName,
      headerShown: true,
    })
  }, [navigation, categoryName])

  const {
    data: articles = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useCategoryArticles(categoryId, {
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

  if (isError) {
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No articles available in this category
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
  },
})

import React, { useState, useCallback } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Keyboard,
} from 'react-native'
import NewsCard from '../components/NewsCard'
import { Article } from '../types/article'
import { useSearch } from '../hooks/useSearch'
import { debounce } from '../lib'

export default function SearchScreen() {
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const {
    data: articles = [],
    isLoading,
    isError,
    isFetching,
  } = useSearch(searchTerm, {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })

  const debouncedSearch = useCallback(
    debounce((text: string) => {
      setSearchTerm(text)
    }, 300),
    []
  )

  const handleSearch = (text: string) => {
    setSearchInput(text)
    debouncedSearch(text)
  }

  const handleClear = () => {
    setSearchInput('')
    setSearchTerm('')
    Keyboard.dismiss()
  }

  const renderItem = useCallback(
    ({ item }: { item: Article }) => <NewsCard article={item} />,
    []
  )

  const keyExtractor = useCallback((item: Article) => item.id, [])

  const renderContent = () => {
    if (isLoading || isFetching) {
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
            Unable to perform search. Please try again.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => debouncedSearch(searchInput)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )
    }

    if (!searchTerm.trim()) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.placeholderText}>
            Enter keywords to search for articles
          </Text>
        </View>
      )
    }

    if (articles.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.placeholderText}>
            No articles found matching "{searchTerm}"
          </Text>
        </View>
      )
    }

    return (
      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search articles..."
            placeholderTextColor="#666"
            value={searchInput}
            onChangeText={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchInput.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {renderContent()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
    marginRight: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#666',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContent: {
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})

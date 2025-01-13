import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Category } from '../hooks/useCategories'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'

interface CategoryCardProps {
  category: Category
}

const getRandomColor = () => {
  const colors = [
    '#007AFF', // Blue
    '#34C759', // Green
    '#FF9500', // Orange
    '#FF2D55', // Pink
    '#5856D6', // Purple
    '#FF3B30', // Red
    '#5AC8FA', // Light Blue
    '#4CD964', // Light Green
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const backgroundColor = React.useMemo(() => getRandomColor(), [])

  const handlePress = () => {
    navigation.navigate('CategoryArticles', {
      categoryId: category.id,
      categoryName: category.name,
    })
  }

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.name}>{category.name}</Text>
        {category.description && (
          <Text style={styles.description} numberOfLines={2}>
            {category.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    margin: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 100,
  },
  content: {
    padding: 16,
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
})

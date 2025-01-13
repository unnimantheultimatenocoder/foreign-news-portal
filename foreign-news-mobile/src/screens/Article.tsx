import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  ActivityIndicator,
} from 'react-native'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'
import { Article } from '../types/article'
import { supabase } from '../integrations/supabase/client'
import { useState, useEffect } from 'react'

type Props = NativeStackScreenProps<RootStackParamList, 'Article'>

export default function ArticleScreen({ route, navigation }: Props) {
  const translateX = useSharedValue(0)

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX
    })
    .onEnd((event) => {
      if (event.translationX > 100) {
        // Swipe right to go back
        navigation.goBack()
      }
      translateX.value = withSpring(0)
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))
  const { id } = route.params
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    fetchArticle()
    checkIfSaved()
  }, [id])

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setArticle(data)
    } catch (error) {
      console.error('Error fetching article:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkIfSaved = async () => {
    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session?.user) return

      const { data, error } = await supabase
        .from('reading_progress')
        .select('*')
        .eq('article_id', id)
        .eq('user_id', session.session.user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setIsSaved(!!data)
    } catch (error) {
      console.error('Error checking saved status:', error)
    }
  }

  const handleShare = async () => {
    if (!article) return
    try {
      await Share.share({
        message: `${article.title}\n\n${article.summary}\n\nRead more:`,
        url: article.original_url,
      })
    } catch (error) {
      console.error('Error sharing article:', error)
    }
  }

  const toggleSave = async () => {
    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session?.user) {
        navigation.navigate('Auth')
        return
      }

      if (isSaved) {
        await supabase
          .from('reading_progress')
          .delete()
          .eq('article_id', id)
          .eq('user_id', session.session.user.id)
      } else {
        await supabase.from('reading_progress').insert({
          article_id: id,
          user_id: session.session.user.id,
          progress: 0,
        })
      }

      setIsSaved(!isSaved)
    } catch (error) {
      console.error('Error toggling save:', error)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  if (!article) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Article not found</Text>
      </View>
    )
  }

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <ScrollView>
      {article.image_url && (
        <Image
          source={{ uri: article.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.content}>
        <Text style={styles.title}>{article.title}</Text>
        
        <View style={styles.meta}>
          <Text style={styles.source}>{article.source}</Text>
          {article.published_at && (
            <Text style={styles.date}>
              {new Date(article.published_at).toLocaleDateString()}
            </Text>
          )}
        </View>

        <Text style={styles.summary}>{article.summary}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={toggleSave}
          >
            <Text style={styles.actionButtonText}>
              {isSaved ? 'Unsave' : 'Save'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
          >
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
        </ScrollView>
      </Animated.View>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  source: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  summary: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
})

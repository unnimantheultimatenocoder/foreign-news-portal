import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import { useTheme } from '../contexts/ThemeContext'

const { width } = Dimensions.get('window')

type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onHide: () => void
  position?: 'top' | 'bottom'
}

export function Toast({
  message,
  type = 'info',
  duration = 3000,
  onHide,
  position = 'top',
}: ToastProps) {
  const { theme } = useTheme()
  const translateY = useRef(new Animated.Value(position === 'top' ? -100 : 100))
  const opacity = useRef(new Animated.Value(0))

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY.current, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity.current, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()

    const timer = setTimeout(() => {
      hideToast()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY.current, {
        toValue: position === 'top' ? -100 : 100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity.current, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide()
    })
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#4caf50'
      case 'error':
        return theme.error
      default:
        return theme.primary
    }
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          transform: [{ translateY: translateY.current }],
          opacity: opacity.current,
          [position]: 50,
        },
      ]}
    >
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    maxWidth: width - 40,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

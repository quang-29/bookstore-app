// TypingIndicator.js
import React, { useEffect, useRef } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';

const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const animateDot = (dot, delay) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot, {
          toValue: -5,
          duration: 300,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(dot, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    animateDot(dot1, 0);
    animateDot(dot2, 150);
    animateDot(dot3, 300);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.dot, { transform: [{ translateY: dot1 }] }]}>.</Animated.Text>
      <Animated.Text style={[styles.dot, { transform: [{ translateY: dot2 }] }]}>.</Animated.Text>
      <Animated.Text style={[styles.dot, { transform: [{ translateY: dot3 }] }]}>.</Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  dot: {
    fontSize: 30,
    lineHeight: 35,
    color: '#555',
    marginHorizontal: 1,
  },
});

export default TypingIndicator;

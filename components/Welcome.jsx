import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { COLORS, SIZES } from '../constants'
import { Ionicons } from '@expo/vector-icons'

const Welcome = () => {
  return (
    <View style={styles.mainContainer}>
        <View style={styles.container}>
            <Text style={styles.title}>Find Books</Text>
            <Text style={styles.subtitle}>Find your place you belong</Text>
        </View>

        <View style={styles.searchContainer}>
            <TouchableOpacity style={styles.icon}>
                <Ionicons name='search-outline' size={26} color={COLORS.primary} />
            </TouchableOpacity>
            
            <TextInput 
                style={styles.input} 
                placeholder="What are you looking for?"
                placeholderTextColor={COLORS.black}
            />

            <TouchableOpacity style={styles.icon}>
                <Ionicons name='camera-outline' size={26} color={COLORS.primary} />
            </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    mainContainer: {
    paddingVertical: 10, // Reduced paddingVertical to reduce height
    backgroundColor: COLORS.lightGray,
  },
  container: {
    marginBottom: 5, // Reduced marginBottom to reduce height
  },
  title: {
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  subtitle: {
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
    shadowColor: COLORS.dark,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  icon: {
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: SIZES.medium,
    color: COLORS.dark,
    paddingVertical: 8,
    paddingLeft: 10,
    borderRadius: 12,
    backgroundColor: COLORS.dark,
  },
});

export default Welcome;

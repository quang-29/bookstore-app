import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import * as ImagePicker from 'expo-image-picker';
import colors from '@/constants/colors';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    // Perform search logic here
    console.log('Searching for:', query);
    // Example search results
    setResults([
      { id: 1, title: 'Mộ đom đóm' },
      { id: 2, title: 'Tôi thấy hoa vàng trên cỏ xanh' },
      { id: 3, title: 'Lão Hạc' },
    ]);
  };

  const handleCamera = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera access is required to find books by camera.');
      return;
    }

    // Launch the camera
    const result = await ImagePicker.launchCameraAsync();
    if (!result.cancelled) {
      console.log('Image captured:', result.uri);
      // Perform image recognition logic here
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.resultItem}>
      <Text style={styles.resultItemText}>{item.title}</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {/* <Book size={64} color={colors.gray[300]} /> */}
      <Text style={styles.emptyTitle}>Find Your Next Book</Text>
      <Text style={styles.emptyText}>
        Search by title, author, or browse categories to discover your next favorite read.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for books..."
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cameraButton} onPress={handleCamera}>
          <Ionicons name="camera-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      {results.length === 0 ? renderEmptyState() :
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.resultsList}
      />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.lightGray,
    marginTop: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 20,
    shadowColor: COLORS.dark,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  input: {
    flex: 1,
    fontSize: SIZES.medium,
    color: COLORS.dark,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 10,
    marginLeft: 10,
  },
  cameraButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 10,
    marginLeft: 10,
  },
  resultsList: {
    paddingBottom: 20,
  },
  resultItem: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: COLORS.dark,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  resultItemText: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
  },
});

export default Search;
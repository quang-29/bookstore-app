import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import * as ImagePicker from 'expo-image-picker';
import colors from '@/constants/colors';
import instance from '@/axios-instance';
import VerticalBookList from '@/components/VerticalBookList';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const res = await instance.get(`/api/book/search?name=${query}`);
      if (res.data.data && res.data.data.length > 0) {
        setResults(res.data.data);
      } else {
        setResults([]);
        Alert.alert('Không tìm thấy', 'Không có sách phù hợp với tìm kiếm của bạn.');
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi tìm kiếm sách.');
    } finally {
      setLoading(false);
    }
  };

  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Từ chối quyền', 'Bạn cần cấp quyền truy cập máy ảnh.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      console.log('Image captured:', imageUri);
      // TODO: Gửi ảnh lên server để tìm sách bằng OCR
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Tìm sách bạn yêu thích</Text>
      <Text style={styles.emptyText}>
        Hãy tìm kiếm theo tên sách, tác giả hoặc thể loại.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm sách..."
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cameraButton} onPress={handleCamera}>
          <Ionicons name="camera-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 30 }} />
      ) : results.length > 0 ? (
        <VerticalBookList books={results} />
      ) : (
        renderEmptyState()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.lightGray,
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: COLORS.dark,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
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
});

export default Search;

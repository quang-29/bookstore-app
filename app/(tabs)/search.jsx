import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import colors from '@/constants/colors';
import instance from '@/axios-instance';
import VerticalBookList from '@/components/VerticalBookList';


const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);


  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      setLoading(true);
      const res = await instance.get(`/api/book/search?name=${query}`);
      if (res.data.data && res.data.data.length > 0) {
        setResults(res.data.data);
        setNoResult(false);
      } else {
        setResults([]);
        setNoResult(true);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi tìm kiếm sách.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = () => {
    Alert.alert(
      'Chọn phương thức',
      'Bạn muốn xử lý ảnh theo cách nào?',
      [
        { text: '📷 Vintern (ảnh bìa)', onPress: () => pickImageAndProcessWithVintern() },
        { text: '🧾 OCR (tìm ISBN hoặc tên)', onPress: () => pickImageAndProcessWithOCR() },
        { text: 'Huỷ', style: 'cancel' },
      ]
    );
  };

  const pickImageAndProcessWithOCR = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
    });
    if (!result.canceled && result.assets?.length > 0) {
      await processImage(result.assets[0].uri);
    }
  };

  const pickImageAndProcessWithVintern = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
    });
    if (!result.canceled && result.assets?.length > 0) {
      await processImageWithVintern(result.assets[0].uri);
    }
  };

  const processImage = async (uri) => {
  try {
    setLoading(true);

    const resizedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
    );

    const formData = new FormData();
    formData.append('file', {
      uri: resizedImage.uri,
      name: 'image.jpg',
      type: 'image/jpeg',
    });

    const ocrRes = await fetch('http://192.168.111.164:5000/api/ocr', {
      method: 'POST',
      body: formData,
    });

    if (!ocrRes.ok) {
      const errText = await ocrRes.text();
      throw new Error(errText || 'Lỗi từ OCR server');
    }

    const ocrData = await ocrRes.json();
    const text = ocrData.texts;

    if (!text || text.trim().length === 0) {
      Alert.alert('Không nhận diện được văn bản');
      return;
    }

    // Tìm ISBN trong kết quả OCR
    const isbnMatch = text.match(/97[89][\-\s]?\d{1,5}[\-\s]?\d{1,7}[\-\s]?\d{1,7}[\-\s]?\d/);
    if (isbnMatch) {
      const cleanIsbn = isbnMatch[0].replace(/[-\s]/g, '');
      const searchRes = await instance.get(`/api/book/searchByISBN?str=${cleanIsbn}`);
      if (searchRes.data.data) {
        setResults([searchRes.data.data]);
        setNoResult(false);
        return;
      }
    }

    // Nếu không có ISBN hoặc không tìm được theo ISBN → tìm theo tên
    const searchRes = await instance.get(`/api/book/search?name=${encodeURIComponent(text)}`);
    if (searchRes.data.data?.length > 0) {
      setResults(searchRes.data.data);
    } else {
      setResults([]);
      setNoResult(true);
    }

  } catch (error) {
    console.error('Lỗi xử lý ảnh:', error);
    Alert.alert('Lỗi', 'Không thể xử lý ảnh.');
  } finally {
    setLoading(false);
  }
};

  const processImageWithVintern = async (uri) => {
  try {
    setLoading(true);

    const resizedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
    );

    const formData = new FormData();
    formData.append('file', {
      uri: resizedImage.uri,
      name: 'image.jpg',
      type: 'image/jpeg',
    });

    const vinternRes = await fetch('http://192.168.111.164:5000/api/vintern', {
      method: 'POST',
      body: formData,
    });

    if (!vinternRes.ok) {
      const errText = await vinternRes.text();
      throw new Error(errText || 'Vintern server error');
    }

    const result = await vinternRes.json();
    const text = result.result || '';

    if (!text || text.trim().length === 0) {
      Alert.alert('Không nhận diện được tên sách');
      return;
    }

    const match = text.match(/(?:\*\*Tên sách:\*\*|Tên sách:)\s*(.+)/i);
    const title = match ? match[1].split('(')[0].trim() : text.trim();

    const searchRes = await instance.get(`/api/book/search?name=${encodeURIComponent(title)}`);
    if (searchRes.data.data?.length > 0) {
      setResults(searchRes.data.data);
      setNoResult(false);
    } else {
      setResults([]);
      setNoResult(true);
    }
  } catch (error) {
    console.error('Lỗi Vintern:', error);
    Alert.alert('Lỗi', 'Không thể xử lý ảnh với mô hình Vintern.');
  } finally {
    setLoading(false);
  }
};


  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Tìm sách bạn yêu thích</Text>
      <Text style={styles.emptyText}>Hãy tìm kiếm theo tên sách, tác giả hoặc thể loại.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm sách..."
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            setNoResult(false);
          }}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cameraButton} onPress={handleImageSelect}>
          <Ionicons name="camera-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

          {loading ? (
      <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 30 }} />
    ) : results.length > 0 ? (
      <VerticalBookList books={results} />
    ) : noResult ? (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Xin lỗi, cửa hàng chúng tôi hiện chưa có sách mà bạn đang tìm kiếm</Text>
      </View>
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
    marginTop: 30,
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

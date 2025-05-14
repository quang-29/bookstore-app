import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import * as ImagePicker from 'expo-image-picker';
import colors from '@/constants/colors';
import instance from '@/axios-instance';
import { router } from 'expo-router';
import Loader from '@/components/Loader';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [isLoading,setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchBooks = async () => {
      try {
        const response = await instance.get('/api/book/getAllBooks');
        if (response.data && response.data.content) {
          setBooks(response.data.content);
          setIsLoading(false);
        } else {
          setBooks([]);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
        Alert.alert('Lỗi', 'Không thể tải danh sách sách.');
      }
    };
    fetchBooks();
  }, []);

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

  const handleAddBook = () => {
    router.push('/book/addbook');
  };

  const handleEdit = (book) => {
    router.push({
      pathname: '/book/editbook',
      params: { bookId: book.id },
    });
  };

  const handleDelete = async (bookId) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa sách này?', [
      { text: 'Hủy' },
      {
        text: 'Xóa',
        onPress: async () => {
          try {
            await instance.delete(`/api/book/${bookId}`);
            setBooks((prev) => prev.filter((b) => b.id !== bookId));
            Alert.alert('Thành công', 'Đã xóa sách.');
          } catch (err) {
            Alert.alert('Lỗi', 'Không thể xóa sách.');
          }
        },
      },
    ]);
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

        <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={query.trim() ? results : books}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingVertical: 10 }}
          ListEmptyComponent={renderEmptyState}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: item.imagePath }}
                    style={styles.bookImage}
                    resizeMode="cover"
                  />
                </View>
                <TouchableOpacity style={styles.infoWrapper} onPress={() => router.push(`/book/${item.id}`)}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.author}>Tác giả: {item.author}</Text>
                  <Text style={styles.price}>Giá: ₫{item.price.toLocaleString('vi-VN')}</Text>
                  <View style={styles.actionGroup}>
                    <TouchableOpacity onPress={() => handleEdit(item)} style={styles.iconButton}>
                      <Ionicons name="create-outline" size={22} color="orange" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconButton}>
                      <Ionicons name="trash-outline" size={22} color="red" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
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
  paddingVertical: 6,
},

iconButton: {
  backgroundColor: COLORS.primary,
  borderRadius: 8,
  padding: 10,
  marginLeft: 8,
  justifyContent: 'center',
  alignItems: 'center',
},

addText: {
  color: COLORS.white,
  fontSize: 20,
  fontWeight: 'bold',
},

  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 10,
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 10,
    marginLeft: 10,
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
  },
  imageWrapper: {
    width: 80,
    height: 100,
    marginRight: 12,
  },
  bookImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
  },
  infoWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  author: {
    fontSize: 14,
    color: COLORS.gray,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  actionGroup: {
    flexDirection: 'row',
    marginTop: 8,
  },
  iconButton: {
    paddingHorizontal: 8,
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

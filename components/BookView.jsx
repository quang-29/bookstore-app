import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants';
import { useRouter } from 'expo-router';
import FormatMoney from './FormatMoney';
import instance from '@/axios-instance';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Platform } from 'react-native';


const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2.4;
const CARD_HEIGHT = 300;

const BookView = ({ books }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [likedBooks, setLikedBooks] = useState({});
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchLikedBooks = async () => {
      if (!user?.userId) {
        setLikedBooks({});
        setLoading(false);
        return;
      }

      try {
        const res = await instance.get('/api/user/listBooksLikedByUser', {
          params: { userId: user.userId },
        });

        const likedIds = (res.data.data || []).map(item => item.id || item.bookId);
        const likedMap = {};
        books?.forEach(book => {
          likedMap[book.id] = likedIds.includes(book.id);
        });
        setLikedBooks(likedMap);
      } catch (err) {
        console.error('Lỗi khi lấy sách yêu thích:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedBooks();
  }, [books, user]);

  const onBookPress = (book) => {
    router.push(`/book/${book.id}`);
  };

  const handleLikeButton = async (bookId) => {
    const isLiked = likedBooks[bookId];
    try {
      const url = isLiked ? '/api/user/unlikeBook' : '/api/user/likeBook';
      const response = await instance.put(url, null, {
        params: { userId: user.userId, bookId },
      });

      Alert.alert('Thông báo', response.data.message);

      setLikedBooks(prev => ({
        ...prev,
        [bookId]: !isLiked,
      }));
    } catch (error) {
      console.error('Lỗi like/unlike:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái yêu thích.');
    }
  };

  const handleAddToCart = (bookId) => {
    addToCart(bookId, 1);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#6c5ce7" />
      </View>
    );
  }

  if (!books || books.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>Không có sách nào</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.gridContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Danh sách sách</Text>
        <TouchableOpacity style={styles.viewAllButton} onPress={() => { }}>
          <Text style={styles.viewAllText}>View All</Text>
          <MaterialIcons name="keyboard-arrow-right" size={20} color="#6c5ce7" />
        </TouchableOpacity>
      </View>

      <View style={styles.gridWrapper}>
        {books.map((book) => (
          <TouchableOpacity
            key={book.id}
            style={styles.bookCard}
            onPress={() => onBookPress(book)}
            activeOpacity={0.8}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: book.imagePath }}
                style={styles.bookImage}
              />
              <TouchableOpacity
                onPress={() => handleLikeButton(book.id)}
                style={styles.likeIcon}
              >
                <Ionicons
                  name={likedBooks[book.id] ? 'heart' : 'heart-outline'}
                  size={24}
                  color="#6c5ce7"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAddToCart(book.id)} style={styles.cartIcon}>
                <Ionicons name="cart-outline" size={24} color="#6c5ce7" />
              </TouchableOpacity>
            </View>

            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle} numberOfLines={1}>{book.title}</Text>
              <Text style={styles.bookAuthor} numberOfLines={1}>{book.author || 'Unknown Author'}</Text>
              <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>
                  {book.averageRating ? book.averageRating.toFixed(1) : '0'} ({book.stock || '0'} remains)
                </Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.discountPrice}>{FormatMoney(book.price)}</Text>
                {book.originalPrice && (
                  <Text style={styles.originalPrice}>{FormatMoney(book.originalPrice)}</Text>
                )}
              </View>
              {book.isBestseller && (
                <View style={styles.bestSellerTag}>
                  <Text style={styles.bestSellerText}>Best Seller</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  gridContent: {
    padding: 10,
  },
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#6c5ce7',
    fontWeight: '500',
  },
  bookCard: {
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
  marginBottom: 16,
  backgroundColor: '#fff',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#e0e0e0',
  elevation: 6,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
  overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
},

  // bookCard: {
  //   width: CARD_WIDTH,
  //   height: CARD_HEIGHT,
  //   marginBottom: 16,
  //   backgroundColor: '#fff',
  //   borderRadius: 8,
  //   elevation: 3,
  //   overflow: 'hidden',
  // },
  imageContainer: {
    width: '100%',
    height: CARD_HEIGHT * 0.65,
    position: 'relative',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  bookImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  likeIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    zIndex: 10,
  },
  cartIcon: {
  position: 'absolute',
  bottom: 8,            // ✅ Đặt gần đáy của ảnh
  right: 8,
  backgroundColor: '#fff',
  borderRadius: 20,
  padding: 4,
  zIndex: 999,           // ✅ Đảm bảo nút nằm phía trên ảnh
},
  bookInfo: {
    padding: 8,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c5ce7',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  bestSellerTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bestSellerText: {
    fontSize: 10,
    color: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
});

export default BookView;

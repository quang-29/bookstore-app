import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants';
import { useRouter } from 'expo-router';
import FormatMoney from './FormatMoney';
import { useCart } from '../context/CartContext';

const VerticalBookList = ({ books }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    if (books && books.length >= 0) {
      setLoading(false);
    }
  }, [books]);

  const onBookPress = (book) => {
    router.push(`/book/${book.id}`);
  };

  const handleAddToCart = async (bookId) => {
    try {
      await addToCart(bookId, 1);
      Alert.alert("Thành công", "Đã thêm sách vào giỏ hàng!");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể thêm sách vào giỏ hàng. Vui lòng thử lại sau.");
    }
  };

  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => onBookPress(item)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.imagePath }}
        style={styles.bookImage}
        onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
      />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2} ellipsizeMode="tail">
          {item.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {item.author || 'Unknown Author'}
        </Text>
        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{item.averageRating || '0'}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{FormatMoney(item.price)}</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>Ddd200.000</Text>
          )}
        </View>
      </View>
      <TouchableOpacity 
        style={styles.cartButton}
        onPress={() => handleAddToCart(item.id)}
      >
        <MaterialIcons name="shopping-cart" size={20} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary || '#6c5ce7'} />
      </View>
    );
  }

  if (!books || books.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>Không có sách nào trong danh sách Best Sellers</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightGray || '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 16,
    marginVertical: 8,
    flex: 1, // Ensures it takes available space
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
    color: COLORS.gray || '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.dark || '#333',
    letterSpacing: 0.5,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: COLORS.light || '#f0f0f0',
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary || '#6c5ce7',
    fontWeight: '600',
    marginRight: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  bookCard: {
    flexDirection: 'row', // Horizontal layout for image and info
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  bookImage: {
    width: 100, // Fixed width for consistency
    height: 150, // Fixed height for a book-like aspect ratio
    resizeMode: 'cover',
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  bookInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between', // Distributes content evenly
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark || '#333',
    marginBottom: 4,
    lineHeight: 20,
  },
  bookAuthor: {
    fontSize: 14,
    color: COLORS.gray || '#666',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 13,
    color: COLORS.gray || '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary || '#6c5ce7',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 13,
    color: COLORS.gray || '#999',
    textDecorationLine: 'line-through',
    fontWeight: '400',
  },
  cartButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary || '#6c5ce7',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default VerticalBookList;
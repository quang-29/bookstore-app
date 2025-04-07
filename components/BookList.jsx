import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants';
import { useRouter } from 'expo-router';
import VerticalBookList from './VerticalBookList';
import FormatMoney from './FormatMoney';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');

const BookList = ({ books }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    if (books && books.length >= 0) {
      setLoading(false);
    }
  }, [books]);

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
        <Text style={styles.emptyText}>Không có sách nào trong danh sách Best Sellers</Text>
      </View>
    );
  }

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

  const viewAllBestSellers = () => {
    // <VerticalBookList books={books} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Best Sellers</Text>
        <TouchableOpacity style={styles.viewAllButton} onPress={viewAllBestSellers}>
          <Text style={styles.viewAllText}>View All</Text>
          <MaterialIcons name="keyboard-arrow-right" size={20} color="#6c5ce7" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {books.map((book) => (
          <TouchableOpacity 
            key={book.id} 
            style={styles.bookCard} 
            onPress={() => onBookPress(book)}
          >
            <Image 
              source={{ uri: book.imagePath }} 
              style={styles.bookImage}
              onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
            />
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle} numberOfLines={2}>
                {book.title}
              </Text>
              <Text style={styles.bookAuthor} numberOfLines={1}>
                {book.author || 'Unknown Author'}
              </Text>
              <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{book.averageRating || '0'}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{FormatMoney(book.price)}</Text>
                {book.originalPrice && (
                  <Text style={styles.originalPrice}>dd200.000</Text>
                )}
              </View>
            </View>
            <TouchableOpacity 
              style={styles.cartButton}
              onPress={() => handleAddToCart(book.id)}
            >
              <MaterialIcons name="shopping-cart" size={22} color="#fff" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundColor,
    borderRadius: 16,
    paddingTop: 10,
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
  scrollContent: {
    
  },
  bookCard: {
    width: width / 2 - 24,
    height: width / 2 + 100,
    marginRight: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  bookImage: {
    width: '100%',
    height: width / 2 - 20, 
    resizeMode: 'cover',
    backgroundColor: '#f0f0f0',
  },
  bookInfo: {
    padding: 12,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
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
  cartButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 18,
    backgroundColor: '#6c5ce7',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
});

export default BookList;
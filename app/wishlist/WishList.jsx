import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter,Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import FormatMoney from '@/components/FormatMoney';
import { useFavorite } from '../../context/FavoriteContext';
import instance from '@/axios-instance';
import { useAuth } from '@/context/AuthContext';
import VerticalBookList from '@/components/VerticalBookList';
import BackButton from '@/components/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants/theme';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';


const Wishlist = () => {
  const [loading, setLoading] = useState(true);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavoriteBooks = async () => {
      try {
        const response = await instance.get('/api/user/listBooksLikedByUser', {
          params: { userId: user.userId }
        });
        setFavoriteBooks(response.data.data);
      } catch (error) {
        console.error('Error fetching favorite books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteBooks();
  }, []);

  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => router.push(`/book/${item.id}`)}
    >
      <Image
        source={{ uri: item.imagePath }}
        style={styles.bookImage}
        onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
      />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {item.author || 'Unknown Author'}
        </Text>
        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{item.averageRating || '0'}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{FormatMoney(item.price)}</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>đ200.000</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (favoriteBooks.length === 0) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Danh sách sách yêu thích',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 12 }}>
                <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
              </Pressable>
            ),
        }}
      />
        <View style={styles.emptyContainer}>
          <MaterialIcons name="favorite-border" size={64} color={COLORS.gray} />
          <Text style={styles.emptyText}>Bạn chưa có sách yêu thích nào</Text>
        </View>
        
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Danh sách sách yêu thích',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 12 }}>
                <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
              </Pressable>
            ),
        }}
      />
      <View style={styles.content}>
        <VerticalBookList books={favoriteBooks} />
      </View>
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
    // padding: 16,
  },
   backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  maincontainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    // paddingTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  bookImage: {
    width: 100,
    height: 150,
    resizeMode: 'cover',
  },
  bookInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: COLORS.gray,
    textDecorationLine: 'line-through',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingLeft: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },

});

export default Wishlist; 
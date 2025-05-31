import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter,Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import instance from '@/axios-instance';
import { useRatedBooks } from '@/context/RateBookContext';
import { Pressable } from 'react-native';


const UnrateBook = () => {
  const { orderId } = useLocalSearchParams();
  const [booksInOrder, setBooksInOrder] = useState([]);
  const {ratedBooks, addRatedBook, isBookRated} = useRatedBooks();
  const router = useRouter();

  useEffect(() => {
  const fetchOrder = async () => {
    try {
      const response = await instance.get(`/api/order/getOrderByOrderId/${orderId}`);
      const orderData = response.data.data;

      const items = orderData.orderItem
        .filter(item => !isBookRated(item.book.title))
        .map(item => ({
          bookId: item.book.id,
          title: item.book.title,
          imagePath: item.book.imagePath,
          orderId: orderData.orderId,
        }));
        console.log(items);

      setBooksInOrder(items);
    } catch (error) {
      console.error('Lỗi khi lấy order:', error);
    }
  };

  if (orderId && ratedBooks.length >= 0) {
    fetchOrder();
  }
}, [orderId, ratedBooks]); 


  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: `/rating/${item.bookId}`,
          params: {
            bookId: item.bookId,
          },
        })
      }
    >
      <Image source={{ uri: item.imagePath }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.action}>→ Đánh giá ngay</Text>
      </View>
    </TouchableOpacity>
  );

  if (booksInOrder.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
          <Stack.Screen
          options={{
            title: 'Đánh giá sách',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 12 }}>
                <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
              </Pressable>
            ),
        }}
      />
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Bạn đã đánh giá tất cả các sách của đơn hàng.</Text>
          </View>
      </View>

      
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white}}>
      <Stack.Screen
          options={{
            title: 'Đánh giá sách',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 12 }}>
                <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
              </Pressable>
            ),
        }}
      />

      <FlatList
        data={booksInOrder}
        keyExtractor={(item, index) => item.bookId + index}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default UnrateBook;
const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
  },
  image: {
    width: 70,
    height: 100,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  info: {
    marginLeft: 12,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  action: {
    color: '#3498db',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    width: 40,
    alignItems: 'flex-start',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  rightPlaceholder: {
    width: 40, 
  },
});

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import instance from '@/axios-instance';
import FormatMoney from '@/components/FormatMoney';
import { router } from 'expo-router';

const DashboardScreen = () => {
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [numberOfOrders, setNumberOfOrders] = useState(0);
  const [numberOfBooks, setNumberOfBooks] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [bestSellers, setBestSellers] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);

  const fetchRecentOrders = async () => {
    try {
      const response = await instance.get('/api/order/getAllOrders');
      const sortedOrders = response.data.data.sort(
        (a, b) => new Date(b.createAt) - new Date(a.createAt)
      );
      setRecentOrders(sortedOrders.slice(0, 5));
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseUsers = await instance.get('/api/user/getNumberOfUsers');
        const responseOrders = await instance.get('/api/order/getNumberOfOrders');
        const responseBooks = await instance.get('/api/book/getNumberOfBooks');
        const responseRevenue = await instance.get('/api/payment/calculateRevenue');
        const responseBestSeller = await instance.get('/api/book/upSaleBook');

        setRevenue(responseRevenue.data);
        setNumberOfBooks(responseBooks.data);
        setNumberOfOrders(responseOrders.data);
        setNumberOfUsers(responseUsers.data);
        setBestSellers(responseBestSeller.data.content);

        fetchRecentOrders();
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dashboard Admin</Text>

      <View style={styles.cardContainer}>
        <Card icon={<Ionicons name="book" size={32} color="#fff" />} title="Sách" value={numberOfBooks} bg="#4CAF50" />
        <Card icon={<FontAwesome5 name="shopping-cart" size={28} color="#fff" />} title="Đơn hàng" value={numberOfOrders} bg="#2196F3" />
        <Card icon={<MaterialIcons name="attach-money" size={32} color="#fff" />} title="Doanh thu" value={FormatMoney(revenue)} bg="#FF9800" />
        <Card icon={<Ionicons name="people" size={32} color="#fff" />} title="Người dùng" value={numberOfUsers} bg="#9C27B0" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Các sách bán chạy gần đây:</Text>
        {(showAll ? bestSellers : bestSellers.slice(0, 5)).map((book, index) => (
          <TouchableOpacity key={index} style={styles.orderItem} onPress={() => router.push(`/book/${book.id}`)}>
            <Image
              source={{ uri: book.imagePath }}
              style={{ width: 50, height: 50, borderRadius: 8, marginRight: 10 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{book.title}</Text>
              <Text style={styles.author}>{book.author}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
              <Text style={styles.price}>₫{book.price.toLocaleString('vi-VN')}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {bestSellers.length > 5 && (
          <TouchableOpacity onPress={() => setShowAll(!showAll)} style={{ marginTop: 10 }}>
            <Text style={{ color: '#1E90FF', textAlign: 'center' }}>
              {showAll ? 'Thu gọn' : 'Xem thêm'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Đơn hàng gần đây</Text>
        {recentOrders.map((order) => (
          <TouchableOpacity key={order.orderId} style={styles.orderCard}
            onPress={() =>
              router.push({
                pathname: '/order/ManageOrder',
                params: { order: JSON.stringify(order) },
              })
        }
          >
            <Text style={styles.cardTitle}>Đơn hàng #{order.orderId}</Text>
            <Text style={styles.cardText}>Người nhận: {order.userAddress.receiverName}</Text>
            <Text style={styles.cardText}>
              Tổng tiền: <Text style={styles.cardPrice}>₫{order.payment.amount.toLocaleString('vi-VN')}</Text>
            </Text>
            <Text style={styles.cardText}>
              Ngày đặt: {new Date(order.createAt).toLocaleDateString('vi-VN')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const Card = ({ icon, title, value, bg }) => (
  <View style={[styles.card, { backgroundColor: bg }]}>
    {icon}
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5', marginTop: 10 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  cardContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 5,
  },
  cardTitle: { fontSize: 16, marginTop: 8, fontWeight: 'bold', color: 'black' },
  cardValue: { fontSize: 20, fontWeight: 'bold', color: '#fff' },

  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  orderItem: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  author: {
    fontSize: 14,
    color: '#555',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  orderCard: {
    backgroundColor: '#fdfdfd',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  cardPrice: {
    color: 'green',
    fontWeight: 'bold',
  },
});

export default DashboardScreen;

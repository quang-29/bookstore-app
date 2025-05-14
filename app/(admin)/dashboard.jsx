import { React, useEffect, useState } from 'react';
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


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get('/api/user/getNumberOfUsers');
        const responseOrders = await instance.get('/api/order/getNumberOfOrders');
        const responseBooks = await instance.get('/api/book/getNumberOfBooks');
        const responseRevenue = await instance.get('/api/payment/calculateRevenue');
        const responseBestSeller = await instance.get('/api/book/upSaleBook');
        setRevenue(responseRevenue.data);
        setNumberOfBooks(responseBooks.data);
        setNumberOfOrders(responseOrders.data);
        setNumberOfUsers(response.data);
        setBestSellers(responseBestSeller.data.content);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dashboard Admin</Text>

      {/* Card Section */}
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
            <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
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
        <View style={styles.orderItem}>
          <Text>Đơn hàng #1001 - Nguyễn Văn A</Text>
          <Text style={styles.price}>₫150.000</Text>
        </View>
        <View style={styles.orderItem}>
          <Text>Đơn hàng #1002 - Trần Thị B</Text>
          <Text style={styles.price}>₫300.000</Text>
        </View>
        {/* Add more order items here */}
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
  cardTitle: { color: '#fff', marginTop: 8, fontSize: 16 },
  cardValue: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  orderItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  price: { fontWeight: 'bold', color: '#333' },
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

});

export default DashboardScreen;

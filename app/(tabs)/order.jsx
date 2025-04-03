import { View, Text, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import { COLORS, SIZES } from '../../constants/theme';

const orders = [
  {
    id: 1,
    orderNumber: 'ORD123456',
    date: '2025-03-01',
    items: [
      { title: 'Mộ đom đóm', quantity: 1, price: 150000 },
      { title: 'Tôi thấy hoa vàng trên cỏ xanh', quantity: 2, price: 200000 },
    ],
    total: 550000,
  },
  {
    id: 2,
    orderNumber: 'ORD123457',
    date: '2025-02-28',
    items: [
      { title: 'Lão Hạc', quantity: 1, price: 150000 },
    ],
    total: 150000,
  },
  // Add more orders as needed
];

const Order = () => {
  const renderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderNumber}>Order Number: {item.orderNumber}</Text>
      <Text style={styles.orderDate}>Date: {item.date}</Text>
      <View style={styles.orderItems}>
        {item.items.map((orderItem, index) => (
          <View key={index} style={styles.orderItemDetail}>
            <Text style={styles.orderItemTitle}>{orderItem.title}</Text>
            <Text style={styles.orderItemQuantity}>Quantity: {orderItem.quantity}</Text>
            <Text style={styles.orderItemPrice}>{orderItem.price} VND</Text>
          </View>
        ))}
      </View>
      <Text style={styles.orderTotal}>Total: {item.total} VND</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.orderList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    padding: 10,
  },
  orderList: {
    paddingBottom: 20,
  },
  orderItem: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  orderNumber: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  orderDate: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 10,
  },
  orderItems: {
    marginBottom: 10,
  },
  orderItemDetail: {
    marginBottom: 5,
  },
  orderItemTitle: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
  },
  orderItemQuantity: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  orderItemPrice: {
    fontSize: SIZES.small,
    color: COLORS.primary,
  },
  orderTotal: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.dark,
    textAlign: 'right',
  },
});

export default Order;
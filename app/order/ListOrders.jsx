import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, SIZES } from '../../constants/theme';
import { AntDesign } from '@expo/vector-icons';
import FormatMoney from '@/components/FormatMoney';
import { useRouter } from 'expo-router';
import { useOrder } from '@/context/OrderContext'; 
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

const ListOrders = () => {
  const { orders, fetchOrder } = useOrder(); 
  const [expandedOrders, setExpandedOrders] = useState({});
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchOrder();
    }, [])
  );

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedOrders[item.orderId];
    const displayedItems = isExpanded ? item.orderItem : item.orderItem.slice(0, 1);

    return (
      <TouchableOpacity
        onPress={() =>
          router.push({ pathname: '/order/OrderDetail', params: { order: JSON.stringify(item) } })
        }
        style={styles.orderItem}
      >
        <View style={styles.orderHeaderRow}>
          <Text style={styles.orderDate}>Date: {new Date(item.createAt).toLocaleDateString()}</Text>
          <Text style={styles.orderStatus}>Tình trạng: {item.payment.status}</Text>
        </View>

        <View style={styles.orderItems}>
          {displayedItems.map((orderItem, index) => (
            <View key={index} style={styles.orderItemDetail}>
              <View style={styles.productRow}>
                <Image
                  source={{ uri: orderItem.book.imagePath }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <View style={styles.productInfo}>
                  <Text style={styles.orderItemTitle}>{orderItem.book.title}</Text>
                  <Text style={styles.orderItemQuantity}>Quantity: {orderItem.quantity}</Text>
                  <Text style={styles.orderItemPrice}>{FormatMoney(orderItem.productPrice)}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {item.orderItem.length > 1 && (
          <TouchableOpacity onPress={() => toggleExpand(item.orderId)} style={styles.viewMoreBtn}>
            <Text style={styles.viewMoreText}>{isExpanded ? 'Thu gọn' : 'Xem thêm'} </Text>
            <AntDesign name={isExpanded ? 'up' : 'down'} size={14} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        <Text style={styles.orderTotal}>Thành tiền: {FormatMoney(item.payment.amount)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={[...orders].sort((a, b) => new Date(b.createAt) - new Date(a.createAt))}
        renderItem={renderItem}
        keyExtractor={(item) => item.orderId.toString()}
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
  productRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  productImage: {
    width: 60,
    height: 90,
    borderRadius: 6,
    backgroundColor: COLORS.lightGray,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  orderItemTitle: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
  },
  orderItemQuantity: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: 2,
  },
  orderItemPrice: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    marginTop: 2,
  },
  viewMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  viewMoreText: {
    fontSize: 14,
    color: COLORS.primary,
    marginRight: 5,
  },
  orderTotal: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.dark,
    textAlign: 'right',
  },
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderStatus: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    fontWeight: '500',
  },
});

export default ListOrders;

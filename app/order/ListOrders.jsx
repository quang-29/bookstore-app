import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { COLORS, SIZES } from '../../constants/theme';
import { AntDesign } from '@expo/vector-icons';
import FormatMoney from '@/components/FormatMoney';
import { useRouter, useFocusEffect } from 'expo-router';
import { useOrder } from '@/context/OrderContext';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import {Stack} from 'expo-router';

const ListOrders = () => {
  const { orders, fetchOrder } = useOrder();
  const [expandedOrders, setExpandedOrders] = useState({});
  const router = useRouter();

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchOrder();
  //   }, [fetchOrder])
  // );

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
    const displayedItems = isExpanded
      ? item.orderItem
      : item.orderItem.slice(0, 1);

    return (
      
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: '/order/OrderDetail',
            params: { order: JSON.stringify(item) },
          })
        }
        style={styles.orderItem}
      >
        <View style={styles.orderHeaderRow}>
          <Text style={styles.orderDate}>
            🗓 {new Date(item.createAt).toLocaleDateString()}
          </Text>
          <Text
            style={[
              styles.orderStatus,
              item.payment.status === 'PAID' ? styles.paid : styles.unpaid,
            ]}
          >
            {item.payment.status}
          </Text>
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
                  <Text style={styles.orderItemTitle} numberOfLines={2}>
                    {orderItem.book.title}
                  </Text>
                  <Text style={styles.orderItemQuantity}>
                    Số lượng: {orderItem.quantity}
                  </Text>
                  <Text style={styles.orderItemPrice}>
                    Đơn giá: {FormatMoney(orderItem.productPrice)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {item.orderItem.length > 1 && (
          <TouchableOpacity
            onPress={() => toggleExpand(item.orderId)}
            style={styles.viewMoreBtn}
          >
            <Text style={styles.viewMoreText}>
              {isExpanded
                ? 'Thu gọn'
                : `Xem thêm (${item.orderItem.length - 1})`}
            </Text>
            <AntDesign
              name={isExpanded ? 'up' : 'down'}
              size={14}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        )}

        <View style={styles.totalContainer}>
          <Text style={styles.orderTotalLabel}>Thành tiền:</Text>
          <Text style={styles.orderTotal}>
            {FormatMoney(item.payment.amount)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
          options={{
            title: 'Danh sách đơn hàng',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 12 }}>
                <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
              </Pressable>
            ),
        }}
        />

     
      <FlatList
        data={[...orders].sort(
          (a, b) => new Date(b.createAt) - new Date(a.createAt)
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item.orderId.toString()}
        contentContainerStyle={styles.orderList}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Bạn chưa mua đơn hàng nào.</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF3E0',
    paddingLeft: 10,
    paddingRight: 10,
    position: 'relative',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
 textHeader: {
  fontSize: SIZES.large,
  color: COLORS.primary,
  position: 'absolute',
  top: 50,                 
  left: '50%',           
  transform: [{ translateX: -80 }], 
  textAlign: 'center',
  fontWeight: '600',
},

  backText: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
    marginLeft: 6,
    fontWeight: '500',
  },
  orderList: {
    paddingBottom: 20,
  },
  orderItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderDate: {
    fontSize: SIZES.small,
    color: '#5d6d7e',
  },
  orderStatus: {
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  paid: {
    color: '#2ecc71',
  },
  unpaid: {
    color: '#e74c3c',
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
    borderRadius: 8,
    backgroundColor: '#FCE4EC',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  orderItemTitle: {
    fontSize: SIZES.medium,
    color: '#2c3e50',
    fontWeight: '500',
  },
  orderItemQuantity: {
    fontSize: SIZES.small,
    color: '#7f8c8d',
    marginTop: 2,
  },
  orderItemPrice: {
    fontSize: SIZES.small,
    color: '#f39c12',
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
    color: '#3498db',
    marginRight: 5,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 10,
    marginTop: 10,
  },
  orderTotalLabel: {
    fontSize: SIZES.medium,
    color: '#7f8c8d',
  },
  orderTotal: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: '#e67e22',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyText: {
    fontSize: SIZES.medium,
    color: '#95a5a6',
    textAlign: 'center',
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

export default ListOrders;

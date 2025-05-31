import {React, useState} from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams,Stack } from 'expo-router';
import FormatMoney from '@/components/FormatMoney';
import { COLORS, SIZES } from '@/constants/theme';
import instance from '@/axios-instance';
import { Alert } from 'react-native';
import Loader from '@/components/Loader';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ListOrders from './ListOrders';


const OrderDetail = () => {
  const { order } = useLocalSearchParams();
  const orderData = JSON.parse(order);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const shippingFee = 20000;
  const totalAmount = orderData.payment.amount + shippingFee;

  const formatToVietnamTime = (rawDate) => {
    const date = new Date(rawDate);
    return date.toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  const handleCancelOrder = () => {
  Alert.alert(
    'Xác nhận',
    'Bạn có chắc muốn huỷ đơn hàng không?',
    [
      {
        text: 'Không',
        style: 'cancel',
      },
      {
        text: 'Có',
        onPress: async () => {
          setIsLoading(true);
          try {
            const response = await instance.post(`/api/order/cancelOrder?orderId=${orderData.orderId}`);
            if (response.status === 200) {
              Alert.alert('Huỷ đơn hàng', 'Đơn hàng đã được huỷ thành công.');
              router.replace('/order/ListOrders');
            } else {
              Alert.alert('Lỗi', 'Không thể huỷ đơn hàng. Vui lòng thử lại.');
            }
          } catch (error) {
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi huỷ đơn hàng.');
          } finally {
            setIsLoading(false);
          }
        },
      },
    ],
    { cancelable: true }
  );
};
    const handleRatingBook = (orderData) => {
      router.push({
        pathname: '/rating/UnrateBook',
        params: {
          orderId: orderData.orderId,
        },
      });
    };



  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
          options={{
            title: 'Chi tiết đơn hàng',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 12 }}>
                <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
              </Pressable>
            ),
        }}
      />
      <ScrollView style={styles.container}>
        {/* Ngày giao hàng */}
        <View style={styles.orderInfo}>
          <Text style={styles.sectionTitle}>Ngày đảm bảo nhận hàng</Text>
          <Text style={styles.infoText}>Đơn hàng sẽ được giao trễ nhất vào <Text style={styles.bold}>{orderData.estimatedDeliveryDate ? formatToVietnamTime(orderData.estimatedDeliveryDate) : null}</Text></Text>
        </View>

        {/* Vận chuyển */}
        <View style={styles.orderInfo}>
          <Text style={styles.sectionTitle}>Thông tin vận chuyển</Text>
          <Text style={styles.infoText}>Giao hàng nhanh - Express Delivery</Text>
          <Text style={styles.status}>
            {(() => {
              const status = orderData.payment.status;
              if (status === 'PENDING') {
                return 'Đơn hàng đang được xử lý';
              } else if (status === 'COMPLETED' || status === 'COD') {
                return 'Đơn hàng đang được xác nhận';
              } else if (status === 'CONFIRMED') {
                return 'Đơn hàng đã được xác nhận';
              } else if (status === 'IN_TRANSIT') {
                return 'Đơn hàng đang được giao';
              } else if (status === 'DELIVERED') {
                return 'Đơn hàng đã được giao';
              } else if (status === 'CANCELLED') {
                return 'Đơn hàng đã bị huỷ';
              } else {
                return 'Trạng thái không xác định';
              }
            })()}
          </Text>
        </View>

        {/* Địa chỉ nhận hàng */}
        <View style={styles.orderInfo}>
          <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
          <Text style={styles.bold}>{orderData.userAddress.receiverName + ' (' + orderData.userAddress.phoneNumber + ')'}</Text>
          <Text style={styles.infoText}>
            {orderData.userAddress.detail + ', ' +
              orderData.userAddress.ward.name + ', ' +
              orderData.userAddress.district.name + ', ' +
              orderData.userAddress.province.name}
          </Text>
        </View>


        {/* Danh sách sản phẩm */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Sản phẩm trong đơn hàng</Text>
          {orderData.orderItem.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Image source={{ uri: item.book.imagePath }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{item.book.title}</Text>
                <Text style={styles.itemQuantity}>Số lượng: {item.quantity}</Text>
                <Text style={styles.itemPrice}>Giá: {FormatMoney(item.productPrice)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Tổng kết thanh toán */}
        <View style={styles.orderInfo}>
          <Text style={styles.sectionTitle}>Thanh toán</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.totalLabel}>Tạm tính:</Text>
            <Text style={styles.totalValue}>{FormatMoney(orderData.payment.amount - orderData.payment.feeShip)}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.totalLabel}>Phí vận chuyển:</Text>
            <Text style={styles.totalValue}>{FormatMoney(orderData.payment.feeShip)}</Text>
          </View>
          <View style={[styles.paymentRow, { marginTop: 8 }]}>
            <Text style={styles.totalLabel}>Thành tiền:</Text>
            <Text style={styles.totalValue}>{FormatMoney(orderData.payment.amount)}</Text>
          </View>
        </View>

        {/* Thông tin đơn hàng */}
        <View style={styles.orderInfo}>
          <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>
          <Text style={styles.infoText}>Mã đơn hàng: <Text style={styles.bold}>{orderData.orderId}</Text></Text>
          <Text style={styles.infoText}>
            Phương thức thanh toán: <Text style={styles.bold}>
              {orderData.payment.status === 'COD' ? 'Thanh toán khi nhận hàng' : 'Thanh toán bằng VNPay'}
            </Text>
          </Text>
          <Text style={styles.infoText} >Thời gian đặt hàng: <Text style={styles.bold} >{formatToVietnamTime(orderData.createAt)}</Text></Text>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

     
      <View style={styles.footer}>
        {(orderData.payment.status === 'PENDING' || orderData.payment.status === 'COD') && (
          <TouchableOpacity
            style={[styles.actionButton, styles.contactButton]}
            onPress={handleCancelOrder}
          >
            <Text style={styles.actionText}>Huỷ đơn hàng</Text>
          </TouchableOpacity>
        )}

        {orderData.payment.status === 'DELIVERED' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.contactButton]}
              onPress={() => handleRatingBook(orderData)}
            >
              <Text style={styles.actionText}>Đánh giá sản phẩm</Text>
            </TouchableOpacity>
          )}



        <TouchableOpacity style={[styles.actionButton, styles.contactButton]} onPress={() => router.replace('/(tabs)/chat')}>
          <Text style={styles.actionText}>Liên hệ shop</Text>
        </TouchableOpacity>
      </View>
      <Loader isLoading={isLoading} message="Đang xử lí..." />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    padding: 16,
    marginBottom: 80, // Để tránh bị che bởi footer
  },
  heading: {
    fontSize: SIZES.xLarge,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.primary,
    marginBottom: 20,
  },
  orderInfo: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.dark,
  },
  infoText: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 6,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '600',
    color: COLORS.dark,
  },
  status: {
    fontWeight: 'bold',
    color: COLORS.success,
    marginTop: 6,
    fontSize: SIZES.small,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 110,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray2,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 6,
  },
  itemQuantity: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    fontWeight: '500',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: SIZES.medium,
    fontWeight: '500',
    color: COLORS.dark,
  },
  totalValue: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray2,
    paddingBottom: 24, // Thêm padding cho an toàn trên các thiết bị có notch
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: COLORS.secondary,
  },
  contactButton: {
    backgroundColor: COLORS.primary,
  },
  actionText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: '600',
  },
});

export default OrderDetail;
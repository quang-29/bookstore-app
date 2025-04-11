import React, { useState } from 'react';
import { View, ScrollView, Text, Image, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from '../../context/CartContext';
import FormatMoney from '../../components/FormatMoney';
import { COLORS, SIZES } from '../../constants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import colors from '@/constants/colors';

const checkOut = () => {
  const { cartItems, updateCartItems } = useCart();
  const [isInsuranceChecked, setInsuranceChecked] = useState(false);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState({
    id: 'express',
    title: 'Hỏa Tốc',
    description: 'Đảm bảo nhận hàng vào ngày mai',
    voucher: 'Voucher trị giá ₫15.000 nếu đơn hàng được giao đến bạn sau ngày 2 Tháng 4 2025'
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({
    id: 'cash',
    title: 'Thanh toán tiền mặt',
    description: 'Thanh toán khi nhận hàng'
  });

  const handleSwitchChange = () => {
    setInsuranceChecked(previousState => !previousState);
  };

  const handleShippingMethodSelect = (method) => {
    setSelectedShippingMethod(method);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Delivery Address Section */}
        <TouchableOpacity style={styles.sectionContainer} onPress={() => router.push('/checkout/address')}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.header}>Đan Linh (+84) 332 137 474</Text>
            <Text style={styles.address}>Số 35, Ngõ 95 Thúy Linh, Phường Linh Nam, Quận Hoàng Mai, Hà Nội</Text>
          </View>
        </TouchableOpacity>

        {/* Products Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cart-outline" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Sản phẩm</Text>
          </View>
          <View style={styles.productSection}>
            {cartItems.map((item) => (
              <View key={item.cartItemId} style={styles.cartItem}>
                <Image source={{ uri: item.book.imagePath }} style={styles.cartItemImage} />
                <View style={styles.cartItemDetails}>
                  <Text style={styles.cartItemTitle} numberOfLines={2}>{item.book.title}</Text>
                  <Text style={styles.authorText}>{item.book.author}</Text>
                  <View style={styles.additionalInfor}>
                    <Text style={styles.cartItemPrice}>{FormatMoney(item.book.price)}</Text>
                    <Text style={styles.quantityText}>x {item.quantity || 0}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Insurance Section */}
        {/* <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark-outline" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Bảo hiểm</Text>
          </View>
          <View style={styles.insuranceSection}>
            <Switch
              value={isInsuranceChecked}
              onValueChange={handleSwitchChange}
              trackColor={{ false: COLORS.gray, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
            <Text style={styles.insuranceText}>Bảo hiểm bảo vệ người tiêu dùng ₫2.999</Text>
          </View>
        </View> */}

        {/* Shipping Method Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="car-outline" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Phương thức vận chuyển</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/checkout/transportation')}>
            <View style={styles.transportationSection}>
              <View>
                <Text style={styles.transportationTitle}>{selectedShippingMethod.title}</Text>
                <Text style={styles.transportationSubtitle}>{selectedShippingMethod.description}</Text>
                {selectedShippingMethod.voucher && (
                  <Text style={styles.voucherText}>{selectedShippingMethod.voucher}</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Payment Method Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card-outline" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/checkout/payment')}>
            <View style={styles.paymentSection}>
              <View>
                <Text style={styles.paymentTitle}>{selectedPaymentMethod.title}</Text>
                <Text style={styles.paymentSubtitle}>{selectedPaymentMethod.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Summary Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="receipt-outline" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Tổng đơn hàng</Text>
          </View>
          <View style={styles.summarySection}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tạm tính</Text>
              <Text style={styles.summaryValue}>₫294.500</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
              <Text style={styles.summaryValue}>₫0</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Bảo hiểm</Text>
              <Text style={styles.summaryValue}>{isInsuranceChecked ? '₫2.999' : '₫0'}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.totalValue}>₫297.499</Text>
            </View>
            <Text style={styles.savingsText}>Tiết kiệm: ₫49.600</Text>
          </View>
        </View>
      </ScrollView>

      {/* Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.orderButton} 
          onPress={() => {
            if (selectedPaymentMethod.id === 'vnpay') {
              // Handle VNPAY payment
              alert('Chuyển hướng đến trang thanh toán VNPAY');
            } else {
              // Handle cash payment
              alert('Đơn hàng đã được đặt thành công!');
            }
          }}
        >
          <Text style={styles.orderButtonText}>Đặt hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  scrollView: {
    flex: 1,
  },
  sectionContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    margin: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginLeft: 10,
  },
  infoSection: {
    padding: 10,
    backgroundColor: COLORS.offWhite,
    borderRadius: 10,
  },
  header: {
    fontWeight: '600',
    fontSize: SIZES.small,
    marginBottom: 5,
  },
  address: {
    fontSize: SIZES.xSmall,
    color: COLORS.gray,
  },
  productSection: {
    marginTop: 10,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.offWhite,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  cartItemImage: {
    width: 90,
    height: 100,
    borderRadius: 6,
    backgroundColor: COLORS.lightGray,
  },
  cartItemDetails: {
    marginLeft: 12,
    flex: 1,
    justifyContent: 'center',
  },
  cartItemTitle: {
    fontSize: SIZES.small,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 4,
  },
  authorText: {
    fontSize: SIZES.xSmall,
    color: COLORS.gray,
    marginBottom: 4,
  },
  additionalInfor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartItemPrice: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: SIZES.small,
    color: COLORS.dark,
  },
  insuranceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
    padding: 10,
    borderRadius: 10,
  },
  insuranceText: {
    marginLeft: 10,
    fontSize: SIZES.small,
    color: COLORS.dark,
  },
  transportationSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
    padding: 15,
    borderRadius: 10,
  },
  transportationTitle: {
    fontSize: SIZES.small,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  transportationSubtitle: {
    fontSize: SIZES.xSmall,
    color: COLORS.gray,
    marginTop: 4,
  },
  paymentSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
    padding: 15,
    borderRadius: 10,
  },
  paymentTitle: {
    fontSize: SIZES.small,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  paymentSubtitle: {
    fontSize: SIZES.xSmall,
    color: COLORS.gray,
    marginTop: 4,
  },
  summarySection: {
    backgroundColor: COLORS.offWhite,
    padding: 15,
    borderRadius: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  summaryValue: {
    fontSize: SIZES.small,
    color: COLORS.dark,
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  totalLabel: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  totalValue: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  savingsText: {
    fontSize: SIZES.xSmall,
    color: COLORS.success,
    marginTop: 5,
  },
  footer: {
    padding: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: "#fff",
  },
  orderButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  orderButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  voucherText: {
    fontSize: SIZES.xSmall,
    color: COLORS.success,
    marginTop: 4,
  },
});

export default checkOut;

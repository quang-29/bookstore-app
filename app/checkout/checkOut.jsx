import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useCart } from '../../context/CartContext';
import FormatMoney from '../../components/FormatMoney';
import { COLORS, SIZES } from '../../constants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAddress } from '../../context/AddressContext';
import { useAuth } from '@/context/AuthContext';
import { IP_CONFIG } from '@/config/ipconfig';
import axios from 'axios';
import { usePayment } from '../../context/PaymentContext'; 

const CheckOut = () => {
  const { cartItems, updateCartItems } = useCart();
  const { defaultAddress, setDefaultAddress } = useAddress();
  const { user, setUser, token, setToken } = useAuth();
  const [shippingFee, setShippingFee] = useState('');
  const [deliveryDateFormatted, setDeliveryDateFormatted] = useState('');
  const { selectedPaymentMethod,handlePaymentByCash, handlePaymentByVNPAY } = usePayment();

    let selectAddress = defaultAddress?.detail + ', ' + defaultAddress?.ward?.name + ', ' + defaultAddress?.district?.name + ', ' + defaultAddress?.province?.name;
  let selectInfo = defaultAddress?.receiverName + ' (' + defaultAddress?.phoneNumber + ')';

  const method = selectedPaymentMethod;

  const [selectedShippingMethod, setSelectedShippingMethod] = useState({
    id: 'express',
    title: 'Giao hàng nhanh',
    fee: 'đ50.000',
    deliveryDate: 'ngày 2 tháng 4 2025',
    description: 'Đảm bảo nhận hàng vào ngày mai',
    voucher: 'Voucher trị giá ₫15.000 nếu đơn hàng được giao đến bạn sau ngày 2 Tháng 4 2025',
  });

  const handleShippingMethodSelect = (method) => {
    setSelectedShippingMethod(method);
  };

  const getTotalBookPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.selected ? item.bookPrice * item.quantity : 0);
    }, 0);
  };

  const getShippingFee = () => {
    const feeStr = selectedShippingMethod.fee?.replace(/[^\d]/g, '');
    return feeStr ? parseInt(feeStr) : 0;
  };

  const totalPrice = getTotalBookPrice() + getShippingFee();



  useEffect(() => {
    if (!defaultAddress) return;

    const fetchBasicShipmentInfor = async () => {
      try {
        const response = await axios.post(
          `http://${IP_CONFIG}:8080/api/address/getBasicShipmentInfo`,
          defaultAddress,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        const data = response.data;
        const fee = data.data.fee;
        const feeFormattedFee = 'đ' + parseInt(fee).toLocaleString('vi-VN');
        const deliveryDate = data.data.expectedDeliveryDate;
        const date = new Date(deliveryDate);
        const formatteddeliveryDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        setShippingFee(feeFormattedFee);
        setDeliveryDateFormatted(formatteddeliveryDate);
        setSelectedShippingMethod({
          id: 'express',
          title: 'Giao hàng nhanh',
          fee: feeFormattedFee,
          deliveryDate: deliveryDate,
          description: 'Đảm bảo nhận hàng trước ' + formatteddeliveryDate,
          voucher: 'Voucher trị giá ₫15.000 nếu đơn hàng được giao đến bạn sau ' + formatteddeliveryDate,
        });
      } catch (error) {
        console.error('Error fetching shipment info:', error);
        Alert.alert('Lỗi', 'Không thể lấy thông tin vận chuyển');
      }
    };

    fetchBasicShipmentInfor();
  }, [defaultAddress]);

  return (
    <View style={styles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <TouchableOpacity style={styles.sectionContainer} onPress={() => router.push('/checkout/ListAddress')}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
          </View>

          {defaultAddress == null ? (
            <View style={styles.infoSection}>
              <Text style={styles.header}>Bạn chưa thiết lập địa chỉ giao hàng! Vui lòng thêm địa chỉ giao hàng. </Text>
            </View>
          ) : (
            <View style={styles.infoSection}>
              <Text style={styles.header}>{selectInfo}</Text>
              <Text style={styles.address}>{selectAddress}</Text>
            </View>
          )}
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

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="car-outline" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Phương thức vận chuyển</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (shippingFee && deliveryDateFormatted) {
                router.push({
                  pathname: 'checkout/Transportation',
                  params: {
                    fee: String(shippingFee),
                    deliveryDate: String(deliveryDateFormatted),
                  },
                });
              } else {
                Alert.alert('Lỗi', 'Thông tin vận chuyển chưa sẵn sàng');
              }
            }}
          >
            <View style={styles.transportationSection}>
              <View>
                <Text style={styles.transportationTitle}>{selectedShippingMethod.title}</Text>
                <Text style={styles.transportationSubtitle}>{selectedShippingMethod.description}</Text>
                <Text style={styles.transportationFee}>{selectedShippingMethod.fee}</Text>
                {selectedShippingMethod.voucher && <Text style={styles.voucherText}>{selectedShippingMethod.voucher}</Text>}
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
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/checkout/Payment',
              })
            }
          >
            <View style={styles.paymentSection}>
              <View>
                <Text style={styles.paymentTitle}>{method.title}</Text>
                <Text style={styles.paymentSubtitle}>{method.description}</Text>
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
              <Text style={styles.summaryValue}>{FormatMoney(getTotalBookPrice())}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
              <Text style={styles.summaryValue}>{selectedShippingMethod.fee}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.totalValue}>{FormatMoney(totalPrice)}</Text>
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
            router.push({
              pathname: '/checkout/Loading',
              params: {
                cartId: user.cart.cartId,
                addressId: defaultAddress.id,
                paymentMethod: selectedPaymentMethod.id,
              },
            });
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
    borderTopColor: '#fff',
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
  transportationFee: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: SIZES.xSmall,
    color: COLORS.success,
  },
});

export default CheckOut;
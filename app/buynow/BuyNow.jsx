import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, Text, Image, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import FormatMoney from '../../components/FormatMoney';
import { COLORS, SIZES } from '../../constants';
import { Ionicons } from '@expo/vector-icons';
import { useAddress } from '../../context/AddressContext';
import { useAuth } from '@/context/AuthContext';
import { IP_CONFIG } from '@/config/ipconfig';
import axios from 'axios';
import { usePayment } from '../../context/PaymentContext';
import Loader from '../../components/Loader';
import { Pressable } from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import instance from '@/axios-instance';

const BuyNow = () => {
  const { defaultAddress } = useAddress();
  const { user, token } = useAuth();
  const { selectedPaymentMethod,buySingleBookHandlePaymentByVNpay, buySingleBookHandlePaymentByCash } = usePayment();
  const [shippingFee, setShippingFee] = useState('');
  const [deliveryDateFormatted, setDeliveryDateFormatted] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const method = selectedPaymentMethod;
  const { id } = useLocalSearchParams();
  const [bookBuy, setBookBuy] = useState(null);



  const [selectedShippingMethod, setSelectedShippingMethod] = useState({
    id: 'express',
    title: 'Giao hàng nhanh',
    fee: 'đ50.000',
    deliveryDate: 'ngày 2 tháng 4 2025',
    description: 'Đảm bảo nhận hàng vào ngày mai',
    voucher: 'Voucher trị giá ₫15.000 nếu đơn hàng được giao đến bạn sau ngày 2 Tháng 4 2025',
  });

  const selectAddress = defaultAddress
    ? `${defaultAddress.detail}, ${defaultAddress.ward?.name}, ${defaultAddress.district?.name}, ${defaultAddress.province?.name}`
    : '';
  const selectInfo = defaultAddress
    ? `${defaultAddress.receiverName} (${defaultAddress.phoneNumber})`
    : '';

//   const getTotalBookPrice = () => {
//     return bookBuy.price;
//   };

  const getShippingFee = () => {
    const feeStr = selectedShippingMethod.fee?.replace(/[^\d]/g, '');
    return feeStr ? parseInt(feeStr) : 0;
  };

  const totalPrice = (bookBuy?.price || 0) + getShippingFee();

  useEffect(() => {

    const getBookById = async () => {
        try {
            const res = await instance.get(`/api/book/${id}`);
            console.log(res.data.data); // Kiểm tra lại structure
            setBookBuy(res.data.data);
        } catch (error) {
            console.error('Error fetching book:', error);
            Alert.alert('Lỗi', 'Không thể lấy thông tin sách');
        }
    };

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
        const fee = data?.data?.fee;
        const feeNumber = parseInt(fee);
        const feeFormattedFee = isNaN(feeNumber)
            ? 'đ0'
            : 'đ' + feeNumber.toLocaleString('vi-VN');


        const deliveryDateRaw = data.data.expectedDeliveryDate;
        const formattedDeliveryDate = new Date(deliveryDateRaw).toLocaleDateString('vi-VN', {
          timeZone: 'Asia/Ho_Chi_Minh',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        setShippingFee(feeFormattedFee);
        setDeliveryDateFormatted(formattedDeliveryDate);
        setSelectedShippingMethod({
          id: 'express',
          title: 'Giao hàng nhanh',
          fee: feeFormattedFee,
          deliveryDate: deliveryDateRaw,
          description: 'Đảm bảo nhận hàng trước ' + formattedDeliveryDate,
          voucher: 'Voucher trị giá ₫15.000 nếu đơn hàng được giao đến bạn sau ' + formattedDeliveryDate,
        });
      } catch (error) {
        console.error('Error fetching shipment info:', error);
        Alert.alert('Lỗi', 'Không thể lấy thông tin vận chuyển');
      }
    };


    getBookById();
    fetchBasicShipmentInfor();
  }, [defaultAddress]);

  const handleCheckout = async () => {
    if (!defaultAddress || !bookBuy) {
      Alert.alert('Thông báo', 'Thiếu thông tin đơn hàng hoặc địa chỉ!');
      return;
    }
    setIsProcessing(true);
        try {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          if (method.id === 'VNPAY') {
            await buySingleBookHandlePaymentByVNpay(id, defaultAddress.id);
          } else {
            await buySingleBookHandlePaymentByCash(id, defaultAddress.id);
            router.replace('/checkout/Success');
          }
        } catch (error) {
          Alert.alert('Lỗi', 'Có lỗi xảy ra khi đặt hàng.');
        } finally {
          setIsProcessing(false);
        }
  };

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen
        options={{
          title: 'Thanh toán',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 12 }}>
              <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
            </Pressable>
          ),
        }}
      />

      <Loader isLoading={isProcessing} message="Đang xử lý đơn hàng..." />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Address Section */}
        <TouchableOpacity style={styles.sectionContainer} onPress={() => router.push('/checkout/ListAddress')}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
          </View>
          {defaultAddress == null ? (
            <View style={styles.infoSection}>
              <Text style={styles.header}>Bạn chưa thiết lập địa chỉ giao hàng!</Text>
            </View>
          ) : (
            <View style={styles.infoSection}>
              <Text style={styles.header}>{selectInfo}</Text>
              <Text style={styles.address}>{selectAddress}</Text>
            </View>
          )}
        </TouchableOpacity>

        
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cart-outline" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Sản phẩm</Text>
          </View>
          <View style={styles.productSection}>
                {bookBuy && (
                    <View style={styles.cartItem}>
                    <Image source={{ uri: bookBuy.imagePath }} style={styles.cartItemImage} />
                    <View style={styles.cartItemDetails}>
                        <Text style={styles.cartItemTitle} numberOfLines={2}>{bookBuy.title}</Text>
                        <Text style={styles.authorText}>{bookBuy.author}</Text>
                        <View style={styles.additionalInfor}>
                        <Text style={styles.cartItemPrice}>{FormatMoney(bookBuy.price)}</Text>
                        <Text style={styles.quantityText}>x 1</Text>
                        </View>
                    </View>
                    </View>
                )}
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
                          pathname: 'checkout/transportation',
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
                        pathname: '/checkout/payment',
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
              <Text style={styles.summaryValue}>{FormatMoney(bookBuy?.price || 0)}</Text>

            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
              <Text style={styles.summaryValue}>{selectedShippingMethod.fee}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.totalValue}>{FormatMoney(totalPrice)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.orderButton} onPress={handleCheckout}>
        <Text style={styles.orderButtonText}>Đặt hàng</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    position: 'relative',
    marginTop: 20,
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
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  scrollView: {
    flex: 1,
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
    marginBottom: 20,
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
  headerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 10,
  backgroundColor: COLORS.white,
  borderBottomWidth: 1,
  borderBottomColor: COLORS.lightGray,
  marginTop: 50,
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

export default BuyNow;

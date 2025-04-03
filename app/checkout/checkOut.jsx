import React, { useState } from 'react';
import { View, ScrollView, Text, Image, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from '../../context/CartContext';
import FormatMoney from '../../components/FormatMoney';
import { COLORS, SIZES } from '../../constants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const checkOut = () => {
  const { cartItems, updateCartItems } = useCart();
  const [isInsuranceChecked, setInsuranceChecked] = useState(false);

  const handleSwitchChange = () => {
    setInsuranceChecked(previousState => !previousState);
  };

  return (
    
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1, marginLeft: 8, marginRight: 8, borderRadius: 10, marginTop: 10
      }}>

      <View style={styles.container}>
        <View style={styles.infoSection}>
          <Text style={styles.header}>Đan Linh (+84) 332 137 474</Text>
          <Text style={styles.address}>Số 35, Ngõ 95 Thúy Linh, Phường Linh Nam, Quận Hoàng Mai, Hà Nội</Text>
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
                  <Text style={{ fontSize: 16, color: COLORS.black }}>
                    x {item.quantity || 0}
                  </Text>
                </View>
              </View>



            </View>
          ))}
        </View>

        {/* Insurance Section */}
        <View style={styles.insuranceSection}>
          <Switch
            value={isInsuranceChecked}
            onValueChange={handleSwitchChange}
          />
          <Text>Bảo hiểm bảo vệ người tiêu dùng ₫2.999</Text>
        </View>

        <View style={styles.transportion}>
          <Text>Phương thức vận chuyển</Text>
          <Text>Xem tất cả</Text>
        </View>

        {/* Delivery and Voucher Information */}
        <View style={styles.deliverySection}>
          <Text>Phương thức vận chuyển: Hỏa Tốc</Text>
          <Text>Đảm bảo nhận hàng vào ngày mai</Text>
          <Text>Voucher trị giá ₫15.000 nếu đơn hàng được giao đến bạn sau ngày 2 Tháng 4 2025.</Text>
        </View>

        {/* Total and Checkout Button */}
        <View style={styles.totalSection}>
          <Text style={styles.totalText}>Tổng thanh toán: ₫294.500</Text>
          <Text style={styles.savingsText}>Tiết kiệm: ₫49.600</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => alert('Order placed!')}>
          <Text style={styles.buttonText}>Đặt hàng</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  infoSection: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 10,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginBottom: 10
  },
  header: {
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
    marginBottom: 8,
    marginRight: 4,
  },
  address: {
    marginLeft: 8,
    fontSize: 13,
  },
  additionalInfor: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  productSection: {
    marginBottom: 16,

  },
  insuranceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  deliverySection: {
    marginBottom: 16,
  },
  totalSection: {
    marginBottom: 16,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  savingsText: {
    color: 'green',
  },
  button: {
    backgroundColor: '#FF6F00',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    height: 120
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
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 4,
  },
  authorText: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  transportion: {
    height: 100,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: COLORS.offWhite,
    borderRadius: 6,
    paddingTop: 12,
    paddingLeft: 8,
    paddingRight: 8
  }
});

export default checkOut;

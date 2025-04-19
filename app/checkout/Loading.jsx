import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  ImageBackground,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { usePayment } from '../../context/PaymentContext';
import { useCart } from '@/context/CartContext';

const Loading = () => {
  const { cartId, addressId, paymentMethod } = useLocalSearchParams();
  const { handlePaymentByCash, handlePaymentByVNPAY } = usePayment();
  const {refreshCart} = useCart();

  const spinValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const processOrder = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (paymentMethod === 'VNPAY') {
          await handlePaymentByVNPAY(cartId, addressId);
          // alert('Chuyển hướng đến trang thanh toán VNPAY');
        } else {
          await handlePaymentByCash(cartId, addressId);
          refreshCart();
        }
        router.replace('/checkout/Success');
      } catch (err) {
        alert('Đã xảy ra lỗi khi đặt hàng');
        router.back();
      }
    };

    processOrder();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ImageBackground
      source={require('../../assets/images/back1.jpg')} 
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.box}>
        <Animated.Image
          source={require('../../assets/images/empty.png')}
          style={[styles.loadingIcon, { transform: [{ rotate: spin }] }]}
        />
        <Text style={styles.text}>Đang xử lý đơn hàng của bạn...</Text>
      </View>
    </ImageBackground>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  loadingIcon: {
    width: 60,
    height: 60,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});

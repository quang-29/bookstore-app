import React, { createContext, useState, useEffect, useContext } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import instance from '@/axios-instance';
import { Alert } from 'react-native';
import { Linking } from 'react-native';
import axios from 'axios';
import { IP_CONFIG } from '@/config/ipconfig';
import { useAuth } from './AuthContext';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {

    const {token} = useAuth();

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({
        id: 'CASH',
        title: 'Thanh toán khi nhận hàng',
        description: 'Thanh toán khi nhận hàng',
    });

    const { selectedPaymentMethod: paramPaymentMethod } = useLocalSearchParams();

    useEffect(() => {
        if (paramPaymentMethod) {
            try {
                const parsedMethod = JSON.parse(paramPaymentMethod);
                setSelectedPaymentMethod(parsedMethod);
            } catch (error) {
                console.error('Lỗi khi parse selectedPaymentMethod từ params:', error);
            }
        }
    }, [paramPaymentMethod]);

    const updateSelectedPaymentMethod = (method) => {
        setSelectedPaymentMethod(method);
        router.back();
        router.setParams({ selectedPaymentMethod: JSON.stringify(method) });
    };

    const checkPaymentStatus = async (returnUrl) => {
        console.log("Return URL:", returnUrl); 
        try {
            const response = await axios.get(returnUrl);
            if (response.data.status === 'success') {
                Alert.alert('Thành công', 'Thanh toán thành công!');
                router.replace('/checkout/Success');
            } else {
                Alert.alert('Lỗi', 'Thanh toán không thành công.');
                router.replace('/checkout/Failed');
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra trạng thái thanh toán:', error);
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi kiểm tra trạng thái thanh toán.');
        }
    };
    
    

    const handlePaymentByVNPAY = async (cartId, addressId) => {
        const requestBody = {
          cartId,
          addressId,
          paymentType: 'bank_transfer',
          weight: 4000,
        };
        try {
          const response = await instance.put('/api/order/placeOrder', requestBody);
          const { orderId, paymentUrl } = response.data.data;
      
          console.log("orderId: " + orderId);
          console.log("paymentUrl: " + paymentUrl);
      
          if (paymentUrl) {
            // Mở URL thanh toán VNPAY
            Linking.openURL(paymentUrl);
            // Sau khi người dùng thanh toán (thành công hoặc thất bại) trên trình duyệt,
            // backend sẽ redirect về deeplink (bookstore://payment/success hoặc bookstore://payment/failed).
            // Component DeeplinkHandler sẽ lắng nghe và xử lý các deeplink này.
          } else {
            Alert.alert('Lỗi', 'Không lấy được link thanh toán VNPAY.');
          }
      
        } catch (error) {
          console.error('Lỗi khi xử lý thanh toán VNPAY:', error);
          Alert.alert('Lỗi', 'Không thể xử lý thanh toán VNPAY.');
        }
      };

      const handlePaymentByVNPAY1 = async (cartId, addressId) => {
        const requestBody = {
          cartId,
          addressId,
          paymentType: 'bank_transfer',
          weight: 4000,
        };
      
        try {
          const response = await instance.put('/api/order/placeOrder', requestBody);
          const { orderId, paymentUrl } = response.data.data;
      
          console.log("orderId:", orderId);
          console.log("paymentUrl:", paymentUrl);
      
          if (paymentUrl) {
            // 👉 Thay vì mở trình duyệt, chuyển đến màn WebView trong app
            router.push({
              pathname: '/checkout/VnpayWebView',
              params: {
                paymentUrl: encodeURIComponent(paymentUrl),
              },
            });
          } else {
            Alert.alert('Lỗi', 'Không lấy được link thanh toán VNPAY.');
          }
      
        } catch (error) {
          console.error('Lỗi khi xử lý thanh toán VNPAY:', error);
          Alert.alert('Lỗi', 'Không thể xử lý thanh toán VNPAY.');
        }
      };

    const handlePaymentByCash = async (cartId, addressId) => {
        const requestBody = {
            "cartId": cartId,
            "addressId": addressId,
            "paymentType": "cash_on_delivery",
            "weight": 4000
        }
        const response = await instance.put('/api/order/placeOrder', requestBody);
        console.log(response.data.data);
    }

    return (
        <PaymentContext.Provider value={{ selectedPaymentMethod, updateSelectedPaymentMethod, handlePaymentByCash, handlePaymentByVNPAY,handlePaymentByVNPAY1 }}>
            {children}
        </PaymentContext.Provider>
    );
};

export const usePayment = () => {
    return useContext(PaymentContext);
};
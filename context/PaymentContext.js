import React, { createContext, useState, useEffect, useContext } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import instance from '@/axios-instance';
import { Alert } from 'react-native';
import { Linking } from 'react-native';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
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
        // Khi chọn phương thức thanh toán, quay lại trang checkout và
        // đặt params để trang checkout có thể cập nhật UI nếu cần
        router.back();
        router.setParams({ selectedPaymentMethod: JSON.stringify(method) });
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
            Linking.openURL(paymentUrl); 
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
        <PaymentContext.Provider value={{ selectedPaymentMethod, updateSelectedPaymentMethod, handlePaymentByCash,handlePaymentByVNPAY  }}>
            {children}
        </PaymentContext.Provider>
    );
};

export const usePayment = () => {
    return useContext(PaymentContext);
};
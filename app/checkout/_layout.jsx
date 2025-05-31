import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const CheckOutLayout = () => {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="Checkout"
        options={{
          title: 'Thanh toán',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Address"
        options={{
          title: 'Thêm địa chỉ giao hàng',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="ListAddress"
        options={{
          title: 'Danh sách địa chỉ',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="transportation"
        options={{
          title: 'Phương thức vận chuyển',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="payment"
        options={{
          title: 'Phương thức thanh toán',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name='Success'
        options={{
          title: 'Đang xử lý...',
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default CheckOutLayout;

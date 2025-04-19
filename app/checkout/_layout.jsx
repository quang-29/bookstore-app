import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const CheckOutLayout = () => {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="CheckOut"
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
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Transportation"
        options={{
          title: 'Phương thức vận chuyển',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Payment"
        options={{
          title: 'Phương thức thanh toán',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name='Loading'
        options={{
          title: 'Đang xử lý...',
          headerShown: false,
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

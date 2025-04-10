import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const CheckOutLayout = () => {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="checkOut"
        options={{
          title: 'Thanh toán',
          headerShown: true,
        }}
      />
    </Stack>
  );
};

export default CheckOutLayout;

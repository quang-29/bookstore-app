import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const BookLayout = () => {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Thông tin chi tiết',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="addbook"
        options={{
          title: 'Thêm sách',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="editbook"
        options={{
          title: 'Thay đổi thông tin sách',
          headerShown: true,
        }}
      />
      
    </Stack>
  );
};

export default BookLayout;

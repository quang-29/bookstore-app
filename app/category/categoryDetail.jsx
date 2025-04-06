import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import VerticalBookList from '@/components/VerticalBookList';
import instance from '@/axios-instance';
import { Ionicons } from '@expo/vector-icons';

const CategoryDetail = () => {
  const { categoryName } = useLocalSearchParams();
  const [bookCategory, setBookCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await instance.get(`/api/book/getAllBooksByCategory/${categoryName}`);
        setBookCategory(response.data.content);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };
    fetchBooks();
    return () => {
      setBookCategory([]);
    };
  }, [categoryName]);

  const handleGoBack = () => {
    router.push('/(tabs)/home'); // Quay lại trang trước đó
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: categoryName, // Tiêu đề động dựa trên categoryName
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleGoBack}
              style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}
            >
              <Ionicons name="chevron-back" size={24} color="#007AFF" />
              <Text style={{ color: '#007AFF', marginLeft: 2, fontSize: 16 }}>Quay lại</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={{ flex: 1 }}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <VerticalBookList books={bookCategory} onBookPress={() => {}} />
        )}
      </View>
    </>
  );
};

export default CategoryDetail;
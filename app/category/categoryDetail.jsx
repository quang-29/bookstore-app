import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import VerticalBookList from '@/components/VerticalBookList';
import instance from '@/axios-instance';
import BackButton from '@/components/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';

const CategoryDetail = () => {
  const { categoryName } = useLocalSearchParams();
  const [bookCategory, setBookCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        let response;
        if (categoryName === 'All') {
          response = await instance.get('/api/book/getAllBooks');
        } else {
          response = await instance.get(`/api/book/getAllBooksByCategory/${categoryName}`);
        }
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton style={styles.backButton} />
          <Text style={styles.title}>{categoryName}</Text>
        </View>
        <View style={styles.content}>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            <VerticalBookList books={bookCategory} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingLeft: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },
});

export default CategoryDetail;
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState} from 'react';
import instance from '@/axios-instance';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { COLORS } from '@/constants';
import { useRouter } from 'expo-router';
import {Stack} from 'expo-router';
import { Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


const AllRating = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user} = useAuth();
  const router = useRouter();

  useFocusEffect(
  useCallback(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await instance.get(`/api/review/getReviewsByUserId/${user.userId}`);
        if (response.data.code === 200) {
          setReviews(response.data.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải đánh giá:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user.userId])
);


  const renderItem = ({ item }) => (
  <View style={styles.reviewCard}>
    <Image
      source={{ uri: item.imagePath || 'https://via.placeholder.com/80x120' }}
      style={styles.bookImage}
    />
    <View style={styles.reviewContent}>
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.rating}>Đánh giá: {item.ratePoint}⭐</Text>
      <Text style={styles.content}>"{item.content}"</Text>
      <Text style={styles.date}>Ngày đánh giá: {item.createdAt}</Text>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push({
          pathname: '/rating/EditReview',
          params: { reviewId: item.reviewId }
        })}
      >
        <Ionicons name="create-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
        <Text style={styles.editButtonText}>Chỉnh sửa</Text>
      </TouchableOpacity>
    </View>
  </View>
);


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Danh sách đánh giá của bạn',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 12 }}>
                <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
              </Pressable>
            ),
        }}
        />

        {reviews.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Text>Bạn chưa đánh giá sách nào</Text>
          </View>
        ) : (
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.reviewId.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        )}

    </View>
  );
};

export default AllRating;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 16,
  },
  reviewCard: {
  backgroundColor: '#f1f1f1',
  padding: 12,
  borderRadius: 8,
  marginBottom: 12,
  flexDirection: 'row-reverse', // hình bên phải
  alignItems: 'flex-start',
  gap: 12,
},

bookImage: {
  width: 80,
  height: 120,
  borderRadius: 6,
  backgroundColor: '#ccc',
},

reviewContent: {
  flex: 1,
  justifyContent: 'space-between',
},

  bookTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  rating: {
    color: '#ffa500',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  content: {
    fontStyle: 'italic',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
  marginTop: 8,
  backgroundColor: COLORS.primary,
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 6,
  alignSelf: 'flex-start',
  flexDirection: 'row',
  alignItems: 'center',
},
editButton: {
  marginTop: 8,
  backgroundColor: COLORS.primary, // màu chủ đạo của bạn
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 6,
  alignSelf: 'flex-start',
  flexDirection: 'row',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
  elevation: 3,
},

editButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 14,
},


  
});

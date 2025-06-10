import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import instance from '@/axios-instance';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';
import { Loader } from '@/components';

const EditReview = () => {
  const { reviewId } = useLocalSearchParams();
  const router = useRouter();

  const [content, setContent] = useState('');
  const [ratePoint, setRatePoint] = useState(5);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await instance.get(`/api/review/getReviewById/${reviewId}`);
        const review = res.data.data;
        setContent(review.content);
        setRatePoint(review.ratePoint);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu review:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReview();
  }, [reviewId]);

  const handleUpdate = async () => {
    setSubmitting(true);
    try {
      const response = await instance.post('/api/review/updateReview', {
        id: reviewId,
        content,
        ratePoint,
      });

      if (response.data.code === 200) {
        Alert.alert('Thành công', 'Đánh giá đã được cập nhật!');
        router.back();
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật review:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật đánh giá');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Sửa đánh giá sách',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 12 }}>
              <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
            </Pressable>
          ),
        }}
      />

      <Text style={styles.label}>Nội dung đánh giá</Text>
      <TextInput
        style={styles.input}
        value={content}
        onChangeText={setContent}
        placeholder="Nhập nội dung đánh giá..."
        multiline
      />

      <Text style={styles.label}>Chọn số sao ({ratePoint})</Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRatePoint(star)}>
            <Ionicons
              name={star <= ratePoint ? "star" : "star-outline"}
              size={40}
               color="#FFD700"
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
        <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
      </TouchableOpacity>

      <Loader isLoading={submitting} message="Đang xử lí ..." />
    </View>
  );
};

export default EditReview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    textAlignVertical: 'top',
    height: 100,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  star: {
    marginHorizontal: 4,
  },
  saveButton: {
    flexDirection: 'row',
    marginTop: 24,
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});

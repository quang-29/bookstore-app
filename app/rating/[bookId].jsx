import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import instance from '@/axios-instance';
import Loader from '@/components/Loader';
import { AntDesign } from '@expo/vector-icons';
import { COLORS, SIZES } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useRatedBooks } from '@/context/RateBookContext';

const RatingBook = () => {
  const {bookId } = useLocalSearchParams();
  const [book, setBook] = useState(null);
  const [rating, setRating] = useState(0); // 1–5 sao
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const {user} = useAuth();
  const {addRatedBookByName} = useRatedBooks();

  // Lấy thông tin sách theo bookId
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await instance.get(`/api/book/${bookId}`);
        setBook(res.data.data);
        console.log("User Id la:" + user.userId);
      } catch (err) {
        Alert.alert('Lỗi', 'Không thể tải thông tin sách.');
      }
    };

    fetchBook();
  }, [bookId]);

  const handleSubmit = async () => {
    if (rating === 0 || reviewText.trim() === '') {
      Alert.alert('Thiếu thông tin', 'Vui lòng chọn số sao và nhập nhận xét.');
      return;
    }
    console.log("BookId:" + bookId);

    try {
      setLoading(true);
      const res = await instance.post('/api/review/createReview', {
      user: user.userId,  
      book: bookId,      
      rating,
      content: reviewText,
    });
      if (res.data.code === 201) {

        addRatedBookByName(book.title)
        Alert.alert('Thành công', 'Cảm ơn bạn đã đánh giá!');
        router.back(); 
      } else {
        Alert.alert('Thất bại', 'Không thể gửi đánh giá.');
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi gửi đánh giá.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <AntDesign
            name={i <= rating ? 'star' : 'staro'}
            size={32}
            color="#f1c40f"
            style={{ marginHorizontal: 4 }}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  if (!book) return <Loader isLoading={true} message="Đang tải sách..." />;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.bookInfo}>
          <Image source={{ uri: book.imagePath }} style={styles.bookImage} />
          <Text style={styles.bookTitle}>{book.title}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Chọn số sao:</Text>
          <View style={styles.starsContainer}>{renderStars()}</View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Nhận xét của bạn:</Text>
          <TextInput
            style={styles.textArea}
            multiline
            placeholder="Viết cảm nhận về sách..."
            value={reviewText}
            onChangeText={setReviewText}
          />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Gửi đánh giá</Text>
        </TouchableOpacity>
      </ScrollView>
      <Loader isLoading={loading} message="Đang gửi đánh giá..." />
    </KeyboardAvoidingView>
  );
};

export default RatingBook;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
  },
  bookInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  bookImage: {
    width: 120,
    height: 170,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#eee',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.dark,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textArea: {
    height: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

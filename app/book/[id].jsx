import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  SafeAreaView,
  Alert,
  Animated
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import BackButton from '@/components/BackButton';
import instance from '@/axios-instance';
import FormatMoney from '@/components/FormatMoney';
import { getUser } from '@/storage';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  Star,
  ShoppingCart,
  Heart,
  Share,
  ChevronDown,
  ChevronUp,
  Calendar,
  Book,
  Type,
  Languages
} from 'lucide-react-native';
import ReviewList from '@/components/ReviewList';
import { addToCart } from '../../context/CartContext';

const specificReviews = [
  {
    id: '1',
    userName: 'Nguyễn Văn A',
    date: '2024-07-20',
    rating: 5,
    comment: 'Một cuốn sách tuyệt vời! Nội dung sâu sắc và cách viết lôi cuốn. Tôi đã đọc nó một mạch không rời.',
  },
  {
    id: '2',
    userName: 'Trần Thị B',
    date: '2024-08-05',
    rating: 4,
    comment: 'Cuốn sách khá hay, cốt truyện hấp dẫn. Tuy nhiên, một vài chi tiết ở giữa có vẻ hơi chậm.',
  },
  {
    id: '3',
    userName: 'Lê Công C',
    date: '2024-08-15',
    rating: 3,
    comment: 'Đây là một cuốn sách thú vị, nhưng không thực sự xuất sắc như tôi mong đợi. Ý tưởng tốt nhưng triển khai chưa tới.',
  },
  {
    id: '4',
    userName: 'Phạm Thu D',
    date: '2024-09-01',
    rating: 5,
    comment: 'Tôi hoàn toàn yêu thích cuốn sách này! Các nhân vật được xây dựng rất tốt và thông điệp ý nghĩa. Chắc chắn sẽ đọc lại.',
  },
  {
    id: '5',
    userName: 'Hoàng Minh E',
    date: '2024-09-10',
    rating: 2,
    comment: 'Khá thất vọng với cuốn sách này. Cốt truyện rời rạc và khó theo dõi. Có lẽ không phù hợp với gu của tôi.',
  },
  {
    id: '6',
    userName: 'Vũ Ngọc F',
    date: '2024-09-25',
    rating: 4,
    comment: 'Một câu chuyện cảm động và đầy ý nghĩa nhân văn. Tác giả viết rất chân thật và dễ đồng cảm.',
  },
];

const SkeletonLoader = () => {
  const [opacity] = useState(new Animated.Value(0.3));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.bookHeader}>
        <Animated.View style={[styles.skeletonImage, { opacity }]} />
        <View style={styles.bookInfo}>
          <Animated.View style={[styles.skeletonTitle, { opacity }]} />
          <Animated.View style={[styles.skeletonAuthor, { opacity }]} />
          <Animated.View style={[styles.skeletonRating, { opacity }]} />
          <Animated.View style={[styles.skeletonPrice, { opacity }]} />
        </View>
      </View>

      <View style={styles.section}>
        <Animated.View style={[styles.skeletonSectionTitle, { opacity }]} />
        <Animated.View style={[styles.skeletonDescription, { opacity }]} />
        <Animated.View style={[styles.skeletonDescription, { opacity }]} />
        <Animated.View style={[styles.skeletonDescription, { opacity }]} />
      </View>

      <View style={styles.section}>
        <Animated.View style={[styles.skeletonSectionTitle, { opacity }]} />
        <View style={styles.detailsGrid}>
          {[1, 2, 3, 4].map((item) => (
            <View key={item} style={styles.detailItem}>
              <Animated.View style={[styles.skeletonDetailIcon, { opacity }]} />
              <View>
                <Animated.View style={[styles.skeletonDetailLabel, { opacity }]} />
                <Animated.View style={[styles.skeletonDetailValue, { opacity }]} />
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Animated.View style={[styles.skeletonSectionTitle, { opacity }]} />
        <View style={styles.categories}>
          {[1, 2, 3].map((item) => (
            <Animated.View key={item} style={[styles.skeletonCategory, { opacity }]} />
          ))}
        </View>
      </View>

      <ReviewList reviews={specificReviews} />
    </ScrollView>
  );
};

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();
  const {addToCart} = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await instance.get(`/api/book/${id}`);
        setBook(res.data.data);

        if (user?.userId) {
          const likeResponse = await instance.get('/api/user/listBooksLikedByUser', {
            params: { userId: user.userId }
          });
          const likedBooks = likeResponse.data.data.map(item => item.bookId);
          setIsLiked(likedBooks.includes(res.data.data.id));
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const extractCategory = (category) => {
    if (!category) return [];
    const parts = category.split(/ - |,|\//);
    return parts.map((part) => part.trim());
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: '',
            headerRight: () => (
              <View style={styles.headerActions}>
                <Pressable style={styles.headerButton}>
                  <Heart size={24} color={colors.text} />
                </Pressable>
                <Pressable style={styles.headerButton}>
                  <Share size={24} color={colors.text} />
                </Pressable>
              </View>
            ),
          }}
        />
        <SkeletonLoader />
        <View style={styles.footer}>
          <Button
            title="Add to Cart"
            leftIcon={<ShoppingCart size={20} color={colors.white} />}
            onPress={() => {}}
            style={styles.addToCartButton}
            rightIcon={null}
            textStyle={{ color: colors.white }}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!book) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Book not found</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          style={styles.backButton}
          textStyle={{ color: colors.white }}
          leftIcon={null}
          rightIcon={null}
        />
      </View>
    );
  }

  const inWishlist = false;

  const handleAddToCart = async (bookId) => {
    addToCart(bookId,1);
  };

  const handleLikeBook = async () => {
    if (!user?.id) {
      Alert.alert("Thông báo", "Vui lòng đăng nhập để thực hiện chức năng này");
      return;
    }

    try {
      const response = await instance.post('/api/user/likeBook', {
        userId: user.id,
        bookId: book.id,
      });

      if (response.data.success) {
        setIsLiked(!isLiked);
      } else {
        Alert.alert("Lỗi", "Không thể thực hiện thao tác này. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error('Error liking book:', error);
      Alert.alert("Lỗi", "Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: '',
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable style={styles.headerButton} onPress={handleLikeBook}>
                <Heart
                  size={24}
                  color={isLiked ? colors.error : colors.text}
                  fill={isLiked ? colors.error : 'none'}
                />
              </Pressable>
              <Pressable style={styles.headerButton}>
                <Share size={24} color={colors.text} />
              </Pressable>
            </View>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.bookHeader}>
          <Image
            source={{ uri: book.imagePath }}
            style={styles.coverImage}
            resizeMode="cover"
          />

          <View style={styles.bookInfo}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>by {book.author}</Text>

            <View style={styles.ratingContainer}>
              <Star size={16} color={colors.secondary} fill={colors.secondary} />
              <Text style={styles.rating}>
                {book.averageRating ? book.averageRating.toFixed(1) : '0'} ({book.stock} remains)
              </Text>
            </View>

            <View style={styles.priceContainer}>
              {book.price ? (
                <>
                  <Text style={styles.discountPrice}>
                    {FormatMoney(book.price)}
                  </Text>
                  <Text style={styles.originalPrice}>
                    đ300.000
                  </Text>
                </>
              ) : (
                <Text style={styles.price}>
                  ${book.price ? book.price.toFixed(2) : 'N/A'}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text
            style={styles.description}
            numberOfLines={expanded ? undefined : 4}
          >
            {book.description}
          </Text>

          {book.description && book.description.length > 150 && (
            <Pressable style={styles.expandButton} onPress={toggleExpanded}>
              <Text style={styles.expandText}>
                {expanded ? 'Show Less' : 'Read More'}
              </Text>
              {expanded ? (
                <ChevronUp size={16} color={colors.primary} />
              ) : (
                <ChevronDown size={16} color={colors.primary} />
              )}
            </Pressable>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Book size={16} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.detailLabel}>ISBN</Text>
                <Text style={styles.detailValue}>{book.isbn}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Calendar size={16} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Published</Text>
                <Text style={styles.detailValue}>{book.publisher}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Type size={16} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Page</Text>
                <Text style={styles.detailValue}>{book.page}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Languages size={16} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Language</Text>
                <Text style={styles.detailValue}>{book.language}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categories}>
            {extractCategory(book.category).map((category, index) => (
              <View key={index} style={styles.categoryTag}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Hiển thị danh sách review cụ thể */}
        <ReviewList reviews={specificReviews} />

        {/* Đoạn code cũ để hiển thị review từ API (bạn có thể bỏ comment nếu muốn hiển thị cả hai hoặc chỉ review từ API khi có) */}
        {/* {book.reviews && book.reviews.length > 0 && (
          <ReviewList reviews={book.reviews} />
        )} */}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Add to Cart"
          leftIcon={<ShoppingCart size={20} color={colors.white} />}
          onPress={() => handleAddToCart(id)}
          style={styles.addToCartButton}
          rightIcon={null}
          textStyle={{ color: colors.white }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    position: 'relative',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 16,
    zIndex: 999,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  bookHeader: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  coverImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
  },
  bookInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 12,
  },ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  discountPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 16,
    color: colors.textLight,
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  expandText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginRight: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  detailItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  categoryTag: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  addToCartButton: {
    width: '100%',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  skeletonImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    backgroundColor: colors.gray[200],
  },
  skeletonTitle: {
    width: '80%',
    height: 24,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonAuthor: {
    width: '60%',
    height: 16,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    marginBottom: 12,
  },
  skeletonRating: {
    width: '40%',
    height: 16,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    marginBottom: 12,
  },
  skeletonPrice: {
    width: '30%',
    height: 20,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
  },
  skeletonSectionTitle: {
    width: '40%',
    height: 20,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    marginBottom: 16,
  },
  skeletonDescription: {
    width: '100%',
    height: 16,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonDetailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray[200],
    marginRight: 8,
  },
  skeletonDetailLabel: {
    width: 60,
    height: 12,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    marginBottom: 4,
  },
  skeletonDetailValue: {
    width: 80,
    height: 14,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
  },
  skeletonCategory: {
    width: 80,
    height: 32,
    backgroundColor: colors.gray[200],
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
})
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
  Animated,
  TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import instance from '@/axios-instance';
import FormatMoney from '@/components/FormatMoney';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import ReviewList from '@/components/ReviewList';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';


const SkeletonLoader = ({ reviews }) => {
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
      <ReviewList reviews={reviews} />
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
  const { addToCart } = useCart();
  const [specificReviews, setSpecificReviews] = useState([]);
  const [bookBuy,setBookBuy] = useState(null);

  const extractCategory = (category) => {
    if (!category) return [];
    const parts = category.split(/ - |,|\//); 
    return parts.map((part) => part.trim());
  };

  useEffect(() => {
    const fetchAll = async () => {
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

        const reviewResponse = await instance.get(`/api/review/getReviewByBookId/${id}`);
        setSpecificReviews(reviewResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id, user]);

  const handleAddToCart = async (bookId) => {
    addToCart(bookId, 1);
  };

  const handleBuyNow = (id) => {
      router.push({
        pathname: '/buynow/BuyNow',
        params: { id: id }
      });
    }
  const handleLikeBook = async () => {
    if (!user?.userId) {
      Alert.alert("Thông báo", "Vui lòng đăng nhập để thực hiện chức năng này");
      return;
    }
    try {
      const response = await instance.post('/api/user/likeBook', {
        userId: user.userId,
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
          title: 'Chi tiết sách',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 12 }}>
              <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
            </Pressable>
          ),
        }}
      />

      {loading ? (
        <>
          <SkeletonLoader reviews={specificReviews} />
          <View style={styles.footer}>
            <Button
              title="Add to Cart"
              leftIcon={<Feather name="shopping-cart" size={20} color={colors.white} />}
              onPress={() => {}}
              style={styles.addToCartButton}
              textStyle={{ color: colors.white }}
            />
          </View>
        </>
      ) : book ? (
        <>
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
              <Feather name="star" size={16} color={colors.secondary} />
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
              <Feather
                name={expanded ? "chevron-up" : "chevron-down"}
                size={16}
                color={colors.primary}
              />
            </Pressable>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Feather name="book" size={16} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.detailLabel}>ISBN</Text>
                <Text style={styles.detailValue}>{book.isbn}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Feather name="calendar" size={16} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Published</Text>
                <Text style={styles.detailValue}>{book.publisher}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Feather name="type" size={16} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Page</Text>
                <Text style={styles.detailValue}>{book.page}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Feather name="globe" size={16} color={colors.primary} />
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

        <ReviewList reviews={specificReviews} />
          </ScrollView>
          <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.footerButton, { backgroundColor: colors.primary }]}
                onPress={() => handleBuyNow(id)}
              >
                <Feather name="credit-card" size={20} color={colors.white} />
                <Text style={styles.footerButtonText}>Mua ngay</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.footerButton, { backgroundColor: colors.secondary }]}
                onPress={() => handleAddToCart(id)}
              >
                <Feather name="shopping-cart" size={20} color={colors.white} />
                <Text style={styles.footerButtonText}>Thêm vào giỏ</Text>
              </TouchableOpacity>
        </View>
        </>
      ) : (
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Book not found</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.backButton}
            textStyle={{ color: colors.white }}
          />
        </View>
      )}
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
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
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
  notFoundText: {
    fontSize: 16,
    marginBottom: 12,
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
    headerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 10,
  backgroundColor: COLORS.white,
  borderBottomWidth: 1,
  borderBottomColor: COLORS.lightGray,
},

headerTitleContainer: {
  flex: 1,
  alignItems: 'center',
},

headerTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: COLORS.dark,
},
rightPlaceholder: {
  width: 40, 
},
footer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 16,
  backgroundColor: colors.white,
  borderTopWidth: 1,
  borderTopColor: colors.lightGray,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 3,
},

footerButton: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 14,
  marginHorizontal: 5,
  borderRadius: 8,
},

footerButtonText: {
  color: colors.white,
  fontSize: 16,
  fontWeight: '600',
  marginLeft: 8,
},

notFound: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},

notFoundText: {
  fontSize: 16,
  color: colors.gray,
  marginBottom: 20,
},

backButton: {
  backgroundColor: colors.primary,
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 8,
},

});

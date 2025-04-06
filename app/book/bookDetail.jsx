import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList, TextInput, Alert, Dimensions } from 'react-native';
import { COLORS } from '../../constants';
import FormatMoney from '../../components/FormatMoney';
import { router, useLocalSearchParams } from 'expo-router';
import { IP_CONFIG } from '../../config/ipconfig';
import { addBookToCart } from '../../services/cart/cartService';
// import { useGlobalContext } from '../../context/GlobalProvider';
import Ionicons from '@expo/vector-icons/Ionicons';



const { width, height } = Dimensions.get('window');

const bookDetail = () => {
  const { id } = useLocalSearchParams();
  const [book, setBook] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [newReview, setNewReview] = useState('');
  const [userRating, setUserRating] = useState(0);
  const {user,token} = useGlobalContext(); 

  const rating = 4.5;
  const totalReviews = 250;

  useEffect(() => {
    const loadBookData = async () => {
      try {
        const response = await fetch(`http://${IP_CONFIG}:8080/api/book/${id}`);
        const data = await response.json();
        if (data && data.data) {
          setBook(data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu sách:", error);
      }
    };
    loadBookData();
  }, [id]);

  const formatNumberToK = (number) => {
    if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'k';
    }
    return number;
  };

  const mockReviews = [
    {
      id: '1',
      user: 'Nguyễn Văn A',
      rating: 5,
      comment: 'Cuốn sách rất hay, cảm động và đáng đọc. Tôi thực sự thích cách tác giả miêu tả chi tiết.',
      date: '2024-03-15'
    },
    {
      id: '2',
      user: 'Trần Thị B',
      rating: 4,
      comment: 'Một tác phẩm đáng để đọc. Ngôn ngữ dễ hiểu và chân thực.',
      date: '2024-03-10'
    },
    {
      id: '3',
      user: 'Lê Văn C',
      rating: 5,
      comment: 'Xuất sắc! Một trong những cuốn sách hay nhất tôi từng đọc.',
      date: '2024-03-05'
    },
  ];

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      'Yêu thích',
      isFavorite
        ? 'Đã xóa khỏi danh sách yêu thích'
        : 'Đã thêm vào danh sách yêu thích'
    );
  };

  const handleAddToCart = () => {
    console.log(user.cart.cartId, book.id, 1, token);
    addBookToCart(user.cart.cartId, book.id, 1, token);
  };

  const handleBuyNow = () => {
    router.push('checkout/checkOut');
    setCartQuantity(0);
  };

  const renderReview = ({ item }) => (
    <View style={styles.reviewContainer}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewUser}>{item.user}</Text>
        <View style={styles.reviewRating}>
          {Array.from({ length: item.rating }, (_, index) => (
            <Ionicons key={index} name="star" size={16} color={COLORS.gold} />
          ))}
        </View>
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
      <Text style={styles.reviewDate}>{item.date}</Text>
    </View>
  );

  const renderStarRating = () => {
    return (
      <View style={styles.starRatingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setUserRating(star)}
            style={styles.starButton}
          >
            <Ionicons
              name={star <= userRating ? "star" : "star-outline"}
              size={30}
              color={COLORS.gold}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const handleSubmitReview = () => {
    if (newReview.trim() === '' || userRating === 0) {
      Alert.alert('Vui lòng nhập đánh giá và chọn số sao');
      return;
    }
    Alert.alert('Đã gửi đánh giá thành công!');
    setNewReview('');
    setUserRating(0);
  };

  if (!book) {
    return <Text style={styles.loadingText}>Đang tải dữ liệu sách...</Text>;
  }

  const bookImage = book.imagePath;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
          style={{
            position: 'absolute', 
            top: 50, 
            left: 20, 
            zIndex: 999,
            backgroundColor: 'rgba(0, 0, 0, 0.1)', 
            padding: 10, 
            borderRadius: 50, 
          }} 
          onPress={() => router.back()}
>
        <Ionicons name="arrow-back-outline" size={24} color={COLORS.dark} />
      </TouchableOpacity>
      
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: bookImage }} style={styles.bookImage} />
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detailBook}>
            <Text style={styles.sectionPrice}>{FormatMoney(book.price)}</Text>
            <Text style={styles.soldText}>Đã bán: {formatNumberToK(book.sold)}</Text>
          </View>

          <View style={styles.titleAndFavorite}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <TouchableOpacity
              style={[styles.favoriteButton, { backgroundColor: isFavorite ? COLORS.lightRed : COLORS.lightGray }]}
              onPress={toggleFavorite}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? COLORS.red : COLORS.dark}
              />
              {/* <Text style={styles.actionButtonText}>
                {isFavorite ? 'Đã thích' : 'Yêu thích'}
              </Text> */}
            </TouchableOpacity>
          </View>

          <View style={styles.bookInfo}>
            <Text style={styles.bookInfoText}>Tác giả: <Text style={styles.boldText}>{book.author}</Text></Text>
            <Text style={styles.bookInfoText}>Nhà xuất bản: <Text style={styles.boldText}>{book.publisher}</Text></Text>
            <Text style={styles.bookInfoText}>Thể loại: <Text style={styles.boldText}>{book.category}</Text></Text>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Mô tả</Text>
            <Text style={styles.bookDescription}>{book.description}</Text>
          </View>

          <View style={styles.ratingOverview}>
            <View style={styles.ratingStars}>
              <Text style={styles.ratingValue}>{rating}</Text>
              <Ionicons name='star' size={20} color={COLORS.gold} />
            </View>
            <Text style={styles.totalReviews}>({formatNumberToK(totalReviews)} đánh giá)</Text>
          </View>

          <View style={styles.reviewsSection}>
            <Text style={styles.sectionTitle}>Đánh giá</Text>

            <View style={styles.reviewInputContainer}>
              <Text style={styles.reviewInputTitle}>Đánh giá của bạn</Text>
              {renderStarRating()}
              <TextInput
                style={styles.reviewTextInput}
                placeholder="Viết đánh giá của bạn về cuốn sách..."
                multiline
                numberOfLines={4}
                value={newReview}
                onChangeText={setNewReview}
                placeholderTextColor={COLORS.gray}
              />
              <TouchableOpacity style={styles.submitReviewButton} onPress={handleSubmitReview}>
                <Text style={styles.submitReviewButtonText}>Gửi đánh giá</Text>
              </TouchableOpacity>
            </View>

            {mockReviews.length > 0 ? (
              <FlatList
                data={mockReviews}
                renderItem={renderReview}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ListHeaderComponent={<Text style={styles.otherReviewsTitle}>Đánh giá khác</Text>}
              />
            ) : (
              <Text style={styles.noReviewsText}>Chưa có đánh giá nào.</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.fixedBottomContainer}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <View style={styles.cartIconContainer}>
            <Ionicons name="cart-outline" size={24} color={COLORS.white} />
            {cartQuantity > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartQuantity}</Text>
              </View>
            )}
          </View>
          <Text style={styles.addToCartButtonText}>Thêm giỏ hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
          <Text style={styles.buyNowButtonText}>Mua Ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 100,
  },
  imageContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  bookImage: {
    width: '100%',
    height: 350,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 20,
  },
  detailBook: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 5,
    flexShrink: 1,
    fontFamily: 'Helvetica'
  },
  soldText: {
    color: COLORS.gray,
    fontSize: 14,
  },
  sectionPrice: {
    fontSize: 22,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginTop: 20,
    marginBottom: 10,
  },
  bookDescription: {
    fontSize: 16,
    color: COLORS.dark,
    lineHeight: 24,
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  ratingText: {
    marginLeft: 5,
    color: COLORS.dark,
    fontSize: 16,
  },
  reviewsSection: {
    marginTop: 20,
  },
  reviewContainer: {
    backgroundColor: COLORS.lightGray,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewUser: {
    fontWeight: 'bold',
    color: COLORS.dark,
    fontSize: 16,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    color: COLORS.dark,
    lineHeight: 20,
  },
  reviewDate: {
    color: COLORS.gray,
    fontSize: 12,
    textAlign: 'right',
    marginTop: 5,
  },
  reviewInputContainer: {
    backgroundColor: COLORS.lightGray,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  reviewInputTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 10,
  },
  starRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align stars to the left
    marginBottom: 15,
  },
  starButton: {
    marginRight: 10,
  },
  reviewTextInput: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
    color: COLORS.dark,
    fontSize: 16,
  },
  submitReviewButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  submitReviewButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 10,
    marginLeft: 15,
  },
  actionButtonText: {
    marginLeft: 8,
    color: COLORS.dark,
    fontWeight: '500',
    fontSize: 16,
  },
  cartIconContainer: {
    position: 'relative',
    marginRight: 10,
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.red, // Changed badge color
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  buyNowButton: {
    backgroundColor: COLORS.secondaryLight, // Changed buy now button color
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
  },
  buyNowButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  fixedBottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  addToCartButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  titleAndFavorite: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  ratingValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginRight: 5,
  },
  totalReviews: {
    color: COLORS.gray,
    fontSize: 14,
  },
  otherReviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginTop: 20,
    marginBottom: 10,
  },
  noReviewsText: {
    color: COLORS.gray,
    fontStyle: 'italic',
    marginTop: 10,
  },
  bookInfo: {
    marginTop: 15,
  },
  bookInfoText: {
    fontSize: 16,
    color: COLORS.dark,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginTop: 20,
  },
  loadingText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    color: COLORS.gray,
  }
});

export default bookDetail;
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Pressable,
  SafeAreaView
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import BackButton from '@/components/BackButton';
import instance from '@/axios-instance';
import FormatMoney from '@/components/FormatMoney';
import { getUser } from '@/storage';

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

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await instance.get(`/api/book/${id}`);
      setBook(res.data.data);

      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  console.log("Book ID:", id);

  fetchData();
}, [id]);
  
  // const book = {
  //           id: "ccf9f134-1398-11f0-bdc0-00155d851915",
  //           title: "Lược Sử Thời Gian",
  //           description: "Kiệt tác khoa học phổ thông về vũ trụ, thời gian và không gian",
  //           price: 130000.00,
  //           publisher: "NXB Trẻ",
  //           isbn: "9786045835219",
  //           language: "Tiếng Việt",
  //           imagePath: "/images/books/luocSuThoiGian.jpg",
  //           stock: 15,
  //           sold: 8,
  //           page: 320,
  //           averageRating: 4.7,
  //           category: "Khoa học - Công nghệ",
  //           author: "Stephen Hawking"
  // };

  const extractCategory = (category) => {
    if (!category) return [];
    const parts = category.split(/ - |,|\//); 
    return parts.map((part) => part.trim());
  };
  
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
  
  const handleAddToCart = async () => {
    try {
      await instance.post('/api/cart/addBookToCart', {
        cartId: user.cart.cartId,
        bookId: book.id,
        quantity: 1,
      });
      console.log("Added to cart successfully");
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };
  
  const toggleWishlist = () => {
    // if (inWishlist) {
    //   removeFromWishlist(book.id);
    // } else {
    //   addToWishlist(book.id);
    // }
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
              <Pressable style={styles.headerButton} onPress={toggleWishlist}>
                <Heart 
                  size={24} 
                  color={inWishlist ? colors.error : colors.text} 
                  fill={inWishlist ? colors.error : 'none'}
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
        {/* <View style={styles.header}>
            <BackButton style={styles.backButton} />
        </View> */}
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
                {book.averageRating.toFixed(1)} ({book.stock} remains)
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
                  ${book.price.toFixed(2)}
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
          
          {book.description.length > 150 && (
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
        
        {/* {book.reviews && book.reviews.length > 0 && (
          <ReviewList reviews={book.reviews} />
        )} */}
      </ScrollView>
      
      <View style={styles.footer}>
        <Button 
          title="Add to Cart" 
          leftIcon={<ShoppingCart size={20} color={colors.white} />}
          onPress={handleAddToCart}
          style={styles.addToCartButton}
          rightIcon={null}
        textStyle={{ color: colors.white }} // Add required textStyle
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
  },
  ratingContainer: {
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
  }
})
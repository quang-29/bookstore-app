import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '@/constants/colors';
import { FontAwesome } from '@expo/vector-icons'; 
import { Image } from 'react-native';


export default function ReviewList({ reviews }) {
  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            {/* <Text style={styles.userInitial}>
              {item.username?.charAt(0).toUpperCase() || '?'}
            </Text> */}
            <Image
              source={{ uri: item.avatarUrl }}
              style={styles.avatarImage}
            />
          </View>
          <View>
            <Text style={styles.userName}>{item.username}</Text>
            <Text style={styles.reviewDate}>{item.createdAt}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
  {[1, 2, 3, 4, 5].map((star) => (
    <FontAwesome
      key={star}
      name={star <= item.ratePoint ? "star" : "star-o"} 
      size={14}
      color={colors.secondary}
    />
  ))}
</View>
      </View>
      <Text style={styles.reviewComment}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reviews ({reviews.length})</Text>

      {reviews.length === 0 ? (
        <Text style={styles.noReviews}>Chưa có đánh giá nào cho sách này.</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.reviewId}
          renderItem={renderReviewItem}
          scrollEnabled={false}
          contentContainerStyle={styles.reviewsList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  noReviews: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  reviewsList: {
    gap: 16,
  },
  reviewItem: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInitial: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  avatarImage: {
  width: 36,
  height: 36,
  borderRadius: 18,
  resizeMode: 'cover',
},

});

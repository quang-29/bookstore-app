// components/BookCard.js

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import { useRouter } from 'expo-router'; 
import FormatMoney from './FormatMoney';




const BookCardView = ({ book }) => {
  const router = useRouter(); 

  const formatNumberToK = (number) => {
    if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'k';
    }
    return number;
  };

  return (
    <TouchableOpacity
      style={styles.bookContainer}
      onPress={() => router.push(`/book/bookDetail?id=${book.id}`)} 
    >
      <Image source={{ uri: book.imagePath }} style={styles.bookImage} />
      <Text style={styles.bookTitle} numberOfLines={1} ellipsizeMode="tail">
        {book.title}
      </Text>
      <View style={styles.detailBook}>
        <Text style={styles.sectionPrice}>{FormatMoney(book.price)}</Text>
        <Text>Đã bán: {formatNumberToK(book.sold)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bookContainer: {
    marginRight: 10,
    width: 180,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailBook: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 15,
  },
  bookImage: {
    width: 160,
    height: 180,
    borderRadius: 8,
  },
  bookTitle: {
    marginTop: 20,
    fontSize: 18,
    color: COLORS.dark,
    fontWeight: 'bold',
  },
  sectionPrice: {
    color: COLORS.red,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
});

export default BookCardView;

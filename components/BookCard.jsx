import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import FormatMoney from './FormatMoney';
import BookCardView from './BookCardView';

const BookCard = ({ books}) => {
  return (
    <FlatList
      data={books}
      renderItem={({ item }) => <BookCardView book={item} />}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 5,
  },
  bookContainer: {
    marginRight: 10,
    alignItems: 'center',
    width: 150,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookImage: {
    width: 130,
    height: 180,
    borderRadius: 8,
  },
  bookTitle: {
    marginTop: 5,
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: 'bold',
  },
  sectionPrice: {
    color: COLORS.red,
    fontWeight: 'bold',
    marginTop: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
});

export default BookCard;

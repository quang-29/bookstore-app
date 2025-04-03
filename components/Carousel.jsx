import React, { useState, useRef, useEffect } from 'react';
import { View, Image, Dimensions, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants';

const { width: screenWidth } = Dimensions.get('window');

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const carouselImages = [
    "https://res.cloudinary.com/dmotq51fh/image/upload/v1732507913/samples/cup-on-a-table.jpg",
    "https://res.cloudinary.com/dmotq51fh/image/upload/v1732507913/samples/coffee.jpg",
    "https://res.cloudinary.com/dmotq51fh/image/upload/v1732507911/samples/balloons.jpg",
    "https://res.cloudinary.com/dmotq51fh/image/upload/v1732507907/samples/landscapes/nature-mountains.jpg",
  ];

  // Automatically change slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        return nextIndex >= carouselImages.length ? 0 : nextIndex; // Loop back to the first image after the last one
      });
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  // Scroll to the correct index
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: activeIndex,
        animated: true,
      });
    }
  }, [activeIndex]);

  const renderItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.carouselItem}>
      <Image source={{ uri: item }} style={styles.carouselImage} resizeMode="cover" />
    </TouchableOpacity>
  );

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {carouselImages.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === activeIndex
              ? styles.activePaginationDot
              : styles.inactivePaginationDot,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={carouselImages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false} // Disable manual scrolling to avoid conflict with auto sliding
      />
      {renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  carouselItem: {
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselImage: {
    width: '90%',
    height: 200,
    borderRadius: 15,
  },
  paginationContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activePaginationDot: {
    backgroundColor: COLORS.primary,
  },
  inactivePaginationDot: {
    backgroundColor: COLORS.lightGray,
  },
});

export default Carousel;

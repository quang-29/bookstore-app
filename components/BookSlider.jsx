import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.9;
const ITEM_HEIGHT = ITEM_WIDTH * 0.6;

const books = [
  {
    id: '1',
    title: 'Where the Crawdads Sing',
    author: 'Delia Owens',
    price: 21.99,
    originalPrice: 26.99,
    image: 'https://res.cloudinary.com/dmotq51fh/image/upload/v1732507906/samples/landscapes/beach-boat.jpg', // Thay bằng URL thực hoặc import ảnh local
  },
  {
    id: '2',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    price: 15.99,
    originalPrice: 19.99,
    image: 'https://res.cloudinary.com/dmotq51fh/image/upload/v1732507906/samples/landscapes/beach-boat.jpg', // Thay bằng URL thực hoặc import ảnh local
  },
  {
    id: '3',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    price: 18.99,
    originalPrice: 22.99,
    image: 'https://res.cloudinary.com/dmotq51fh/image/upload/v1732507906/samples/landscapes/beach-boat.jpg', // Thay bằng URL thực hoặc import ảnh local
  },
  {
    id: '4',
    title: '1984',
    author: 'George Orwell',
    price: 17.99,
    originalPrice: 23.99,
    image: 'https://res.cloudinary.com/dmotq51fh/image/upload/v1732507906/samples/landscapes/beach-boat.jpg', // Thay bằng URL thực hoặc import ảnh local
  },
];

const BookSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef();
  
  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeIndex === books.length - 1) {
        flatListRef.current.scrollToIndex({
          index: 0,
          animated: true,
        });
      } else {
        flatListRef.current.scrollToIndex({
          index: activeIndex + 1,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: new Animated.Value(0) } } }],
    {
      useNativeDriver: false,
      listener: event => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / ITEM_WIDTH);
        setActiveIndex(index);
      },
    },
  );

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.backgroundImage}
          blurRadius={0.5}
        />
        <View style={styles.overlay} />
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>{item.author}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              <Text style={styles.originalPrice}>${item.originalPrice.toFixed(2)}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.exploreButton}>
            <Text style={styles.exploreText}>Explore</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContent}
        onScroll={handleScroll}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          });
        }}
      />
      
      <View style={styles.paginationContainer}>
        {books.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              activeIndex === index ? styles.paginationDotActive : {},
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flatListContent: {
    paddingHorizontal: width * 0.05,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 5,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CD964',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    textDecorationLine: 'line-through',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#6c5ce7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'flex-start',
    marginTop: 16,
  },
  exploreText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#6c5ce7',
    width: 20,
  },
});

export default BookSlider;
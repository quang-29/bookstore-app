import instance from '@/axios-instance';
import { COLORS } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const CategoryScreen = () => {
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const response = instance.get('/api/category/getAllCategories');
    response.then((res) => {
      if (res.data.code === 200) {
        setCategory(res.data.data);
      } else {
        console.log('Error fetching categories:', res.data.message);
      }
    }).catch((error) => {
      console.error('Error fetching categories:', error);
    });
    return () => {
      setCategory([]); 
    };
  }, []);

  const handlePressCategory = (categoryName) => {
    router.push({
      pathname: '/category/CategoryDetail',
      params: { categoryName },
    });
  };

  const handlePressViewAll = () => {
    router.push({
      pathname: '/category/categoryDetail',
      params: { categoryName: 'All' }
    });
  }

  const viewAllBestSellers = () => {
    router.push('/category/categoryDetail?categoryName=All');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity style={styles.viewAllButton} onPress={viewAllBestSellers}>
          <Text style={styles.viewAllText}>View All</Text>
          <MaterialIcons name="keyboard-arrow-right" size={20} color="#6c5ce7" />
        </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {category.map((category) => (
          <TouchableOpacity 
          key={category.id} 
          style={styles.categoryItem}
          onPress={() => handlePressCategory(category.categoryName)}>
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: category.category_img }} 
                style={styles.categoryImage}
              />
            </View>
            <Text style={styles.categoryName}>{category.categoryName}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundColor,
    marginTop: 5,
    borderRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#6c5ce7',
    fontWeight: '500',
  },
  categoryDetail: {
    position: 'absolute',
    right: 0,
    top: 5,
    fontSize: 14,
    color: '#4a5568',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 16,
  },
  scrollContainer: {
    paddingRight: 16,
    paddingVertical: 8,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 22,
    maxWidth: screenWidth / 3 - 15,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
    marginBottom: 8,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryName: {
    fontSize: 12,
    color: '#4a5568',
    textAlign: 'center',
  },
});

export default CategoryScreen;
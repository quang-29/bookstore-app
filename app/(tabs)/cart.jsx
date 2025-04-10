import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS, SIZES } from '../../constants/theme';
import FormatMoney from '../../components/FormatMoney'; 
import axios from 'axios';

import { IP_CONFIG } from '../../config/ipconfig';
import { router } from 'expo-router';
// import { useCart } from '../../context/CartContext'; // Import the CartContext
import { getUser,storeUser } from '@/storage';
import instance from '@/axios-instance';
import colors from '@/constants/colors';
import Button from '@/components/Button';
import { useCart } from '@/context/CartContext';

const Cart = () => {
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const { addToCart, removeFromCart, decreaseFromCart } = useCart(); 

  
useEffect(() => {
  const init = async () => {
    const storedUser = await getUser();
    setUser(storedUser);
    console.log("username", storedUser.username);
    fetchData(storedUser);
  };

  init();
}, []);

const fetchData = async (userData) => {
  setLoading(true);
  try {
    const response = await instance.get(`api/cart/getCartByUserName/${userData.username}`);
    if (Array.isArray(response.data.data.cartItem)) {
      const itemsWithSelection = response.data.data.cartItem.map(item => ({
        ...item,
        selected: false,
      }));
      setCartItems(itemsWithSelection);
      setError(null);
    } else {
      setError('Giỏ hàng không hợp lệ.');
    }
  } catch (error) {
    console.error('Error fetching cart data:', error);
    setError('Không thể tải giỏ hàng. Vui lòng thử lại sau.');
  } finally {
    setLoading(false);
  }
};

const onRefresh = async () => {
  setRefreshing(true);
  try {
    const currentUser = user || await getUser();
    const response = await instance.get(`api/cart/getCartByUserName/${currentUser.username}`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (Array.isArray(response.data.data.cartItem)) {
      const itemsWithSelection = response.data.data.cartItem.map(item => ({
        ...item,
        selected: false,
      }));
      setCartItems(itemsWithSelection);
      setError(null);
    } else {
      setError('Giỏ hàng không hợp lệ.');
    }
  } catch (error) {
    console.error('Error refreshing cart data:', error);
    setError('Không thể tải giỏ hàng. Vui lòng thử lại sau.');
  } finally {
    setRefreshing(false);
  }
};

  

  const handleIncrease = async (id) => {
    try {
      const currentItem = cartItems.find(item => item.cartItemId === id);
      if (!currentItem) {
        throw new Error('Item not found in cart');
      }
      await addToCart(currentItem.book.id, 1);
      const updatedItems = cartItems.map(item =>
        item.cartItemId === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCartItems(updatedItems);
    } catch (error) {
      console.error('Error increasing quantity:', error);
      Alert.alert('Lỗi', 'Không thể tăng số lượng sản phẩm. Vui lòng thử lại sau.');
    }
  };

  const handleDecrease = async (id) => {
    try {
      const currentItem = cartItems.find(item => item.cartItemId === id);
      if (!currentItem) {
        Alert.alert('Lỗi', 'Không tìm thấy sản phẩm trong giỏ hàng');
        return;
      }
  
      if (currentItem.quantity === 1) {
        Alert.alert(
          'Xác nhận xóa',
          'Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?',
          [
            {
              text: 'Hủy',
              style: 'cancel',
            },
            {
              text: 'Xóa',
              onPress: async () => {
                try {
                  await removeFromCart(currentItem.book.id);
                  const updatedItems = cartItems.filter(item => item.cartItemId !== id);
                  setCartItems(updatedItems);
                } catch (error) {
                  console.error('Error removing item:', error);
                  Alert.alert('Lỗi', 'Không thể xóa sản phẩm. Vui lòng thử lại sau.');
                }
              },
            },
          ]
        );
      } else {
        try {
          await decreaseFromCart(currentItem.book.id);
          const updatedItems = cartItems.map(item =>
            item.cartItemId === id ? { ...item, quantity: item.quantity - 1 } : item
          );
          setCartItems(updatedItems);
        } catch (error) {
          console.error('Error decreasing quantity:', error);
          Alert.alert('Lỗi', 'Không thể giảm số lượng sản phẩm. Vui lòng thử lại sau.');
        }
      }
    } catch (error) {
      console.error('Error in handleDecrease:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  };
  
  

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      {/* <ShoppingCart size={64} color={colors.gray[300]} /> */}
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptyText}>
        Browse our collection and add some books to your cart.
      </Text>
      <Button 
        title="Start Shopping" 
        style={styles.shopButton}
        onPress={() => router.push('/home')}
        
      />
    </View>
  );

  

  const handleRemoveItem = async (id) => {
    try {
      setCartItems(cartItems.filter(item => item.cartItemId !== id));
    } catch (error) {
      console.error('Error removing item:', error);
      fetchData(); 
    }
  };

  const handleSelectItem = (id) => {
    setCartItems(cartItems.map(item =>
      item.cartItemId === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const handleBuy = async () => {
    router.push("/checkout/checkOut");
  }
  const handleSelectAll = () => {
    const areAllSelected = cartItems.every(item => item.selected);
    setCartItems(cartItems.map(item => ({ ...item, selected: !areAllSelected })));
  };
  // const handleSelectBook = (id) => {
  //    router.push(`/book/bookDetail?id=${id}`)};

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <TouchableOpacity onPress={() => handleSelectItem(item.cartItemId)} style={styles.checkboxContainer}>
        <Text style={styles.checkbox}>{item.selected ? '☑' : '☐'}</Text>
      </TouchableOpacity>
      <TouchableOpacity 
      onPress={() => router.push(`/book/${item.book.id}`)} 
      style={{ flexDirection: 'row', flex: 1 }}>
      <Image source={{ uri: item.book.imagePath }} style={styles.cartItemImage} />
      <View style={styles.cartItemDetails}>
        <Text style={styles.cartItemTitle} numberOfLines={2}>{item.book.title}</Text>
        <Text style={styles.authorText}>{item.book.author}</Text>
        <Text style={styles.cartItemPrice}>{FormatMoney(item.book.price)}</Text>
      </View>
      </TouchableOpacity>
      
      <View style={styles.quantityContainer}>
        <View style={styles.quantityButtons}>
          <TouchableOpacity style={styles.quantityButton} onPress={() => handleDecrease(item.cartItemId)}>
            <Text style={styles.quantityText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={() => handleIncrease(item.cartItemId)}>
            <Text style={styles.quantityText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const totalPrice = cartItems.reduce((total, item) => {
    if (item.selected) {
      return total + (item.book.price * item.quantity);
    }
    return total;
  }, 0);

  const selectedItemsCount = cartItems.filter(item => item.selected).length;

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centerContainer}>
          <Text>Đang tải giỏ hàng...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : cartItems.length === 0 ? (

        renderEmptyCart()
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.selectAllContainer}>
            <TouchableOpacity onPress={handleSelectAll} style={styles.selectAllButton}>
              <Text style={styles.checkbox}>{cartItems.every(item => item.selected) ? '☑' : '☐'}</Text>
              <Text style={styles.selectAllText}>Chọn tất cả</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.cartItemId}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }
          />
          
          <View style={styles.summary}>
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryText}>
                Tổng thanh toán ({selectedItemsCount} sản phẩm):
              </Text>
              <Text style={styles.summaryPrice}>{FormatMoney(totalPrice)}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.checkoutButton, selectedItemsCount === 0 && styles.disabledCheckoutButton]}
              disabled={selectedItemsCount === 0}
              onPress={handleBuy}
            >
              <Text style={styles.checkoutButtonText}>Mua hàng</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  contentContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  selectAllContainer: {
    backgroundColor: COLORS.white,
    padding: 5,
    marginBottom: 8,
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30
  },
  selectAllText: {
    marginLeft: 8,
    fontSize: SIZES.medium,
    color: COLORS.dark,
  },
  cartList: {
    padding: 10,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  checkboxContainer: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    fontSize: 20,
    color: COLORS.primary,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartItemImage: {
    width: 70,
    height: 100,
    borderRadius: 6,
    backgroundColor: COLORS.lightGray,
  },
  cartItemDetails: {
    marginLeft: 12,
    flex: 1,
    justifyContent: 'center',
  },
  cartItemTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 4,
  },
  authorText: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  quantityContainer: {
    alignItems: 'center',
    marginLeft: 6,
  },
  quantityButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontSize: 16,
    color: COLORS.dark,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    minWidth: 35,
    textAlign: 'center',
  },
  quantityButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  summary: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  summaryTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
  },
  summaryPrice: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  disabledCheckoutButton: {
    backgroundColor: COLORS.gray,
  },
  checkoutButtonText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  emptyCartText: {
    fontSize: SIZES.large,
    color: COLORS.dark,
    marginBottom: 20,
  },
  shopNowButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  shopNowButtonText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: SIZES.medium,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  retryButtonText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
});

export default Cart;
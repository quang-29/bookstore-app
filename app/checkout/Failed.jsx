import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Failed = () => {
  return (
    <ImageBackground
      source={require('../../assets/images/back1.jpg')} // thay bằng ảnh của bạn
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View style={styles.box}>
        <Ionicons name="checkmark-circle" size={64} color="white" style={styles.icon} />

        <Text style={styles.title}>Đặt hàng không thành công. Bạn chưa thanh toán nên đơn hàng đang trong quá trình xử lí</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/home')}>
            <Text style={styles.buttonText}>Trang chủ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => router.push('/order/ListOrders')}>
            <Text style={styles.buttonText}>Đơn mua</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Failed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  icon: {
    marginBottom: 20,
    color: '#039be5'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#37474f',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#546e7a',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#039be5',
    fontWeight: '600',
    fontSize: 14,
  },
});

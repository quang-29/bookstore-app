import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Success = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View style={styles.box}>
        <Ionicons name="checkmark-circle" size={64} color="#E53935" style={styles.icon} />

        <Text style={styles.title}>Đặt hàng thành công</Text>
        <Text style={styles.subtitle}>
          Cùng BookTopias đồng hành cùng bạn trong những năm tháng tươi đẹp của cuộc đời bạn.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/home')}>
            <Text style={styles.buttonText}>Trang chủ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace('/order/ListOrders')}
          >
            <Text style={styles.buttonText}>Đơn mua</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Success;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4', // ✅ nền xám sáng nhẹ
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E53935', // đỏ cam hài hòa
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#616161', // xám đậm
    textAlign: 'center',
    marginBottom: 30,
  },

  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    backgroundColor: '#E53935', // cam đậm
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#FFFFFF', // vẫn tốt nếu nền cam
    fontWeight: '600',
    fontSize: 14,
  },

});

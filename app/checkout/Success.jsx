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
import { LinearGradient } from 'expo-linear-gradient';

const Success = () => {
  return (
    <LinearGradient colors={['#FFECEB', '#FFFFFF']} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View style={styles.card}>
        <Ionicons name="checkmark-circle-outline" size={84} color="#4CAF50" style={styles.icon} />

        <Text style={styles.title}>Đặt hàng thành công!</Text>
        <Text style={styles.subtitle}>
          Cảm ơn bạn đã tin tưởng BookTopias. Hãy cùng chúng tôi khám phá tri thức mỗi ngày!
        </Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.buttonPrimary} onPress={() => router.push('/home')}>
            <Text style={styles.buttonText}>Về trang chủ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonOutline}
            onPress={() => router.replace('/order/ListOrders')}
          >
            <Text style={styles.buttonOutlineText}>Xem đơn hàng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Success;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 24,
    marginHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#424242',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  buttonGroup: {
    width: '100%',
  },
  buttonPrimary: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonOutline: {
    borderColor: '#4CAF50',
    borderWidth: 1.5,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonOutlineText: {
    color: '#4CAF50',
    fontSize: 15,
    fontWeight: '600',
  },
});

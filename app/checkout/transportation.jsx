import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const Transportation = () => {
  const [selectedMethod, setSelectedMethod] = useState('express');

  const shippingMethods = [
    {
      id: 'express',
      title: 'Hỏa Tốc',
      description: 'Đảm bảo nhận hàng vào ngày mai',
      price: '₫50.000',
      icon: 'rocket-outline',
      time: '1 ngày',
      voucher: 'Voucher trị giá ₫15.000 nếu đơn hàng được giao đến bạn sau ngày 2 Tháng 4 2025'
    },
    {
      id: 'standard',
      title: 'Tiêu Chuẩn',
      description: 'Giao hàng trong 2-3 ngày',
      price: '₫30.000',
      icon: 'car-outline',
      time: '2-3 ngày'
    },
    {
      id: 'economy',
      title: 'Tiết Kiệm',
      description: 'Giao hàng trong 4-7 ngày',
      price: '₫15.000',
      icon: 'bicycle-outline',
      time: '4-7 ngày'
    }
  ];

  const handleSelectMethod = (methodId) => {
    setSelectedMethod(methodId);
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phương thức vận chuyển</Text>
      </View> */}

      <ScrollView style={styles.content}>
        {shippingMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodCard,
              selectedMethod === method.id && styles.selectedMethod
            ]}
            onPress={() => handleSelectMethod(method.id)}
          >
            <View style={styles.methodHeader}>
              <View style={styles.methodIconContainer}>
                <Ionicons name={method.icon} size={20} color={COLORS.primary} />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>{method.title}</Text>
                <Text style={styles.methodDescription}>{method.description}</Text>
              </View>
              <View style={styles.methodPrice}>
                <Text style={styles.priceText}>{method.price}</Text>
              </View>
            </View>

            <View style={styles.methodDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={14} color={COLORS.gray} />
                <Text style={styles.detailText}>Thời gian giao hàng: {method.time}</Text>
              </View>
              {method.voucher && (
                <View style={styles.detailRow}>
                  <Ionicons name="gift-outline" size={14} color={COLORS.gray} />
                  <Text style={styles.voucherText}>{method.voucher}</Text>
                </View>
              )}
            </View>

            {selectedMethod === method.id && (
              <View style={styles.selectedIndicator}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: SIZES.small,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  methodCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedMethod: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.offWhite,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  methodIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.offWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: SIZES.xSmall,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 2,
  },
  methodDescription: {
    fontSize: SIZES.xxSmall,
    color: COLORS.gray,
  },
  methodPrice: {
    marginLeft: 8,
  },
  priceText: {
    fontSize: SIZES.xSmall,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  methodDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: SIZES.xxSmall,
    color: COLORS.gray,
    marginLeft: 6,
  },
  voucherText: {
    fontSize: SIZES.xxSmall,
    color: COLORS.success,
    marginLeft: 6,
    flex: 1,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
});

export default Transportation; 
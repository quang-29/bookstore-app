import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter,Stack, useLocalSearchParams } from 'expo-router';
import { usePayment } from '../../context/PaymentContext';
import { Pressable } from 'react-native';
const Payment = () => {
  const { updateSelectedPaymentMethod, selectedPaymentMethod: contextPaymentMethod } = usePayment();
  const { selectedPaymentMethod: paramPaymentMethod } = useLocalSearchParams();
  const selected = contextPaymentMethod; 
  const router = useRouter();

  const paymentMethods = [
    {
      id: 'CASH',
      title: 'Thanh toán tiền mặt',
      description: 'Thanh toán khi nhận hàng',
      icon: 'cash-outline',
      details: 'Bạn sẽ thanh toán bằng tiền mặt khi nhận được hàng'
    },
    {
      id: 'VNPAY',
      title: 'VNPAY',
      description: 'Thanh toán qua VNPAY',
      icon: 'card-outline',
      details: 'Thanh toán an toàn và nhanh chóng qua VNPAY'
    }
  ];

  const handleSelectMethod = (method) => {
    updateSelectedPaymentMethod(method); // Update context and go back
  };

  return (
    <View style={styles.container}>

      <Stack.Screen
          options={{
            title: 'Phương thức thanh toán',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 12 }}>
                <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
              </Pressable>
            ),
        }}
        />
      <ScrollView style={styles.content}>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodCard,
              selected?.id === method.id && styles.selectedMethod 
            ]}
            onPress={() => handleSelectMethod(method)}
          >
            <View style={styles.methodHeader}>
              <View style={styles.methodIconContainer}>
                <Ionicons name={method.icon} size={20} color={COLORS.primary} />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>{method.title}</Text>
                <Text style={styles.methodDescription}>{method.description}</Text>
              </View>
            </View>

            <View style={styles.methodDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="information-circle-outline" size={14} color={COLORS.gray} />
                <Text style={styles.detailText}>{method.details}</Text>
              </View>
            </View>

            {selected?.id === method.id && ( // Use optional chaining
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
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
});

export default Payment;
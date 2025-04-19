import instance from '@/axios-instance';
import { tokenGHN } from '../../constants/tokenGHN';
import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { getUser, getToken } from '@/storage';
import { IP_CONFIG } from '@/config/ipconfig';
import { useAddress } from '@/context/AddressContext';
import { useAuth } from '@/context/AuthContext';

const ListAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const { user, token } = useAuth();
  const { setDefaultAddress } = useAddress();

  const formatToVietnamTime = (rawDate) => {
    const date = new Date(rawDate);
    const vietnamDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    return vietnamDate.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserAndAddresses = async () => {
        try {
          const response = await fetch(`http://${IP_CONFIG}:8080/api/address/${user.username}`, {
            method: 'GET',
            headers: {
              'token': `${tokenGHN}`,
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            Alert.alert('Lỗi khi gọi API: ' + response.status);
            return;
          }

          const json = await response.json();

          const sortedAddresses = json.data.sort((a, b) => {
            if (a.primary && !b.primary) return -1;
            if (!a.primary && b.primary) return 1;
            return 0;
          });

          setAddresses(sortedAddresses);
        } catch (error) {
          console.error('Lỗi khi fetch user hoặc address:', error);
        }
      };

      fetchUserAndAddresses();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.receiverName} - {item.phoneNumber}</Text>
        {item.primary && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Mặc định</Text>
          </View>
        )}
      </View>

      <Text style={styles.address}>
        {item.detail}
        {item.ward?.name ? ', ' + item.ward.name : ''}
        {item.district?.name ? ', ' + item.district.name : ''}
        {item.province?.name ? ', ' + item.province.name : ''}
      </Text>

      {item.updatedAt && (
        <Text style={styles.updatedAt}>Cập nhật: {formatToVietnamTime(item.updatedAt)}</Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => {
            setDefaultAddress(item);
            router.back();
          }}
        >
          <Text style={styles.editText}>Chọn</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn}>
          <Text style={styles.editText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {addresses.length === 0 ? (
        <Text style={styles.title}>Bạn chưa thiết lập địa chỉ nhận hàng nào</Text>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/checkout/Address')}
      >
        <Text style={styles.addText}>Thêm địa chỉ mới</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ListAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 12,
    textAlign: 'center',
    flex: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  badge: {
    backgroundColor: '#fce4ec',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#d81b60',
    fontSize: 12,
    fontWeight: '600',
  },
  address: {
    marginTop: 8,
    color: '#7f8c8d',
    fontSize: 14,
  },
  updatedAt: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 6,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  editBtn: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },
  editText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  addText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

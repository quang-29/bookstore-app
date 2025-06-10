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
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

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
        <TouchableOpacity style={styles.actionBtnBlue} onPress={() => {
          setDefaultAddress(item);
          router.back();
        }}>
          <Ionicons name="checkmark" size={16} color="#fff" />
          <Text style={styles.btnText}>Chọn</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtnGray} onPress={() => {
          router.push({ pathname: '/checkout/EditAddress', params: { id: item.id } });
        }}>
          <Ionicons name="create-outline" size={16} color="#fff" />
          <Text style={styles.btnText}>Sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtnRed} onPress={() => {
          Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa địa chỉ này?', [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Xóa', style: 'destructive', onPress: () => {/* gọi API xóa ở đây */} },
          ]);
        }}>
          <Ionicons name="trash-outline" size={16} color="#fff" />
          <Text style={styles.btnText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Danh sách địa chỉ</Text>
        </View>
        <View style={styles.rightPlaceholder} />
      </View>
      {addresses.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="location-outline" size={64} color="#bdc3c7" style={{ alignSelf: 'center'}} />
          <Text>Bạn chưa thiết lập địa chỉ nhận hàng nào</Text>
        </View>
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
    gap: 8,
  },
  actionBtnBlue: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 10,
  },
  actionBtnGray: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7f8c8d',
    borderRadius: 8,
    paddingVertical: 10,
  },
  actionBtnRed: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    paddingVertical: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    marginTop: 50,
  },
  backButton: {
    width: 40,
    alignItems: 'flex-start',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  rightPlaceholder: {
    width: 40,
  },
});
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import instance from '@/axios-instance';

const Setting = () => {
  const router = useRouter();
  const { user,setUser } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // Khởi tạo form từ user ban đầu
  useEffect(() => {
    setPhoneNumber(user?.phoneNumber || '');
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
    setEmail(user?.email || '');
  }, [user]);

  const handleSave = async () => {
    if (!email || !phoneNumber || !firstName || !lastName) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const formattedData = {
      id: user.userId,
      email,
      phoneNumber,
      firstName,
      lastName,
    };

    try {
      const response = await instance.put(`/api/user/editUser`, formattedData);
      if (response.data === true) {
            setUser({
              ...user,
              email,
              phoneNumber,
              firstName,
              lastName,
            });
            router.push('/(tabs)/profile');
        Alert.alert('Thành công', 'Cập nhật thông tin thành công!');
      } else {
        Alert.alert('Thất bại', 'Không thể cập nhật thông tin.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật thông tin!');
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cập nhật thông tin</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập họ"
            placeholderTextColor="#999"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên"
            placeholderTextColor="#999"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Setting;


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
    paddingVertical: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginTop: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#000',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
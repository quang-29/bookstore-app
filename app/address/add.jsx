import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { addressService } from '../../services/addressService';

const AddAddressScreen = () => {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    street: '',
    isDefault: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      fetchAddress();
    }
  }, [id]);

  const fetchAddress = async () => {
    try {
      setLoading(true);
      const address = await addressService.getAddressById(id);
      setFormData(address);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải thông tin địa chỉ. Vui lòng thử lại sau.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (!formData.province.trim()) {
      newErrors.province = 'Vui lòng chọn tỉnh/thành phố';
    }
    if (!formData.district.trim()) {
      newErrors.district = 'Vui lòng chọn quận/huyện';
    }
    if (!formData.ward.trim()) {
      newErrors.ward = 'Vui lòng chọn phường/xã';
    }
    if (!formData.street.trim()) {
      newErrors.street = 'Vui lòng nhập địa chỉ cụ thể';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      if (id) {
        await addressService.updateAddress(id, formData);
      } else {
        await addressService.createAddress(formData);
      }
      router.back();
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể lưu địa chỉ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{id ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Họ và tên</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Nhập họ và tên"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tỉnh/Thành phố</Text>
          <TextInput
            style={[styles.input, errors.province && styles.inputError]}
            value={formData.province}
            onChangeText={(text) => setFormData({ ...formData, province: text })}
            placeholder="Chọn tỉnh/thành phố"
          />
          {errors.province && <Text style={styles.errorText}>{errors.province}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Quận/Huyện</Text>
          <TextInput
            style={[styles.input, errors.district && styles.inputError]}
            value={formData.district}
            onChangeText={(text) => setFormData({ ...formData, district: text })}
            placeholder="Chọn quận/huyện"
          />
          {errors.district && <Text style={styles.errorText}>{errors.district}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phường/Xã</Text>
          <TextInput
            style={[styles.input, errors.ward && styles.inputError]}
            value={formData.ward}
            onChangeText={(text) => setFormData({ ...formData, ward: text })}
            placeholder="Chọn phường/xã"
          />
          {errors.ward && <Text style={styles.errorText}>{errors.ward}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Địa chỉ cụ thể</Text>
          <TextInput
            style={[styles.input, errors.street && styles.inputError]}
            value={formData.street}
            onChangeText={(text) => setFormData({ ...formData, street: text })}
            placeholder="Số nhà, tên đường"
          />
          {errors.street && <Text style={styles.errorText}>{errors.street}</Text>}
        </View>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
        >
          <View style={[styles.checkbox, formData.isDefault && styles.checkboxChecked]}>
            {formData.isDefault && <Ionicons name="checkmark" size={16} color="#fff" />}
          </View>
          <Text style={styles.checkboxLabel}>Đặt làm địa chỉ mặc định</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity
        style={[styles.saveButton, loading && styles.saveButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>
          {loading ? 'Đang lưu...' : 'Lưu địa chỉ'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddAddressScreen; 
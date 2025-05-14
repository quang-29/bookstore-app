import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import instance from '@/axios-instance';
import Loader from '@/components/Loader';

const EditBookScreen = () => {
  const { bookId } = useLocalSearchParams();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await instance.get(`/api/book/${bookId}`);
        setBook(res.data.data);
        console.log(res.data.data); 
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải dữ liệu sách.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [bookId]);

  const handleChange = (field, value) => {
    setBook({ ...book, [field]: value });
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await instance.put(`/api/book/updateBook/${bookId}`, {
        ...book,
        price: parseInt(book.price),
        page: parseInt(book.page),
        reprint: parseInt(book.reprint),
        stock: parseInt(book.stock),
        sold: parseInt(book.sold),
      });
      Alert.alert('Thành công', 'Đã cập nhật sách.');
      router.back(); // quay lại trang trước
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật sách.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !book) return <Loader isLoading={true} message="Đang tải dữ liệu..." />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Chỉnh sửa sách</Text>

      {[
        ['Tiêu đề', 'title'],
        ['Tác giả', 'author'],
        ['Mô tả', 'description'],
        ['Giá', 'price'],
        ['Nhà xuất bản', 'publisher'],
        ['Tái bản lần', 'reprint'],
        ['Tồn kho', 'stock'],
        ['Đã bán', 'sold'],
      ].map(([label, key]) => (
        <View key={key} style={styles.inputGroup}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={styles.input}
            value={String(book[key])}
            onChangeText={(text) => handleChange(key, text)}
            placeholder={label}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Lưu thay đổi</Text>
      </TouchableOpacity>

      <Loader isLoading={isLoading} message="Đang cập nhật..." />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 80,
    backgroundColor: '#f2f2f2',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    fontWeight: '600',
    color: '#555',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#FFA500',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditBookScreen;

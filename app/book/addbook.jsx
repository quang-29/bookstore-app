import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../../constants/theme';
import instance from '@/axios-instance';
import Loader from '@/components/Loader'; // ✅ Đảm bảo đường dẫn đúng

const AddBookScreen = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // ✅ loader state
  const [book, setBook] = useState({
    title: '',
    authorId: '',
    categoryId: '',
    price: '',
    isbn: '',
    language: '',
    page: '',
    publisher: '',
    reprint: '',
    stock: '',
    sold: '',
    description: '',
    imagePath: '',
    publishedDate: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await instance.get('/api/category/getAllCategories');
        if (response.data && response.data.data) {
          setCategories(response.data.data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        Alert.alert('Lỗi', 'Không thể tải danh sách thể loại.');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (field, value) => {
    setBook({ ...book, [field]: value });
  };

  const handleSubmit = async () => {
    setIsLoading(true); // ✅ bật loader
    try {
      await instance.post('/api/book/addBook', {
        ...book,
        price: parseInt(book.price),
        page: parseInt(book.page),
        reprint: parseInt(book.reprint),
        stock: parseInt(book.stock),
        sold: parseInt(book.sold),
        author: book.authorId,
        category: book.categoryId,
      });

      Alert.alert('Thành công', 'Đã thêm sách mới.');
      setBook({
        title: '',
        authorId: '',
        categoryId: '',
        price: '',
        isbn: '',
        language: '',
        page: '',
        publisher: '',
        reprint: '',
        stock: '',
        sold: '',
        description: '',
        imagePath: '',
        publishedDate: '',
      });
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm sách.');
      console.error(error);
    } finally {
      setIsLoading(false); // ✅ tắt loader
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Thêm Sách Mới</Text>

        {[
          ['Tiêu đề', 'title'],
          ['Tên tác giả', 'authorId'],
          ['Mô tả', 'description'],
          ['Giá', 'price'],
          ['ISBN', 'isbn'],
          ['Ngôn ngữ', 'language'],
          ['Số trang', 'page'],
          ['Nhà xuất bản', 'publisher'],
          ['Tái bản lần', 'reprint'],
          ['Số lượng tồn kho', 'stock'],
          ['Đã bán', 'sold'],
          ['Đường dẫn ảnh', 'imagePath'],
        ].map(([label, key]) => (
          <View key={key} style={styles.fieldWrapper}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              placeholder={label}
              value={book[key]}
              onChangeText={(text) => handleChange(key, text)}
              style={styles.input}
            />
          </View>
        ))}

        {/* Thể loại */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Thể loại</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={book.categoryId}
              onValueChange={(value) => handleChange('categoryId', value)}
              style={styles.picker}
            >
              <Picker.Item label="Chọn thể loại" value="" />
              {categories.map((category) => (
                <Picker.Item
                  key={category.id}
                  label={category.categoryName}
                  value={category.categoryName}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Ngày xuất bản */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Ngày xuất bản</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            value={book.publishedDate}
            onChangeText={(text) => handleChange('publishedDate', text)}
            style={styles.input}
          />
        </View>

        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Thêm sách</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ✅ Loader ở trên mọi thành phần */}
      <Loader isLoading={isLoading} message="Đang thêm sách..." />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.lightGray,
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.primary,
  },
  fieldWrapper: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    fontWeight: '600',
    color: COLORS.dark,
  },
  input: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 8,
  },
  pickerContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddBookScreen;

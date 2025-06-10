import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { COLORS } from '../../constants/theme';
import instance from '@/axios-instance';
import Loader from '@/components/Loader';
import { Stack, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const AddBookScreen = () => {
  const [open, setOpen] = useState(false);
  const [categoryItems, setCategoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await instance.get('/api/category/getAllCategories');
        if (response.data?.data) {
          const formatted = response.data.data.map((category) => ({
            label: category.categoryName,
            value: category.id,
          }));
          setCategoryItems(formatted);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        Alert.alert('Lỗi', 'Không thể tải danh sách thể loại.');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (field, value) => {
    setBook((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen
        options={{
          title: 'Thêm sách mới',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 12 }}>
              <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
            </Pressable>
          ),
        }}
      />

      <View style={{ zIndex: 1000, marginBottom: open ? 220 : 12, paddingHorizontal: 20, marginTop: 20 }}>
        <Text style={styles.label}>Thể loại</Text>
        <DropDownPicker
          open={open}
          setOpen={setOpen}
          items={categoryItems}
          setItems={setCategoryItems}
          value={book.categoryId}
          setValue={(callback) =>
            setBook((prev) => ({ ...prev, categoryId: callback(prev.categoryId) }))
          }
          placeholder="Chọn thể loại"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />
      </View>

      <KeyboardAwareScrollView
        style={[styles.container]}
        extraScrollHeight={100}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
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
      </KeyboardAwareScrollView>

      <Loader isLoading={isLoading} message="Đang thêm sách..." />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: COLORS.lightGray,
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
  dropdown: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray,
    minHeight: 50,
    zIndex: 1000,
  },
  dropdownContainer: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray,
    zIndex: 1000,
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

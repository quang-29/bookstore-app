import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl
} from "react-native";
import { COLORS, SIZES } from "../../constants/theme";
import colors from "@/constants/colors";
import instance from "@/axios-instance";

import SearchBar from "@/components/SearchBar";
import BookSlider from "../../components/BookSlider";
import Category from "../../components/Category";
import BookList from "../../components/BookList";
import Loader from "@/components/Loader";

const Home = () => {
  const [query, setQuery] = useState("");
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true); // loader toàn màn
  const [refreshing, setRefreshing] = useState(false); // kiểm soát kéo xuống

  // HÀM FETCH DÙNG CHUNG
  const fetchBestSellers = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/api/book/upSaleBook");
      if (response.data && response.data.content) {
        setBestSellers(response.data.content);
      } else {
        setBestSellers([]);
      }
    } catch (err) {
      console.error("Error fetching best sellers:", err);
      Alert.alert("Lỗi", "Không thể tải danh sách Best Sellers");
    } finally {
      setLoading(false);
      setRefreshing(false); // khi kéo xuống xong thì dừng refresh
    }
  };

  // GỌI KHI LOAD LẦN ĐẦU
  useEffect(() => {
    fetchBestSellers();
  }, []);

  // HÀM GỌI KHI KÉO XUỐNG
  const onRefresh = () => {
    setRefreshing(true);  // để RefreshControl biết là đang refresh
    fetchBestSellers();   // loader sẽ hiển thị
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="transparent"
            colors={["transparent"]}
            progressBackgroundColor="transparent"
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Find Books</Text>
          <Text style={styles.subtitle}>Find your place you belong</Text>
        </View>

        <SearchBar />
        <BookSlider />
        <Category />
        <BookList books={bestSellers} />
      </ScrollView>

      <Loader isLoading={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
});

export default Home;


import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { COLORS, SIZES } from "../../constants/theme";
import colors from "@/constants/colors";
import instance from "@/axios-instance";

import SearchBar from "@/components/SearchBar";
import BookSlider from "../../components/BookSlider";
import Category from "../../components/Category";
import BookList from "../../components/BookList";
import Loader from "@/components/Loader";

import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

const Home = () => {
  const [query, setQuery] = useState("");
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();

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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBestSellers();
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
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.greeting}>Find Books</Text>
              <Text style={styles.subtitle}>Find your place you belong</Text>
            </View>

            <TouchableOpacity onPress={() => router.push("/chat")}>
              <Feather name="message-circle" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
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
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

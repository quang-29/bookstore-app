import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, TouchableOpacity, Alert, StyleSheet, TextInput, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../constants/theme";
import Welcome from "../../components/Welcome";
import FormatMoney from "../../components/FormatMoney";
import { router } from "expo-router";
// import { useGlobalContext } from "../../context/GlobalProvider";
import Carousel from "../../components/Carousel";
import BookCard from "../../components/BookCard";
import { getBookUpSale } from "../../services/book/getBookUpSale";

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState(""); 
  const [bestSellers, setBestSellers] = useState([]); 
  // const { user } = useGlobalContext();

  
  useEffect(() => {
    const fetchBestSellers = async () => {
      const data = await getBookUpSale();
      if (data) {
        setBestSellers(data); 
      } else {
        console.error("Không thể lấy dữ liệu sách bán chạy");
      }
    };

    fetchBestSellers();
  }, []); 

  const handleSearch = () => {
    if (query === "") {
      return Alert.alert(
        "Missing Query",
        "Please input something to search results across database"
      );
    }
    console.log("Searching for:", query);
  };

  const handleBookPress = (book) => {
    router.push({
      pathname: "bookDetails",
      params: { bookId: book.id, bookTitle: book.title, bookImage: book.image }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.appBarWrapper}>
          <View style={styles.appBar}>
            <Ionicons name="location-outline" size={26} color={COLORS.dark} />
            <Text style={styles.locationText}>Hà Nội</Text>
            <View style={styles.cartWrapper}>
              <View style={styles.cartAccount}>
                <View style={styles.cartNumber}>
                  <Text style={styles.cartText}>8</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => router.push("cart")}>
                <Ionicons name="cart-outline" size={26} color={COLORS.dark} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Welcome />
        <Carousel />
        <View style={styles.bestSellerSection}>
          <Text style={styles.sectionTitle}>Sách bán chạy gần đây</Text>
          {/* Hiển thị BookCard với dữ liệu sách bán chạy */}
          <BookCard books={bestSellers} />
        </View>
        <View style={styles.bestSellerSection}>
          <Text style={styles.sectionTitle}>Truyện ngắn</Text>
          <BookCard books={bestSellers}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.lightGray,
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  appBarWrapper: {
    marginHorizontal: 20,
    marginTop: SIZES.small,
  },
  appBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationText: {
    fontSize: 18,
    color: COLORS.dark,
  },
  cartWrapper: {
    alignItems: "flex-end",
  },
  cartAccount: {
    position: "absolute",
    borderRadius: 12,
    height: 18,
    width: 18,
    backgroundColor: COLORS.primary,
    bottom: 16,
    right: -4,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionPrice: {
    color: COLORS.red,
    fontWeight: "bold",
    marginTop: 5,
  },
  cartNumber: {
    fontFamily: "regular",
    fontWeight: "600",
    fontSize: 12,
    color: COLORS.white,
    textAlign: "center",
  },
  cartText: {
    color: COLORS.white,
  },
  bestSellerSection: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 10,
  },
  bookContainer: {
    marginRight: 10,
    alignItems: "center",
    width: 150,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookImage: {
    width: 130,
    height: 180,
    borderRadius: 8,
  },
  bookTitle: {
    marginTop: 5,
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
});

export default Home;

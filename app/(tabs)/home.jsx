import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, TouchableOpacity, Alert, StyleSheet, TextInput, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../constants/theme";
import Welcome from "../../components/Welcome";
import FormatMoney from "../../components/FormatMoney";
import { router } from "expo-router";
import BookCard from "../../components/BookCard";
import { getBookUpSale } from "../../services/book/getBookUpSale";
import Category from "../../components/Category";
import BookSlider from "../../components/BookSlider";
import BestSellers from "@/components/BookList";
import BookLayout from "../book/_layout";
import BookList from "../../components/BookList";
import instance from "@/axios-instance"; 
import VerticalBookList from "@/components/VerticalBookList";
import Search from "./search";
import SearchBar from "@/components/SearchBar";
import colors from "@/constants/colors";

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState(""); 
  const [bestSellers, setBestSellers] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
      const fetchBestSellers = async () => {
        try {
          setLoading(true);
          const response = await instance.get('/api/book/upSaleBook');
          if (response.data && response.data.content) {
            setBestSellers(response.data.content);
            console.log("Best Sellers:", response.data.content);
          } else {
            setBestSellers([]);
          }
        } catch (err) {
          console.error('Error fetching best sellers:', err);
          setError('Không thể tải danh sách Best Sellers');
        } finally {
          setLoading(false);
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
        {/* <View style={styles.appBarWrapper}>
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
        </View> */}
        {/* <Welcome /> */}

        <View style={styles.header}>
          <Text style={styles.greeting}>Find Books</Text>
          <Text style={styles.subtitle}>Find your place you belong</Text>
        </View>
        <SearchBar />
        <BookSlider />
        <Category />
        <BookList books={bestSellers} />
        
        
      </ScrollView>
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
  appBarWrapper: {
    marginTop: SIZES.small,
    paddingHorizontal: 4,
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
    zIndex: 999,
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
  bestSellerSection: {
    
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

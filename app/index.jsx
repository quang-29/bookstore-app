import { StatusBar } from "expo-status-bar";
import { Redirect, useRouter } from "expo-router";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import { useAuth } from "../context/AuthContext";
import Loader from "@/components/Loader";
// import { useGlobalContext } from "../context/GlobalProvider";

const Welcome = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <Image source={images.logo5} style={styles.logo} resizeMode="contain" />

          <Image source={images.card2} style={styles.cards} resizeMode="cover" />

          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Khám phá những khả năng bất tận
              trong những trang sách với{" "}
              <Text style={styles.highlight}>Bookophile</Text>
            </Text>

            <Image source={images.path} style={styles.path} resizeMode="contain" />
          </View>

          <Text style={styles.subtitle}>
            Mỗi Trang Sách – Một Hành Trình: Đồng Hành Cùng Bạn 
          </Text>

          <TouchableOpacity style={styles.button} onPress={() => router.push("/sign-in")}>
            <Text style={styles.buttonText}>Tiếp tục với đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#161622", 
    flex: 1,
  },
  scrollContainer: {
    height: "100%",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  logo: {
    width: 200,
    height: 84,
  },
  cards: {
  width: "100%",
  maxWidth: 380,
  height: 298,
  borderRadius: 60,
  borderWidth: 2,            
  borderColor: "#ffffff",   
},

  textContainer: {
    position: "relative",
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  highlight: {
    color: "#FFA500", // text-secondary-200
  },
  path: {
    width: 136,
    height: 15,
    position: "absolute",
    bottom: -8,
    right: -32,
  },
  subtitle: {
    fontSize: 14,
    color: "#9CA3AF", // text-gray-100
    textAlign: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#FFA500", // Màu thay thế cho bg-secondary
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default Welcome;

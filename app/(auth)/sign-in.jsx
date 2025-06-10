import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Alert,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS, images } from "../../constants";
import instance from "@/axios-instance";
import { IP_CONFIG } from "../../config/ipconfig";
import { storeToken, storeUser } from "../../storage";
import { useAuth } from "../../context/AuthContext";
import Loader from "@/components/Loader"; 

const SignIn = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  // const submit = async () => {
  //   if (!form.username || !form.password) {
  //     Alert.alert("Lỗi", "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
  //     return;
  //   }
  
  //   setIsSubmitting(true);
  //   try {
  //     const response = await instance.post(
  //       `http://${IP_CONFIG}:8080/api/auth/login`,
  //       {
  //         username: form.username,
  //         password: form.password,
  //       }
  //     );
  
  //     const token = response.data?.data?.token;
  //     if (!token) {
  //       Alert.alert("Lỗi đăng nhập", response.data.message || "Sai tài khoản hoặc mật khẩu.");
  //       return;
  //     }
  
  //     await storeToken(token);
  
  //     const userResponse = await instance.get("api/user/myInfo");
  //     const userInfo = userResponse.data?.data;
  
  //     if (!userInfo) {
  //       Alert.alert("Lỗi", "Không thể lấy thông tin người dùng");
  //       return;
  //     }
  
  //     await storeUser(userInfo);
  //     await login(userInfo, token);
  //     console.log("Đăng nhập thành công", userInfo);
  //     setIsSubmitting(false);

  //     if (userInfo.roles === 'ADMIN') {
  //     router.replace("/dashboard"); 
  //   } else {
  //     router.replace("/home"); 
  //   }
  //   } catch (error) {
  //     if (error.code === "ECONNABORTED") {
  //       Alert.alert("Lỗi mạng", "Kết nối đến máy chủ bị timeout, vui lòng thử lại.");
  //     } else if (error.response) {
  //       Alert.alert("Lỗi đăng nhập", error.response.data.message || "Sai tài khoản hoặc mật khẩu.");
  //     } else {
  //       Alert.alert("Lỗi", error?.message || "Có lỗi xảy ra khi gọi API");
  //     }
  //   }
  // };

  const submit = async () => {
  if (!form.username || !form.password) {
    Alert.alert("Lỗi", "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
    return;
  }

  setIsSubmitting(true);

  try {
    const response = await instance.post(
      `http://${IP_CONFIG}:8080/api/auth/login`,
      {
        username: form.username,
        password: form.password,
      }
    );

    const token = response.data?.data?.token;

    if (!token) {
      Alert.alert("Lỗi đăng nhập", response.data.message || "Sai tài khoản hoặc mật khẩu.");
      return;
    }

    await storeToken(token);

    const userResponse = await instance.get("api/user/myInfo");
    const userInfo = userResponse.data?.data;

    if (!userInfo) {
      Alert.alert("Lỗi", "Không thể lấy thông tin người dùng");
      return;
    }

    await storeUser(userInfo);
    await login(userInfo, token);

    console.log("Đăng nhập thành công", userInfo);

    if (userInfo.roles === 'ADMIN') {
      router.replace("/dashboard"); 
    } else {
      router.replace("/home"); 
    }
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      Alert.alert("Lỗi mạng", "Kết nối đến máy chủ bị timeout, vui lòng thử lại.");
    } else if (error.response) {
      Alert.alert("Lỗi đăng nhập", error.response.data.message || "Sai tài khoản hoặc mật khẩu.");
    } else {
      Alert.alert("Lỗi", error?.message || "Có lỗi xảy ra khi gọi API");
    }
  } finally {
    setIsSubmitting(false); 
  }
};

  
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.innerContainer}>
          <Image
            source={images.logo5}
            resizeMode="contain"
            style={styles.logo}
          />
          <Text style={styles.title}>Đăng nhập</Text>

          <TextInput
            placeholder="Username"
            placeholderTextColor="#999"
            value={form.username}
            onChangeText={(text) => setForm({ ...form, username: text })}
            style={styles.input}
          />

          <TextInput
            placeholder="Mật khẩu"
            placeholderTextColor="#999"
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
            style={styles.input}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={submit}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Link href="/change-password">
              <Text style={styles.forgetPassword}>Quên mật khẩu?</Text>
            </Link>
          </View>

          <View style={styles.signUpContainer}>
            <Text style={styles.text}>Bạn chưa có tài khoản? </Text>
            <Link href="/sign-up">
              <Text style={styles.link}>Đăng ký</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
      <Loader isLoading={isSubmitting} message="Đang đăng nhập..." />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1F2937",
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    marginTop: 24,
    minHeight: Dimensions.get("window").height - 200,
  },
  logo: {
    width: 200,
    height: 84,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
    marginTop: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#374151",
    color: "#fff",
    padding: 18,
    borderRadius: 8,
    marginTop: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#FFA500",
    padding: 18,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  text: {
    color: "#9CA3AF",
    fontSize: 16,
  },
  link: {
    color: "#FFA500",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
  },
  forgetPassword: {
    color: COLORS.red,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SignIn;

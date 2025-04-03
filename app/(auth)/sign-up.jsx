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
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { images } from "../../constants";
import { IP_CONFIG } from "../../config/ipconfig"; 
const SignUp = () => {
  const router = useRouter();

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      // Gọi API đăng ký người dùng
      const response = await fetch(`http://${IP_CONFIG}:8080/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Account created successfully!");
        router.replace("/sign-in");
      } else {
        Alert.alert("Registration Error", data.message || "Something went wrong.");
      }
    } catch (error) {
      Alert.alert("Registration Error", "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.innerContainer}>
          <Image source={images.logo} resizeMode="contain" style={styles.logo} />

          <Text style={styles.title}>Đăng ký</Text>

          <TextInput
            placeholder="Username"
            placeholderTextColor="#999"
            value={form.username}
            onChangeText={(text) => setForm({ ...form, username: text })}
            style={styles.input}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
            style={styles.input}
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Mật khẩu"
            placeholderTextColor="#999"
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
            style={styles.input}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={submit} disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Đăng ký</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signInContainer}>
            <Text style={styles.text}>Bạn đã có tài khoản? </Text>
            <Link href="/sign-in">
              <Text style={styles.link}>Đăng nhập</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1F2937", // bg-primary
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
    width: 115,
    height: 34,
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
    backgroundColor: "#FFA500", // Thay thế bg-secondary
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
  signInContainer: {
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
});

export default SignUp;

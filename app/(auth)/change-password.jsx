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
import instance from "@/axios-instance";

const changePassword = () => {
    const router = useRouter();

    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const submit = async () => {
        if (!form.username || !form.email || !form.password) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        setSubmitting(true);
        try {
            const response = await instance.post("/api/auth/register", {
                username: form.username,
                email: form.email,
                password: form.password,
            });

            Alert.alert("Thành công", "Tạo tài khoản thành công!");
            router.replace("/sign-in");

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
            Alert.alert("Lỗi đăng ký", errorMessage);
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.innerContainer}>
                    <Image source={images.logo5} resizeMode="contain" style={styles.logo} />

                    <Text style={styles.title}>Đổi mật khẩu</Text>

                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#999"
                        value={form.username}
                        onChangeText={(text) => setForm({ ...form, username: text })}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Nhập mật khẩu mới"
                        placeholderTextColor="#999"
                        value={form.email}
                        onChangeText={(text) => setForm({ ...form, email: text })}
                        style={styles.input}
                        keyboardType="email-address"
                    />

                    <TextInput
                        placeholder="Nhập lại mật khẩu mới"
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
                            <Text style={styles.buttonText}>Đổi mật khẩu</Text>
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
export default changePassword

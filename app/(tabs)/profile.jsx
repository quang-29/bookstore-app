import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../constants/theme";
// import { useGlobalContext } from "../../context/GlobalProvider";
import axios from "axios";
import { router } from "expo-router";
import { IP_CONFIG } from "../../config/ipconfig";
import { getUser,getToken } from "../../storage"; 
import instance from "../../axios-instance";
import { useState,useEffect } from "react"; // Import axios instance

const Profile = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = await getUser();
      const storedToken = await getToken();
      setUser(storedUser);
      setToken(storedToken);
      console.log("Fetched user:", storedUser);
      console.log("Fetched token:", storedToken);
    };
    fetchData();
  }, []);

  const handleSignOut = async () => {
    try {
      const response = await instance.post("api/auth/logOut");
      if (response.data.code == 200) {
        console.log("Đăng xuất thành công");
        setToken("");
        setUser(null);
        // setIsLogin(false); // <-- XÓA dòng này nếu không dùng useGlobalContext
        router.replace("/sign-in");
      } else {
        console.log("Lỗi khi đăng xuất");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API đăng xuất:", error);
    }
  };
  const handleEditProfile = () => {
    router.push("/editProfile");  
  };

  const handleStats = () => {};

  const handleSettings = () => {};

  const handleInvite = () => {};

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Đang tải thông tin người dùng...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://res.cloudinary.com/dmotq51fh/image/upload/v1732507913/samples/cup-on-a-table.jpg",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      {/* Các phần còn lại giữ nguyên */}

      {/* Order Status Section */}
      <View style={styles.orderStatusContainer}>
        <Text style={styles.orderStatusTitle}>Đơn mua</Text>
        <View style={styles.orderStatusRow}>
          <View style={styles.orderStatusItem}>
            <Ionicons name="mail-outline" size={30} color={COLORS.primary} />
            <Text style={styles.orderStatusText}>Chờ xác nhận</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          </View>
          <View style={styles.orderStatusItem}>
            <Ionicons name="cube-outline" size={30} color={COLORS.primary} />
            <Text style={styles.orderStatusText}>Chờ lấy hàng</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          </View>
          <View style={styles.orderStatusItem}>
            <Ionicons name="car-outline" size={30} color={COLORS.primary} />
            <Text style={styles.orderStatusText}>Chờ giao hàng</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>5</Text>
            </View>
          </View>
          <View style={styles.orderStatusItem}>
            <Ionicons name="star-outline" size={30} color={COLORS.primary} />
            <Text style={styles.orderStatusText}>Đánh giá</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>14</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
          <Ionicons name="pencil-outline" size={20} color={COLORS.primary} />
          <Text style={styles.buttonText}>Edit Profile</Text>
          <Ionicons name="chevron-forward-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleStats}>
          <Ionicons name="stats-chart-outline" size={20} color={COLORS.primary} />
          <Text style={styles.buttonText}>My Stats</Text>
          <Ionicons name="chevron-forward-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSettings}>
          <Ionicons name="settings-outline" size={20} color={COLORS.primary} />
          <Text style={styles.buttonText}>Settings</Text>
          <Ionicons name="chevron-forward-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleInvite}>
          <Ionicons name="person-add-outline" size={20} color={COLORS.primary} />
          <Text style={styles.buttonText}>Invite a Friend</Text>
          <Ionicons name="chevron-forward-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.primary} />
          <Text style={styles.buttonText}>Log Out</Text>
          <Ionicons name="chevron-forward-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.lightGray,
    marginTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  email: {
    fontSize: 16,
    color: COLORS.dark,
    marginBottom: 20,
  },
  topIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  iconButton: {
    padding: 10,
  },
  orderStatusContainer: {
    marginBottom: 20,
  },
  orderStatusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  orderStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderStatusItem: {
    alignItems: "center",
  },
  orderStatusText: {
    fontSize: 12,
    color: COLORS.dark,
    marginTop: 5,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: COLORS.red,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 5,
    shadowColor: COLORS.dark,
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    color: COLORS.dark,
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1,
  },
});

export default Profile;

import React from "react";
import { View, ActivityIndicator, Text, Platform, StyleSheet } from "react-native";

const Loader = ({ isLoading, message = "Đang tải dữ liệu..." }) => {
  const osName = Platform.OS;

  if (!isLoading) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.loaderBox}>
        <ActivityIndicator
          animating={isLoading}
          color="#FFA500"
          size={osName === "ios" ? "large" : 60}
          style={styles.spinner}
        />
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999, // cao hơn để luôn nổi trên tất cả
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderBox: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  spinner: {
    marginBottom: 12,
  },
  text: {
    fontSize: 13,
    color: "#FFA500",
    fontWeight: "600",
  },
});

export default Loader;

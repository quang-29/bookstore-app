import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs } from "expo-router";
import { Image, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { icons } from "../../constants";
import { Loader } from "../../components";
import { useState, useEffect } from "react";
import { COLORS, SIZES } from '../../constants/theme';

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View style={styles.tabContainer}>
      <Image source={icon} resizeMode="contain" style={[styles.icon, { tintColor: color }]} />
      <Text style={[styles.tabText, { color, fontWeight: focused ? "600" : "400" }]}>
        {name}
      </Text>
    </View>
  );
};

const TabLayout = () => {
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setIsLogged(true);
    }, 2000);
  }, []);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.home} color={color} name="Home" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.search} color={color} name="Search" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Giỏ hàng",
            headerShown: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => window.history.back()} style={styles.backButton}>
                <Text style={styles.backText}>Quay lại</Text>
              </TouchableOpacity>
            ),
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.cartpro} color={color} name="Cart" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="order"
          options={{
            title: "Đơn hàng",
            headerShown: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => window.history.back()} style={styles.backButton}>
                <Text style={styles.backText}>Quay lại</Text>
              </TouchableOpacity>
            ),
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.plus} color={color} name="Order" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.profile} color={color} name="Profile" focused={focused} />
            ),
          }}
        />
      </Tabs>
      <Loader isLoading={loading} />
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
  tabText: {
    fontSize: 9,
  },
  tabBar: {
    backgroundColor: "#161622",
    borderTopWidth: 1,
    borderTopColor: "#232533",
    height: 70,
  },
  backButton: {
    marginLeft: 15,
  },
  backText: {
    fontSize: 18,
    color: COLORS.primary,
  },
});

export default TabLayout;
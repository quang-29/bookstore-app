import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs } from "expo-router";
import { Image, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { icons } from "../../constants";
import { Loader } from "../../components";
import { useState, useEffect } from "react";
import { COLORS, SIZES } from '../../constants/theme';
import { useCart } from '../../context/CartContext';

const TabIcon = ({ icon, color, name, focused, badgeCount }) => {
  return (
    <View style={styles.tabContainer}>
      <View>
        <Image source={icon} resizeMode="contain" style={[styles.icon, { tintColor: color }]} />
        {badgeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeCount}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.tabText, { color }]}>
        {name}
      </Text>

    </View>
  );
};

const TabLayout = () => {
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const { totalItems, refreshCart } = useCart();

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
          name="chat"
          options={{
            title: "Chat",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.chat} color={color} name="Chat" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Giỏ hàng",
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.cartpro}
                color={color}
                name="Cart"
                focused={focused}
                badgeCount={totalItems}
              />
            ),
          }}
          listeners={{
            tabPress: () => {
              refreshCart();
            },
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
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default TabLayout;
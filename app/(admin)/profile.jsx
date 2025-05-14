import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import Button from '@/components/Button';
import Loader from '@/components/Loader'; 
import {
  User,
  ShoppingBag,
  Heart,
  CreditCard,
  MapPin,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Settings
} from 'lucide-react-native';
import { useAddress } from '@/context/AddressContext';
import { useAuth } from '@/context/AuthContext';

const profileSections = [
  
  {
    title: 'Preferences',
    items: [
      { icon: Bell, label: 'Notifications', route: '/notifications' },
      { icon: Settings, label: 'Settings', route: '/settings' },
    ]
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help Center', route: '/help' },
    ]
  }
];

export default function ProfileScreen() {
  const router = useRouter();
  const { setDefaultAddress } = useAddress();
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false); // ✅ thêm state loader

  const isLoggedIn = !!user;

  const handleLogout = async () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn chắc chắn muốn đăng xuất?',
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);              
            await logout();                  
            setTimeout(() => {
              setIsLoading(false);          
              router.replace('/sign-in');   
            }, 2000);
          }
        }
      ]
    );
  };

  const navigateTo = (route) => {
    if (isLoggedIn) {
      router.push(route);
    } else {
      Alert.alert(
        'Cần đăng nhập',
        'Vui lòng đăng nhập để tiếp tục.',
        [
          { text: 'Huỷ', style: 'cancel' },
          { text: 'Đăng nhập', onPress: () => router.push('/sign-in') }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <User size={40} color={colors.white} />
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.username}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>

        {profileSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <Pressable
                key={itemIndex}
                style={styles.menuItem}
                onPress={() => navigateTo(item.route)}
              >
                <View style={styles.menuItemLeft}>
                  <item.icon size={20} color={colors.primary} />
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                </View>
                <ChevronRight size={20} color={colors.gray[400]} />
              </Pressable>
            ))}
          </View>
        ))}

        {isLoggedIn && (
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={colors.error} />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </Pressable>
        )}
      </ScrollView>
      <Loader isLoading={isLoading} message="Đang đăng xuất..." />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.textLight,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemLabel: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    color: colors.error,
    marginLeft: 12,
  },
  version: {
    fontSize: 12,
    color: colors.gray[400],
    textAlign: 'center',
    marginTop: 24,
  },
});

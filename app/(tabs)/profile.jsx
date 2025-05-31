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
import { Feather, Ionicons } from '@expo/vector-icons';
import colors from '@/constants/colors';
import Button from '@/components/Button';
import Loader from '@/components/Loader';
import { useAddress } from '@/context/AddressContext';
import { useAuth } from '@/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import instance from '@/axios-instance';



const profileSections = [
  {
    title: 'Account',
    items: [
      { icon: 'shopping-bag', label: 'Orders', route: '/order/ListOrders' },
      { icon: 'heart', label: 'Wishlist', route: '/wishlist/WishList' },
      { icon: 'credit-card', label: 'Payment Methods', route: '/payment-methods' },
      { icon: 'map-pin', label: 'Addresses', route: '/checkout/ListAddress' },
      { icon: 'star', label: 'Reviews', route: '/rating/AllRating' },
    ]
  },
  {
    title: 'Preferences',
    items: [
      { icon: 'bell', label: 'Notifications', route: '/notifications' },
      { icon: 'settings', label: 'Settings', route: '/settings/SettingScreen' },
    ]
  },
  {
    title: 'Support',
    items: [
      { icon: 'help-circle', label: 'Help Center', route: '/help' },
    ]
  }
];



export default function ProfileScreen() {
  const router = useRouter();
  const { setDefaultAddress } = useAddress();
  const { user, logout, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
 

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

const handleChangeAvatar = async () => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    Alert.alert('Quyền bị từ chối', 'Bạn cần cấp quyền truy cập thư viện ảnh để đổi ảnh đại diện.');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    const image = result.assets[0];

    const formData = new FormData();
    formData.append('file', {
      uri: image.uri,
      name: 'avatar.jpg',
      type: 'image/jpeg',
    });

    try {
      setIsLoading(true);
      const response = await instance.put(
        `/api/user/changeAvatar/${user.userId}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success === true) {
        const imageUrl = response.data.url;
        console.log(imageUrl);
        setUser({
          ...user,
          avatarUrl: imageUrl,
        });
      } else {
        Alert.alert('Thất bại', 'Không thể thay đổi ảnh đại diện.');
      }
    } catch (error) {
      console.error('Lỗi upload ảnh:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi thay đổi ảnh đại diện.');
    } finally {
      setIsLoading(false);
      Alert.alert('Thành công', 'Ảnh đại diện đã được cập nhật thành công.');
    }
  }
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
                <Image
                  source={{
                    uri: user?.avatarUrl
                      ? user.avatarUrl
                      : 'https://res.cloudinary.com/daxt0vwoc/image/upload/v1740297885/User-avatar.svg_nihuye.png',
                  }}
                  style={styles.avatar}
                />

                <Pressable style={styles.editIcon} onPress={handleChangeAvatar}>
                  <Feather name="camera" size={20} color="#fff" />
                </Pressable>
              </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.username}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
          <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="settings-outline" size={24} color={colors.gray[400]} onPress={() => router.push('/settings/SettingScreen')} />
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
                  <Feather name={item.icon} size={20} color={colors.primary} />
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                </View>
                <Feather name="chevron-right" size={20} color={colors.gray[400]} />
              </Pressable>
            ))}
          </View>
        ))}

        {isLoggedIn && (
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Feather name="log-out" size={20} color={colors.error} />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </Pressable>
        )}
      </ScrollView>
      <Loader isLoading={isLoading} message="Đang xử lí..." />
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
  editIcon: {
  position: 'absolute',
  bottom: 2,
  right: 5,
  backgroundColor: colors.primary,
  borderRadius: 12,
  padding: 4,
},

});

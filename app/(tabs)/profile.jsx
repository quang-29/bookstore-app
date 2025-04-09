import React, { useEffect,useState } from 'react';
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
// import { useUserStore } from '@/store/user-store';
import Button from '@/components/Button';
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
import { getUser } from '@/storage';
import { clearStorage  } from '@/storage';

const profileSections = [
  {
    title: 'Account',
    items: [
      { icon: ShoppingBag, label: 'Orders', route: '/orders' },
      { icon: Heart, label: 'Wishlist', route: '/wishlist' },
      { icon: CreditCard, label: 'Payment Methods', route: '/payment-methods' },
      { icon: MapPin, label: 'Addresses', route: '/addresses' },
    ]
  },
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
  const [user, setUser] = useState("");
  // const user = {
  //   name: 'Quang Minh',
  //   email: 'vquangn2990@gmail.com'
  // }
  const isLoggedIn = true; 
  const handleLogin = () => {
    // router.push('/auth/login');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        if (userData) {
          setUser(userData);
          console.log('User data:', userData);
        } else {
          console.log('No user data found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            clearStorage(); 
            setUser(null); 
            router.push('/sign-in'); 
          }
        }
      ]
    );
  };

  const navigateTo = (route) => {
    if (isLoggedIn) {
      if (route === '/wishlist') {
        router.push('/wishlist');
      } else {
        router.push(route);
      }
    } else {
      Alert.alert(
        'Sign In Required',
        'Please sign in to access this feature',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: handleLogin }
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
              <Image
                source={{ uri: user.avatar }}
                style={styles.avatar}
              />
            ) : (
              <User size={40} color={colors.white} />
            )}
          </View>
          <View style={styles.profileInfo}>
              <>
                <Text style={styles.name}>{user?.username}</Text>
                <Text style={styles.email}>{user?.email}</Text>
              </>
          </View>
        </View>

        {/* {!isLoggedIn && (
          <View style={styles.authButtons}>
            <Button
              title="Sign In"
              onPress={handleLogin}
              style={styles.signInButton}
            />
            <Button
              title="Create Account"
              variant="outline"
              onPress={() => router.push('/auth/register')}
              style={styles.registerButton}
            />
          </View>
        )} */}

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
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        )}

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
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
  authButtons: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  signInButton: {
    flex: 1,
  },
  registerButton: {
    flex: 1,
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

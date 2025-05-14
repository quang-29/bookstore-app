import React, { useEffect } from 'react';
import { Alert, AppState, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';

const DeeplinkHandler = () => {
  const router = useRouter();

  useEffect(() => {
    const handleOpenURL = (event) => {
      console.log('Deeplink URL:', event.url);
      const { path, queryParams } = Linking.parse(event.url);

      if (path === 'payment/success') {
        const { orderId } = queryParams;
        console.log('Thanh toán thành công, Order ID:', orderId);
        Alert.alert('Thành công', `Thanh toán thành công với Order ID: ${orderId}`);
        setTimeout(() => {
          router.push('/checkout/Success');
        }, 1000);
      } else if (path === 'payment/failed') {
        const { orderId } = queryParams;
        console.log('Thanh toán thất bại, Order ID:', orderId);
        Alert.alert('Lỗi', `Thanh toán thất bại với Order ID: ${orderId}`);
        setTimeout(() => {
          router.push('/checkout/Failed');
        }, 1000);
      }
    };

    // Lắng nghe sự kiện khi ứng dụng được mở bằng một URL
    const subscription = Linking.addEventListener('url', handleOpenURL);

    // Kiểm tra URL ban đầu khi ứng dụng được mở lần đầu (nếu có)
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('Initial URL:', url);
        handleOpenURL({ url });
      }
    }).catch(err => console.error('Lỗi khi lấy initial URL:', err));

    // Xử lý khi ứng dụng chuyển từ background sang foreground
    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      console.log('AppState changed to:', nextAppState);
      if (nextAppState === 'active') {
        Linking.getInitialURL().then((url) => {
          if (url) {
            console.log('URL when app became active:', url);
            handleOpenURL({ url });
          }
        }).catch(err => console.error('Lỗi khi lấy initial URL:', err));
      }
    });

    // Cleanup listeners khi component unmount
    return () => {
      subscription.remove();
      appStateSubscription.remove();
    };
  }, [router]);

  return null; // Component này không render UI trực tiếp
};

export default DeeplinkHandler;
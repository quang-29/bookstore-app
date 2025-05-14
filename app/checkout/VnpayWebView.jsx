import React from 'react';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { WebView } from 'react-native-webview';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useCart } from '../../context/CartContext';


const VnpayWebView = () => {
  const { paymentUrl } = useLocalSearchParams();
  const {refreshCart} = useCart();
  console.log('🔗 Payment URL:', paymentUrl);
  const decodedUrl = decodeURIComponent(paymentUrl);

  const handleNavigationChange = ({ url }) => {
    console.log('🔁 Redirect URL:', url);

    if (url.includes('vnp_ResponseCode=00') && url.includes('vnp_TransactionStatus=00')) {
      refreshCart();
      router.replace('/checkout/Success');
    } else if (url.includes('vnp_ResponseCode=24')) {
      refreshCart();
      router.replace('/checkout/Failed');
    } else if (url.includes('vnp_ResponseCode=')) {
      refreshCart();
      router.replace('/checkout/Failed');
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Thanh toán VNPAY', headerShown: true }} />
      <WebView
        source={{ uri: decodedUrl }}
        onNavigationStateChange={handleNavigationChange}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#FF8C00" />
          </View>
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VnpayWebView;

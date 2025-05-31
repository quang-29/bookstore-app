import { Stack } from 'expo-router';

export default function OrderLayout() {
  return (
    <Stack>
      <Stack.Screen name="ListOrders" options={{title: 'Danh sách đơn hàng', headerShown: true }} />
      <Stack.Screen name="[id]" options={{ title: 'Chi tiết đơn hàng', headerShown: true }} />
      <Stack.Screen name="ManageOrder" options={{ title: 'Quản lí đơn hàng', headerShown: false }} />
    </Stack>
  );
}

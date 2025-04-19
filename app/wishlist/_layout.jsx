import { Stack } from 'expo-router';

export default function OrderLayout() {
  return (
    <Stack>
      <Stack.Screen name="WishList" options={{title: 'Danh sách sách yêu thích', headerShown: true }} />
    </Stack>
  );
}

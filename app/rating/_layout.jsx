import { Stack } from 'expo-router';

export default function RatingLayout() {
  return (
    <Stack>
      <Stack.Screen name="UnrateBook" options={{title: 'Danh sách sách đánh giá', headerShown: true }} />
      <Stack.Screen name="[bookId]" options={{ title: 'Đánh giá sách', headerShown: true }} />
      <Stack.Screen name="AllRating" options={{ title: 'Tất cả đánh giá sách', headerShown: true }} />
      <Stack.Screen name="EditReview" options={{ title: 'Sửa đánh giá sách', headerShown: true }} />


    </Stack>
  );
}

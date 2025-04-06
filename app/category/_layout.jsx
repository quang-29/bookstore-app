import { Stack } from 'expo-router';

const CategoryLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="categoryDetail"
        options={{
          headerShown: false, // Tắt header mặc định ở layout, để categoryDetail tự xử lý
        }}
      />
    </Stack>
  );
};

export default CategoryLayout;
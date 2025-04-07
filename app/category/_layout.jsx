import { Stack } from 'expo-router';

const CategoryLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="categoryDetail"
        options={{
          headerShown: false, 
        }}
      />
    </Stack>
  );
};

export default CategoryLayout;
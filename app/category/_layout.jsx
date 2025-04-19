import { Stack } from 'expo-router';

const CategoryLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="CategoryDetail"
        options={{
          headerShown: false, 
        }}
      />
    </Stack>
  );
};

export default CategoryLayout;
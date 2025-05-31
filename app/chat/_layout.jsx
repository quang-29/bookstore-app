import { Stack } from 'expo-router';

export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen name="MessageScreen" options={{title: 'Chat với user', headerShown: true }} />
    </Stack>
  );
}

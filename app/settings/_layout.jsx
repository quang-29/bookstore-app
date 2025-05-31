// settings/layout.js
import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="SettingScreen"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

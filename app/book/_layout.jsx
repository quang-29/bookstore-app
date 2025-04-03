import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const BookLayout = () => {
  return (
    <Stack>
        <Stack.Screen
          name="bookDetail"
          options={{
            headerShown: false,
          }}
        />
    </Stack>
  )
}

export default BookLayout
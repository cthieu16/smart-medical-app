import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

export const LoadingScreen = () => {
  return (
    <View className='flex-1 bg-[#121212] justify-center items-center'>
      <ActivityIndicator size='large' color='#4A90E2' />
      <Text className='mt-4 text-white'>Loading...</Text>
    </View>
  );
};

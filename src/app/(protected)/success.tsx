import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const SuccessScreen = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#0D1117] justify-center items-center px-4">
      <AntDesign name="checkcircle" size={80} color="#4A90E2" />
      <Text className="mt-6 mb-2 text-2xl font-bold text-center text-white">
        Order Successful!
      </Text>
      <Text className="mb-8 text-center text-gray-400">
        Your order has been placed successfully. You will receive a confirmation
        email shortly.
      </Text>
      <Pressable
        className="bg-[#4A90E2] py-3 px-6 rounded-full"
        onPress={() => router.push("/(protected)/home")}
      >
        <Text className="text-lg font-semibold text-white">
          Continue Shopping
        </Text>
      </Pressable>
    </View>
  );
};

export default SuccessScreen;

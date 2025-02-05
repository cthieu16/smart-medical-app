import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

type HeaderProps = {
  title: string;
  showBackButton?: boolean;
  showSearchButton?: boolean;
};

export const Header = ({
  title,
  showBackButton = true,
  showSearchButton = true,
}: HeaderProps) => {
  const router = useRouter();

  return (
    <View className='flex-row items-center justify-between px-4 py-3 bg-[#121212] border-b border-gray-800'>
      <View className='flex-row items-center'>
        {showBackButton && (
          <Pressable onPress={() => router.back()} className='mr-4'>
            <AntDesign name='left' size={24} color='white' />
          </Pressable>
        )}
        <Text className='text-xl font-bold text-white'>{title}</Text>
      </View>
      {showSearchButton && (
        <Pressable onPress={() => console.log("search")}>
          <AntDesign name='search1' size={24} color='white' />
        </Pressable>
      )}
    </View>
  );
};

import React from "react";
import { Pressable, Text } from "react-native";

type PrimaryButtonProps = {
  onPress: () => void;
  title: string;
};

const PrimaryButton = ({ onPress, title }: PrimaryButtonProps) => {
  return (
    <Pressable
      className='bg-[#4A90E2] py-4 px-6 rounded-full'
      onPress={onPress}
    >
      <Text className='text-base font-semibold text-center text-white'>
        {title}
      </Text>
    </Pressable>
  );
};

export { PrimaryButton };

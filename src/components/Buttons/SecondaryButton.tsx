import React from "react";
import { Pressable, Text } from "react-native";

type SecondaryButtonProps = {
  onPress: () => void;
  title: string;
};

const SecondaryButton = ({ onPress, title }: SecondaryButtonProps) => {
  return (
    <Pressable
      className='bg-transparent border border-[#404040] py-4 px-6 rounded-full'
      onPress={onPress}
    >
      <Text className='text-base font-semibold text-center text-white'>
        {title}
      </Text>
    </Pressable>
  );
};

export { SecondaryButton };

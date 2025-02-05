import React from "react";
import { Pressable, Text, View } from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

type SocialButtonProps = {
  onPress: () => void;
  title: string;
  icon: any;
};

const SocialButton = ({ onPress, title, icon }: SocialButtonProps) => {
  const IconComponent = icon === "facebook" ? FontAwesome : AntDesign;

  return (
    <Pressable
      className='bg-transparent border border-[#404040] py-4 px-6 rounded-full flex-row items-center justify-center'
      onPress={onPress}
    >
      <IconComponent name={icon} size={20} color='#FFFFFF' />
      <Text className='ml-2 text-base text-center text-white font-poppins-semibold'>
        {title}
      </Text>
    </Pressable>
  );
};

export { SocialButton };

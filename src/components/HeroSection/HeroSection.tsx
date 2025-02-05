import { View, Text, Image, Pressable } from "react-native";

type HeroSectionProps = {
  imageUrl: string;
  title: string;
  buttonText: string;
  onButtonPress: () => void;
};

export const HeroSection = ({
  imageUrl,
  title,
  buttonText,
  onButtonPress,
}: HeroSectionProps) => {
  return (
    <View className='relative h-[400px]'>
      <Image source={{ uri: imageUrl }} className='w-full h-full' />
      <View className='absolute bottom-8 left-4'>
        <Text className='mb-4 text-4xl font-bold text-white'>{title}</Text>
        <Pressable
          className='bg-[#4A90E2] px-6 py-2 rounded-lg'
          onPress={onButtonPress}
        >
          <Text className='font-medium text-white'>{buttonText}</Text>
        </Pressable>
      </View>
    </View>
  );
};

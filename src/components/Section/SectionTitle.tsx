import { View, Text, Pressable } from "react-native";

type SectionTitleProps = {
  title: string;
  viewAll?: boolean;
  onViewAll?: () => void;
};

export const SectionTitle = ({
  title,
  viewAll = false,
  onViewAll,
}: SectionTitleProps) => (
  <View className='flex-row items-center justify-between mb-4'>
    <Text className='text-xl font-bold text-white'>{title}</Text>
    {viewAll && (
      <Pressable onPress={onViewAll}>
        <Text className='text-[#4A90E2]'>View all</Text>
      </Pressable>
    )}
  </View>
);

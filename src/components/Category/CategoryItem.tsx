import { Text, Pressable } from "react-native";

type CategoryItemProps = {
  name: string;
  onPress: () => void;
};

export const CategoryItem = ({ name, onPress }: CategoryItemProps) => {
  return (
    <Pressable
      className='px-4 py-2 mr-2 bg-gray-800 rounded-full'
      onPress={onPress}
    >
      <Text className='text-sm text-white'>{name}</Text>
    </Pressable>
  );
};

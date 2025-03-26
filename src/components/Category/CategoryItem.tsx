import { Pressable, Text } from "react-native";

type CategoryItemProps = {
  name: string;
  onPress: () => void;
};

export const CategoryItem = ({ name, onPress }: CategoryItemProps) => {
  return (
    <Pressable
      className="px-4 py-2 mr-2 bg-[#161B22] rounded-full"
      onPress={onPress}
    >
      <Text className="text-sm text-white">{name}</Text>
    </Pressable>
  );
};

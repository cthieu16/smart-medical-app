import { View, Text, Pressable } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import { NAV_ITEMS, NavItem } from "../../constants/navItems";

type NavItemProps = NavItem & {
  isActive: boolean;
  onPress: () => void;
};

const NavBarItem = ({ name, icon, isActive, onPress }: NavItemProps) => {
  const IconComponent = icon in AntDesign.glyphMap ? AntDesign : Feather;

  return (
    <Pressable className='items-center' onPress={onPress}>
      <View className='mb-1'>
        <IconComponent
          name={icon as any}
          size={24}
          color={isActive ? "#4A90E2" : "#666"}
        />
      </View>
      <Text
        className={`text-xs ${isActive ? "text-[#4A90E2]" : "text-gray-400"}`}
      >
        {name}
      </Text>
    </Pressable>
  );
};

export const BottomNavBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View className='flex-row items-center justify-around py-4 bg-[#121212] border-t border-gray-800'>
      {NAV_ITEMS.map((item) => (
        <NavBarItem
          key={item.id}
          {...item}
          isActive={item.routes.includes(pathname)}
          onPress={() => router.push(item.routes[0] as any)}
        />
      ))}
    </View>
  );
};

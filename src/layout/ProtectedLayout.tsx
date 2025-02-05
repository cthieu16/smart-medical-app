import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNavBar } from "../components/NavBar/BottomNavBar";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <SafeAreaView className='flex-1 bg-[#121212]'>
      <View className='flex-1'>{children}</View>
      <BottomNavBar />
    </SafeAreaView>
  );
};

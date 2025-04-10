import { AntDesign, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../hooks/useOrders";
import { Header } from "@/src/components/Header/Header";

const ProfileScreen = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data: orders } = useOrders();

  const menuItems = [
    {
      id: "orders",
      title: "Bệnh án",
      subtitle: `Số lượng: ${orders?.length || 0}`,
      icon: "shopping-bag",
      onPress: () => router.push("/"),
    },
    {
      id: "map",
      title: "Bản đồ",
      subtitle: "Xem vị trí phòng khám",
      icon: "map",
      onPress: () => router.push("/map"),
    },
    {
      id: "settings",
      title: "Cài đặt",
      subtitle: "Thông tin, mật khẩu",
      icon: "settings",
      onPress: () => router.push("/settings"),
    },
  ];

  return (
    <ScrollView className="flex-1 bg-[#0D1117]">
      <Header title="Thông tin cá nhân"/>

      <View className="px-4 py-6">
        <Text className="text-xl font-semibold text-white">
          {user?.fullName}
        </Text>
        <Text className="text-gray-400">{user?.email}</Text>
      </View>

      <View className="px-4 mt-4">
        {menuItems.map((item) => (
          <Pressable
            key={item.id}
            className="flex-row items-center justify-between py-4 border-b border-gray-800"
            onPress={item.onPress}
          >
            <View className="flex-row items-center">
              <View className="items-center justify-center w-10 h-10 bg-[#161B22] rounded-full">
                <Feather name={item.icon as any} size={20} color="#4A90E2" />
              </View>
              <View className="ml-4">
                <Text className="text-base font-medium text-white">
                  {item.title}
                </Text>
                <Text className="text-sm text-gray-400">{item.subtitle}</Text>
              </View>
            </View>
            <AntDesign name="right" size={20} color="#666" />
          </Pressable>
        ))}
      </View>

      <Pressable
        className="mx-4 mt-8 mb-4 bg-[#4A90E2] py-3 px-6 rounded-xl"
        onPress={async () => {
          await logout();
          router.replace("/");
        }}
      >
        <Text className="font-semibold text-center text-white">Đăng xuất</Text>
      </Pressable>
    </ScrollView>
  );
};

export default ProfileScreen;

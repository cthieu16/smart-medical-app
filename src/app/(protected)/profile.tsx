import { AntDesign, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../hooks/useOrders";

const ProfileScreen = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data: orders } = useOrders();

  const menuItems = [
    {
      id: "orders",
      title: "Đơn hàng",
      subtitle: `${orders?.length || 0} orders`,
      icon: "shopping-bag",
      onPress: () => router.push("/orders"),
    },
    {
      id: "payment",
      title: "Thanh toán",
      subtitle: "**** **** ****",
      icon: "credit-card",
      onPress: () => console.log("Navigate to payment methods"),
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
    <ScrollView className="flex-1 bg-[#121212]">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4">
        <Text className="text-2xl font-bold text-white">Thông tin cá nhân</Text>
        <Pressable onPress={() => console.log("Search")}>
          <AntDesign name="search1" size={24} color="white" />
        </Pressable>
      </View>

      {/* Profile Info */}
      <View className="px-4 py-6">
        <Text className="text-xl font-semibold text-white">
          {user?.firstName} {user?.lastName}
        </Text>
        <Text className="text-gray-400">{user?.email}</Text>
      </View>

      {/* Menu Items */}
      <View className="px-4 mt-4">
        {menuItems.map((item) => (
          <Pressable
            key={item.id}
            className="flex-row items-center justify-between py-4 border-b border-gray-800"
            onPress={item.onPress}
          >
            <View className="flex-row items-center">
              <View className="items-center justify-center w-10 h-10 bg-gray-800 rounded-full">
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

      {/* Logout Button */}
      <Pressable
        className="mx-4 mt-8 mb-4 bg-[#4A90E2] py-3 px-6 rounded-lg"
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

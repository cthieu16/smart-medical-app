import { useAuth } from "@/src/context/AuthContext";
import { AntDesign, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Image, Pressable, ScrollView, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

const images = [
  require("../../assets/images/slider/slider1.jpg"),
  require("../../assets/images/slider/slider2.jpg"),
  require("../../assets/images/slider/slider3.jpg"),
];

const Home = () => {
  const { user } = useAuth();

  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-[#121212]">
      <View className="flex-row items-center space-x-4 mx-4 mt-6">
        <Image
          source={require('../../assets/images/user.png')}
          className="w-16 h-16 rounded-full border-2 border-[#4A90E2]"
          resizeMode="cover"
        />
        <View className="ml-2">
          <Text className="text-lg font-semibold text-white">Xin chào,</Text>
          <Text className="text-xl font-bold text-[#4A90E2]">{user?.userName}</Text>
        </View>
      </View>

      <View className="mt-6">
        <Carousel
          loop
          width={width - 32}
          height={200}
          autoPlay
          data={images}
          scrollAnimationDuration={1000}
          style={{ alignSelf: "center" }}
          renderItem={({ item }) => (
            <View className="rounded-2xl overflow-hidden">
              <Image source={item} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
            </View>
          )}
        />
      </View>

      <View className="flex-row justify-between mx-4 mt-8">
        <Pressable
          className="flex-1 bg-gray-800 p-4 rounded-xl items-center mx-1"
          onPress={() => router.push("/appointments")}
        >
          <MaterialIcons name="event-note" size={28} color="#4A90E2" />
          <Text className="text-white mt-2 font-semibold">Lịch hẹn</Text>
        </Pressable>

        <Pressable
          className="flex-1 bg-gray-800 p-4 rounded-xl items-center mx-1"
          onPress={() => router.push("/medical-records")}
        >
          <FontAwesome5 name="notes-medical" size={28} color="#4A90E2" />
          <Text className="text-white mt-2 font-semibold">Bệnh án</Text>
        </Pressable>

        <Pressable
          className="flex-1 bg-gray-800 p-4 rounded-xl items-center mx-1"
          onPress={() => router.push("/notifications")}
        >
          <AntDesign name="bells" size={28} color="#4A90E2" />
          <Text className="text-white mt-2 font-semibold">Thông báo</Text>
        </Pressable>
      </View>

      <View className="bg-gray-900 mx-4 p-5 rounded-xl mt-8">
        <Text className="text-lg font-semibold text-white">📅 Lịch hẹn gần nhất</Text>
        <Text className="text-xl font-bold text-[#4A90E2] mt-2">15:00 - 16/06/2025</Text>
      </View>

      <Pressable
        className="bg-gray-800 mx-4 p-5 rounded-xl mt-4 flex-row justify-between items-center"
        onPress={() => router.push("/medical-records")}
      >
        <View>
          <Text className="text-lg font-semibold text-white">📝 Bệnh án mới nhất</Text>
          <Text className="text-sm text-gray-400 mt-1">Cập nhật lần cuối: 10/02/2025</Text>
        </View>
        <Text className="text-lg text-[#4A90E2] font-bold">Xem ngay</Text>
      </Pressable>

      <Pressable
        className="mx-4 my-8 bg-[#4A90E2] py-4 rounded-xl flex-row items-center justify-center shadow-lg"
        onPress={() => router.push("/medical-records")}
      >
        <AntDesign name="filetext1" size={20} color="white" />
        <Text className="font-semibold text-white text-lg ml-2">Xem bệnh án</Text>
      </Pressable>
    </ScrollView>
  );
};

export default Home;

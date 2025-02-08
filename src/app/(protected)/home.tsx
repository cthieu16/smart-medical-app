import React from "react";
import { ScrollView, View, Text, Pressable, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import { useAuth } from "@/src/context/AuthContext";

const { width } = Dimensions.get("window");

const images = [
  require("../../assets/images/slider/slider3.jpg"),
  require("../../assets/images/slider/slider2.jpg"),
  require("../../assets/images/slider/slider1.jpg"),
];

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-[#121212]">
      <View className="flex-row items-center space-x-4 mx-4 gap-2">
        <Image
          source={require('../../assets/images/user.png')}
          className="w-14 h-14 rounded-full"
          resizeMode="cover"
        />
        <Text className="font-semibold text-center text-white">
          Xin chào {user?.firstName} {user?.lastName}
        </Text>
      </View>
      <View className="relative mt-8">
        <Carousel
          loop
          width={width}
          height={200}
          autoPlay
          data={images}
          renderItem={({ item }) => (
            <View style={{ flex: 1 }}>
              <Image source={item} style={{ width: "100%", height: "100%", borderRadius: 10 }} />
            </View>
          )}
        />
      </View>

      <View className="flex-col gap-4 mt-8 mx-4">
        <View className="flex-row gap-2">
          <Text className="font-semibold text-center text-white">Lịch hẹn gần đây:</Text>
          <Text className="font-semibold text-center text-white">15:00 16/06/2025</Text>
        </View>
        <View className="flex-row gap-2">
          <Text className="font-semibold text-center text-white">Bệnh án mới nhất:</Text>
          <Text className="font-semibold text-center text-[#4A90E2]">Xem ngay</Text>
        </View>
      </View>

      <Pressable
        className="mx-4 my-8 bg-[#4A90E2] py-3 rounded-lg"
        onPress={() => router.push("/")}
      >
        <Text className="font-semibold text-center text-white">
          Xem bệnh án
        </Text>
      </Pressable>
    </ScrollView>
  );
};

export default Home;

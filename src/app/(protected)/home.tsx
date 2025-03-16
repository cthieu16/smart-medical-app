import { useAuth } from "@/src/context/AuthContext";
import { AntDesign, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
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
    <View className="flex-1 bg-[#121212]">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center mx-4 mt-10 p-5 bg-gray-900 rounded-3xl shadow-lg">
          <Image
            source={require("../../assets/images/user.png")}
            className="w-16 h-16 rounded-full border-4 border-blue-500"
            resizeMode="cover"
          />
          <View className="ml-4">
            <Text className="text-lg text-gray-400">Chào mừng,</Text>
            <Text className="text-2xl font-bold text-blue-500">
              {user?.username}
            </Text>
          </View>
        </View>

        {/* Image Carousel */}
        <View className="mt-6 px-4">
          <Carousel
            loop
            width={width - 32}
            height={220}
            autoPlay
            data={images}
            scrollAnimationDuration={1200}
            style={{ alignSelf: "center" }}
            renderItem={({ item }) => (
              <View className="rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  source={item}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            )}
          />
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-between mx-4 mt-8">
          {[
            {
              icon: "event-note",
              text: "Lịch hẹn",
              route: "/appointments",
              IconComponent: MaterialIcons,
            },
            {
              icon: "notes-medical",
              text: "Bệnh án",
              route: "/medical-records",
              IconComponent: FontAwesome5,
            },
            {
              icon: "bells",
              text: "Thông báo",
              route: "/notifications",
              IconComponent: AntDesign,
            },
          ].map(({ icon, text, route, IconComponent }, index) => (
            <Pressable
              key={index}
              className="flex-1 bg-gray-800 p-6 rounded-3xl items-center mx-2 shadow-lg active:opacity-80"
            >
              <IconComponent name={icon} size={30} color="#4A90E2" />
              <Text className="text-white mt-2 font-semibold text-sm">
                {text}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Upcoming Appointment */}
        <View className="bg-gray-900 mx-4 p-6 rounded-3xl mt-8 shadow-xl flex-row items-center">
          <MaterialIcons name="event" size={28} color="#4A90E2" />
          <View className="ml-3">
            <Text className="text-lg font-semibold text-gray-300">
              Lịch hẹn gần nhất
            </Text>
            <Text className="text-xl font-bold text-blue-500 mt-2">
              15:00 - 16/06/2025
            </Text>
          </View>
        </View>

        {/* Medical Record */}
        <Pressable
          className="bg-gray-800 mx-4 p-6 rounded-3xl mt-4 flex-row justify-between items-center shadow-xl"
          onPress={() => router.push("/medical-records")}
        >
          <View className="flex-row items-center">
            <FontAwesome5 name="file-medical" size={28} color="#4A90E2" />
            <View className="ml-3">
              <Text className="text-lg font-semibold text-gray-300">
                Bệnh án mới nhất
              </Text>
              <Text className="text-sm text-gray-400 mt-1">
                Cập nhật lần cuối: 10/02/2025
              </Text>
            </View>
          </View>
          <Text className="text-lg text-blue-500 font-bold">Xem ngay</Text>
        </Pressable>

        {/* View Records Button */}
        <Pressable
          className="mx-4 my-8 bg-blue-500 py-4 rounded-3xl flex-row items-center justify-center shadow-2xl active:opacity-80"
          onPress={() => router.push("/medical-records")}
        >
          <AntDesign name="filetext1" size={24} color="white" />
          <Text className="font-semibold text-white text-lg ml-2">
            Xem bệnh án
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default Home;

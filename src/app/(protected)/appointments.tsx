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
    <View className="flex-1 bg-[#1A1A2E]">
      <ScrollView>
        <View className="flex-row items-center mx-4 mt-8 p-4 bg-[#16213E] rounded-2xl shadow-lg border border-[#0F3460]">
          <Image
            source={require("../../assets/images/user.png")}
            className="w-14 h-14 rounded-full border-2 border-[#E94560]"
            resizeMode="cover"
          />
          <View className="ml-4">
            <Text className="text-lg text-gray-400">Xin chào,</Text>
            <Text className="text-2xl font-bold text-[#E94560]">
              {user?.username}
            </Text>
          </View>
        </View>

        <View className="mt-6 px-4">
          <Carousel
            loop
            width={width - 32}
            height={220}
            autoPlay
            data={images}
            scrollAnimationDuration={1000}
            style={{ alignSelf: "center" }}
            renderItem={({ item }) => (
              <View className="rounded-2xl overflow-hidden shadow-xl border border-[#0F3460]">
                <Image
                  source={item}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            )}
          />
        </View>

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
              className="flex-1 bg-[#0F3460] p-5 rounded-2xl items-center mx-2 shadow-md active:opacity-80 border border-[#E94560]"
            >
              <IconComponent name={icon} size={28} color="#E94560" />
              <Text className="text-white mt-2 font-semibold text-sm">
                {text}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="bg-[#16213E] mx-4 p-6 rounded-2xl mt-8 shadow-lg flex-row items-center border border-[#0F3460]">
          <MaterialIcons name="event" size={26} color="#E94560" />
          <View className="ml-3">
            <Text className="text-lg font-semibold text-gray-300">
              Lịch hẹn gần nhất
            </Text>
            <Text className="text-xl font-bold text-[#E94560] mt-2">
              15:00 - 16/06/2025
            </Text>
          </View>
        </View>

        <Pressable
          className="bg-[#0F3460] mx-4 p-6 rounded-2xl mt-4 flex-row justify-between items-center shadow-lg border border-[#E94560]"
          onPress={() => router.push("/medical-records")}
        >
          <View className="flex-row items-center">
            <FontAwesome5 name="file-medical" size={26} color="#E94560" />
            <View className="ml-3">
              <Text className="text-lg font-semibold text-gray-300">
                Bệnh án mới nhất
              </Text>
              <Text className="text-sm text-gray-400 mt-1">
                Cập nhật lần cuối: 10/02/2025
              </Text>
            </View>
          </View>
          <Text className="text-lg text-[#E94560] font-bold">Xem ngay</Text>
        </Pressable>

        <Pressable
          className="mx-4 my-8 bg-[#E94560] py-4 rounded-2xl flex-row items-center justify-center shadow-xl active:opacity-80 border border-[#0F3460]"
          onPress={() => router.push("/medical-records")}
        >
          <AntDesign name="filetext1" size={22} color="white" />
          <Text className="font-semibold text-white text-lg ml-2">
            Xem bệnh án
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default Home;

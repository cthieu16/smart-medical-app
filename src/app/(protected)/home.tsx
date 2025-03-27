import { PrimaryButton } from "@/src/components/Buttons/PrimaryButton";
import { useAuth } from "@/src/context/AuthContext";
import { useMyAppointments } from "@/src/hooks/useAppointments";
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

interface Appointment {
  id: string;
  clinicId: string;
  doctorId: string;
  patientId: string;
  startTime: string;
  endTime: string;
  queueNumber: number;
  status: "CONFIRMED" | "CANCELLED" | "PENDING";
  note?: string;
  createAt: string;
}

const getUpcomingAppointment = (
  appointments: Appointment[]
): Appointment | null => {
  const now = new Date();
  return (
    appointments
      .filter((appt) => appt.status !== "CANCELLED")
      .filter((appt) => new Date(appt.startTime) >= now)
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      )[0] || null
  );
};

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { data: rawAppointments = [] } = useMyAppointments() as {
    data: Appointment[];
  };

  const upcomingAppointment = getUpcomingAppointment(rawAppointments);
  const formattedAppointmentTime = upcomingAppointment
    ? `${new Date(upcomingAppointment.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${new Date(upcomingAppointment.startTime).toLocaleDateString()}`
    : "Không có lịch hẹn";

  return (
    <View className="flex-1 bg-[#0D1117]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center mx-4 mt-10 p-6 bg-[#161B22] rounded-3xl shadow-lg shadow-[#00AEEF]">
          <Image
            source={require("../../assets/images/user.png")}
            className="w-16 h-16 rounded-full border-4 border-[#00AEEF]"
            resizeMode="cover"
          />
          <View className="ml-4">
            <Text className="text-lg text-[#8B949E]">Chào mừng,</Text>
            <Text className="text-2xl font-bold text-[#fff]">
              {user?.fullName}
            </Text>
          </View>
        </View>

        <View className="mt-6 px-6">
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
          ].map(({ icon, text, route, IconComponent }, index) => (
            <Pressable
              key={index}
              className="flex-1 bg-[#161B22] p-6 rounded-3xl items-center mx-2 shadow-lg active:opacity-80"
            >
              <IconComponent name={icon} size={30} color="#00AEEF" />
              <Text className="text-white mt-2 font-semibold text-sm">
                {text}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="bg-[#161B22] mx-4 p-6 rounded-3xl mt-8 shadow-xl flex-row items-center">
          <MaterialIcons name="event" size={28} color="#00AEEF" />
          <View className="ml-3">
            <Text className="text-lg font-semibold text-[#8B949E]">
              Lịch hẹn gần nhất
            </Text>
            <Text className="text-xl font-bold text-[#fff] mt-2">
              {formattedAppointmentTime}
            </Text>
          </View>
        </View>

        <Pressable
          className="bg-[#161B22] mx-4 p-6 rounded-3xl mt-4 flex-row justify-between items-center shadow-xl"
          onPress={() => router.push("/medical-records")}
        >
          <View className="flex-row items-center">
            <FontAwesome5 name="file-medical" size={28} color="#00AEEF" />
            <View className="ml-3">
              <Text className="text-lg font-semibold text-[#8B949E]">
                Bệnh án mới nhất
              </Text>
              <Text className="text-sm text-[#8B949E] mt-1">
                Cập nhật lần cuối: 10/02/2025
              </Text>
            </View>
          </View>
          <Text className="text-lg text-[#fff] font-bold">Xem ngay</Text>
        </Pressable>

        <View className="p-6">
          <PrimaryButton
            title="Xem bệnh án"
            onPress={() => router.push("/medical-records")}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

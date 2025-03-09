import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Text, View, Pressable, ScrollView } from "react-native";

const appointmentDetails = {
  id: "1",
  date: "01/03/2025",
  time: "14:00",
  doctor: "BS. Lê Minh",
  specialty: "Nội khoa",
  status: "Đã xác nhận",
  location: "Phòng khám ABC, 123 Đường XYZ, TP.HCM",
  notes: "Bệnh nhân có tiền sử cao huyết áp, cần kiểm tra định kỳ.",
};

const AppointmentsDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  return (
    <View className="flex-1 bg-[#1E1E1E] p-4">
      <View className="flex-row items-center justify-between pb-4 border-gray-700">
        <Pressable onPress={() => router.back()} className="p-2">
          <AntDesign name="left" size={24} color="white" />
        </Pressable>
        <Text className="text-2xl font-bold text-white">Chi tiết lịch hẹn</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="mt-6" showsVerticalScrollIndicator={false}>
        <View className="bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-700">
          <Text className="text-white text-lg font-semibold">
            📅 {appointmentDetails.date} - 🕒 {appointmentDetails.time}
          </Text>
          <Text className="text-gray-400 mt-3">
            👨‍⚕️ Bác sĩ:{" "}
            <Text className="text-white">{appointmentDetails.doctor}</Text>
          </Text>
          <Text className="text-gray-400 mt-1">
            🏥 Chuyên khoa:{" "}
            <Text className="text-white">{appointmentDetails.specialty}</Text>
          </Text>
          <Text className="text-gray-400 mt-1">
            📍 Địa điểm:{" "}
            <Text className="text-white">{appointmentDetails.location}</Text>
          </Text>
          <Text className="text-gray-400 mt-1">
            📝 Ghi chú:{" "}
            <Text className="text-white">{appointmentDetails.notes}</Text>
          </Text>
          <Text
            className={`mt-4 text-lg font-semibold ${
              appointmentDetails.status === "Đã xác nhận"
                ? "text-green-400"
                : appointmentDetails.status === "Chờ xác nhận"
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            📌 Trạng thái: {appointmentDetails.status}
          </Text>
        </View>

        <View className="mt-6 flex-row justify-between">
          <Pressable
            className="bg-red-500 p-4 rounded-lg flex-1 mr-2 shadow-md active:opacity-80"
            onPress={() => console.log("Hủy lịch hẹn")}
          >
            <Text className="text-white text-center font-semibold text-lg">
              ❌ Hủy hẹn
            </Text>
          </Pressable>
          <Pressable
            className="bg-green-500 p-4 rounded-lg flex-1 ml-2 shadow-md active:opacity-80"
            onPress={() => console.log("Xác nhận hẹn")}
          >
            <Text className="text-white text-center font-semibold text-lg">
              ✅ Xác nhận
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default AppointmentsDetailScreen;

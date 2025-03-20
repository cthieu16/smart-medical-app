import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import dayjs from "dayjs";
import { useAppointmentDetail } from "@/src/hooks/useAppointments";
import { useMyDoctors } from "@/src/hooks/useDoctors";
import { Header } from "@/src/components/Header/Header";

type Status = "CONFIRMED" | "PENDING" | "CANCELLED";

const STATUS_CONFIG: Record<Status, { label: string; color: string }> = {
  CONFIRMED: { label: "Đã xác nhận", color: "bg-green-600" },
  PENDING: { label: "Chờ xác nhận", color: "bg-yellow-500" },
  CANCELLED: { label: "Đã hủy", color: "bg-red-500" },
};

const AppointmentsDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: appointment } = useAppointmentDetail(id as string);
  const { data: doctors = [] } = useMyDoctors();

  const doctor = doctors.find((doc) => doc.id === appointment?.doctorId);

  const handleCancel = () => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn hủy lịch hẹn này?", [
      { text: "Không" },
      {
        text: "Có",
        onPress: () => {
          router.push("/(protected)/appointments");
        },
      },
    ]);
  };

  if (!appointment) {
    return (
      <View className="flex-1 items-center justify-center bg-[#121212]">
        <Text className="text-gray-400">Không tìm thấy lịch hẹn.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#121212]">
      <Header title="Chi tiết lịch hẹn" />
      <View className="p-6">
        <View className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
          <Text className="text-white text-2xl font-bold text-center mb-4">
            Thông tin lịch hẹn
          </Text>
          <View className="space-y-4">
            <View className="flex-row items-center">
              <MaterialIcons name="event" size={24} color="white" />
              <Text className="text-white text-lg ml-3">
                {dayjs(appointment.startTime).format("DD/MM/YYYY HH:mm")}
              </Text>
            </View>
            <View className="flex-row items-center">
              <FontAwesome name="user-md" size={24} color="white" />
              <Text className="text-white text-lg ml-3">
                Bác sĩ: {doctor?.fullName || "Chưa xác định"}
              </Text>
            </View>
            {appointment.note && (
              <View className="flex-row items-center">
                <MaterialIcons name="notes" size={24} color="white" />
                <Text className="text-gray-300 text-lg ml-3">
                  {appointment.note}
                </Text>
              </View>
            )}
            <View
              className={`px-4 py-2 rounded-lg ${
                STATUS_CONFIG[appointment.status as Status].color
              } flex-row items-center justify-center mt-4`}
            >
              <MaterialIcons name="info" size={20} color="white" />
              <Text className="text-white text-lg font-bold ml-2">
                {STATUS_CONFIG[appointment.status as Status].label}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View className="mt-8 items-center">
        <Pressable
          className="bg-red-600 px-6 py-3 rounded-lg shadow-lg flex-row items-center"
          onPress={handleCancel}
        >
          <AntDesign name="closecircleo" size={24} color="white" />
          <Text className="text-white text-lg font-bold ml-3">
            Hủy lịch hẹn
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default AppointmentsDetailScreen;

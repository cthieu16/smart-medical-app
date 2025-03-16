import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, View, Pressable, Alert } from "react-native";
import dayjs from "dayjs";

const statusColors: Record<AppointmentStatus, string> = {
  confirmed: "bg-green-600",
  pending: "bg-yellow-500",
  cancelled: "bg-red-500",
};

type AppointmentStatus = "confirmed" | "pending" | "cancelled";

const initialAppointment = {
  id: "1",
  patientId: "1",
  doctorId: "1",
  clinicId: "1",
  queueNumber: 1,
  startTime: "2025-03-16T06:01:44.876Z",
  endTime: "2025-03-16T06:31:44.876Z",
  status: "confirmed" as AppointmentStatus,
  createAt: "2025-03-10T08:00:00.000Z",
  note: "Khám sức khỏe tổng quát",
  doctorName: "BS. Lê Minh",
};

const AppointmentsDetailScreen = () => {
  const router = useRouter();
  const [appointment, setAppointment] = useState(initialAppointment);

  const handleCancelAppointment = () => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn hủy lịch hẹn này?", [
      { text: "Không", style: "cancel" },
      {
        text: "Có",
        onPress: () =>
          setAppointment((prev) => ({ ...prev, status: "cancelled" })),
      },
    ]);
  };

  const isPastAppointment = dayjs().isAfter(dayjs(appointment.startTime));

  return (
    <ScrollView className="flex-1 bg-[#121212]">
      <View className="flex-row items-center justify-between p-4">
        <Pressable onPress={() => router.back()} className="p-2">
          <AntDesign name="left" size={24} color="white" />
        </Pressable>
        <Text className="text-2xl font-bold text-white">Chi tiết lịch hẹn</Text>
        <View className="w-8" />
      </View>

      <View className="p-4">
        <View className="bg-gray-900 p-4 rounded-2xl shadow-lg border border-gray-800">
          <Text className="text-xl font-bold text-white mb-2">Thông tin</Text>
          <View className="flex-row items-center mb-2">
            <MaterialIcons name="event" size={20} color="gray" />
            <Text className="text-white ml-2">
              {dayjs(appointment.startTime).format("DD/MM/YYYY")}
            </Text>
          </View>
          <View className="flex-row items-center mb-2">
            <AntDesign name="clockcircleo" size={20} color="gray" />
            <Text className="text-white ml-2">
              {dayjs(appointment.startTime).format("HH:mm")} -{" "}
              {dayjs(appointment.endTime).format("HH:mm")}
            </Text>
          </View>
          <View className="flex-row items-center mb-2">
            <FontAwesome name="user-md" size={20} color="gray" />
            <Text className="text-white ml-2">
              Bác sĩ: {appointment.doctorName}
            </Text>
          </View>
          <View className="flex-row items-center mb-2">
            <MaterialIcons name="notes" size={20} color="gray" />
            <Text className="text-white ml-2">Ghi chú: {appointment.note}</Text>
          </View>
          <View
            className={`mt-2 px-2 py-1 rounded-lg flex-row items-center ${
              statusColors[appointment.status]
            }`}
          >
            <MaterialIcons name="info" size={20} color="white" />
            <Text className="text-white ml-2 font-bold">
              {appointment.status === "confirmed"
                ? "Đã xác nhận"
                : appointment.status === "pending"
                ? "Chờ xác nhận"
                : "Đã hủy"}
            </Text>
          </View>
        </View>
      </View>

      {appointment.status !== "cancelled" && (
        <Pressable
          className={`mx-4 my-4 p-4 rounded-lg items-center ${
            isPastAppointment ? "bg-gray-500" : "bg-red-600"
          }`}
          onPress={handleCancelAppointment}
          disabled={isPastAppointment}
        >
          <Text className="text-white font-bold">
            {isPastAppointment
              ? "Không thể huỷ lịch hẹn đã qua"
              : "Hủy lịch hẹn"}
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
};

export default AppointmentsDetailScreen;

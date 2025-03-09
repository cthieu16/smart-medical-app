import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

const initialAppointments = [
    { id: "1", date: "01/03/2025", time: "14:00", doctor: "BS. Lê Minh", specialty: "Nội khoa", status: "Đã xác nhận" },
    { id: "2", date: "05/03/2025", time: "09:30", doctor: "BS. Nguyễn Lan", specialty: "Tai mũi họng", status: "Chờ xác nhận" },
    { id: "3", date: "10/03/2025", time: "16:00", doctor: "BS. Trần Văn B", specialty: "Nhi khoa", status: "Đã hủy" },
];

const Header = ({ title }: { title: string }) => {
    const router = useRouter();
    return (
        <View className="flex-row items-center justify-between p-4">
            <Pressable onPress={() => router.back()} className="mr-4">
                <AntDesign name="left" size={24} color="white" />
            </Pressable>
            <Text className="text-2xl font-bold text-white">{title}</Text>
            <Pressable onPress={() => console.log("Search")}>
                <AntDesign name="search1" size={24} color="white" />
            </Pressable>
        </View>
    );
};

interface Appointment {
    id: string;
    date: string;
    time: string;
    doctor: string;
    specialty: string;
    status: string;
}

const AppointmentItem = ({ appointment }: { appointment: Appointment }) => {
    const router = useRouter();

    return (
      <Pressable
        onPress={() =>
          router.push(`/(protected)/appointments-detail?id=${appointment.id}`)
        }
        className="bg-gray-800 mx-4 p-4 rounded-xl mt-3 shadow-sm border border-gray-700 flex-row justify-between items-center"
      >
        <View className="flex-col gap-2">
          <Text className="text-white font-semibold">
            📅 {appointment.date} - 🕒 {appointment.time}
          </Text>
          <Text className="text-gray-400">
            👨‍⚕️ Bác sĩ: <Text className="text-white">{appointment.doctor}</Text>
          </Text>
          <Text className="text-gray-400">
            🏥 Chuyên khoa:{" "}
            <Text className="text-white">{appointment.specialty}</Text>
          </Text>
          <Text
            className={`font-semibold ${
              appointment.status === "Đã xác nhận"
                ? "text-green-400"
                : appointment.status === "Chờ xác nhận"
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            📌 Trạng thái: {appointment.status}
          </Text>
        </View>
        <AntDesign name="right" size={20} color="white" />
      </Pressable>
    );
};

const AddAppointmentButton = ({ onPress }: { onPress: () => void }) => (
    <Pressable onPress={onPress} className="bg-[#4A90E2] p-4 rounded-full mx-6 mt-4 flex-row items-center justify-center shadow-lg mb-4">
        <AntDesign name="plus" size={20} color="white" />
        <Text className="text-white font-semibold ml-2 text-lg">Thêm lịch hẹn mới</Text>
    </Pressable>
);

const AppointmentsScreen: React.FC = () => {
    const router = useRouter();
    const [appointments, setAppointments] =
      useState<Appointment[]>(initialAppointments);

    const renderAppointment = useCallback(
      ({ item }: { item: Appointment }) => (
        <AppointmentItem appointment={item} />
      ),
      []
    );

    return (
      <View className="flex-1 bg-[#121212]">
        <Header title="Lịch hẹn" />
        <Text className="text-lg font-semibold text-gray-300 mx-4 mt-6">
          📅 Danh sách lịch hẹn
        </Text>
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={renderAppointment}
          contentContainerStyle={{ paddingVertical: 10 }}
          ListEmptyComponent={
            <Text className="text-gray-400 text-center mt-6">
              Không có lịch hẹn nào.
            </Text>
          }
        />
        <AddAppointmentButton
          onPress={() => router.push("/(protected)/appointments-create")}
        />
      </View>
    );
};

export default AppointmentsScreen;

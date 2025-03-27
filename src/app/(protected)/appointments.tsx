import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo, useCallback, useMemo } from "react";
import { FlatList, Pressable, Text, View, StyleSheet } from "react-native";
import dayjs from "dayjs";
import { useMyAppointments } from "@/src/hooks/useAppointments";
import { useMyDoctors } from "@/src/hooks/useDoctors";
import { Header } from "@/src/components/Header/Header";

type AppointmentStatus = "CONFIRMED" | "PENDING" | "CANCELLED";

type Appointment = {
  id: string;
  startTime: string;
  status: AppointmentStatus;
  note?: string;
  doctorId: string;
};

type Doctor = {
  id: string;
  fullName: string;
};

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; color: string }
> = {
  CONFIRMED: { label: "Đã xác nhận", color: "bg-[#00C851]" },
  PENDING: { label: "Chờ xác nhận", color: "bg-[#FFBB33]" },
  CANCELLED: { label: "Đã hủy", color: "bg-[#FF4444]" },
};

type AppointmentItemProps = {
  appointment: Appointment;
  doctor?: Doctor;
};

const AppointmentItem = memo(
  ({ appointment, doctor }: AppointmentItemProps) => {
    const router = useRouter();
    const { label, color } = STATUS_CONFIG[appointment.status];

    const handleDetail = useCallback(() => {
      router.push(`/(protected)/appointments-detail?id=${appointment.id}`);
    }, [appointment.id, router]);

    return (
      <Pressable
        onPress={handleDetail}
        className="bg-[#161B22] mx-4 p-4 rounded-2xl mt-3 shadow-lg flex-row justify-between items-center"
      >
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <MaterialIcons name="event" size={20} color="#8B949E" />
            <Text className="text-[#fff] text-lg font-bold ml-2">
              {dayjs(appointment.startTime).format("DD/MM/YYYY")}
            </Text>
            <View className="flex-row items-center ml-2">
              <AntDesign name="clockcircleo" size={16} color="#8B949E" />
              <Text className="text-gray-400 ml-1">
                {dayjs(appointment.startTime).format("HH:mm")}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center mt-1">
            <FontAwesome name="user-md" size={16} color="#8B949E" />
            <Text className="text-gray-400 text-sm ml-2">
              Bác sĩ:{" "}
              <Text className="text-[#fff] font-medium">
                {doctor?.fullName || "Chưa xác định"}
              </Text>
            </Text>
          </View>
          {appointment.note && (
            <View className="flex-row items-center mt-1">
              <MaterialIcons name="notes" size={16} color="#8B949E" />
              <Text className="text-gray-400 text-sm ml-2">
                Ghi chú:{" "}
                <Text className="text-gray-300">{appointment.note}</Text>
              </Text>
            </View>
          )}
          <View
            className={`mt-2 px-2 py-1 rounded-lg flex-row items-center ${color}`}
          >
            <MaterialIcons name="info" size={16} color="white" />
            <Text className="text-white ml-1 text-xs font-bold">{label}</Text>
          </View>
        </View>
        <AntDesign name="right" size={20} color="#8B949E" />
      </Pressable>
    );
  }
);

const AppointmentsScreen = () => {
  const router = useRouter();
  const { data: rawAppointments = [] } = useMyAppointments();
  const { data: dataMyDoctors = [] } = useMyDoctors();

  const dataMyAppointments = useMemo(
    () =>
      rawAppointments.map((item) => ({
        ...item,
        status: item.status as AppointmentStatus,
      })),
    [rawAppointments]
  );

  const doctorMap = useMemo(
    () =>
      Object.fromEntries(dataMyDoctors.map((doctor) => [doctor.id, doctor])),
    [dataMyDoctors]
  );

  return (
    <View className="flex-1 bg-[#0D1117]">
      <Header title="Lịch hẹn" />
      <View className="flex-row items-center mx-4 mt-6">
        <MaterialIcons name="event-note" size={20} color="#8B949E" />
        <Text className="text-lg font-semibold text-gray-300 ml-2">
          Danh sách lịch hẹn của bạn
        </Text>
      </View>
      <FlatList
        data={dataMyAppointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AppointmentItem
            appointment={item}
            doctor={doctorMap[item.doctorId]}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View className="items-center mt-6">
            <MaterialIcons name="event-busy" size={50} color="#8B949E" />
            <Text className="text-gray-400 text-center mt-2">
              Không có lịch hẹn nào.
            </Text>
          </View>
        }
      />
      <Pressable
        className="absolute bottom-6 right-6 bg-[#00AEEF] p-4 rounded-full shadow-lg"
        onPress={() => router.push("/(protected)/appointments-create")}
      >
        <AntDesign name="plus" size={28} color="white" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 10,
  },
});

export default AppointmentsScreen;

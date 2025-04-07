import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import dayjs from "dayjs";
import { Header } from "@/src/components/Header/Header";
import { useMyDoctors } from "@/src/hooks/useDoctors";
import { useCreateAppointment } from "@/src/hooks/useAppointments";
import { PrimaryButton } from "@/src/components/Buttons/PrimaryButton";

const timeSlots = [
  "09:00 - 09:30",
  "09:30 - 10:00",
  "10:00 - 10:30",
  "10:30 - 11:00",
  "11:00 - 11:30",
  "13:00 - 13:30",
  "13:30 - 14:00",
  "14:00 - 14:30",
  "14:30 - 15:00",
  "15:00 - 15:30",
  "15:30 - 16:00",
  "16:00 - 16:30",
  "16:30 - 17:00",
];

const AppointmentsCreateScreen = () => {
  const router = useRouter();
  const { data: doctors = [] } = useMyDoctors();
  const createAppointment = useCreateAppointment();

  const [doctorId, setDoctorId] = useState(doctors[0]?.id || "");
  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(timeSlots[0]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmDate = (date: any) => {
    setSelectedDate(date);
    setDatePickerVisibility(false);
  };

  const handleCreateAppointment = async () => {
    if (!doctorId) {
      return Alert.alert("Thông báo", "Vui lòng chọn bác sĩ!");
    }

    if (!selectedDate) {
      return Alert.alert("Thông báo", "Vui lòng chọn ngày!");
    }

    if (dayjs(selectedDate).isBefore(dayjs(), "day")) {
      return Alert.alert(
        "Thông báo",
        "Ngày không hợp lệ! Vui lòng chọn ngày trong tương lai."
      );
    }

    if (!selectedTime) {
      return Alert.alert("Thông báo", "Vui lòng chọn giờ!");
    }

    setLoading(true);

    try {
      const formatTime = (time: any) => {
        const [hour, minute] = time.split(":");
        return { hour: Number(hour), minute: Number(minute) };
      };

      const [start, end] = selectedTime.split(" - ").map(formatTime);
      const startTime = dayjs(selectedDate)
        .hour(start.hour)
        .minute(start.minute)
        .format("YYYY-MM-DDTHH:mm:ss");
      const endTime = dayjs(selectedDate)
        .hour(end.hour)
        .minute(end.minute)
        .format("YYYY-MM-DDTHH:mm:ss");

      const payload = { doctorId, startTime, endTime, note };
      await createAppointment.mutateAsync(payload);

      Alert.alert("Thành công", "Lịch hẹn đã được tạo!", [
        {
          text: "OK",
          onPress: () => router.replace("/(protected)/appointments"),
        },
      ]);
    } catch (error) {
      Alert.alert("Lỗi", "Đã có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1">
        <ScrollView className="flex-1 bg-[#0D1117]">
          <Header title="Tạo lịch hẹn" />

          <View className="p-6">
            <Text className="text-lg text-gray-300 mb-2">Chọn bác sĩ</Text>
            <View className="border border-gray-600 rounded-2xl">
              <Picker
                selectedValue={doctorId}
                onValueChange={setDoctorId}
                style={{ color: "white" }}
                className="bg-[#161B22] p-2 rounded-sm"
              >
                {doctors.map((doctor) => (
                  <Picker.Item
                    key={doctor.id}
                    label={doctor.fullName}
                    value={doctor.id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View className="mt-4 px-6">
            <Text className="text-lg text-gray-300 mb-2">Chọn ngày</Text>
            <Pressable
              onPress={() => setDatePickerVisibility(true)}
              className="bg-[#161B22] p-4 rounded-2xl border border-gray-600 flex-row items-center justify-between"
            >
              <Text className="text-white">
                {selectedDate
                  ? dayjs(selectedDate).format("DD/MM/YYYY")
                  : "Chọn ngày"}
              </Text>
              <MaterialIcons name="event" size={24} color="white" />
            </Pressable>
          </View>

          <View className="mt-4 px-6">
            <Text className="text-lg text-gray-300 mb-2">Chọn giờ</Text>
            <View className="border border-gray-600 rounded-2xl">
              <Picker
                selectedValue={selectedTime}
                onValueChange={setSelectedTime}
                style={{ color: "white" }}
                className="bg-[#161B22] p-2 rounded-2xl"
              >
                {timeSlots.map((time) => (
                  <Picker.Item key={time} label={time} value={time} />
                ))}
              </Picker>
            </View>
          </View>

          <View className="mt-4 px-6">
            <Text className="text-lg text-gray-300 mb-2">Ghi chú</Text>
            <TextInput
              className="bg-[#161B22] text-white p-4 rounded-2xl border border-gray-600 h-32"
              placeholder="Nhập ghi chú..."
              placeholderTextColor="gray"
              multiline
              value={note}
              onChangeText={setNote}
            />
          </View>

          <View className="p-6">
            <PrimaryButton
              title="Tạo lịch hẹn"
              onPress={handleCreateAppointment}
            />
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={() => setDatePickerVisibility(false)}
          />
        </ScrollView>

        {loading && (
          <View className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AppointmentsCreateScreen;

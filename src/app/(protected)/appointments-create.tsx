import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import dayjs from "dayjs";

const doctors = [
  { id: "1", name: "BS. Lê Minh" },
  { id: "2", name: "BS. Nguyễn Lan" },
  { id: "3", name: "BS. Phạm Đức" },
];

const Header = ({ title }: { title: string }) => {
  const router = useRouter();
  return (
    <View className="flex-row items-center justify-between p-4">
      <Pressable onPress={() => router.back()} className="mr-4">
        <AntDesign name="left" size={24} color="white" />
      </Pressable>
      <Text className="text-2xl font-bold text-white">{title}</Text>
      <View style={{ width: 32 }} />
    </View>
  );
};

const AppointmentsCreateScreen = () => {
  const router = useRouter();
  const [doctorId, setDoctorId] = useState(doctors[0].id);
  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleConfirmDate = (date: Date) => {
    setSelectedDate(date);
    setDatePickerVisibility(false);
  };

  const handleCreateAppointment = () => {
    console.log("Tạo lịch hẹn với:", { doctorId, selectedDate, note });
    router.back();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 bg-[#121212]">
        <Header title="Tạo lịch hẹn" />
        <View className="mx-4 mt-6">
          <Text className="text-lg text-gray-300 mb-2">Chọn bác sĩ</Text>
          <View className="bg-gray-900 p-2 rounded-xl border border-gray-700">
            <Picker
              selectedValue={doctorId}
              onValueChange={(itemValue) => setDoctorId(itemValue)}
              style={{ color: "white" }}
            >
              {doctors.map((doctor) => (
                <Picker.Item
                  key={doctor.id}
                  label={doctor.name}
                  value={doctor.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View className="mx-4 mt-4">
          <Text className="text-lg text-gray-300 mb-2">Chọn ngày và giờ</Text>
          <Pressable
            onPress={() => setDatePickerVisibility(true)}
            className="bg-gray-900 p-4 rounded-xl border border-gray-700 flex-row items-center justify-between"
          >
            <Text className="text-white">
              {selectedDate
                ? dayjs(selectedDate).format("DD/MM/YYYY HH:mm")
                : "Chọn ngày và giờ"}
            </Text>
            <MaterialIcons name="event" size={24} color="white" />
          </Pressable>
        </View>

        <View className="mx-4 mt-4">
          <Text className="text-lg text-gray-300 mb-2">Ghi chú</Text>
          <TextInput
            className="bg-gray-900 text-white p-4 rounded-xl border border-gray-700 h-32"
            placeholder="Nhập ghi chú..."
            placeholderTextColor="gray"
            multiline
            value={note}
            onChangeText={setNote}
          />
        </View>

        <Pressable
          onPress={handleCreateAppointment}
          className="bg-[#4A90E2] p-4 rounded-xl mx-4 mt-6 items-center"
        >
          <Text className="text-white font-bold text-lg">Tạo lịch hẹn</Text>
        </Pressable>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirmDate}
          onCancel={() => setDatePickerVisibility(false)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AppointmentsCreateScreen;

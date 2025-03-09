import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Animated } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

const AppointmentsCreateScreen = () => {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [doctor, setDoctor] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const handleCreateAppointment = () => {
    if (!doctor || !specialty) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    console.log("Lịch hẹn đã được tạo:", { date, doctor, specialty });
    router.push("/(protected)/appointments");
  };

  return (
    <View className="flex-1 bg-[#121212]">
      <View className="flex-row items-center justify-between p-4">
        <Pressable onPress={() => router.back()} className="mr-4">
          <AntDesign name="left" size={24} color="white" />
        </Pressable>
        <Text className="text-2xl font-bold text-white">Thêm mới lịch hẹn</Text>
        <Pressable onPress={() => console.log("Search")}>
          <AntDesign name="search1" size={24} color="white" />
        </Pressable>
      </View>

      <View className="px-4 mt-4">
        <Pressable
          onPress={() => {
            setShowPicker(true);
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }).start();
          }}
          className="p-4 bg-gray-900 rounded-xl mb-4 border border-gray-700"
        >
          <Text className="text-white text-lg font-medium">
            📅 Ngày hẹn: {date.toLocaleDateString()}
          </Text>
        </Pressable>
        {showPicker && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              onChange={(_, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          </Animated.View>
        )}

        <TextInput
          placeholder="Nhập tên bác sĩ"
          placeholderTextColor="#A0A0A0"
          value={doctor}
          onChangeText={setDoctor}
          className="p-4 bg-gray-900 text-white rounded-xl mb-4 border border-gray-700"
        />
        <TextInput
          placeholder="Nhập chuyên khoa"
          placeholderTextColor="#A0A0A0"
          value={specialty}
          onChangeText={setSpecialty}
          className="p-4 bg-gray-900 text-white rounded-xl mb-6 border border-gray-700"
        />

        <Pressable
          onPress={handleCreateAppointment}
          className="bg-[#4A90E2] p-4 rounded-full flex-row items-center justify-center shadow-lg"
        >
          <AntDesign name="check" size={28} color="white" />
          <Text className="text-white font-semibold ml-3 text-lg">
            Tạo lịch hẹn
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default AppointmentsCreateScreen;

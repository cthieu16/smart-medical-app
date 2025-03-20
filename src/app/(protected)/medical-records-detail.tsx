import { AntDesign, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import dayjs from "dayjs";

const fakeMedicalRecord = {
  id: "1",
  patientId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  doctorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  appointmentId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  diagnosis: "Cảm cúm",
  symptoms: "Sốt, ho, đau họng",
  medicalHistory: "Không có tiền sử bệnh nghiêm trọng",
  testResults: "Không có dấu hiệu bất thường",
  createdAt: "2025-03-17T13:59:05.751Z",
  updatedAt: "2025-03-17T13:59:05.751Z",
};

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

const MedicalRecordDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const record = useMemo(
    () => (fakeMedicalRecord.id === id ? fakeMedicalRecord : null),
    [id]
  );

  if (!record) {
    return (
      <View className="flex-1 items-center justify-center bg-[#121212]">
        <Text className="text-gray-400">Hồ sơ bệnh án không tồn tại.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#121212]">
      <Header title="Chi tiết bệnh án" />
      <ScrollView className="px-4 py-6">
        <View className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
          <View className="flex-row items-center mb-4">
            <FontAwesome5 name="file-medical" size={22} color="#4ADE80" />
            <Text className="text-xl font-bold text-white ml-3">
              {record.diagnosis}
            </Text>
          </View>
          <Text className="text-gray-300 text-base mt-2">
            <MaterialIcons name="error-outline" size={18} color="gray" />
            <Text className="font-semibold"> Triệu chứng:</Text>{" "}
            {record.symptoms}
          </Text>
          <Text className="text-gray-300 text-base mt-2">
            <MaterialIcons name="history" size={18} color="gray" />
            <Text className="font-semibold"> Tiền sử bệnh:</Text>{" "}
            {record.medicalHistory}
          </Text>
          <Text className="text-gray-300 text-base mt-2">
            <MaterialIcons name="science" size={18} color="gray" />
            <Text className="font-semibold"> Xét nghiệm:</Text>{" "}
            {record.testResults}
          </Text>
          <View className="mt-6 border-t border-gray-600 pt-4">
            <Text className="text-gray-500 text-xs">
              Ngày tạo: {dayjs(record.createdAt).format("DD/MM/YYYY HH:mm")}
            </Text>
            <Text className="text-gray-500 text-xs">
              Cập nhật lần cuối:{" "}
              {dayjs(record.updatedAt).format("DD/MM/YYYY HH:mm")}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MedicalRecordDetailScreen;

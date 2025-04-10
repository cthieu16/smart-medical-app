import { AntDesign, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import dayjs from "dayjs";
import { useMedicalRecordDetail } from "@/src/hooks/useMedicalRecords";
import { Header } from "@/src/components/Header/Header";

const MedicalRecordDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const {
    data: record,
    isLoading,
    isError,
  } = useMedicalRecordDetail(id as string);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0D1117]">
        <ActivityIndicator size="large" color="#4ADE80" />
        <Text className="text-gray-400 mt-4">Đang tải hồ sơ bệnh án...</Text>
      </View>
    );
  }

  if (isError || !record) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0D1117]">
        <Text className="text-gray-400">
          Hồ sơ bệnh án không tồn tại hoặc xảy ra lỗi.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0D1117]">
      <Header title="Chi tiết bệnh án" />
      <ScrollView className="px-4 py-6">
        <View className="bg-[#161B22] p-6 rounded-2xl shadow-lg border border-gray-700">
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
            {record.testResults || "Không có"}
          </Text>
          <View className="mt-6 border-t border-gray-600 pt-4 flex-col gap-2">
            <Text className="text-gray-500 text-xs">
              Ngày tạo: {dayjs(record.createdAt).format("DD/MM/YYYY HH:mm")}
            </Text>
            <Text className="text-gray-500 text-xs">
              Cập nhật lần cuối:{" "}
              {dayjs(record.updatedAt).format("DD/MM/YYYY HH:mm")}
            </Text>
          </View>
          <View className="flex-row justify-end mt-4">
            <Pressable
              onPress={() => {
                console.log(record);
              }}
              className="flex-row items-center bg-green-600 px-4 py-2 rounded-xl"
            >
              <AntDesign name="download" size={18} color="white" />
              <Text className="text-white font-medium ml-2">Tải xuống</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MedicalRecordDetailScreen;

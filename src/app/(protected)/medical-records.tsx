import { AntDesign, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import dayjs from "dayjs";
import { Header } from "@/src/components/Header/Header";

interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  diagnosis: string;
  symptoms: string;
  medicalHistory: string;
  testResults: string;
  createdAt: string;
  updatedAt: string;
}

const fakeMedicalRecords: MedicalRecord[] = [
  {
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
  },
  {
    id: "2",
    patientId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    doctorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    appointmentId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    diagnosis: "Đau dạ dày",
    symptoms: "Đau bụng, buồn nôn",
    medicalHistory: "Có tiền sử viêm loét dạ dày",
    testResults: "Cần nội soi để kiểm tra chi tiết hơn",
    createdAt: "2025-03-16T10:45:00.000Z",
    updatedAt: "2025-03-16T10:45:00.000Z",
  },
];

const MedicalRecordItem = ({ record }: { record: MedicalRecord }) => {
  const router = useRouter();
  return (
    <Pressable
      onPress={() =>
        router.push(`/(protected)/medical-records-detail?id=${record.id}`)
      }
      className="bg-[#161B22] mx-4 p-5 rounded-2xl mt-3 shadow-lg flex-row justify-between items-center"
    >
      <View className="flex-1">
        <View className="flex-row items-center">
          <FontAwesome5 name="file-medical" size={20} color="#4ADE80" />
          <Text className="text-lg font-bold text-white ml-2">
            {record.diagnosis}
          </Text>
        </View>
        <Text className="text-gray-300 text-sm mt-1">
          Triệu chứng: {record.symptoms}
        </Text>
        <Text className="text-gray-300 text-sm mt-1">
          Tiền sử: {record.medicalHistory}
        </Text>
        <Text className="text-gray-300 text-sm mt-1">
          Xét nghiệm: {record.testResults}
        </Text>
        <Text className="text-gray-500 text-xs mt-2">
          Ngày tạo: {dayjs(record.createdAt).format("DD/MM/YYYY HH:mm")}
        </Text>
      </View>
      <AntDesign name="right" size={20} color="white" />
    </Pressable>
  );
};

const MedicalRecordsScreen: React.FC = () => {
  const medicalRecords = useMemo(() => fakeMedicalRecords, []);

  return (
    <View className="flex-1 bg-[#0D1117]">
      <Header title="Hồ sơ bệnh án" />
      <FlatList
        data={medicalRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MedicalRecordItem record={item} />}
        contentContainerStyle={{ paddingVertical: 10 }}
        ListEmptyComponent={
          <View className="items-center mt-10">
            <MaterialIcons name="event-busy" size={50} color="gray" />
            <Text className="text-gray-400 text-center mt-2">
              Không có hồ sơ bệnh án nào.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default MedicalRecordsScreen;

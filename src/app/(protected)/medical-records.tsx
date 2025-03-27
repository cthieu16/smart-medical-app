import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo, useCallback, useMemo } from "react";
import { FlatList, Pressable, Text, View, StyleSheet } from "react-native";
import dayjs from "dayjs";
import { useMedicalRecords } from "@/src/hooks/useMedicalRecords";
import { useMyDoctors } from "@/src/hooks/useDoctors";
import { Header } from "@/src/components/Header/Header";

type MedicalRecord = {
  id: string;
  patientName: string | null;
  patientId: string;
  code: string;
  doctorId: string;
  diagnosis: string;
  symptoms: string;
  medicalHistory: string;
  examinationDate: string;
  testResults: string | null;
  createdAt: string;
  updatedAt: string;
};

type Doctor = {
  id: string;
  fullName: string;
};

type MedicalRecordItemProps = {
  record: MedicalRecord;
  doctor?: Doctor;
};

const MedicalRecordItem = memo(({ record, doctor }: MedicalRecordItemProps) => {
  const router = useRouter();

  const handleDetail = useCallback(() => {
    router.push(`/(protected)/medical-records-detail?id=${record.id}`);
  }, [record.id, router]);

  return (
    <Pressable
      onPress={handleDetail}
      className="bg-[#161B22] mx-4 p-4 rounded-2xl mt-3 shadow-lg flex-row justify-between items-center"
    >
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <MaterialIcons name="event" size={20} color="#8B949E" />
          <Text className="text-[#fff] text-lg font-bold ml-2">
            {dayjs(record.examinationDate).format("DD/MM/YYYY")}
          </Text>
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
        <View className="flex-row items-center mt-1">
          <MaterialIcons name="healing" size={16} color="#8B949E" />
          <Text className="text-gray-400 text-sm ml-2">
            Chẩn đoán:{" "}
            <Text className="text-[#fff] font-medium">{record.diagnosis}</Text>
          </Text>
        </View>
        <View className="flex-row items-center mt-1">
          <MaterialIcons name="notes" size={16} color="#8B949E" />
          <Text className="text-gray-400 text-sm ml-2">
            Tiền sử bệnh:{" "}
            <Text className="text-gray-300">{record.medicalHistory}</Text>
          </Text>
        </View>
      </View>
      <AntDesign name="right" size={20} color="#8B949E" />
    </Pressable>
  );
});

const MedicalRecordsScreen = () => {
  const router = useRouter();
  const { data: medicalRecords = [] } = useMedicalRecords();
  const { data: doctors = [] } = useMyDoctors();

  const doctorMap = useMemo(
    () => Object.fromEntries(doctors.map((doctor) => [doctor.id, doctor])),
    [doctors]
  );

  return (
    <View className="flex-1 bg-[#0D1117]">
      <Header title="Hồ sơ bệnh án" />
      <View className="flex-row items-center mx-4 mt-6">
        <MaterialIcons name="medical-services" size={20} color="#8B949E" />
        <Text className="text-lg font-semibold text-gray-300 ml-2">
          Danh sách hồ sơ bệnh án
        </Text>
      </View>
      <FlatList
        data={medicalRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MedicalRecordItem record={item} doctor={doctorMap[item.doctorId]} />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View className="items-center mt-6">
            <MaterialIcons name="medical-services" size={50} color="#8B949E" />
            <Text className="text-gray-400 text-center mt-2">
              Không có hồ sơ bệnh án nào.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 10,
  },
});

export default MedicalRecordsScreen;

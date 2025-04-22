import { AntDesign, FontAwesome, MaterialIcons, FontAwesome5, Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo, useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  SafeAreaView
} from "react-native";
import dayjs from "dayjs";
import { useMedicalRecords } from "@/src/hooks/useMedicalRecords";
import { useMyDoctors } from "@/src/hooks/useDoctors";
import { Header } from "@/src/components/Header/Header";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

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
  index: number;
};

const MedicalRecordItem = memo(({ record, doctor, index }: MedicalRecordItemProps) => {
  const router = useRouter();

  const handleDetail = useCallback(() => {
    router.push(`/(protected)/medical-records-detail?id=${record.id}`);
  }, [record.id, router]);

  const isRecent = dayjs(record.examinationDate).isAfter(dayjs().subtract(7, 'day'));
  const formattedDate = dayjs(record.examinationDate).format("DD/MM/YYYY");

  // Generate a deterministic color based on the diagnosis text
  const getColorForDiagnosis = (text: string): string => {
    const colors = ['#4A90E2', '#6C5CE7', '#EC4899', '#F59E0B', '#8B5CF6'];
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const diagnosisColor = getColorForDiagnosis(record.diagnosis);

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).duration(400)}
      className="mx-6 my-3"
    >
      <TouchableOpacity
        onPress={handleDetail}
        className="bg-[#161B22] rounded-xl shadow-lg overflow-hidden active:opacity-90 border border-[#30363D]"
        activeOpacity={0.8}
        style={styles.cardShadow}
      >
        {/* Colored Side Indicator */}
        <LinearGradient
          colors={[diagnosisColor, `${diagnosisColor}80`]}
          className="absolute left-0 top-0 bottom-0 w-1.5"
        />

        <View className="p-4 pl-5">
          {/* Header with Date & Badge */}
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-row items-center gap-2">
              <LinearGradient
                colors={['#161B22', '#161B22']}
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
              >
                <MaterialIcons
                  name="event-note"
                  size={20}
                  color={diagnosisColor}
                />
              </LinearGradient>
              <View>
                <Text className="text-white text-base font-bold">
                  {formattedDate}
                </Text>
                <Text className="text-gray-400 text-xs">
                  ID: {record.code}
                </Text>
              </View>
            </View>

            {isRecent && (
              <View className="bg-[#4A90E230] px-2.5 py-1 rounded-full border border-[#4A90E240]">
                <Text className="text-xs text-[#4A90E2] font-medium">Gần đây</Text>
              </View>
            )}
          </View>

          {/* Diagnosis */}
          <View className="mb-3 mt-2 bg-[#0D111780] p-3 rounded-xl border border-[#30363D40]">
            <Text className="text-gray-400 text-xs mb-1">Chẩn đoán</Text>
            <Text className="text-white font-medium text-base" numberOfLines={2}>
              {record.diagnosis}
            </Text>
          </View>

          {/* Doctor & Action */}
          <View className="flex-row justify-between items-center mt-2">
            <View className="flex-row items-center flex-1">
              <FontAwesome name="user-md" size={13} color="gray" />
              <Text className="text-gray-400 text-sm ml-2 mr-1">
                Bác sĩ:
              </Text>
              <Text className="text-white text-sm" numberOfLines={1} ellipsizeMode="tail">
                {doctor?.fullName || "Chưa xác định"}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleDetail}
              className="bg-[#21262D] px-3.5 py-2 rounded-xl flex-row items-center border border-[#30363D]"
            >
              <Text className="text-white text-xs mr-1.5">Chi tiết</Text>
              <AntDesign name="right" size={12} color="#4A90E2" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

const EmptyState = () => (
  <Animated.View
    className="items-center mt-12 px-4"
    entering={FadeInDown.delay(300).duration(400)}
  >
    <LinearGradient
      colors={['#21262D', '#161B22']}
      className="w-20 h-20 rounded-full items-center justify-center mb-4"
    >
      <MaterialIcons name="medical-services" size={50} color="#4A90E2" />
    </LinearGradient>
    <Text className="text-white text-center mt-4 text-lg font-medium">
      Chưa có hồ sơ bệnh án
    </Text>
    <Text className="text-gray-400 text-center mt-2 text-sm px-10 leading-5">
      Hồ sơ bệnh án sẽ được hiển thị ở đây sau khi bạn khám bệnh
    </Text>
  </Animated.View>
);

const MedicalRecordsScreen = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const { data: medicalRecords = [], refetch } = useMedicalRecords();
  const { data: doctors = [] } = useMyDoctors();

  React.useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const doctorMap = useMemo(
    () => Object.fromEntries(doctors.map((doctor) => [doctor.id, doctor])),
    [doctors]
  );

  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text className="text-white mt-4">Đang tải hồ sơ bệnh án...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <Header title="Hồ sơ bệnh án" />

      {/* Header Section */}
      <Animated.View
        className="mx-6 mt-4 mb-2"
        entering={FadeInDown.delay(200).duration(400)}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <LinearGradient
              colors={['#4A90E2', '#366DAF']}
              className="w-1.5 h-7 rounded-full mr-2.5"
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
            <Text className="text-xl font-bold text-white">
              Hồ sơ bệnh án
            </Text>
          </View>

          <TouchableOpacity
            onPress={onRefresh}
            className="bg-[#21262D] rounded-full p-2.5 border border-[#30363D]"
          >
            <Feather name="refresh-cw" size={18} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        <Text className="text-gray-400 text-sm mt-2 ml-4">
          Tổng số: {medicalRecords.length} hồ sơ
        </Text>
      </Animated.View>

      {/* Records List */}
      <FlatList
        data={medicalRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <MedicalRecordItem
            record={item}
            doctor={doctorMap[item.doctorId]}
            index={index}
          />
        )}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4A90E2"
            colors={["#4A90E2"]}
          />
        }
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 10,
    paddingBottom: 100,
  },
  cardShadow: {
    shadowColor: "#4A90E2",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    shadowColor: "#4A90E2",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  }
});

export default MedicalRecordsScreen;

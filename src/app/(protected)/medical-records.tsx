import { AntDesign, FontAwesome, MaterialIcons, FontAwesome5, Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo, useCallback, useMemo, useState } from "react";
import { 
  FlatList, 
  Pressable, 
  Text, 
  View, 
  StyleSheet, 
  RefreshControl, 
  TouchableOpacity,
  ActivityIndicator 
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
    const colors = ['#4ADE80', '#3B82F6', '#EC4899', '#F59E0B', '#8B5CF6'];
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };
  
  const diagnosisColor = getColorForDiagnosis(record.diagnosis);

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).duration(400)}
      className="mx-4 my-2.5"
    >
      <Pressable
        onPress={handleDetail}
        className="bg-[#161B22] rounded-2xl shadow-lg overflow-hidden active:opacity-90 border border-[#30363D]"
      >
        {/* Colored Side Indicator */}
        <View className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: diagnosisColor }} />
        
        <View className="p-4 pl-5">
          {/* Header with Date & Badge */}
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-row items-center">
              <View className="w-9 h-9 rounded-full bg-[#21262D] items-center justify-center mr-3">
                <MaterialIcons 
                  name="event-note" 
                  size={18} 
                  color={diagnosisColor} 
                />
              </View>
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
              <View className="bg-[#4ADE8020] px-2 py-1 rounded-full">
                <Text className="text-xs text-[#4ADE80] font-medium">Gần đây</Text>
              </View>
            )}
          </View>
          
          {/* Diagnosis */}
          <View className="mb-3 mt-1">
            <Text className="text-gray-400 text-xs mb-1">Chẩn đoán</Text>
            <Text className="text-white font-medium text-base" numberOfLines={2}>
              {record.diagnosis}
            </Text>
          </View>
          
          {/* Doctor & Action */}
          <View className="flex-row justify-between items-center mt-3">
            <View className="flex-row items-center flex-1">
              <FontAwesome name="user-md" size={14} color="#8B949E" />
              <Text className="text-gray-400 text-sm ml-2 mr-1">
                Bác sĩ:
              </Text>
              <Text className="text-white text-sm" numberOfLines={1} ellipsizeMode="tail">
                {doctor?.fullName || "Chưa xác định"}
              </Text>
            </View>
            
            <TouchableOpacity 
              onPress={handleDetail}
              className="bg-[#21262D] px-3 py-1.5 rounded-lg flex-row items-center"
            >
              <Text className="text-white text-xs mr-1">Xem chi tiết</Text>
              <AntDesign name="right" size={12} color="#8B949E" />
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
});

const EmptyState = () => (
  <Animated.View 
    className="items-center mt-10 px-4"
    entering={FadeInDown.delay(300).duration(400)}
  >
    <MaterialIcons name="medical-services" size={70} color="#8B949E" />
    <Text className="text-gray-400 text-center mt-4 text-base">
      Bạn chưa có hồ sơ bệnh án nào.
    </Text>
    <Text className="text-gray-500 text-center mt-2 text-sm px-6">
      Hồ sơ bệnh án sẽ được hiển thị ở đây sau khi bạn khám bệnh.
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
      <View className="flex-1 bg-[#0D1117] justify-center items-center">
        <ActivityIndicator size="large" color="#4ADE80" />
        <Text className="text-white mt-4">Đang tải hồ sơ bệnh án...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0D1117]">
      <Header title="Hồ sơ bệnh án" />
      
      {/* Header Section */}
      <Animated.View 
        className="mx-4 mt-4 mb-2"
        entering={FadeInDown.delay(200).duration(400)}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <LinearGradient
              colors={['#4ADE80', '#22C55E']}
              className="w-1 h-6 rounded-full mr-2"
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
            <Text className="text-xl font-bold text-white">
              Hồ sơ bệnh án
            </Text>
          </View>
          
          <TouchableOpacity 
            onPress={onRefresh}
            className="bg-[#21262D] rounded-full p-2"
          >
            <Feather name="refresh-cw" size={18} color="#8B949E" />
          </TouchableOpacity>
        </View>
        
        <Text className="text-gray-400 text-sm mt-2 ml-3">
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
            tintColor="#4ADE80"
            colors={["#4ADE80"]}
          />
        }
        ListEmptyComponent={<EmptyState />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 10,
    paddingBottom: 40,
  },
});

export default MedicalRecordsScreen;

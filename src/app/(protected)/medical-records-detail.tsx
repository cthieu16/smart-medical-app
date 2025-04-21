import { AntDesign, FontAwesome5, MaterialIcons, Ionicons, Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, ReactNode } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Share
} from "react-native";
import dayjs from "dayjs";
import { useMedicalRecordDetail } from "@/src/hooks/useMedicalRecords";
import { Header } from "@/src/components/Header/Header";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

interface DetailItemProps {
  icon: ReactNode;
  label: string;
  value: string | null;
  iconColor?: string;
}

const DetailItem = ({ icon, label, value, iconColor = "#8B949E" }: DetailItemProps) => {
  return (
    <Animated.View
      className="mt-3"
      entering={FadeInDown.duration(400)}
    >
      <View className="flex-row items-start">
        <View className="w-8 h-8 bg-[#21262D] rounded-full items-center justify-center">
          {icon}
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-gray-400 text-sm">{label}</Text>
          <Text className="text-white text-base mt-1">{value || "Không có"}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const MedicalRecordDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    data: record,
    isLoading,
    isError,
  } = useMedicalRecordDetail(id as string);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsDownloading(false);
      Alert.alert(
        "Tải xuống thành công",
        "Hồ sơ bệnh án đã được lưu vào thiết bị của bạn.",
        [{ text: "OK" }]
      );
    } catch (error) {
      setIsDownloading(false);
      Alert.alert("Lỗi", "Không thể tải xuống hồ sơ bệnh án.");
    }
  };

  const handleShare = async () => {
    if (!record) return;

    try {
      await Share.share({
        message: `Hồ sơ bệnh án: ${record.diagnosis}\nTriệu chứng: ${record.symptoms}\nNgày khám: ${dayjs(record.examinationDate).format("DD/MM/YYYY")}`,
        title: `Hồ sơ bệnh án: ${record.diagnosis}`,
      });
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chia sẻ hồ sơ bệnh án.");
    }
  };

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
        <Ionicons name="alert-circle-outline" size={60} color="#F87171" />
        <Text className="text-gray-400 mt-4 text-center px-6">
          Hồ sơ bệnh án không tồn tại hoặc xảy ra lỗi.
        </Text>
        <TouchableOpacity
          className="mt-6 bg-[#21262D] px-6 py-3 rounded-full"
          onPress={() => router.back()}
        >
          <Text className="text-white">Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0D1117]">
      <Header title="Chi tiết bệnh án" />

      <ScrollView className="flex-1">
        {/* Hero Section */}
        <Animated.View
          className="mb-4"
          entering={FadeInDown.duration(400)}
        >
          <LinearGradient
            colors={["rgba(74, 222, 128, 0.2)", "rgba(74, 222, 128, 0.05)"]}
            className="px-5 pt-4 pb-6 mb-2"
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-[#21262D] rounded-full items-center justify-center">
                <FontAwesome5 name="file-medical" size={24} color="#4ADE80" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-xs text-gray-400">Chẩn đoán</Text>
                <Text className="text-xl font-bold text-white mt-1" numberOfLines={2}>
                  {record.diagnosis}
                </Text>
              </View>
            </View>

            <View className="mt-4 flex-row justify-between">
              <View className="bg-[#21262D] px-3 py-2 rounded-xl flex-row items-center">
                <Feather name="calendar" size={14} color="#8B949E" />
                <Text className="text-gray-300 ml-2 text-sm">
                  {dayjs(record.examinationDate).format("DD/MM/YYYY")}
                </Text>
              </View>

              <View className="bg-[#21262D] px-3 py-2 rounded-xl flex-row items-center">
                <Feather name="hash" size={14} color="#8B949E" />
                <Text className="text-gray-300 ml-2 text-sm">
                  {record.code}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Details Content */}
        <View className="px-5 pb-10">
          <DetailItem
            icon={<MaterialIcons name="error-outline" size={18} color="#F59E0B" />}
            label="Triệu chứng"
            value={record.symptoms}
            iconColor="#F59E0B"
          />

          <DetailItem
            icon={<MaterialIcons name="history" size={18} color="#3B82F6" />}
            label="Tiền sử bệnh"
            value={record.medicalHistory}
            iconColor="#3B82F6"
          />

          <DetailItem
            icon={<MaterialIcons name="science" size={18} color="#EC4899" />}
            label="Xét nghiệm"
            value={record.testResults}
            iconColor="#EC4899"
          />

          <DetailItem
            icon={<MaterialIcons name="person" size={18} color="#8B5CF6" />}
            label="Bệnh nhân"
            value={record.patientName || "Không có thông tin"}
            iconColor="#8B5CF6"
          />

          {/* Time Stamps */}
          <Animated.View
            className="mt-6 border-t border-gray-700 pt-4"
            entering={FadeInDown.delay(200).duration(400)}
          >
            <View className="flex-row justify-between">
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={14} color="#8B949E" />
                <Text className="text-gray-500 text-xs ml-1">
                  Ngày tạo: {dayjs(record.createdAt).format("DD/MM/YYYY HH:mm")}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="refresh-outline" size={14} color="#8B949E" />
                <Text className="text-gray-500 text-xs ml-1">
                  Cập nhật: {dayjs(record.updatedAt).format("DD/MM/YYYY HH:mm")}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View
            className="flex-row justify-between mt-6"
            entering={FadeInDown.delay(300).duration(400)}
          >
            <TouchableOpacity
              onPress={handleShare}
              className="flex-row items-center bg-[#21262D] px-4 py-3 rounded-xl flex-1 mr-2 justify-center"
              activeOpacity={0.7}
            >
              <Ionicons name="share-social-outline" size={18} color="white" />
              <Text className="text-white font-medium ml-2">Chia sẻ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDownload}
              className="flex-row items-center bg-green-600 px-4 py-3 rounded-xl flex-1 ml-2 justify-center"
              activeOpacity={0.7}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <AntDesign name="download" size={18} color="white" />
                  <Text className="text-white font-medium ml-2">Tải xuống</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MedicalRecordDetailScreen;

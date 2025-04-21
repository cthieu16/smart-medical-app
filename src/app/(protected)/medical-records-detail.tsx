import { AntDesign, FontAwesome5, MaterialIcons, Ionicons, Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, ReactNode } from "react";
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Share,
  SafeAreaView,
  StatusBar,
  Platform,
  Linking
} from "react-native";
import dayjs from "dayjs";
import { useMedicalRecordDetail } from "@/src/hooks/useMedicalRecords";
import { Header } from "@/src/components/Header/Header";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

/*
 * CHÚ Ý: Để tải xuống PDF, bạn cần cài đặt các thư viện sau:
 *
 * 1. react-native-pdf: Để hiển thị PDF
 *    npm install react-native-pdf
 *    # hoặc với yarn
 *    yarn add react-native-pdf
 *
 * 2. react-native-fs: Để quản lý file system
 *    npm install react-native-fs
 *    # hoặc với yarn
 *    yarn add react-native-fs
 *
 * 3. react-native-blob-util: Để xử lý dữ liệu dạng blob và tải tệp
 *    npm install react-native-blob-util
 *    # hoặc với yarn
 *    yarn add react-native-blob-util
 *
 * 4. Với Expo, bạn cần cài đặt:
 *    npx expo install expo-file-system
 *    npx expo install expo-sharing
 *
 * Sau khi cài đặt, bạn cần chạy:
 * npx pod-install
 * Hoặc với Expo: npx expo prebuild
 */

// Sau khi cài đặt các thư viện, bỏ comment các dòng import dưới đây:
// import FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';

interface DetailItemProps {
  icon: ReactNode;
  label: string;
  value: string | null;
  iconColor?: string;
}

const DetailItem = ({ icon, label, value, iconColor = "gray" }: DetailItemProps) => {
  return (
    <Animated.View
      className="mt-4"
      entering={FadeInDown.duration(400)}
    >
      <View className="flex-row items-start">
        <LinearGradient
          colors={['black', 'black']}
          className="w-10 h-10 rounded-full items-center justify-center"
        >
          {icon}
        </LinearGradient>
        <View className="ml-4 flex-1">
          <Text className="text-gray-400 text-sm">{label}</Text>
          <View className="bg-[#161B2280] p-3 rounded-xl mt-2 border border-[#30363D40]">
            <Text className="text-white text-base">{value || "Không có"}</Text>
          </View>
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

  /**
   * Hàm tạo nội dung PDF từ dữ liệu hồ sơ y tế
   * Trong môi trường thực tế, bạn sẽ gọi API từ backend để tạo PDF
   */
  const generatePDF = async () => {
    if (!record) return null;

    // Trong môi trường thực tế, đây sẽ là URL của API tạo PDF
    // const pdfUrl = `https://your-api.com/generate-pdf?id=${record.id}`;

    // Đây là URL mẫu cho việc demo, bạn cần thay thế bằng URL thực tế
    const dummyPdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    return dummyPdfUrl;
  };

  /**
   * Tải xuống và lưu file PDF
   * Sử dụng expo-file-system và expo-sharing
   */
  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      if (Platform.OS === 'web') {
        Alert.alert(
          "Không hỗ trợ",
          "Tính năng tải xuống không hỗ trợ trên web.",
          [{ text: "OK" }]
        );
        setIsDownloading(false);
        return;
      }

      // Demo: Tạo độ trễ giả lập quá trình tải xuống
      await new Promise(resolve => setTimeout(resolve, 1500));

      /*
      // CODE SẼ ĐƯỢC SỬ DỤNG SAU KHI CÀI ĐẶT THƯ VIỆN:

      // Lấy URL PDF từ hàm tạo PDF
      const pdfUrl = await generatePDF();
      if (!pdfUrl) {
        throw new Error("Không thể tạo PDF");
      }

      // Tạo tên file từ thông tin bệnh án
      const fileName = `HoSoBenhAn_${record?.code || id}_${dayjs().format("DDMMYYYY")}.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      // Tải file từ URL và lưu vào thiết bị
      const downloadResumable = FileSystem.createDownloadResumable(
        pdfUrl,
        fileUri
      );

      const { uri } = await downloadResumable.downloadAsync();

      // Kiểm tra xem thiết bị có hỗ trợ chia sẻ không
      const isSharingAvailable = await Sharing.isAvailableAsync();

      if (isSharingAvailable) {
        // Mở menu chia sẻ hoặc lưu
        await Sharing.shareAsync(uri);
      } else {
        // Thông báo thành công nếu không thể chia sẻ
        Alert.alert(
          "Tải xuống thành công",
          `Hồ sơ bệnh án đã được lưu vào: ${uri}`,
          [{ text: "OK" }]
        );
      }
      */

      // Demo: Thông báo thành công
      setIsDownloading(false);
      Alert.alert(
        "Tải xuống thành công",
        "Hồ sơ bệnh án đã được lưu vào thiết bị của bạn.",
        [{ text: "OK" }]
      );
    } catch (error) {
      setIsDownloading(false);
      Alert.alert("Lỗi", "Không thể tải xuống hồ sơ bệnh án.");
      console.error("Download error:", error);
    }
  };

  /**
   * Hiển thị PDF online (phương án thay thế cho việc tải xuống)
   */
  const handleViewPDF = async () => {
    try {
      // Lấy URL PDF từ hàm tạo PDF
      const pdfUrl = await generatePDF();
      if (!pdfUrl) {
        throw new Error("Không thể tạo PDF");
      }

      // Mở URL trong trình duyệt
      await Linking.openURL(pdfUrl);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể mở hồ sơ bệnh án.");
      console.error("View PDF error:", error);
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
      <View className="flex-1 items-center justify-center bg-black">
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text className="text-gray-300 mt-4">Đang tải hồ sơ bệnh án...</Text>
      </View>
    );
  }

  if (isError || !record) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <StatusBar barStyle="light-content" />
        <Ionicons name="alert-circle-outline" size={60} color="#F87171" />
        <Text className="text-white text-center px-6 mt-4">
          Hồ sơ bệnh án không tồn tại hoặc xảy ra lỗi.
        </Text>
        <TouchableOpacity
          className="mt-6 bg-[#21262D] px-6 py-3 rounded-full border border-[#30363D]"
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text className="text-white font-medium">Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <Header title="Chi tiết bệnh án" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Animated.View
          className="mt-2 mb-4"
          entering={FadeInDown.duration(400)}
        >
          <LinearGradient
            colors={["rgba(74, 144, 226, 0.2)", "rgba(74, 144, 226, 0.05)"]}
            className="px-6 pt-5 pb-6"
          >
            <View className="flex-row items-center px-6 pt-2">
              <View className="w-14 h-14 bg-[#21262D] rounded-full items-center justify-center border border-[#30363D]">
                <FontAwesome5 name="file-medical" size={28} color="#4A90E2" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-xs text-gray-400">Chẩn đoán</Text>
                <Text className="text-xl font-bold text-white mt-1" numberOfLines={2}>
                  {record.diagnosis}
                </Text>
              </View>
            </View>

            <View className="mt-5 flex-row justify-between px-6 pb-2">
              <View className="bg-[#21262D] px-4 py-2.5 rounded-xl flex-row items-center border border-[#30363D60]">
                <Feather name="calendar" size={16} color="#4A90E2" />
                <Text className="text-white ml-2 text-sm font-medium">
                  {dayjs(record.examinationDate).format("DD/MM/YYYY")}
                </Text>
              </View>

              <View className="bg-[#21262D] px-4 py-2.5 rounded-xl flex-row items-center border border-[#30363D60]">
                <Feather name="hash" size={16} color="#4A90E2" />
                <Text className="text-white ml-2 text-sm font-medium">
                  {record.code}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Details Content */}
        <View className="px-6 pb-10">
          <DetailItem
            icon={<MaterialIcons name="error-outline" size={22} color="#F59E0B" />}
            label="Triệu chứng"
            value={record.symptoms}
            iconColor="#F59E0B"
          />

          <DetailItem
            icon={<MaterialIcons name="history" size={22} color="#3B82F6" />}
            label="Tiền sử bệnh"
            value={record.medicalHistory}
            iconColor="#3B82F6"
          />

          <DetailItem
            icon={<MaterialIcons name="science" size={22} color="#EC4899" />}
            label="Xét nghiệm"
            value={record.testResults}
            iconColor="#EC4899"
          />

          <DetailItem
            icon={<MaterialIcons name="person" size={22} color="#8B5CF6" />}
            label="Bệnh nhân"
            value={record.patientName || "Không có thông tin"}
            iconColor="#8B5CF6"
          />

          {/* Time Stamps */}
          <Animated.View
            className="mt-8 border-t border-gray-800 pt-4"
            entering={FadeInDown.delay(200).duration(400)}
          >
            <View className="bg-[#161B2280] p-3 rounded-xl border border-[#30363D40]">
              <View className="flex-row justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={14} color="#4A90E2" />
                  <Text className="text-gray-400 text-xs ml-1">
                    Ngày tạo: {dayjs(record.createdAt).format("DD/MM/YYYY HH:mm")}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Ionicons name="refresh-outline" size={14} color="#4A90E2" />
                  <Text className="text-gray-400 text-xs ml-1">
                    Cập nhật: {dayjs(record.updatedAt).format("DD/MM/YYYY HH:mm")}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View
            className="flex-row justify-between mt-8"
            entering={FadeInDown.delay(300).duration(400)}
          >
            <TouchableOpacity
              onPress={handleShare}
              className="flex-row items-center bg-[#21262D] px-4 py-3.5 rounded-xl flex-1 mr-2.5 justify-center border border-[#30363D]"
              activeOpacity={0.7}
            >
              <Ionicons name="share-social-outline" size={20} color="white" />
              <Text className="text-white font-medium ml-2.5">Chia sẻ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDownload}
              className="flex-row items-center bg-[#4A90E2] px-4 py-3.5 rounded-xl flex-1 ml-2.5 justify-center"
              activeOpacity={0.7}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <AntDesign name="download" size={20} color="white" />
                  <Text className="text-white font-medium ml-2.5">Tải PDF</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* PDF Preview Button */}
          <TouchableOpacity
            onPress={handleViewPDF}
            className="flex-row items-center bg-[#21262D] px-4 py-3.5 rounded-xl justify-center mt-4 border border-[#30363D]"
            activeOpacity={0.7}
          >
            <MaterialIcons name="picture-as-pdf" size={20} color="#EC4899" />
            <Text className="text-white font-medium ml-2.5">Xem PDF trực tuyến</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MedicalRecordDetailScreen;

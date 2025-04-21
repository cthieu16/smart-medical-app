import { AntDesign, FontAwesome, MaterialIcons, Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator, StatusBar, SafeAreaView } from "react-native";
import dayjs from "dayjs";
import {
  useAppointmentDetail,
  useUpdateAppointmentStatus,
} from "@/src/hooks/useAppointments";
import { useMyDoctors } from "@/src/hooks/useDoctors";
import { Header } from "@/src/components/Header/Header";
import Animated, { FadeIn, FadeInDown, SlideInRight, FadeInLeft } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

type Status = "CONFIRMED" | "PENDING" | "CANCELLED";

// Đối tượng cấu hình hiện đại hơn cho từng trạng thái
const STATUS_CONFIG: Record<Status, {
  label: string;
  color: string;
  secondaryColor: string;
  gradientColors: readonly string[];
  iconName: string;
  iconSet: "MaterialCommunityIcons";
  description: string;
  shape: React.ReactNode;
  emoji: string;
}> = {
  CONFIRMED: {
    label: "Đã xác nhận",
    color: "#4CAF50",
    secondaryColor: "#E8F5E9",
    gradientColors: ["#2E7D32", "#388E3C", "#43A047"] as const,
    iconName: "check-circle",
    iconSet: "MaterialCommunityIcons",
    description: "Lịch hẹn đã được xác nhận. Vui lòng đến đúng giờ.",
    shape: <View className="w-32 h-32 rounded-full bg-green-800/10 absolute -right-10 -top-10" />,
    emoji: "✅"
  },
  PENDING: {
    label: "Chờ xác nhận",
    color: "#FF9800",
    secondaryColor: "#FFF3E0",
    gradientColors: ["#E65100", "#EF6C00", "#F57C00"] as const,
    iconName: "timer-sand",
    iconSet: "MaterialCommunityIcons",
    description: "Lịch hẹn đang chờ xác nhận. Chúng tôi sẽ thông báo khi có kết quả.",
    shape: <View className="w-40 h-40 rounded-full bg-orange-800/10 absolute -right-20 -top-20" />,
    emoji: "⏳"
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "#F44336",
    secondaryColor: "#FFEBEE",
    gradientColors: ["#B71C1C", "#C62828", "#D32F2F"] as const,
    iconName: "close-circle",
    iconSet: "MaterialCommunityIcons",
    description: "Lịch hẹn đã bị hủy.",
    shape: <View className="w-36 h-36 rounded-full bg-red-800/10 absolute -right-14 -top-14" />,
    emoji: "❌"
  },
};

// Component hiển thị chi tiết từng mục
const DetailItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <View className="mb-4">
    <View className="flex-row items-center mb-1">
      <View className="mr-2">{icon}</View>
      <Text className="text-gray-400 text-xs font-medium">{label}</Text>
    </View>
    <Text className="text-white text-base font-medium pl-8">{value}</Text>
  </View>
);

// Component hiển thị badge cho trạng thái
const StatusBadge = ({ status }: { status: Status }) => {
  const { color, label, iconName } = STATUS_CONFIG[status];

  return (
    <View className="flex-row items-center bg-[#21262D] py-1.5 px-3 rounded-full self-start">
      <MaterialCommunityIcons name={iconName as any} size={16} color={color} />
      <Text className="ml-1 font-medium" style={{ color }}>
        {label}
      </Text>
    </View>
  );
};

const AppointmentsDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: appointment, refetch } = useAppointmentDetail(id as string);
  const { data: doctors = [] } = useMyDoctors();
  const { mutate: updateStatus } = useUpdateAppointmentStatus();

  const doctor = doctors.find((doc) => doc.id === appointment?.doctorId);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleCancel = () => {
    Alert.alert(
      "Xác nhận hủy lịch hẹn",
      "Bạn có chắc chắn muốn hủy lịch hẹn này không?",
      [
        { text: "Không", style: "cancel" },
        {
          text: "Có, hủy lịch",
          style: "destructive",
          onPress: () => {
            if (!appointment) return;

            setIsUpdating(true);
            updateStatus(
              {
                id: appointment.id,
                status: "CANCELLED",
              },
              {
                onSuccess: () => {
                  setIsUpdating(false);
                  Alert.alert("Thành công", "Lịch hẹn đã được hủy thành công.");
                  refetch();
                },
                onError: () => {
                  setIsUpdating(false);
                  Alert.alert("Lỗi", "Không thể hủy lịch hẹn. Vui lòng thử lại sau.");
                },
              }
            );
          },
        },
      ]
    );
  };

  if (loading || !appointment) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text className="text-[#4A90E2] mt-4 font-medium">Đang tải thông tin lịch hẹn...</Text>
      </View>
    );
  }

  const status = appointment.status as Status;
  const statusConfig = STATUS_CONFIG[status];
  const isUpcoming = dayjs(appointment.startTime).isAfter(dayjs());
  const canCancel = status !== "CANCELLED" && isUpcoming;

  // Format các thông tin thời gian
  const appointmentDate = dayjs(appointment.startTime).format("DD/MM/YYYY");
  const dayOfWeek = dayjs(appointment.startTime).format("dddd");
  const startTime = dayjs(appointment.startTime).format("HH:mm");
  const endTime = dayjs(appointment.endTime).format("HH:mm");

  // Format lại ngày giờ hiển thị đẹp hơn
  const formattedDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
  const formattedDate = `${formattedDay}, ${appointmentDate}`;
  const formattedTime = `${startTime} - ${endTime}`;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <Header title="Chi tiết lịch hẹn" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section - Status */}
        <Animated.View
          className="overflow-hidden"
          entering={FadeInDown.duration(500)}
        >
          <LinearGradient
            colors={statusConfig.gradientColors as any}
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1.0, y: 1.0 }}
            className="pt-6 pb-8 px-5 relative overflow-hidden"
          >
            {statusConfig.shape}

            <View className="relative z-10 px-6">
              <Animated.View entering={FadeInDown.delay(300).duration(500)}>
                <Text className="text-white/80 text-base mb-1">Trạng thái</Text>
                <View className="flex-row items-center">
                  <Text className="text-white text-3xl font-bold mr-2">{statusConfig.label}</Text>
                  <Text className="text-2xl">{statusConfig.emoji}</Text>
                </View>
              </Animated.View>

              <Animated.Text
                className="text-white/80 text-base mt-2 max-w-[85%]"
                entering={FadeInDown.delay(400).duration(500)}
              >
                {statusConfig.description}
              </Animated.Text>
            </View>

            {status === "CONFIRMED" && (
              <Animated.View
                className="mt-5 flex-row items-center bg-white/10 p-3 rounded-xl self-start"
                entering={FadeInLeft.delay(500).duration(500)}
              >
                <View className="bg-white/20 p-2 rounded-full">
                  <MaterialCommunityIcons name="ticket-confirmation" size={20} color="white" />
                </View>
                <View className="ml-3">
                  <Text className="text-white/80 text-sm">Số thứ tự</Text>
                  <Text className="text-white text-2xl font-bold">{appointment.queueNumber || "N/A"}</Text>
                </View>
              </Animated.View>
            )}
          </LinearGradient>
        </Animated.View>

        {/* Main Content */}
        <View className="p-6">
          {/* Appointment Time Card */}
          <Animated.View
            className="bg-[#161B22] rounded-xl overflow-hidden mb-5 border border-[#30363D]"
            entering={FadeInDown.delay(500).duration(500)}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <View className="p-4 border-b border-[#30363D]">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="calendar-clock" size={18} color="#4A90E2" />
                  <Text className="text-white font-bold text-lg ml-2">Thời gian hẹn</Text>
                </View>
                <StatusBadge status={status} />
              </View>
            </View>

            <View className="p-4">
              <View className="flex-row items-center mb-3">
                <View className="bg-[#21262D] rounded-lg p-3 mr-4">
                  <MaterialIcons name="event" size={24} color="#4A90E2" />
                </View>
                <View>
                  <Text className="text-white text-lg font-bold">{formattedDate}</Text>
                  <Text className="text-gray-400">{formattedTime}</Text>
                </View>
              </View>

              <View className="mt-2 bg-[#21262D]/50 rounded-lg p-3 flex-row items-center">
                <MaterialIcons name="info-outline" size={18} color="#4A90E2" />
                <Text className="text-gray-400 ml-2 flex-1">
                  {isUpcoming
                    ? "Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục"
                    : "Lịch hẹn này đã qua"}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Doctor & Location Details */}
          <Animated.View
            className="bg-[#161B22] rounded-xl border border-[#30363D] overflow-hidden mb-5"
            entering={FadeInDown.delay(600).duration(500)}
          >
            <View className="p-4 border-b border-[#30363D]">
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="card-account-details" size={18} color="#4A90E2" />
                <Text className="text-white font-bold text-lg ml-2">Chi tiết lịch hẹn</Text>
              </View>
            </View>

            <View className="p-4">
              <DetailItem
                icon={<FontAwesome name="user-md" size={18} color="#4A90E2" />}
                label="BÁC SĨ"
                value={doctor?.fullName || "Chưa xác định"}
              />

              <DetailItem
                icon={<MaterialIcons name="location-on" size={18} color="#4A90E2" />}
                label="ĐỊA ĐIỂM"
                value="Phòng khám Medical Center"
              />

              <DetailItem
                icon={<MaterialIcons name="confirmation-number" size={18} color="#4A90E2" />}
                label="MÃ LỊCH HẸN"
                value={appointment.id.substring(0, 12) + "..."}
              />

              {appointment.note && (
                <View className="mt-3">
                  <View className="flex-row items-center mb-1">
                    <MaterialIcons name="notes" size={18} color="#4A90E2" className="mr-2" />
                    <Text className="text-gray-400 text-xs font-medium">GHI CHÚ</Text>
                  </View>
                  <View className="bg-[#21262D] p-3 rounded-lg ml-8">
                    <Text className="text-white">{appointment.note}</Text>
                  </View>
                </View>
              )}
            </View>
          </Animated.View>

          {/* Notice & Guidelines */}
          <Animated.View
            className="bg-[#161B22] rounded-xl border border-[#30363D] p-4 mb-6"
            entering={FadeInDown.delay(700).duration(500)}
          >
            <View className="flex-row items-center mb-3">
              <MaterialIcons name="info-outline" size={18} color="#4A90E2" />
              <Text className="text-white font-bold ml-2">Lưu ý quan trọng</Text>
            </View>

            <View className="pl-1">
              <View className="flex-row items-start mb-2">
                <View className="w-5 h-5 rounded-full bg-[#21262D] items-center justify-center mt-0.5 mr-2">
                  <Text className="text-white text-xs">1</Text>
                </View>
                <Text className="text-gray-400 flex-1">
                  Vui lòng đến trước giờ hẹn 15 phút để hoàn tất thủ tục
                </Text>
              </View>

              <View className="flex-row items-start mb-2">
                <View className="w-5 h-5 rounded-full bg-[#21262D] items-center justify-center mt-0.5 mr-2">
                  <Text className="text-white text-xs">2</Text>
                </View>
                <Text className="text-gray-400 flex-1">
                  Mang theo giấy tờ tùy thân và thẻ bảo hiểm (nếu có)
                </Text>
              </View>

              <View className="flex-row items-start">
                <View className="w-5 h-5 rounded-full bg-[#21262D] items-center justify-center mt-0.5 mr-2">
                  <Text className="text-white text-xs">3</Text>
                </View>
                <Text className="text-gray-400 flex-1">
                  Nếu bạn không thể đến đúng hẹn, vui lòng hủy lịch trước ít nhất 24 giờ
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View
            className="flex-row justify-between mb-8"
            entering={FadeInDown.delay(800).duration(500)}
          >
            <TouchableOpacity
              className="flex-1 bg-[#21262D] p-4 rounded-xl mr-3 flex-row justify-center items-center"
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={18} color="white" />
              <Text className="text-white font-medium ml-2">Quay lại</Text>
            </TouchableOpacity>

            {canCancel ? (
              <TouchableOpacity
                className="flex-1 p-4 rounded-xl flex-row justify-center items-center"
                style={{
                  backgroundColor: STATUS_CONFIG.CANCELLED.color,
                  shadowColor: STATUS_CONFIG.CANCELLED.color + "80",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                  elevation: 5,
                }}
                onPress={handleCancel}
                disabled={isUpdating}
                activeOpacity={0.8}
              >
                {isUpdating ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="calendar-remove" size={18} color="white" />
                    <Text className="text-white font-medium ml-2">Hủy lịch</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <View
                className="flex-1 p-4 rounded-xl flex-row justify-center items-center bg-gray-600"
              >
                <MaterialCommunityIcons name="calendar-remove" size={18} color="white" />
                <Text className="text-white font-medium ml-2 opacity-80">Hủy lịch</Text>
              </View>
            )}
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppointmentsDetailScreen;
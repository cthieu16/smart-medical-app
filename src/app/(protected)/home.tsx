import { PrimaryButton } from "@/src/components/Buttons/PrimaryButton";
import { useAuth } from "@/src/context/AuthContext";
import { useMyAppointments } from "@/src/hooks/useAppointments";
import { useMedicalRecords } from "@/src/hooks/useMedicalRecords";
import {
  FontAwesome5,
  MaterialIcons,
  Ionicons,
  Feather,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  View,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Linking,
  Platform,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Animated, { FadeInDown } from "react-native-reanimated";

const { width } = Dimensions.get("window");

const images = [
  require("../../assets/images/slider/slider1.jpg"),
  require("../../assets/images/slider/slider2.jpg"),
  require("../../assets/images/slider/slider3.jpg"),
];

interface Appointment {
  id: string;
  clinicId: string;
  doctorId: string;
  patientId: string;
  startTime: string;
  endTime: string;
  queueNumber: number;
  status: "CONFIRMED" | "CANCELLED" | "PENDING";
  note?: string;
  createAt: string;
}

interface QuickAction {
  icon: React.ReactNode;
  text: string;
  route: string;
  color: string;
}

const getUpcomingAppointment = (
  appointments: Appointment[]
): Appointment | null => {
  if (!appointments || appointments.length === 0) return null;

  const now = new Date();

  // Filter valid appointments (not cancelled and in the future)
  const validAppointments = appointments
    .filter((appt) => appt.status !== "CANCELLED")
    .filter((appt) => {
      const apptDate = new Date(appt.startTime);
      return apptDate >= now;
    });

  if (validAppointments.length === 0) return null;

  // Sort by start time (ascending) to get the closest upcoming appointment
  return validAppointments.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  )[0];
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Calculate time remaining until appointment
const getTimeUntilAppointment = (appointmentDate: string): string => {
  const now = new Date();
  const apptDate = new Date(appointmentDate);
  const diffMs = apptDate.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (diffDays > 0) {
    return `còn ${diffDays} ngày ${diffHours} giờ`;
  } else if (diffHours > 0) {
    return `còn ${diffHours} giờ`;
  } else {
    return "sắp diễn ra";
  }
};

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const { data: rawAppointments = [], refetch: refetchAppointments } = useMyAppointments() as {
    data: Appointment[];
    refetch: () => Promise<any>;
  };

  const { data: medicalRecords = [], refetch: refetchMedicalRecords } = useMedicalRecords() as {
    data: any[];
    refetch: () => Promise<any>;
  };

  const upcomingAppointment = getUpcomingAppointment(rawAppointments);

  // Get the 2 most recent medical records
  const recentMedicalRecords = React.useMemo(() => {
    return [...medicalRecords]
      .sort((a, b) => new Date(b.examinationDate).getTime() - new Date(a.examinationDate).getTime())
      .slice(0, 2);
  }, [medicalRecords]);

  const openTelegram = async () => {
    const telegramUrl = "https://t.me/SmartMedicalSupport";
    const telegramAppUrl = Platform.OS === 'ios' ? 'tg://' : 'org.telegram.messenger://';

    try {
      const canOpenTelegram = await Linking.canOpenURL(telegramAppUrl);
      if (canOpenTelegram) {
        // Open Telegram app if installed
        await Linking.openURL(telegramUrl);
      } else {
        // Open Telegram in browser if app not installed
        await Linking.openURL(telegramUrl);
      }
    } catch (error) {
      console.error('Không thể mở Telegram:', error);
      // Fallback to browser version
      await Linking.openURL(telegramUrl);
    }
  };

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchAppointments(), refetchMedicalRecords()]);
    setRefreshing(false);
  };

  const quickActions: QuickAction[] = [
    {
      icon: <Ionicons name="calendar" size={24} color="#fff" />,
      text: "Đặt lịch",
      route: "/appointments-create",
      color: "#4A90E2",
    },
    {
      icon: <MaterialIcons name="event-note" size={24} color="#fff" />,
      text: "Lịch hẹn",
      route: "/appointments",
      color: "#FF6B6B",
    },
    {
      icon: <FontAwesome5 name="notes-medical" size={22} color="#fff" />,
      text: "Bệnh án",
      route: "/medical-records",
      color: "#68D391",
    },
    {
      icon: <Feather name="message-circle" size={24} color="#fff" />,
      text: "Tư vấn",
      route: "telegram",
      color: "#F6AD55",
    },
  ];

  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text className="text-white mt-4 text-lg">Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4A90E2"
            colors={["#4A90E2"]}
          />
        }
      >
        {/* Header with User Info */}
        <Animated.View
          className="flex-row items-center mx-6 mt-6 p-5 bg-[#161B22] rounded-2xl"
          entering={FadeInDown.delay(200).duration(500)}
        >
          <View className="relative">
            <Image
              source={require("../../assets/images/user.png")}
              className="w-14 h-14 rounded-full border-2 border-[#4A90E2]"
              resizeMode="cover"
            />
            <View className="absolute -top-1 -right-1 bg-green-500 rounded-full w-3.5 h-3.5" />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-gray-400 text-sm">Xin chào,</Text>
            <Text className="text-lg font-bold text-white" numberOfLines={1}>
              {user?.fullName || "Người dùng"}
            </Text>
          </View>
          <TouchableOpacity
            className="bg-[#21262D] p-3 rounded-full"
            onPress={() => router.push("/settings")}
          >
            <Feather name="settings" size={20} color="#4A90E2" />
          </TouchableOpacity>
        </Animated.View>

        {/* Carousel */}
        <Animated.View
          className="mt-6 px-6"
          entering={FadeInDown.delay(300).duration(500)}
        >
          <Carousel
            loop
            width={width - 48}
            height={160}
            autoPlay={true}
            data={images}
            scrollAnimationDuration={1200}
            autoPlayInterval={5000}
            renderItem={({ item }) => (
              <View className="rounded-xl overflow-hidden mx-1">
                <Image
                  source={item}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            )}
          />
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          className="mt-8 mx-6"
          entering={FadeInDown.delay(400).duration(500)}
        >
          <Text className="text-white font-bold text-lg mb-4">
            Truy cập nhanh
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                className={`mb-4 items-center justify-center w-[48%] py-4 rounded-xl`}
                style={{ backgroundColor: `${action.color}15` }}
                onPress={() =>
                  action.route === "telegram"
                    ? openTelegram()
                    : router.push(action.route as any)
                }
              >
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: action.color }}
                >
                  {action.icon}
                </View>
                <Text className="text-white text-sm font-medium">
                  {action.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Upcoming Appointment */}
        <Animated.View
          className="mx-6 mt-8"
          entering={FadeInDown.delay(500).duration(500)}
        >
          <Text className="text-white font-bold text-lg mb-4">
            Lịch hẹn sắp tới
          </Text>
          <TouchableOpacity
            className="bg-[#161B22] p-5 rounded-xl border border-[#30363D]"
            onPress={() =>
              upcomingAppointment
                ? router.push(`/(protected)/appointments-detail?id=${upcomingAppointment.id}`)
                : router.push("/appointments")
            }
          >
            {upcomingAppointment ? (
              <View>
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="calendar-clock" size={20} color="#4A90E2" />
                  <Text className="text-white font-semibold ml-2">
                    {formatDate(upcomingAppointment.startTime)}
                  </Text>
                  <View
                    className={`ml-auto rounded-full px-3 py-1 ${
                      upcomingAppointment.status === "CONFIRMED"
                        ? "bg-green-500"
                        : upcomingAppointment.status === "PENDING"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    <Text className="text-white text-xs font-medium">
                      {upcomingAppointment.status === "CONFIRMED"
                        ? "Đã xác nhận"
                        : upcomingAppointment.status === "PENDING"
                        ? "Chờ xác nhận"
                        : "Đã hủy"}
                    </Text>
                  </View>
                </View>

                <View className="mt-3 flex-row items-center">
                  <View className="w-2 h-10 bg-green-500 rounded-full mr-3" />
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-white">
                      Lịch khám
                      <Text className="text-sm font-normal text-[#4A90E2]"> ({getTimeUntilAppointment(upcomingAppointment.startTime)})</Text>
                    </Text>
                    <Text className="text-gray-400">
                      {formatTime(upcomingAppointment.startTime)} - {formatTime(upcomingAppointment.endTime)}
                    </Text>
                  </View>
                  <View className="bg-[#21262D] h-8 w-8 rounded-full items-center justify-center">
                    <Text className="text-white font-bold">
                      {upcomingAppointment.queueNumber}
                    </Text>
                  </View>
                </View>

                {upcomingAppointment.note ? (
                  <View className="mt-3 bg-[#21262D] p-3 rounded-lg">
                    <Text className="text-gray-400">
                      Ghi chú: {upcomingAppointment.note}
                    </Text>
                  </View>
                ) : (
                  <View className="mt-3 bg-[#21262D] p-3 rounded-lg">
                    <Text className="text-gray-400">
                      Lời khuyên: Hãy đến sớm 15 phút để hoàn thành các thủ tục cần thiết.
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View className="items-center py-5">
                <MaterialIcons name="event-busy" size={40} color="#8B949E" />
                <Text className="text-gray-400 mt-2 text-center mb-4">
                  Bạn không có lịch hẹn nào sắp tới
                </Text>
                <PrimaryButton
                  title="Đặt lịch ngay"
                  onPress={() => router.push("/appointments-create")}
                  loading={false}
                />
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Health Stats */}
        <Animated.View
          className="mx-6 mt-8"
          entering={FadeInDown.delay(600).duration(500)}
        >
          <Text className="text-white font-bold text-lg mb-4">
            Thông số sức khỏe
          </Text>
          <View className="flex-row justify-between">
            <View className="bg-[#161B22] p-4 rounded-xl w-[48%] border border-[#30363D]">
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-400">Nhịp tim</Text>
                <MaterialCommunityIcons name="heart-pulse" size={22} color="#FF6B6B" />
              </View>
              <Text className="text-white text-xl font-bold mt-2">78 BPM</Text>
              <Text className="text-green-500 text-xs mt-1">+2.5% từ lần trước</Text>
            </View>

            <View className="bg-[#161B22] p-4 rounded-xl w-[48%] border border-[#30363D]">
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-400">Huyết áp</Text>
                <FontAwesome5 name="heartbeat" size={20} color="#4A90E2" />
              </View>
              <Text className="text-white text-xl font-bold mt-2">120/80</Text>
              <Text className="text-gray-400 text-xs mt-1">Bình thường</Text>
            </View>
          </View>
        </Animated.View>

        {/* Medical Records */}
        <Animated.View
          className="mx-6 mt-8"
          entering={FadeInDown.delay(700).duration(500)}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white font-bold text-lg">
              Bệnh án gần đây
            </Text>
            <TouchableOpacity onPress={() => router.push("/medical-records")}>
              <Text className="text-[#4A90E2]">Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {recentMedicalRecords.length > 0 ? (
            recentMedicalRecords.map((record, index) => (
              <TouchableOpacity
                key={record.id}
                className="bg-[#161B22] p-5 rounded-xl border border-[#30363D] mb-4"
                onPress={() => router.push(`/medical-records-detail?id=${record.id}`)}
              >
                <View className="flex-row justify-between">
                  <View className="flex-row items-center">
                    <FontAwesome5 name="file-medical" size={16} color={index === 0 ? "#68D391" : "#F6AD55"} />
                    <Text className="ml-2 text-white font-semibold">
                      {record.code || "Khám bệnh"}
                    </Text>
                  </View>
                  <Text className="text-gray-400 text-sm">
                    {formatDate(record.examinationDate)}
                  </Text>
                </View>
                <Text className="text-gray-400 mt-2">
                  Bác sĩ: {record.doctorName || "Chưa xác định"}
                </Text>
                <View className="mt-2 bg-[#21262D] rounded-lg px-3 py-2">
                  <Text className="text-gray-400 text-sm" numberOfLines={2}>
                    Chẩn đoán: {record.diagnosis}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="items-center py-5 bg-[#161B22] rounded-xl border border-[#30363D]">
              <FontAwesome5 name="file-medical-alt" size={40} color="#8B949E" />
              <Text className="text-gray-400 mt-2 text-center mb-4">
                Bạn chưa có bệnh án nào
              </Text>
              <PrimaryButton
                title="Đặt lịch khám"
                onPress={() => router.push("/appointments-create")}
                loading={false}
              />
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

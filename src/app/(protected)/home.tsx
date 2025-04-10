import { PrimaryButton } from "@/src/components/Buttons/PrimaryButton";
import { SecondaryButton } from "@/src/components/Buttons/SecondaryButton";
import { useAuth } from "@/src/context/AuthContext";
import { useMyAppointments } from "@/src/hooks/useAppointments";
import { 
  AntDesign, 
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
  Pressable,
  ScrollView,
  Text,
  View,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

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
  const now = new Date();
  return (
    appointments
      .filter((appt) => appt.status !== "CANCELLED")
      .filter((appt) => new Date(appt.startTime) >= now)
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      )[0] || null
  );
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

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { data: rawAppointments = [], refetch } = useMyAppointments() as {
    data: Appointment[];
    refetch: () => Promise<any>;
  };

  const upcomingAppointment = getUpcomingAppointment(rawAppointments);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const quickActions: QuickAction[] = [
    {
      icon: <Ionicons name="calendar" size={24} color="#fff" />,
      text: "Đặt lịch",
      route: "/appointments",
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
      route: "/appointments",
      color: "#F6AD55",
    },
  ];

  if (loading) {
    return (
      <View className="flex-1 bg-[#0D1117] justify-center items-center">
        <ActivityIndicator size="large" color="#00AEEF" />
        <Text className="text-white mt-4 text-lg">Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0D1117]">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00AEEF"
            colors={["#00AEEF"]}
          />
        }
      >
        {/* Header with User Info */}
        <Animated.View 
          className="flex-row items-center mx-4 mt-10 p-6 bg-[#161B22] rounded-3xl shadow-lg"
          entering={FadeInDown.delay(200).duration(500)}
        >
          <View className="relative">
            <Image
              source={require("../../assets/images/user.png")}
              className="w-16 h-16 rounded-full border-2 border-[#00AEEF]"
              resizeMode="cover"
            />
            <View className="absolute -top-1 -right-1 bg-green-500 rounded-full w-4 h-4" />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-md text-[#8B949E]">Xin chào,</Text>
            <Text className="text-xl font-bold text-[#fff]" numberOfLines={1}>
              {user?.fullName || "Người dùng"}
            </Text>
          </View>
          <TouchableOpacity 
            className="bg-[#21262D] p-3 rounded-full"
            onPress={() => router.push("/appointments")}
          >
            <Feather name="settings" size={22} color="#00AEEF" />
          </TouchableOpacity>
        </Animated.View>

        {/* Carousel */}
        <Animated.View 
          className="mt-6 px-4"
          entering={FadeInDown.delay(300).duration(500)}
        >
          <Carousel
            loop
            width={width - 32}
            height={180}
            autoPlay={true}
            data={images}
            scrollAnimationDuration={1200}
            autoPlayInterval={5000}
            style={{ alignSelf: "center" }}
            renderItem={({ item }) => (
              <View className="rounded-2xl overflow-hidden shadow-2xl mx-1">
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
          className="mt-8 mx-4"
          entering={FadeInDown.delay(400).duration(500)}
        >
          <Text className="text-[#fff] font-bold text-xl mb-4 px-1">
            Truy cập nhanh
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                className={`mb-4 items-center justify-center w-[48%] py-5 rounded-2xl`}
                style={{ backgroundColor: `${action.color}20` }}
                onPress={() => router.push(action.route as any)}
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
          className="mx-4 mt-6"
          entering={FadeInDown.delay(500).duration(500)}
        >
          <Text className="text-[#fff] font-bold text-xl mb-4 px-1">
            Lịch hẹn sắp tới
          </Text>
          <TouchableOpacity
            className="bg-[#161B22] p-5 rounded-2xl border border-[#30363D]"
            onPress={() => router.push("/appointments")}
          >
            {upcomingAppointment ? (
              <View>
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="calendar-clock" size={22} color="#00AEEF" />
                  <Text className="text-white font-semibold ml-2">
                    {formatDate(upcomingAppointment.startTime)}
                  </Text>
                  <View className="ml-auto bg-blue-500 rounded-full px-3 py-1">
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
                    </Text>
                    <Text className="text-[#8B949E]">
                      {formatTime(upcomingAppointment.startTime)} - {formatTime(upcomingAppointment.endTime)}
                    </Text>
                  </View>
                  <View className="bg-[#21262D] h-8 w-8 rounded-full items-center justify-center">
                    <Text className="text-white font-bold">
                      {upcomingAppointment.queueNumber}
                    </Text>
                  </View>
                </View>
                
                {upcomingAppointment.note && (
                  <View className="mt-3 bg-[#21262D] p-3 rounded-lg">
                    <Text className="text-[#8B949E]">
                      Ghi chú: {upcomingAppointment.note}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View className="items-center py-5">
                <MaterialIcons name="event-busy" size={40} color="#8B949E" />
                <Text className="text-[#8B949E] mt-2 text-center">
                  Bạn không có lịch hẹn nào sắp tới
                </Text>
                <PrimaryButton
                  title="Đặt lịch ngay"
                  onPress={() => router.push("/appointments")}
                  loading={false}
                  disabled={false}
                />
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Health Stats */}
        <Animated.View 
          className="mx-4 mt-8"
          entering={FadeInDown.delay(600).duration(500)}
        >
          <Text className="text-[#fff] font-bold text-xl mb-4 px-1">
            Thông số sức khỏe
          </Text>
          <View className="flex-row justify-between">
            <View className="bg-[#161B22] p-4 rounded-2xl w-[48%] border border-[#30363D]">
              <View className="flex-row items-center justify-between">
                <Text className="text-[#8B949E]">Nhịp tim</Text>
                <MaterialCommunityIcons name="heart-pulse" size={24} color="#FF6B6B" />
              </View>
              <Text className="text-white text-xl font-bold mt-2">78 BPM</Text>
              <Text className="text-green-500 text-xs mt-1">+2.5% từ lần trước</Text>
            </View>
            
            <View className="bg-[#161B22] p-4 rounded-2xl w-[48%] border border-[#30363D]">
              <View className="flex-row items-center justify-between">
                <Text className="text-[#8B949E]">Huyết áp</Text>
                <FontAwesome5 name="heartbeat" size={22} color="#4A90E2" />
              </View>
              <Text className="text-white text-xl font-bold mt-2">120/80</Text>
              <Text className="text-[#8B949E] text-xs mt-1">Bình thường</Text>
            </View>
          </View>
        </Animated.View>
        
        {/* Medical Records */}
        <Animated.View 
          className="mx-4 mt-6 mb-8"
          entering={FadeInDown.delay(700).duration(500)}
        >
          <View className="flex-row justify-between items-center mb-4 px-1">
            <Text className="text-[#fff] font-bold text-xl">
              Bệnh án gần đây
            </Text>
            <TouchableOpacity onPress={() => router.push("/medical-records")}>
              <Text className="text-[#00AEEF]">Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            className="bg-[#161B22] p-5 rounded-2xl border border-[#30363D] mb-3"
            onPress={() => router.push("/medical-records")}
          >
            <View className="flex-row justify-between">
              <View className="flex-row items-center">
                <FontAwesome5 name="file-medical" size={18} color="#68D391" />
                <Text className="ml-2 text-white font-semibold">Khám tổng quát</Text>
              </View>
              <Text className="text-[#8B949E] text-sm">10/05/2023</Text>
            </View>
            <Text className="text-[#8B949E] mt-2">
              Bác sĩ: Nguyễn Văn A
            </Text>
            <View className="mt-2 bg-[#21262D] rounded-lg px-3 py-2">
              <Text className="text-[#8B949E] text-sm">
                Chẩn đoán: Sức khỏe bình thường, cần tăng cường thể dục...
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-[#161B22] p-5 rounded-2xl border border-[#30363D]"
            onPress={() => router.push("/medical-records")}
          >
            <View className="flex-row justify-between">
              <View className="flex-row items-center">
                <FontAwesome5 name="file-medical" size={18} color="#F6AD55" />
                <Text className="ml-2 text-white font-semibold">Khám chuyên khoa</Text>
              </View>
              <Text className="text-[#8B949E] text-sm">15/04/2023</Text>
            </View>
            <Text className="text-[#8B949E] mt-2">
              Bác sĩ: Trần Thị B
            </Text>
            <View className="mt-2 bg-[#21262D] rounded-lg px-3 py-2">
              <Text className="text-[#8B949E] text-sm">
                Chẩn đoán: Viêm họng cấp tính, cần nghỉ ngơi và uống thuốc...
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default Home;

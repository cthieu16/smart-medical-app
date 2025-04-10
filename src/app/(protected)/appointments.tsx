import { AntDesign, FontAwesome, MaterialIcons, Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
  ActivityIndicator,
  Dimensions,
  ScrollView
} from "react-native";
import dayjs from "dayjs";
import { useMyAppointments } from "@/src/hooks/useAppointments";
import { useMyDoctors } from "@/src/hooks/useDoctors";
import { Header } from "@/src/components/Header/Header";
import Animated, { FadeInDown, FadeInRight, FadeInLeft } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get('window');

type AppointmentStatus = "CONFIRMED" | "PENDING" | "CANCELLED";

type Appointment = {
  id: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  note?: string;
  doctorId: string;
  queueNumber?: number;
};

type Doctor = {
  id: string;
  fullName: string;
};

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { 
    label: string; 
    color: string; 
    iconName: string;
    iconSet: "MaterialCommunityIcons";
    bgColor: string;
    emoji: string;
  }
> = {
  CONFIRMED: { 
    label: "Đã xác nhận", 
    color: "#4CAF50",
    iconName: "check-circle-outline",
    iconSet: "MaterialCommunityIcons",
    bgColor: "rgba(76, 175, 80, 0.1)",
    emoji: "✅"
  },
  PENDING: { 
    label: "Chờ xác nhận", 
    color: "#FF9800",
    iconName: "timer-sand-empty",
    iconSet: "MaterialCommunityIcons",
    bgColor: "rgba(255, 152, 0, 0.1)",
    emoji: "⏳"
  },
  CANCELLED: { 
    label: "Đã hủy", 
    color: "#F44336",
    iconName: "close-circle-outline",
    iconSet: "MaterialCommunityIcons",
    bgColor: "rgba(244, 67, 54, 0.1)",
    emoji: "❌"
  },
};

const formatDay = (date: string) => {
  const d = dayjs(date);
  const today = dayjs().startOf('day');
  const tomorrow = today.add(1, 'day');
  
  if (d.isSame(today, 'day')) {
    return 'Hôm nay';
  } else if (d.isSame(tomorrow, 'day')) {
    return 'Ngày mai';
  } else {
    const dayOfWeek = d.format('dddd');
    return dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
  }
};

type AppointmentItemProps = {
  appointment: Appointment;
  doctor?: Doctor;
  index: number;
};

const AppointmentItem = memo(
  ({ appointment, doctor, index }: AppointmentItemProps) => {
    const router = useRouter();
    const { label, color, iconName, bgColor, emoji } = STATUS_CONFIG[appointment.status];

    const handleDetail = useCallback(() => {
      router.push(`/(protected)/appointments-detail?id=${appointment.id}`);
    }, [appointment.id, router]);

    const isToday = dayjs(appointment.startTime).isSame(dayjs(), 'day');
    const formattedDate = dayjs(appointment.startTime).format("DD/MM/YYYY");
    const dayLabel = formatDay(appointment.startTime);
    const startTime = dayjs(appointment.startTime).format("HH:mm");
    const endTime = dayjs(appointment.endTime).format("HH:mm");

    return (
      <Animated.View
        entering={FadeInRight.delay(index * 80).duration(300)}
        className="mx-4 my-2"
      >
        <Pressable
          onPress={handleDetail}
          className="bg-[#161B22] rounded-2xl border border-[#30363D] shadow-md active:opacity-80 overflow-hidden"
          style={{
            shadowColor: color + '20',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2
          }}
        >
          {/* Header */}
          <View 
            className="px-4 py-2 border-b border-[#30363D] flex-row justify-between items-center"
            style={{ backgroundColor: bgColor }}
          >
            <View className="flex-row items-center">
              <Text className="text-xs font-medium mr-1" style={{ color }}>
                {emoji}
              </Text>
              <Text className="text-xs font-medium" style={{ color }}>
                {label}
              </Text>
            </View>
            <Text className="text-[#8B949E] text-xs">
              ID: {appointment.id.substring(0, 6)}
            </Text>
          </View>

          {/* Content */}
          <View className="p-4">
            <View className="flex-row items-start justify-between">
              {/* Date and Time */}
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-full bg-[#21262D] items-center justify-center mr-3">
                  <MaterialCommunityIcons 
                    name={isToday ? "calendar-today" : "calendar-month-outline"} 
                    size={24} 
                    color={isToday ? "#00AEEF" : "#8B949E"} 
                  />
                </View>
                <View>
                  <View className="flex-row items-center">
                    <Text className="text-white font-bold text-base mr-2">
                      {dayLabel}
                    </Text>
                    {isToday && (
                      <View className="px-2 py-0.5 bg-[#00AEEF30] rounded-full">
                        <Text className="text-[#00AEEF] text-xs font-medium">Hôm nay</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-[#8B949E] text-xs">
                    {formattedDate} • {startTime} - {endTime}
                  </Text>
                </View>
              </View>

              {/* Queue number for confirmed appointments */}
              {appointment.status === "CONFIRMED" && appointment.queueNumber && (
                <View className="bg-[#4CAF5020] px-3 py-1 rounded-lg items-center">
                  <Text className="text-[#4CAF50] text-xs">STT</Text>
                  <Text className="text-[#4CAF50] font-bold text-lg">{appointment.queueNumber}</Text>
                </View>
              )}
            </View>

            {/* Doctor Info */}
            <View className="mt-3 flex-row justify-between items-center">
              <View className="flex-row items-center flex-1">
                <FontAwesome name="user-md" size={14} color="#8B949E" />
                <Text className="text-white ml-2 mr-1">
                  Bác sĩ:
                </Text>
                <Text className="text-white font-medium" numberOfLines={1} ellipsizeMode="tail">
                  {doctor?.fullName || "Chưa xác định"}
                </Text>
              </View>
              
              <TouchableOpacity 
                onPress={handleDetail}
                className="bg-[#21262D] px-3 py-1.5 rounded-lg flex-row items-center"
              >
                <Text className="text-white text-xs font-medium mr-1">Chi tiết</Text>
                <AntDesign name="right" size={12} color="#8B949E" />
              </TouchableOpacity>
            </View>

            {/* Note (only if exists) */}
            {appointment.note && (
              <View className="mt-3 bg-[#21262D] p-3 rounded-lg flex-row items-start">
                <MaterialIcons name="notes" size={16} color="#8B949E" style={{ marginTop: 2 }} />
                <Text className="text-[#8B949E] text-xs ml-2 flex-1" numberOfLines={2} ellipsizeMode="tail">
                  {appointment.note}
                </Text>
              </View>
            )}
          </View>
        </Pressable>
      </Animated.View>
    );
  }
);

const FilterOption = ({ label, active, onPress, color, emoji }: { label: string; active: boolean; onPress: () => void; color?: string; emoji?: string }) => (
  <TouchableOpacity
    className={`px-4 py-2 rounded-2xl mx-1 ${active ? 'border-2' : 'bg-[#21262D] border-transparent border-2'}`}
    style={{ borderColor: active ? (color || '#00AEEF') : 'transparent' }}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View className="flex-row items-center">
      {emoji && (
        <Text className="mr-1">{emoji}</Text>
      )}
      <Text className={`text-sm font-medium ${active ? 'text-white' : 'text-[#8B949E]'}`}>
        {label}
      </Text>
    </View>
  </TouchableOpacity>
);

const EmptyState = ({ message, onCreatePress }: { message: string, onCreatePress: () => void }) => (
  <Animated.View 
    className="items-center mt-10 px-6"
    entering={FadeInDown.delay(300).duration(400)}
  >
    <MaterialIcons name="event-busy" size={60} color="#8B949E" />
    <Text className="text-[#8B949E] text-center mt-4 text-base">
      {message}
    </Text>
    <TouchableOpacity
      className="mt-6 bg-[#00AEEF] px-6 py-3 rounded-full"
      onPress={onCreatePress}
      activeOpacity={0.8}
    >
      <Text className="text-white font-bold">Tạo lịch hẹn mới</Text>
    </TouchableOpacity>
  </Animated.View>
);

const AppointmentsScreen = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AppointmentStatus | 'ALL'>('ALL');
  
  const { data: rawAppointments = [], refetch } = useMyAppointments();
  const { data: dataMyDoctors = [] } = useMyDoctors();

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

  const dataMyAppointments = useMemo(
    () =>
      rawAppointments
        .map((item) => ({
          ...item,
          status: item.status as AppointmentStatus,
        }))
        .filter(item => filter === 'ALL' ? true : item.status === filter)
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
    [rawAppointments, filter]
  );

  const doctorMap = useMemo(
    () =>
      Object.fromEntries(dataMyDoctors.map((doctor) => [doctor.id, doctor])),
    [dataMyDoctors]
  );

  if (loading) {
    return (
      <View className="flex-1 bg-[#0D1117] justify-center items-center">
        <ActivityIndicator size="large" color="#00AEEF" />
        <Text className="text-white mt-4">Đang tải danh sách lịch hẹn...</Text>
      </View>
    );
  }

  const handleCreateAppointment = () => {
    router.push("/(protected)/appointments-create");
  };

  return (
    <View className="flex-1 bg-[#0D1117]">
      <Header title="Lịch hẹn" />
      
      {/* Header with Filters */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(400)}
        className="mx-4 mt-2"
      >
        {/* Page Title */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <LinearGradient
              colors={['#00AEEF', '#0078FF']}
              className="w-1 h-6 rounded-full mr-2"
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
            <Text className="text-xl font-bold text-white">
              Danh sách lịch hẹn
            </Text>
          </View>
          
          <TouchableOpacity 
            onPress={onRefresh}
            className="bg-[#21262D] rounded-full p-2"
          >
            <Feather name="refresh-cw" size={18} color="#8B949E" />
          </TouchableOpacity>
        </View>
        
        {/* Filter Options */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="pb-2"
        >
          <View className="flex-row mb-4">
            <FilterOption 
              label="Tất cả" 
              active={filter === 'ALL'} 
              onPress={() => setFilter('ALL')} 
            />
            <FilterOption 
              label="Đã xác nhận" 
              active={filter === 'CONFIRMED'} 
              onPress={() => setFilter('CONFIRMED')} 
              color={STATUS_CONFIG.CONFIRMED.color}
              emoji={STATUS_CONFIG.CONFIRMED.emoji}
            />
            <FilterOption 
              label="Chờ xác nhận" 
              active={filter === 'PENDING'} 
              onPress={() => setFilter('PENDING')} 
              color={STATUS_CONFIG.PENDING.color}
              emoji={STATUS_CONFIG.PENDING.emoji}
            />
            <FilterOption 
              label="Đã hủy" 
              active={filter === 'CANCELLED'} 
              onPress={() => setFilter('CANCELLED')} 
              color={STATUS_CONFIG.CANCELLED.color}
              emoji={STATUS_CONFIG.CANCELLED.emoji}
            />
          </View>
        </ScrollView>
      </Animated.View>

      {/* Appointment List */}
      <FlatList
        data={dataMyAppointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <AppointmentItem
            appointment={item}
            doctor={doctorMap[item.doctorId]}
            index={index}
          />
        )}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00AEEF"
            colors={["#00AEEF"]}
          />
        }
        ListEmptyComponent={
          <EmptyState 
            message={
              filter === 'ALL'
                ? "Bạn chưa có lịch hẹn nào. Hãy tạo lịch hẹn mới để được khám bệnh."
                : `Không có lịch hẹn nào ở trạng thái ${STATUS_CONFIG[filter].label}.`
            } 
            onCreatePress={handleCreateAppointment}
          />
        }
      />
      
      {/* FAB - Create Appointment */}
      <Animated.View
        className="absolute bottom-6 right-6"
        entering={FadeInDown.delay(400).duration(500)}
      >
        <TouchableOpacity
          className="p-4 rounded-full items-center justify-center"
          onPress={handleCreateAppointment}
          activeOpacity={0.8}
          style={{
            backgroundColor: "#00AEEF",
            shadowColor: "#00AEEF",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5,
            width: 58,
            height: 58,
          }}
        >
          <AntDesign name="plus" size={28} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 10,
    paddingBottom: 100,
  },
});

export default AppointmentsScreen;

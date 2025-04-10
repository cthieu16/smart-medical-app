import { Header } from "@/src/components/Header/Header";
import { useNotifications } from "@/src/hooks/useNotifications";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { 
  FlatList, 
  Pressable, 
  Text, 
  View, 
  TouchableOpacity, 
  RefreshControl, 
  ActivityIndicator, 
  Alert 
} from "react-native";
import { 
  MaterialIcons, 
  Ionicons, 
  FontAwesome5, 
  AntDesign, 
  Feather 
} from "@expo/vector-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

dayjs.extend(relativeTime);

interface Notification {
  id: string;
  title: string;
  message: string;
  isReaded: boolean;
  notificationType: string;
  patientId: string;
  doctorId: string;
  chatId: string;
  createdAt: string;
  updatedAt: string;
}

// Configuration for different notification types
const NOTIFICATION_CONFIG = {
  "CREATE_APPOINTMENT": {
    icon: <Ionicons name="calendar" size={20} color="#3B82F6" />,
    label: "Lịch hẹn mới",
    bgColor: "rgba(59, 130, 246, 0.1)",
  },
  "APPOINTMENT_UPDATED": {
    icon: <Ionicons name="time-outline" size={20} color="#F59E0B" />,
    label: "Cập nhật lịch hẹn",
    bgColor: "rgba(245, 158, 11, 0.1)",
  },
  "APPOINTMENT_REMINDER": {
    icon: <Ionicons name="notifications-outline" size={20} color="#8B5CF6" />,
    label: "Nhắc nhở lịch hẹn",
    bgColor: "rgba(139, 92, 246, 0.1)",
  },
  "CHAT_MESSAGE": {
    icon: <Ionicons name="chatbubble-outline" size={20} color="#EC4899" />,
    label: "Tin nhắn mới",
    bgColor: "rgba(236, 72, 153, 0.1)",
  },
  "PRESCRIPTION": {
    icon: <FontAwesome5 name="pills" size={18} color="#10B981" />,
    label: "Đơn thuốc mới",
    bgColor: "rgba(16, 185, 129, 0.1)",
  },
  "DEFAULT": {
    icon: <Ionicons name="alert-circle-outline" size={20} color="#8B949E" />,
    label: "Thông báo",
    bgColor: "rgba(139, 148, 158, 0.1)",
  }
};

const NotificationItem = ({
  id,
  title,
  message,
  isReaded,
  notificationType,
  createdAt,
  index,
  onRead
}: Notification & { index: number; onRead: (id: string) => void }) => {
  const [readed, setReaded] = useState(isReaded);
  const config = NOTIFICATION_CONFIG[notificationType as keyof typeof NOTIFICATION_CONFIG] || NOTIFICATION_CONFIG.DEFAULT;
  
  const timeAgo = dayjs(createdAt).fromNow();

  const handlePress = () => {
    if (!readed) {
      setReaded(true);
      onRead(id);
    }
    // Handle navigation or action based on notification type
    console.log(`Clicked notification: ${title}`);
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).duration(400)}
      className="mx-4 my-2"
    >
      <TouchableOpacity
        className={`bg-[#161B22] p-4 rounded-2xl border border-[#30363D] ${!readed ? 'border-l-[3px]' : ''}`}
        style={{ borderLeftColor: !readed ? '#3B82F6' : undefined }}
        activeOpacity={0.7}
        onPress={handlePress}
      >
        <View className="flex-row items-start">
          {/* Icon Container */}
          <View 
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: config.bgColor }}
          >
            {config.icon}
          </View>
          
          {/* Content */}
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <Text className={`font-semibold ${readed ? 'text-gray-400' : 'text-white'}`}>
                {config.label}
              </Text>
              {!readed && <View className="w-2 h-2 bg-blue-500 rounded-full" />}
            </View>
            
            <Text 
              className={`${readed ? 'text-gray-500' : 'text-gray-300'} text-sm mt-1`}
              numberOfLines={2}
            >
              {message}
            </Text>
            
            {/* Time */}
            <View className="flex-row items-center mt-2">
              <Ionicons name="time-outline" size={12} color="#8B949E" />
              <Text className="text-[#8B949E] text-xs ml-1">
                {timeAgo}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const NotificationsScreen = () => {
  const router = useRouter();
  const { data: dataNotifications = [], isLoading, refetch } = useNotifications();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // Mark notification as read
  const handleMarkAsRead = useCallback((id: string) => {
    setReadIds(prev => new Set([...prev, id]));
    // Here you would typically call an API to update the read status
    console.log(`Marked notification ${id} as read`);
  }, []);

  // Mark all as read
  const handleMarkAllAsRead = useCallback(() => {
    const allIds = dataNotifications.map(notification => notification.id);
    setReadIds(new Set(allIds));
    Alert.alert("Thành công", "Đã đánh dấu tất cả thông báo là đã đọc");
  }, [dataNotifications]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const visibleNotifications = useMemo(
    () => {
      const sorted = [...dataNotifications].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return showAll ? sorted : sorted.slice(0, 5);
    },
    [showAll, dataNotifications]
  );

  const unreadCount = useMemo(() => {
    return dataNotifications.filter(
      notification => !notification.isReaded && !readIds.has(notification.id)
    ).length;
  }, [dataNotifications, readIds]);

  const handleShowAll = useCallback(() => setShowAll(true), []);
  const handleGoBack = useCallback(() => router.back(), [router]);

  return (
    <View className="flex-1 bg-[#0D1117]">
      <Header title="Thông báo" />

      {/* Stats Bar */}
      <Animated.View 
        className="mx-4 mt-3 mb-2"
        entering={FadeInDown.delay(200).duration(400)}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <LinearGradient
              colors={['#3B82F6', '#60A5FA']}
              className="w-1 h-6 rounded-full mr-2"
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
            <Text className="text-xl font-bold text-white">
              Thông báo
            </Text>
          </View>
          
          {dataNotifications.length > 0 && (
            <TouchableOpacity 
              onPress={handleMarkAllAsRead} 
              className="bg-[#21262D] px-3 py-1 rounded-full"
            >
              <Text className="text-blue-400 text-xs">Đánh dấu tất cả đã đọc</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {unreadCount > 0 && (
          <View className="bg-[#21262D] rounded-xl p-3 mt-3 flex-row items-center">
            <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
            <Text className="text-white text-sm">
              Bạn có <Text className="text-blue-400 font-bold">{unreadCount}</Text> thông báo chưa đọc
            </Text>
          </View>
        )}
      </Animated.View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-400 mt-4">Đang tải thông báo...</Text>
        </View>
      ) : (
        <FlatList
          data={visibleNotifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <NotificationItem 
              {...item} 
              index={index} 
              onRead={handleMarkAsRead}
              isReaded={item.isReaded || readIds.has(item.id)}
            />
          )}
          contentContainerStyle={{ paddingVertical: 10, paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#3B82F6"
              colors={["#3B82F6"]}
            />
          }
          ListEmptyComponent={
            <Animated.View 
              className="items-center mt-10 px-4"
              entering={FadeInDown.delay(300).duration(400)}
            >
              <Ionicons name="notifications-off-outline" size={70} color="#8B949E" />
              <Text className="text-gray-400 text-center mt-4 text-base">
                Không có thông báo nào.
              </Text>
              <Text className="text-gray-500 text-center mt-2 text-sm px-6">
                Thông báo về lịch hẹn, tin nhắn và đơn thuốc sẽ xuất hiện ở đây.
              </Text>
            </Animated.View>
          }
        />
      )}

      {!showAll && dataNotifications.length > 5 && (
        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          className="mx-4 my-4"
        >
          <TouchableOpacity
            onPress={handleShowAll}
            className="bg-[#21262D] p-4 rounded-xl flex-row items-center justify-center shadow-lg"
            activeOpacity={0.7}
          >
            <Text className="text-blue-400 font-semibold mr-2">Xem tất cả thông báo</Text>
            <AntDesign name="arrowright" size={16} color="#60A5FA" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

export default NotificationsScreen;

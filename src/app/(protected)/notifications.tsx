import { Header } from "@/src/components/Header/Header";
import { useNotifications } from "@/src/hooks/useNotifications";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  StatusBar,
  SafeAreaView
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
import "dayjs/locale/vi";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

dayjs.extend(relativeTime);
dayjs.locale('vi');

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
const NOTIFICATION_CONFIG: Record<string, {
  icon: React.ReactNode;
  label: string;
  bgColor: string;
  iconColor: string;
}> = {
  "CREATE_APPOINTMENT": {
    icon: <Ionicons key="calendar-icon" name="calendar" size={20} color="#4A90E2" />,
    label: "Lịch hẹn mới",
    bgColor: "rgba(74, 144, 226, 0.1)",
    iconColor: "#4A90E2"
  },
  "APPOINTMENT_UPDATED": {
    icon: <Ionicons key="time-icon" name="time-outline" size={20} color="#F59E0B" />,
    label: "Cập nhật lịch hẹn",
    bgColor: "rgba(245, 158, 11, 0.1)",
    iconColor: "#F59E0B"
  },
  "APPOINTMENT_REMINDER": {
    icon: <Ionicons key="notification-icon" name="notifications-outline" size={20} color="#8B5CF6" />,
    label: "Nhắc nhở lịch hẹn",
    bgColor: "rgba(139, 92, 246, 0.1)",
    iconColor: "#8B5CF6"
  },
  "CHAT_MESSAGE": {
    icon: <Ionicons key="chat-icon" name="chatbubble-outline" size={20} color="#EC4899" />,
    label: "Tin nhắn mới",
    bgColor: "rgba(236, 72, 153, 0.1)",
    iconColor: "#EC4899"
  },
  "PRESCRIPTION": {
    icon: <FontAwesome5 key="pills-icon" name="pills" size={18} color="#10B981" />,
    label: "Đơn thuốc mới",
    bgColor: "rgba(16, 185, 129, 0.1)",
    iconColor: "#10B981"
  },
  "DEFAULT": {
    icon: <Ionicons key="alert-icon" name="alert-circle-outline" size={20} color="#4A90E2" />,
    label: "Thông báo",
    bgColor: "rgba(74, 144, 226, 0.1)",
    iconColor: "#4A90E2"
  }
};

interface NotificationItemProps extends Notification {
  index: number;
  onRead: (id: string) => void;
}

const NotificationItem = ({
  id,
  title,
  message,
  isReaded,
  notificationType,
  createdAt,
  index,
  onRead
}: NotificationItemProps) => {
  const [readed, setReaded] = useState(isReaded);
  const config = NOTIFICATION_CONFIG[notificationType] || NOTIFICATION_CONFIG.DEFAULT;

  const timeAgo = dayjs(createdAt).fromNow();

  const handlePress = () => {
    if (!readed) {
      setReaded(true);
      onRead(id);
    }
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).duration(400)}
      className="mx-6 my-3"
    >
      <TouchableOpacity
        className={`bg-[#161B22] p-4 rounded-xl border border-[#30363D] ${!readed ? 'border-l-[3px]' : ''}`}
        style={{ borderLeftColor: !readed ? '#4A90E2' : undefined }}
        activeOpacity={0.8}
        onPress={handlePress}
      >
        <View className="flex-row items-start gap-2">
          {/* Icon Container */}
          <LinearGradient
            colors={['#161B22', '#161B22']}
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
          >
            {React.cloneElement(config.icon as React.ReactElement, { key: `notification-icon-${id}` })}
          </LinearGradient>

          {/* Content */}
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <Text className={`font-semibold ${readed ? 'text-gray-400' : 'text-white'}`}>
                {config.label}
              </Text>
              {!readed && <View className="w-2 h-2 bg-[#4A90E2] rounded-full" />}
            </View>

            <View className="bg-[#0D111780] p-3 rounded-xl mt-2 border border-[#30363D40]">
              <Text
                className={`${readed ? 'text-gray-500' : 'text-white'} text-sm`}
                numberOfLines={2}
              >
                {message}
              </Text>
            </View>

            {/* Time */}
            <View className="flex-row items-center mt-2">
              <Ionicons name="time-outline" size={12} color="#4A90E2" />
              <Text className="text-gray-400 text-xs ml-1">
                {timeAgo}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const EmptyNotifications = () => (
  <Animated.View
    className="items-center mt-12 px-4"
    entering={FadeInDown.delay(300).duration(400)}
  >
    <LinearGradient
      colors={['#21262D', '#161B22']}
      className="w-20 h-20 rounded-full items-center justify-center mb-4"
    >
      <Ionicons key="empty-notification-icon" name="notifications-off-outline" size={50} color="#4A90E2" />
    </LinearGradient>
    <Text className="text-white text-center mt-4 text-lg font-medium">
      Không có thông báo nào
    </Text>
    <Text className="text-gray-400 text-center mt-2 text-sm px-10 leading-5">
      Thông báo về lịch hẹn, tin nhắn và đơn thuốc sẽ xuất hiện ở đây
    </Text>
  </Animated.View>
);

const NotificationsScreen = () => {
  const router = useRouter();
  const {
    data: dataNotifications = [],
    isLoading,
    refetch
  } = useNotifications();

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // Mark notification as read
  const handleMarkAsRead = useCallback((id: string) => {
    setReadIds(prev => new Set([...prev, id]));
  }, []);

  // Mark all as read
  const handleMarkAllAsRead = useCallback(() => {
    if (dataNotifications.length === 0) return;

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

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text className="text-gray-300 mt-4">Đang tải thông báo...</Text>
      </View>
    );
  }

  const renderNotificationItem = ({ item, index }: { item: Notification, index: number }) => (
    <NotificationItem
      {...item}
      index={index}
      onRead={handleMarkAsRead}
      isReaded={item.isReaded || readIds.has(item.id)}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <Header title="Thông báo" />

      {/* Stats Bar */}
      <Animated.View
        className="mx-6 mt-4 mb-2"
        entering={FadeInDown.delay(200).duration(400)}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <LinearGradient
              colors={['#161B22', '#161B22']}
              className="w-1.5 h-7 rounded-full mr-2.5"
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
            <Text className="text-xl font-bold text-white">
              Thông báo
            </Text>
          </View>

          {/* {dataNotifications.length > 0 && (
            <TouchableOpacity
              onPress={handleMarkAllAsRead}
              className="bg-[#21262D] px-3 py-2 rounded-full border border-[#30363D]"
              activeOpacity={0.8}
            >
              <Text className="text-[#4A90E2] text-xs font-medium">Đánh dấu tất cả đã đọc</Text>
            </TouchableOpacity>
          )} */}
        </View>

        {/* {unreadCount > 0 && (
          <View className="bg-[#161B2280] rounded-xl p-3 mt-3 flex-row items-center border border-[#30363D40]">
            <View className="w-2 h-2 bg-[#4A90E2] rounded-full mr-2" />
            <Text className="text-white text-sm">
              Bạn có <Text className="text-[#4A90E2] font-bold">{unreadCount}</Text> thông báo chưa đọc
            </Text>
          </View>
        )} */}
      </Animated.View>

      <FlatList
        data={visibleNotifications}
        keyExtractor={(item, index) => item.id ? `notification-${item.id}` : `notification-index-${index}`}
        renderItem={renderNotificationItem}
        contentContainerStyle={{ paddingVertical: 10, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#4A90E2"
            colors={["#4A90E2"]}
          />
        }
        ListEmptyComponent={<EmptyNotifications />}
        showsVerticalScrollIndicator={false}
      />

      {!showAll && dataNotifications.length > 5 && (
        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          className="mx-6 mb-6 absolute bottom-0 left-0 right-0"
        >
          <TouchableOpacity
            onPress={handleShowAll}
            className="bg-[#21262D] py-3.5 rounded-xl flex-row items-center justify-center border border-[#30363D]"
            activeOpacity={0.8}
          >
            <Text className="text-[#4A90E2] font-medium mr-2">Xem tất cả thông báo</Text>
            <AntDesign name="arrowright" size={16} color="#4A90E2" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default NotificationsScreen;

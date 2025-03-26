import { Header } from "@/src/components/Header/Header";
import { useNotifications } from "@/src/hooks/useNotifications";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

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

const NotificationItem = ({
  title,
  message,
  isReaded,
  notificationType,
}: Notification) => {
  const [readed, setReaded] = useState(isReaded);

  const handlePress = () => {
    setReaded(true);
    console.log(`Clicked: ${title}`);
  };

  const notificationLabel =
    notificationType === "CREATE_APPOINTMENT" ? "Lịch hẹn" : "Đang hoàn thiện";

  return (
    <Pressable
      className="bg-[#161B22] mx-4 p-4 rounded-2xl mt-3 shadow-lg flex-row justify-between items-center"
      onPress={handlePress}
    >
      <View className="flex-1">
        <Text
          className={`text-base font-semibold ${
            readed ? "text-gray-400" : "text-white"
          }`}
        >
          {notificationLabel}
        </Text>
        <Text className="text-gray-300 text-sm">{message}</Text>
      </View>
      {!readed && <View className="w-3 h-3 bg-blue-500 rounded-full" />}
    </Pressable>
  );
};

const NotificationsScreen = () => {
  const router = useRouter();
  const { data: dataNotifications = [], isLoading } = useNotifications();
  const [showAll, setShowAll] = useState<boolean>(false);

  const visibleNotifications = useMemo(
    () => (showAll ? dataNotifications : dataNotifications.slice(0, 5)),
    [showAll, dataNotifications]
  );

  const handleShowAll = useCallback(() => setShowAll(true), []);
  const handleGoBack = useCallback(() => router.back(), [router]);

  return (
    <View className="flex-1 bg-[#0D1117]">
      <Header title="Thông báo" />

      {isLoading ? (
        <Text className="text-gray-400 text-center mt-6">Đang tải...</Text>
      ) : (
        <FlatList
          data={visibleNotifications}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <NotificationItem {...item} />}
          contentContainerStyle={{ paddingVertical: 10 }}
          ListEmptyComponent={
            <Text className="text-gray-400 text-center mt-6">
              Không có thông báo nào.
            </Text>
          }
        />
      )}

      {!showAll && dataNotifications.length > 5 && (
        <Pressable
          onPress={handleShowAll}
          className="bg-[#4A90E2] p-4 rounded-full mx-6 mt-4 flex-row items-center justify-center shadow-lg mb-4"
        >
          <Text className="text-white font-semibold text-lg">Xem tất cả</Text>
        </Pressable>
      )}
    </View>
  );
};

export default NotificationsScreen;

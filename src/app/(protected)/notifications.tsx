import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

interface Notification {
    id: string;
    title: string;
    time: string;
    seen?: boolean;
}

const notifications: Notification[] = [
    { id: "1", title: "Lịch hẹn của bạn đã được xác nhận.", time: "2 phút trước", seen: false },
    { id: "2", title: "Có ưu đãi mới dành cho bạn.", time: "10 phút trước", seen: true },
    { id: "3", title: "Bác sĩ đã gửi cập nhật về đơn thuốc.", time: "1 giờ trước", seen: false },
    { id: "4", title: "Nhắc nhở: Bạn có cuộc hẹn vào ngày mai.", time: "3 giờ trước", seen: false },
    { id: "5", title: "Hệ thống đang bảo trì vào lúc 12:00.", time: "5 giờ trước", seen: true },
];

const NotificationItem = ({ title, time, seen = false }: Notification) => (
    <Pressable
        className="bg-gray-800 mx-4 p-4 rounded-xl mt-3 shadow-sm border border-gray-700 flex-row justify-between items-center"
        onPress={() => console.log(`Clicked: ${title}`)}
    >
        <View className="flex-col gap-1 flex-1">
            <Text className={`text-base font-semibold ${seen ? "text-gray-400" : "text-white"}`}>
                {title}
            </Text>
            <Text className="text-gray-400 text-sm">{time}</Text>
        </View>
        {!seen && <View className="w-3 h-3 bg-blue-500 rounded-full" />}
    </Pressable>
);

const NotificationsScreen = () => {
    const router = useRouter();
    const [showAll, setShowAll] = useState<boolean>(false);

    const visibleNotifications = useMemo(
        () => (showAll ? notifications : notifications.slice(0, 5)),
        [showAll]
    );

    const handleShowAll = useCallback(() => setShowAll(true), []);
    const handleGoBack = useCallback(() => router.back(), [router]);

    return (
        <View className="flex-1 bg-[#121212]">
            <View className="flex-row items-center justify-between p-4">
                <Pressable onPress={handleGoBack} className="mr-4">
                    <AntDesign name="left" size={24} color="white" />
                </Pressable>
                <Text className="text-2xl font-bold text-white">Thông báo</Text>
                <Pressable onPress={() => console.log("Search")}>
                    <AntDesign name="search1" size={24} color="white" />
                </Pressable>
            </View>

            <FlatList
                data={visibleNotifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <NotificationItem {...item} />}
                contentContainerStyle={{ paddingVertical: 10 }}
                ListEmptyComponent={<Text className="text-gray-400 text-center mt-6">Không có thông báo nào.</Text>}
            />

            {!showAll && notifications.length > 5 && (
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

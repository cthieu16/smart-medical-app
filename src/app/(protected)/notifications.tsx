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
    { id: "4", title: "Lịch hẹn của bạn đã được xác nhận.", time: "2 phút trước", seen: false },
    { id: "5", title: "Có ưu đãi mới dành cho bạn.", time: "10 phút trước", seen: true },
    { id: "6", title: "Bác sĩ đã gửi cập nhật về đơn thuốc.", time: "1 giờ trước", seen: false },
    { id: "7", title: "Lịch hẹn của bạn đã được xác nhận.", time: "2 phút trước", seen: false },
    { id: "8", title: "Có ưu đãi mới dành cho bạn.", time: "10 phút trước", seen: true },
    { id: "9", title: "Bác sĩ đã gửi cập nhật về đơn thuốc.", time: "1 giờ trước", seen: false },
    { id: "10", title: "Nhắc nhở: Bạn có cuộc hẹn vào ngày mai.", time: "3 giờ trước", seen: false },
    { id: "11", title: "Hệ thống đang bảo trì vào lúc 12:00.", time: "5 giờ trước", seen: true },
];

const NotificationItem = ({ title, time, seen = false }: Notification) => {
    return (
        <View className="p-4 bg-[#1E1E1E] rounded-2xl mb-3 mx-4 shadow-md">
            <Text className={`text-base font-semibold ${seen ? "text-gray-400" : "text-white"}`}>
                {title}
            </Text>
            <Text className="text-gray-400 text-sm mt-1">{time}</Text>
        </View>
    );
};

const NotificationsScreen = () => {
    const router = useRouter();
    const [showAll, setShowAll] = useState(false);

    const visibleNotifications = useMemo(
        () => (showAll ? notifications : notifications.slice(0, 10)),
        [showAll]
    );

    const handleShowAll = useCallback(() => setShowAll(true), []);

    return (
        <View className="flex-1 bg-[#121212]">
            <View className="flex-row items-center justify-between p-4">
                <Pressable onPress={() => router.back()} className="mr-4">
                    <AntDesign name="left" size={24} color="white" />
                </Pressable>
                <Text className="text-2xl font-bold text-white">Cài đặt</Text>
                <Pressable onPress={() => console.log("Search")}>
                    <AntDesign name="search1" size={24} color="white" />
                </Pressable>
            </View>

            <FlatList
                data={visibleNotifications}
                keyExtractor={(item) => item?.id ?? ""}
                renderItem={({ item }) => item ? <NotificationItem {...item} /> : null}
                contentContainerStyle={{ paddingVertical: 10 }}
            />

            {!showAll && notifications.length > 10 && (
                <Pressable onPress={handleShowAll} className="p-4">
                    <Text className="text-center text-blue-400">Xem tất cả</Text>
                </Pressable>
            )}
        </View>
    );
};

export default NotificationsScreen;

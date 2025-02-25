import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const AppointmentsScreen = () => {
    const router = useRouter();
    return (
        <View className="flex-1 bg-[#121212]">
            <View className="flex-row items-center justify-between p-4">
                <Pressable onPress={() => router.back()} className="mr-4">
                    <AntDesign name="left" size={24} color="white" />
                </Pressable>
                <Text className="text-2xl font-bold text-white">Lịch hẹn</Text>
                <Pressable onPress={() => console.log("Search")}>
                    <AntDesign name="search1" size={24} color="white" />
                </Pressable>
            </View>
        </View>
    )
}

export default AppointmentsScreen

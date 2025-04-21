import { AntDesign } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { PrimaryButton } from "../components/Buttons/PrimaryButton";
import { FormTitle } from "../components/Form/FormTitle";
import { TextInput } from "../components/TextInput/TextInput";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (username.trim().length < 3) {
      return Alert.alert("Lỗi", "Tên đăng nhập phải có ít nhất 3 ký tự.");
    }

    if (password.length < 6) {
      return Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự.");
    }

    try {
      setIsLoading(true);
      await login(username, password);
      router.replace("/home");
    } catch (err) {
      Alert.alert("Lỗi", "Đăng nhập không thành công. Vui lòng kiểm tra lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-black"
    >
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-8 pt-12 pb-6">
          <Pressable onPress={() => router.back()} className="mb-10">
            <AntDesign name="arrowleft" size={24} color="white" />
          </Pressable>

          <Animated.View entering={FadeIn.duration(1000)} className="flex-1 justify-center">
            <View className="mb-10">
              <FormTitle title="Đăng nhập" />
              <Text className="text-gray-400 text-base mt-2">Chào mừng bạn quay trở lại.</Text>
            </View>

            <View className="gap-5 mb-8">
              <TextInput
                label="Tài khoản"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />

              <TextInput
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <PrimaryButton
              title="Đăng nhập"
              onPress={handleLogin}
              loading={isLoading}
            />

            <Link href="/forgot-password" asChild>
              <Pressable className="py-4 mt-4">
                <Animated.Text className="text-[#4A90E2] text-center text-base">
                  Quên mật khẩu?
                </Animated.Text>
              </Pressable>
            </Link>

            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-400">Chưa có tài khoản? </Text>
              <Link href="/register" asChild>
                <Pressable>
                  <Text className="text-[#4A90E2] font-semibold">Đăng ký ngay</Text>
                </Pressable>
              </Link>
            </View>
          </Animated.View>

          <Animated.Text
            entering={FadeIn.delay(500).duration(1000)}
            className="text-[#666] text-center text-sm mt-8"
          >
            Ứng dụng chăm sóc sức khỏe thông minh
          </Animated.Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

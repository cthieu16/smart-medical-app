import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, Text, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { PrimaryButton } from "../components/Buttons/PrimaryButton";
import { FormTitle } from "../components/Form/FormTitle";
import { TextInput } from "../components/TextInput/TextInput";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const router = useRouter();
  const { register, login } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = () => {
    if (fullName.trim().length < 3) {
      Alert.alert("Lỗi", "Họ và tên phải có ít nhất 3 ký tự.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Lỗi", "Email không hợp lệ.");
      return false;
    }

    if (username.trim().length < 3 || /\s/.test(username)) {
      Alert.alert(
        "Lỗi",
        "Tên đăng nhập phải có ít nhất 3 ký tự và không chứa khoảng trắng."
      );
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự.");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu nhập lại không khớp.");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    try {
      setIsLoading(true);
      await register(fullName, email, username, password, confirmPassword);
      await login(email, password);
      router.replace("/home");
    } catch (err) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi đăng ký. Vui lòng kiểm tra lại.");
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
        <View className="flex-1 px-8 pt-12">
          <Pressable onPress={() => router.back()} className="mb-8">
            <AntDesign name="arrowleft" size={24} color="white" />
          </Pressable>

          <Animated.View entering={FadeIn.duration(1000)} className="flex-1">
            <View className="mb-8">
              <FormTitle title="Tạo tài khoản mới" />
              <Text className="text-gray-400 text-base mt-2">Nhập thông tin của bạn để đăng ký.</Text>
            </View>

            <View className="gap-5 mb-6">
              <TextInput
                label="Họ và tên"
                placeholder="Nhập họ và tên"
                value={fullName}
                onChangeText={setFullName}
              />

              <TextInput
                label="Email"
                placeholder="example@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                label="Tên đăng nhập"
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

              <TextInput
                label="Nhập lại mật khẩu"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <PrimaryButton
              title="Đăng ký"
              onPress={handleRegister}
              loading={isLoading}
            />

            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-400">Đã có tài khoản? </Text>
              <Pressable onPress={() => router.replace("/login")}>
                <Text className="text-[#4A90E2] font-semibold">Đăng nhập</Text>
              </Pressable>
            </View>

            <Text className="text-[#666] text-center text-sm mt-8">
              Khi đăng ký, bạn đồng ý với các{" "}
              <Text className="text-[#4A90E2]">Điều khoản</Text> và{" "}
              <Text className="text-[#4A90E2]">Điều kiện</Text> của chúng tôi.
            </Text>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;

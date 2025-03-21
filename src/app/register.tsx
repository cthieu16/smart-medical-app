import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
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
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const validateInputs = () => {
    if (fullName.trim().length < 3) {
      setError("Họ và tên phải có ít nhất 3 ký tự.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ.");
      return false;
    }

    if (username.trim().length < 3 || /\s/.test(username)) {
      setError(
        "Tên đăng nhập phải có ít nhất 3 ký tự và không chứa khoảng trắng."
      );
      return false;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return false;
    }


    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return false;
    }

    setError("");
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    try {
      await register(fullName, email, username, password, confirmPassword);
      await login(email, password);
      router.replace("/home");
    } catch (err) {
      setError("Lỗi khi đăng ký. Vui lòng kiểm tra lại.");
    }
  };

  return (
    <View className="flex-1 px-8 pt-12 bg-black">
      <Pressable onPress={() => router.back()} className="mb-8">
        <AntDesign name="arrowleft" size={24} color="white" />
      </Pressable>

      <Animated.View entering={FadeIn.duration(1000)} className="flex-1">
        <FormTitle title="Tạo tài khoản mới" />

        <View className="gap-3 space-y-4">
          <TextInput
            label="Họ và tên"
            placeholder="Họ và tên"
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
            placeholder="Tên đăng nhập"
            value={username}
            onChangeText={setusername}
            autoCapitalize="none"
          />

          <TextInput
            label="Mật khẩu"
            placeholder="Mật khẩu"
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

          <View className="h-6">
            {error ? <Text className="text-red-500">{error}</Text> : null}
          </View>

          <PrimaryButton title="Đăng ký" onPress={handleRegister} />

          <Text className="text-[#666] text-center text-sm mt-4">
            Khi đăng ký, bạn đồng ý với các{" "}
            <Text className="text-[#4A90E2]">Điều khoản</Text> và{" "}
            <Text className="text-[#4A90E2]">Điều kiện </Text>của chúng tôi.
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

export { Register as default };

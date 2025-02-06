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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      await register(firstName, lastName, email, password);
      await login(email, password);
      router.replace("/home");
    } catch (err) {
      setError("Lỗi khi đăng nhập. Vui lòng kiểm tra lại.");
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
            label="Họ"
            placeholder="Họ"
            value={firstName}
            onChangeText={setFirstName}
          />

          <TextInput
            label="Tên"
            placeholder="Tên"
            value={lastName}
            onChangeText={setLastName}
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
            label="Mật khẩu"
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
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

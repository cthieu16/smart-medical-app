import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View, Alert } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { PrimaryButton } from "../components/Buttons/PrimaryButton";
import { FormTitle } from "../components/Form/FormTitle";
import { TextInput } from "../components/TextInput/TextInput";
import { useAuth } from "../context/AuthContext";

const ForgotPassword = () => {
  const router = useRouter();
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      return Alert.alert("Lỗi", "Vui lòng nhập email của bạn.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Alert.alert(
        "Lỗi",
        "Email không hợp lệ. Vui lòng nhập đúng định dạng."
      );
    }

    try {
      await forgotPassword(email);
      Alert.alert(
        "Thành công",
        "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.",
        [{ text: "OK", onPress: () => router.push("/login") }]
      );
    } catch (err) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi gửi email. Vui lòng thử lại.");
    }
  };

  return (
    <View className="flex-1 px-8 pt-12 bg-black">
      <Pressable onPress={() => router.back()} className="mb-8">
        <AntDesign name="arrowleft" size={24} color="white" />
      </Pressable>

      <Animated.View entering={FadeIn.duration(1000)} className="flex-1">
        <FormTitle title="Quên mật khẩu" />

        <Text className="text-[#666] text-base mb-6">
          Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn để bạn thiết lập lại
          mật khẩu
        </Text>

        <View className="gap-3 space-y-4">
          <TextInput
            label="Email"
            placeholder="example@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <PrimaryButton title="Gửi" onPress={handleForgotPassword} />

          <Pressable className="py-2" onPress={() => router.push("/login")}>
            <Text className="text-[#4A90E2] text-center text-base">
              Quay lại đăng nhập
            </Text>
          </Pressable>
        </View>
      </Animated.View>

      <Animated.Text
        entering={FadeIn.delay(500).duration(1000)}
        className="text-[#666] text-center text-sm mb-4"
      >
        Nếu bạn cần trợ giúp thêm, vui lòng liên hệ với đội ngũ hỗ trợ của chúng
        tôi.
      </Animated.Text>
    </View>
  );
};

export default ForgotPassword;

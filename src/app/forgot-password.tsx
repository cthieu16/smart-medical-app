import { AntDesign, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { PrimaryButton } from "../components/Buttons/PrimaryButton";
import { FormTitle } from "../components/Form/FormTitle";
import { TextInput } from "../components/TextInput/TextInput";
import { post } from "../utils/api";
import { ENDPOINTS } from "../constants/api";

// Define the type for the forgot password response
interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

// Define the type for the reset password response
interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// Safe icon rendering helper
const renderIcon = (Component: typeof AntDesign | typeof Feather, name: string, size: number, color: string) => {
  return <Component name={name as any} size={size} color={color} />;
};

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'request' | 'reset'>('request');

  const handleRequestReset = async () => {
    if (!email.trim()) {
      return Alert.alert("Lỗi", "Vui lòng nhập email của bạn.");
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Alert.alert("Lỗi", "Vui lòng nhập email hợp lệ.");
    }

    try {
      setIsLoading(true);
      const result = await post<ForgotPasswordResponse>(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }, false);

      if (result.success) {
        setStep('reset');
        Alert.alert("Thành công", "Mã xác nhận đã được gửi đến email của bạn. Vui lòng kiểm tra email và nhập mã xác nhận cùng mật khẩu mới.");
      } else {
        Alert.alert("Lỗi", result.message || "Có lỗi xảy ra khi gửi mã xác nhận.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi xử lý yêu cầu";
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!token.trim()) {
      return Alert.alert("Lỗi", "Vui lòng nhập mã xác nhận.");
    }

    if (!newPassword.trim()) {
      return Alert.alert("Lỗi", "Vui lòng nhập mật khẩu mới.");
    }

    if (newPassword !== confirmPassword) {
      return Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
    }

    if (newPassword.length < 6) {
      return Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự.");
    }

    try {
      setIsLoading(true);

      const result = await post<ResetPasswordResponse>(
        ENDPOINTS.AUTH.RESET_PASSWORD,
        {
          email,
          token,
          newPassword
        },
        false
      );

      if (result.success) {
        Alert.alert(
          "Thành công",
          "Mật khẩu đã được đặt lại thành công.",
          [{ text: "Đăng nhập", onPress: () => router.push("/login") }]
        );
      } else {
        Alert.alert("Lỗi", result.message || "Có lỗi xảy ra khi đặt lại mật khẩu.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi đặt lại mật khẩu";
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRequestForm = () => (
    <>
      <View className="mb-10">
        <FormTitle title="Quên mật khẩu" />
        <Text className="text-gray-400 text-base mt-2">
          Nhập email của bạn và chúng tôi sẽ gửi mã xác nhận để thiết lập lại mật khẩu
        </Text>
      </View>

      <View className="gap-5 mb-8">
        <TextInput
          label="Email"
          placeholder="Nhập email của bạn"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <PrimaryButton
        title="Gửi mã xác nhận"
        onPress={handleRequestReset}
        loading={isLoading}
      />
    </>
  );

  const renderResetForm = () => (
    <>
      <View className="mb-10">
        <FormTitle title="Đặt lại mật khẩu" />
        <Text className="text-gray-400 text-base mt-2">
          Vui lòng nhập mã xác nhận đã được gửi đến email của bạn và mật khẩu mới
        </Text>
      </View>

      <View className="gap-5 mb-8">
        <TextInput
          label="Mã xác nhận"
          placeholder="Nhập mã xác nhận"
          value={token}
          onChangeText={setToken}
          autoCapitalize="none"
          keyboardType="number-pad"
        />

        <TextInput
          label="Mật khẩu mới"
          placeholder="Nhập mật khẩu mới"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TextInput
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu mới"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <PrimaryButton
        title="Đặt lại mật khẩu"
        onPress={handleResetPassword}
        loading={isLoading}
      />
    </>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-black"
    >
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-8 pt-12 pb-6">
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            {renderIcon(AntDesign, "arrowleft", 24, "white")}
          </TouchableOpacity>

          <Animated.View entering={FadeIn.duration(1000)} className="flex-1 justify-center">
            {step === 'request' && renderRequestForm()}
            {step === 'reset' && renderResetForm()}

            <TouchableOpacity className="py-4 mt-4" onPress={() => router.push("/login")} activeOpacity={0.7}>
              <Text className="text-[#4A90E2] text-center text-base">
                Quay lại đăng nhập
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.Text
            entering={FadeIn.delay(500).duration(1000)}
            className="text-[#666] text-center text-sm mt-8"
          >
            Nếu bạn cần trợ giúp thêm, vui lòng liên hệ với đội ngũ hỗ trợ của chúng
            tôi.
          </Animated.Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginBottom: 32,
    padding: 4,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#161B22',
  }
});

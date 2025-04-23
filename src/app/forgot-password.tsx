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

const ForgotPassword = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const handleRequestReset = async () => {
    if (!username.trim()) {
      return Alert.alert("Lỗi", "Vui lòng nhập tên đăng nhập của bạn.");
    }

    try {
      setIsLoading(true);
      const result = await post<ForgotPasswordResponse>(ENDPOINTS.AUTH.FORGOT_PASSWORD, { userName: username }, false);

      // Extract token from the response message
      const token = result.message;
      if (token) {
        setResetToken(token);
        Alert.alert("Thành công", "Mã xác nhận đã được tạo. Vui lòng nhập mật khẩu mới để tiếp tục.");
      } else {
        Alert.alert("Lỗi", "Không nhận được mã xác nhận từ máy chủ.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi xử lý yêu cầu";
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
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
          userName: username,
          token: resetToken,
          newPassword: newPassword
        },
        false
      );

      Alert.alert(
        "Thành công",
        "Mật khẩu đã được đặt lại thành công.",
        [{ text: "Đăng nhập", onPress: () => router.push("/login") }]
      );
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
          Nhập tên đăng nhập của bạn và chúng tôi sẽ gửi mã xác nhận để thiết lập lại mật khẩu
        </Text>
      </View>

      <View className="gap-5 mb-8">
        <TextInput
          label="Tên đăng nhập"
          placeholder="Nhập tên đăng nhập"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>

      <PrimaryButton
        title="Gửi yêu cầu"
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
          Vui lòng nhập mật khẩu mới của bạn
        </Text>
      </View>

      <View className="gap-5 mb-8">
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
            {!resetToken ? renderRequestForm() : renderResetForm()}

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
};

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

export default ForgotPassword;

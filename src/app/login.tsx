import { AntDesign } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
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
  const [error, setError] = useState("");

  const validateInputs = () => {
    if (username.trim().length < 3) {
      setError("Tên đăng nhập phải có ít nhất 3 ký tự.");
      return false;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return false;
    }

    setError("");
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    try {
      await login(username, password);
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
        <FormTitle title="Đăng nhập" />

        <View className="gap-3 space-y-4">
          <TextInput
            label="Tài khoản"
            placeholder="example"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <TextInput
            label="Mật khẩu"
            placeholder="********"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View className="h-6">
            {error ? <Text className="text-red-500">{error}</Text> : null}
          </View>

          <PrimaryButton title="Đăng nhập" onPress={handleLogin} />

          <Link href="/forgot-password" asChild>
            <Pressable className="py-2">
              <Animated.Text className="text-[#4A90E2] text-center text-base">
                Quên mật khẩu
              </Animated.Text>
            </Pressable>
          </Link>
        </View>
      </Animated.View>
    </View>
  );
};

export { Login as default };

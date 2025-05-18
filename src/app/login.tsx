import { AntDesign, Feather } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { PrimaryButton } from "../components/Buttons/PrimaryButton";
import { FormTitle } from "../components/Form/FormTitle";
import { TextInput } from "../components/TextInput/TextInput";
import { useAuth } from "../context/AuthContext";

// Safe icon rendering helper
const renderIcon = (Component: typeof AntDesign | typeof Feather, name: string, size: number, color: string) => {
  return <Component name={name as any} size={size} color={color} />;
};

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (username.trim().length < 1) {
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              {renderIcon(AntDesign, "arrowleft", 24, "white")}
            </TouchableOpacity>

            <Animated.View
              entering={FadeInDown.duration(800).springify()}
              style={styles.formContainer}
            >
              <View style={styles.headerContainer}>
                <View style={styles.titleContainer}>
                  <View style={styles.titleAccent} />
                  <Text style={styles.title}>Đăng nhập</Text>
                </View>
                <Text style={styles.subtitle}>Chào mừng bạn quay trở lại.</Text>
              </View>

              <View style={styles.inputsContainer}>
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
                <TouchableOpacity style={styles.forgotPasswordButton} activeOpacity={0.7}>
                  <Animated.Text style={styles.forgotPasswordText}>
                    Quên mật khẩu?
                  </Animated.Text>
                </TouchableOpacity>
              </Link>

              {/* Ẩn phần đăng ký 
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Chưa có tài khoản? </Text>
                <Link href="/register" asChild>
                  <TouchableOpacity>
                    <Text style={styles.registerLink}>Đăng ký ngay</Text>
                  </TouchableOpacity>
                </Link>
              </View>
              */}
            </Animated.View>

            <Animated.Text
              entering={FadeIn.delay(500).duration(1000)}
              style={styles.footerText}
            >
              Ứng dụng chăm sóc sức khỏe thông minh
            </Animated.Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 12,
    paddingBottom: 24,
  },
  backButton: {
    marginBottom: 32,
    padding: 4,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#161B22',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 32,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleAccent: {
    width: 4,
    height: 24,
    backgroundColor: '#4A90E2',
    borderRadius: 2,
    marginRight: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
  },
  subtitle: {
    color: '#A1A1AA',
    fontSize: 16,
    marginTop: 8,
  },
  inputsContainer: {
    gap: 20,
    marginBottom: 32,
  },
  forgotPasswordButton: {
    paddingVertical: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#4A90E2',
    fontSize: 16,
    textAlign: 'center',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    color: '#A1A1AA',
  },
  registerLink: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  footerText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 32,
  },
});

export default Login;

import { AntDesign, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
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
                  <Text style={styles.title}>Tạo tài khoản mới</Text>
                </View>
                <Text style={styles.subtitle}>Nhập thông tin của bạn để đăng ký.</Text>
              </View>

              <View style={styles.inputsContainer}>
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

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Đã có tài khoản? </Text>
                <TouchableOpacity onPress={() => router.replace("/login")}>
                  <Text style={styles.loginLink}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <Animated.Text
              entering={FadeIn.delay(500).duration(1000)}
              style={styles.footerText}
            >
              Khi đăng ký, bạn đồng ý với các{" "}
              <Text style={styles.termsText}>Điều khoản</Text> và{" "}
              <Text style={styles.termsText}>Điều kiện</Text> của chúng tôi.
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
  },
  headerContainer: {
    marginBottom: 24,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#A1A1AA',
  },
  loginLink: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  footerText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 32,
    lineHeight: 20,
  },
  termsText: {
    color: '#4A90E2',
  },
});

export default Register;

import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";
import { useUser } from "../../hooks/useUser";
import { useAuth } from "@/src/context/AuthContext";
import { Header } from "@/src/components/Header/Header";

const SettingsScreen = () => {
  const router = useRouter();
  const { user, updateUser, isUpdating } = useUser();
  const { changePassword } = useAuth();
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName ?? "",
        username: user.username ?? "",
        email: user.email ?? "",
      });
    }
  }, [user]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (name: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const updatedData: Partial<typeof user> = {
      fullName: formData.fullName,
      username: formData.username,
      email: formData.email,
    };
    updateUser(updatedData);
  };

  const handlePasswordChange = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmNewPassword
    ) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới không khớp!");
      return;
    }

    try {
      await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmNewPassword
      );
      Alert.alert("Thành công", "Mật khẩu đã được thay đổi!");
      setIsPasswordModalVisible(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err: any) {
      Alert.alert(
        "Lỗi",
        err.message || "Không thể đổi mật khẩu, vui lòng thử lại."
      );
    }
  };

  if (!user) {
    return (
      <View className="flex-1 bg-[#121212] items-center justify-center">
        <Text className="text-white">Đang chờ...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#121212]">
      <Header title="Cài đặt" />

      <View className="px-6 mt-4">
        <Text className="mb-4 text-xl text-white">Thông tin cá nhân</Text>
        <View className="gap-3 space-y-4">
          <TextInput
            className="bg-[#1E1E1E] text-white px-4 py-3 rounded-lg"
            placeholder="Họ"
            placeholderTextColor="#666"
            value={formData.fullName}
            onChangeText={(value) => handleChange("fullName", value)}
          />
          <TextInput
            className="bg-[#1E1E1E] text-white px-4 py-3 rounded-lg"
            placeholder="Tên"
            placeholderTextColor="#666"
            value={formData.username}
            onChangeText={(value) => handleChange("username", value)}
          />
          <TextInput
            className="bg-[#1E1E1E] text-white px-4 py-3 rounded-lg"
            placeholder="Email"
            placeholderTextColor="#666"
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
            keyboardType="email-address"
          />
        </View>

        <Pressable
          className="bg-[#4A90E2] mt-8 py-3 px-6 rounded-lg"
          onPress={handleSubmit}
          disabled={isUpdating}
        >
          <Text className="font-semibold text-center text-white">
            {isUpdating ? "Đang lưu..." : "Lưu"}
          </Text>
        </Pressable>

        <Pressable
          className="mt-8 py-3 px-6 rounded-lg border border-[#4A90E2] mb-4"
          onPress={() => setIsPasswordModalVisible(true)}
        >
          <Text className="text-[#4A90E2] text-center font-semibold">
            Đổi mật khẩu
          </Text>
        </Pressable>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isPasswordModalVisible}
        onRequestClose={() => setIsPasswordModalVisible(false)}
      >
        <Pressable
          className="justify-end flex-1 bg-black bg-opacity-50"
          onPress={() => setIsPasswordModalVisible(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View className="bg-[#121212] p-6 rounded-t-3xl">
              <Text className="mb-6 text-2xl font-bold text-white">
                Đổi mật khẩu
              </Text>
              <TextInput
                className="bg-[#1E1E1E] text-white px-4 py-3 rounded-lg mb-4"
                placeholder="Mật khẩu cũ"
                placeholderTextColor="#666"
                secureTextEntry
                value={passwordData.currentPassword}
                onChangeText={(value) =>
                  handlePasswordInputChange("currentPassword", value)
                }
              />
              <TextInput
                className="bg-[#1E1E1E] text-white px-4 py-3 rounded-lg mb-4"
                placeholder="Mật khẩu mới"
                placeholderTextColor="#666"
                secureTextEntry
                value={passwordData.newPassword}
                onChangeText={(value) =>
                  handlePasswordInputChange("newPassword", value)
                }
              />
              <TextInput
                className="bg-[#1E1E1E] text-white px-4 py-3 rounded-lg mb-4"
                placeholder="Nhập lại mật khẩu mới"
                placeholderTextColor="#666"
                secureTextEntry
                value={passwordData.confirmNewPassword}
                onChangeText={(value) =>
                  handlePasswordInputChange("confirmNewPassword", value)
                }
              />
              <Pressable
                className="bg-[#E63946] py-3 px-6 rounded-lg mb-4"
                onPress={handlePasswordChange}
              >
                <Text className="font-semibold text-center text-white">
                  Lưu
                </Text>
              </Pressable>
              <Pressable onPress={() => setIsPasswordModalVisible(false)}>
                <Text className="text-[#4A90E2] text-center">Huỷ bỏ</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
};

export default SettingsScreen;

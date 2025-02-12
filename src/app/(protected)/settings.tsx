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
} from "react-native";
import { useUser } from "../../hooks/useUser";

const SettingsScreen = () => {
  const router = useRouter();
  const { user, updateUser, isUpdating } = useUser();
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        postalCode: user.address?.postalCode || "",
        country: user.address?.country || "",
      });
    }
  }, [user]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const updatedData: Partial<typeof user> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || null,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
      },
    };
    updateUser(updatedData);
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
      <View className="flex-row items-center justify-between p-4">
        <Pressable onPress={() => router.back()} className="mr-4">
          <AntDesign name="left" size={24} color="white" />
        </Pressable>
        <Text className="text-2xl font-bold text-white">Cài đặt</Text>
        <Pressable onPress={() => console.log("Search")}>
          <AntDesign name="search1" size={24} color="white" />
        </Pressable>
      </View>

      <View className="px-4 mt-4">
        <Text className="mb-4 text-xl text-white">Thông tin cá nhân</Text>
        <View className="gap-3 space-y-4">
          <TextInput
            className="bg-[#1E1E1E] text-white px-4 py-3 rounded-lg"
            placeholder="Họ"
            placeholderTextColor="#666"
            value={formData.firstName}
            onChangeText={(value) => handleChange("firstName", value)}
          />
          <TextInput
            className="bg-[#1E1E1E] text-white px-4 py-3 rounded-lg"
            placeholder="Tên"
            placeholderTextColor="#666"
            value={formData.lastName}
            onChangeText={(value) => handleChange("lastName", value)}
          />
          <TextInput
            className="bg-[#1E1E1E] text-white px-4 py-3 rounded-lg"
            placeholder="Email"
            placeholderTextColor="#666"
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
            keyboardType="email-address"
          />
          <TextInput
            className="bg-[#1E1E1E] text-white px-4 py-3 rounded-lg"
            placeholder="Số điện thoại"
            placeholderTextColor="#666"
            value={formData.phone}
            onChangeText={(value) => handleChange("phone", value)}
            keyboardType="phone-pad"
          />
        </View>

        <Text className="mt-8 mb-4 text-xl text-white">Địa chỉ</Text>
        <View className="gap-3 space-y-4">
          <TextInput
            className="bg-[#1E1E1E] text-white px-4 py-3 rounded-lg"
            placeholder="Đường, phố"
            placeholderTextColor="#666"
            value={formData.street}
            onChangeText={(value) => handleChange("street", value)}
          />
          <TextInput
            className="bg-[#1E1E1E] text-white px-4 py-3 rounded-lg"
            placeholder="Thành phố"
            placeholderTextColor="#666"
            value={formData.city}
            onChangeText={(value) => handleChange("city", value)}
          />
          <TextInput
            className="bg-[#1E1E1E] text-white px-4 py-3 rounded-lg"
            placeholder="Bang, tiểu bang (hoặc tỉnh, tùy theo quốc gia)"
            placeholderTextColor="#666"
            value={formData.state}
            onChangeText={(value) => handleChange("state", value)}
          />
          <TextInput
            className="bg-[#1E1E1E] text-white px-4 py-3 rounded-lg"
            placeholder="Mã bưu điện"
            placeholderTextColor="#666"
            value={formData.postalCode}
            onChangeText={(value) => handleChange("postalCode", value)}
          />
          <TextInput
            className="bg-[#1E1E1E] text-white px-4 py-3 rounded-lg"
            placeholder="Quốc gia"
            placeholderTextColor="#666"
            value={formData.country}
            onChangeText={(value) => handleChange("country", value)}
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
              />
              <TextInput
                className="bg-[#1E1E1E] text-white px-4 py-3 rounded-lg mb-4"
                placeholder="Mật khẩu mới"
                placeholderTextColor="#666"
                secureTextEntry
              />
              <TextInput
                className="bg-[#1E1E1E] text-white px-4 py-3 rounded-lg mb-4"
                placeholder="Nhập lại mật khẩu mới"
                placeholderTextColor="#666"
                secureTextEntry
              />
              <Pressable
                className="bg-[#E63946] py-3 px-6 rounded-lg mb-4"
                onPress={() => {
                  setIsPasswordModalVisible(false);
                }}
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

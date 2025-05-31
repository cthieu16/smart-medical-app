import { AntDesign, Feather, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
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
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useUser } from "../../hooks/useUser";
import { useAuth } from "@/src/context/AuthContext";
import { Header } from "@/src/components/Header/Header";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from '@react-native-community/datetimepicker';

// Safe icon rendering helper
const renderFeatherIcon = (name: string, size: number, color: string) => {
  return <Feather name={name as any} size={size} color={color} />;
};

const ANIMATION_DELAY_BASE = 50;
const COLORS = {
  primary: "#4A90E2",
  background: "black",
  cardBg: "#161B22",
  borderColor: "#30363D",
  textPrimary: "#FFFFFF",
  textSecondary: "#A1A1AA",
  placeholder: "#666",
  danger: "#F87171",
  success: "#10B981",
  iconBg: "rgba(74, 144, 226, 0.15)",
};

const genderOptions = [
  { value: 0, label: "Nam" },
  { value: 1, label: "Nữ" },
  { value: 2, label: "Khác" },
];

const InputField = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  keyboardType = "default",
  icon,
  editable = true 
}: any) => (
  <Animated.View style={styles.inputContainer} entering={FadeInDown.duration(300)}>
    <View style={styles.inputLabelContainer}>
      {icon && (
        <View style={styles.inputIconContainer}>
          {icon}
        </View>
      )}
      <Text style={styles.inputLabel}>{label}</Text>
    </View>
    <TextInput
      style={[styles.input, !editable && styles.disabledInput]}
      placeholder={placeholder}
      placeholderTextColor={COLORS.placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      editable={editable}
    />
  </Animated.View>
);

const SettingsScreen = () => {
  const router = useRouter();
  const { user, updatePatientProfile, isUpdatingPatientProfile } = useUser();
  const { logout, changePassword } = useAuth();

  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [patientInfo, setPatientInfo] = useState({
    id: "",
    userId: "",
    name: "",
    age: 0,
    dateOfBirth: new Date(),
    gender: 0,
    address: "",
    chanelNumber: "",
    email: "",
    code: "",
  });

  // For iOS: Keep track of temporary date selection
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    if (user) {
      const userData = user as any;
      if (userData.patientInfo) {
        setPatientInfo({
          id: userData.patientInfo.id ?? "",
          userId: userData.id ?? "",
          name: userData.patientInfo.name ?? "",
          age: userData.patientInfo.age ?? 0,
          dateOfBirth: userData.patientInfo.dateOfBirth ? new Date(userData.patientInfo.dateOfBirth) : new Date(),
          gender: userData.patientInfo.gender ?? 0,
          address: userData.patientInfo.address ?? "",
          chanelNumber: userData.patientInfo.chanelNumber ?? "",
          email: userData.patientInfo.email ?? "",
          code: userData.patientInfo.code ?? "",
        });
      }
    }
  }, [user]);

  // Reset temp date when opening the picker
  useEffect(() => {
    if (showDatePicker) {
      setTempSelectedDate(patientInfo.dateOfBirth);
    }
  }, [showDatePicker]);

  const handlePatientInfoChange = (name: string, value: any) => {
    setPatientInfo((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordInputChange = (name: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const updatedData = {
      id: patientInfo.id,
      userId: patientInfo.userId,
      name: patientInfo.name || null,
      age: patientInfo.age || 0,
      dateOfBirth: patientInfo.dateOfBirth ? patientInfo.dateOfBirth.toISOString() : null,
      gender: patientInfo.gender !== undefined ? Number(patientInfo.gender) : null,
      address: patientInfo.address || null,
      chanelNumber: patientInfo.chanelNumber || null,
      email: patientInfo.email || null,
      code: patientInfo.code || null,
    };
    updatePatientProfile(updatedData as any);
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

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setShowLogoutConfirm(false);
      await logout();
      router.replace("/");
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error.message || "Không thể đăng xuất, vui lòng thử lại sau."
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Handle date change based on platform
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (selectedDate) {
        handlePatientInfoChange("dateOfBirth", selectedDate);
      }
    } else {
      // For iOS - just update the temporary state without closing
      if (selectedDate) {
        setTempSelectedDate(selectedDate);
      }
    }
  };

  // Confirm date selection on iOS
  const confirmIOSDateSelection = () => {
    if (tempSelectedDate) {
      handlePatientInfoChange("dateOfBirth", tempSelectedDate);
    }
    setShowDatePicker(false);
  };

  // Cancel date selection on iOS
  const cancelIOSDateSelection = () => {
    setShowDatePicker(false);
  };

  const formatDate = (date: Date) => {
    if (!date) return "";
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <Header title="Cài đặt" />

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Header Info Card */}
          <Animated.View
            style={styles.headerCard}
            entering={FadeInDown.delay(100).duration(400)}
          >
            <LinearGradient
              colors={['rgba(74, 144, 226, 0.08)', 'rgba(74, 144, 226, 0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientOverlay}
            />
            <View style={styles.headerCardContent}>
              <MaterialCommunityIcons name="account-cog" size={20} color={COLORS.primary} />
              <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Quản lý thông tin tài khoản và bảo mật
            </Text>
          </Animated.View>

          <View style={styles.formContainer}>
            {/* Patient Information Section */}
            <Animated.View 
              style={styles.sectionCard}
              entering={FadeInDown.delay(200).duration(400)}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <View style={styles.sectionAccent} />
                  <Text style={styles.sectionTitle}>Thông tin bệnh nhân</Text>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <InputField
                  label="Họ tên"
                  value={patientInfo.name}
                  onChangeText={(value: string) => handlePatientInfoChange("name", value)}
                  placeholder="Nhập họ tên"
                  icon={<MaterialIcons name="person" size={16} color={COLORS.primary} />}
                />

                <View style={styles.rowContainer}>
                  <View style={styles.halfWidth}>
                    <InputField
                      label="Tuổi"
                      value={String(patientInfo.age)}
                      onChangeText={(value: string) => handlePatientInfoChange("age", value)}
                      placeholder="Tuổi"
                      keyboardType="number-pad"
                      icon={<MaterialIcons name="cake" size={16} color={COLORS.primary} />}
                    />
                  </View>
                  
                  <View style={styles.halfWidth}>
                    <Animated.View style={styles.inputContainer} entering={FadeInDown.duration(300)}>
                      <View style={styles.inputLabelContainer}>
                        <View style={styles.inputIconContainer}>
                          <MaterialIcons name="event" size={16} color={COLORS.primary} />
                        </View>
                        <Text style={styles.inputLabel}>Ngày sinh</Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.input} 
                        onPress={() => setShowDatePicker(true)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.dateText}>
                          {patientInfo.dateOfBirth ? formatDate(patientInfo.dateOfBirth) : "Chọn ngày"}
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>
                  </View>
                </View>

                <Animated.View style={styles.inputContainer} entering={FadeInDown.duration(300)}>
                  <View style={styles.inputLabelContainer}>
                    <View style={styles.inputIconContainer}>
                      <MaterialIcons name="wc" size={16} color={COLORS.primary} />
                    </View>
                    <Text style={styles.inputLabel}>Giới tính</Text>
                  </View>
                  <View style={styles.genderContainer}>
                    {genderOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.genderOption,
                          Number(patientInfo.gender) === option.value && styles.genderOptionSelected
                        ]}
                        onPress={() => handlePatientInfoChange("gender", option.value)}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.genderText,
                          Number(patientInfo.gender) === option.value && styles.genderTextSelected
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </Animated.View>

                <InputField
                  label="Địa chỉ"
                  value={patientInfo.address}
                  onChangeText={(value: string) => handlePatientInfoChange("address", value)}
                  placeholder="Nhập địa chỉ"
                  icon={<MaterialIcons name="location-on" size={16} color={COLORS.primary} />}
                />

                <InputField
                  label="Số kênh"
                  value={patientInfo.chanelNumber}
                  onChangeText={(value: string) => handlePatientInfoChange("chanelNumber", value)}
                  placeholder="Nhập số kênh"
                  icon={<MaterialIcons name="phone" size={16} color={COLORS.primary} />}
                />

                <InputField
                  label="Email"
                  value={patientInfo.email}
                  onChangeText={(value: string) => handlePatientInfoChange("email", value)}
                  placeholder="Nhập email"
                  keyboardType="email-address"
                  icon={<MaterialIcons name="email" size={16} color={COLORS.primary} />}
                />
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, isUpdatingPatientProfile && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={isUpdatingPatientProfile}
                activeOpacity={0.8}
              >
                {isUpdatingPatientProfile ? (
                  <View style={styles.loadingButtonContent}>
                    <ActivityIndicator size="small" color="white" style={styles.buttonLoader} />
                    <Text style={styles.buttonText}>Đang lưu...</Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>Lưu thay đổi</Text>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Action Buttons */}
            <Animated.View
              style={styles.actionButtonsContainer}
              entering={FadeInDown.delay(300).duration(400)}
            >
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => setIsPasswordModalVisible(true)}
                activeOpacity={0.8}
              >
                <View style={styles.buttonIcon}>
                  <MaterialIcons name="lock" size={20} color={COLORS.primary} />
                </View>
                <Text style={styles.outlineButtonText}>Đổi mật khẩu</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dangerButton}
                onPress={() => setShowLogoutConfirm(true)}
                activeOpacity={0.8}
                disabled={isLoggingOut}
              >
                <View style={styles.buttonIcon}>
                  {isLoggingOut ? (
                    <ActivityIndicator size="small" color={COLORS.danger} />
                  ) : (
                    <MaterialIcons name="logout" size={20} color={COLORS.danger} />
                  )}
                </View>
                <Text style={styles.dangerButtonText}>
                  {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>

        {/* Date Picker for Android */}
        {Platform.OS === 'android' && showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={patientInfo.dateOfBirth || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
            locale="vi-VN"
          />
        )}
      </SafeAreaView>

      {/* iOS Date Picker Modal */}
      {Platform.OS === 'ios' && showDatePicker && (
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop}>
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity 
                  onPress={cancelIOSDateSelection}
                  style={styles.datePickerButton}
                >
                  <Text style={styles.datePickerCancelText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={confirmIOSDateSelection}
                  style={styles.datePickerButton}
                >
                  <Text style={styles.datePickerDoneText}>Xong</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                testID="dateTimePickerIOS"
                value={tempSelectedDate || patientInfo.dateOfBirth || new Date()}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={new Date()}
                style={styles.iosDatePicker}
                textColor="white"
                locale="vi-VN"
              />
            </View>
          </Pressable>
        </View>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowLogoutConfirm(false)}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContainer}>
                <View style={styles.modalIconContainer}>
                  <MaterialIcons name="logout" size={24} color={COLORS.danger} />
                </View>
                <Text style={styles.modalTitle}>Đăng xuất</Text>
                <Text style={styles.modalMessage}>
                  Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng không?
                </Text>

                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => setShowLogoutConfirm(false)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.modalCancelButtonText}>Hủy bỏ</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalSaveButton, { backgroundColor: COLORS.danger }]}
                    onPress={handleLogout}
                    activeOpacity={0.8}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={styles.modalSaveButtonText}>Đăng xuất</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </Pressable>
        </View>
      )}

      {/* Password Change Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPasswordModalVisible}
        onRequestClose={() => setIsPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setIsPasswordModalVisible(false)}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContainer}>
                <View style={styles.modalIconContainer}>
                  <MaterialIcons name="lock" size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.modalTitle}>Đổi mật khẩu</Text>

                <View style={styles.modalInputContainer}>
                  <Text style={styles.inputLabel}>Mật khẩu hiện tại</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập mật khẩu hiện tại"
                    placeholderTextColor={COLORS.placeholder}
                    secureTextEntry
                    value={passwordData.currentPassword}
                    onChangeText={(value) =>
                      handlePasswordInputChange("currentPassword", value)
                    }
                  />
                </View>

                <View style={styles.modalInputContainer}>
                  <Text style={styles.inputLabel}>Mật khẩu mới</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập mật khẩu mới"
                    placeholderTextColor={COLORS.placeholder}
                    secureTextEntry
                    value={passwordData.newPassword}
                    onChangeText={(value) =>
                      handlePasswordInputChange("newPassword", value)
                    }
                  />
                </View>

                <View style={styles.modalInputContainer}>
                  <Text style={styles.inputLabel}>Xác nhận mật khẩu mới</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập lại mật khẩu mới"
                    placeholderTextColor={COLORS.placeholder}
                    secureTextEntry
                    value={passwordData.confirmNewPassword}
                    onChangeText={(value) =>
                      handlePasswordInputChange("confirmNewPassword", value)
                    }
                  />
                </View>

                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => setIsPasswordModalVisible(false)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.modalCancelButtonText}>Hủy bỏ</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalSaveButton}
                    onPress={handlePasswordChange}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.modalSaveButtonText}>Cập nhật</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  headerCard: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    backgroundColor: `${COLORS.cardBg}99`,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    padding: 20,
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  sectionCard: {
    backgroundColor: `${COLORS.cardBg}CC`,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionAccent: {
    width: 4,
    height: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.iconBg,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    color: COLORS.textPrimary,
    padding: 16,
    borderRadius: 12,
    fontSize: 15,
  },
  disabledInput: {
    backgroundColor: '#242832',
    color: '#999',
  },
  dateText: {
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: COLORS.cardBg,
  },
  genderOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.iconBg,
  },
  genderText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  genderTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loadingButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonLoader: {
    marginRight: 8,
  },
  buttonText: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    fontSize: 16,
  },
  actionButtonsContainer: {
    gap: 12,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: `${COLORS.primary}08`,
  },
  buttonIcon: {
    marginRight: 8,
  },
  outlineButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: COLORS.danger,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: `${COLORS.danger}08`,
  },
  dangerButtonText: {
    color: COLORS.danger,
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 32,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  modalIconContainer: {
    width: 56,
    height: 56,
    backgroundColor: COLORS.iconBg,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalMessage: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalInputContainer: {
    marginBottom: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#21262D',
    padding: 16,
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  modalCancelButtonText: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    fontSize: 16,
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveButtonText: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    fontSize: 16,
  },
  datePickerContainer: {
    backgroundColor: COLORS.cardBg,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    paddingBottom: Platform.OS === 'ios' ? 36 : 0,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  datePickerButton: {
    paddingHorizontal: 12,
  },
  datePickerCancelText: {
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  datePickerDoneText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  iosDatePicker: {
    height: 200,
    width: '100%',
  },
});

export default SettingsScreen;

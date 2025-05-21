import { AntDesign, Feather } from "@expo/vector-icons";
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
import Animated, { FadeInDown } from "react-native-reanimated";
import { spacing } from "@/src/theme/spacing";
import DateTimePicker from '@react-native-community/datetimepicker';

// Safe icon rendering helper
const renderFeatherIcon = (name: string, size: number, color: string) => {
  return <Feather name={name as any} size={size} color={color} />;
};

const ANIMATION_DELAY_BASE = 50;

const genderOptions = [
  { value: 0, label: "Nam" },
  { value: 1, label: "Nữ" },
  { value: 2, label: "Khác" },
];

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
        <Text style={styles.loadingText}>Đang chờ...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header title="Cài đặt" accentColor="#4A90E2" />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.delay(ANIMATION_DELAY_BASE).duration(400)}
          style={styles.formContainer}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>Thông tin bệnh nhân</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Họ tên</Text>
              <TextInput
                style={styles.input}
                placeholder="Họ tên"
                placeholderTextColor="#666"
                value={patientInfo.name}
                onChangeText={(value) => handlePatientInfoChange("name", value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Tuổi</Text>
              <TextInput
                style={styles.input}
                placeholder="Tuổi"
                placeholderTextColor="#666"
                value={String(patientInfo.age)}
                onChangeText={(value) => handlePatientInfoChange("age", value)}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Ngày sinh</Text>
              <TouchableOpacity 
                style={styles.input} 
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.dateText}>
                  {patientInfo.dateOfBirth ? formatDate(patientInfo.dateOfBirth) : "Chọn ngày sinh"}
                </Text>
              </TouchableOpacity>
              
              {Platform.OS === 'android' && showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={patientInfo.dateOfBirth || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Giới tính</Text>
              <View style={styles.genderContainer}>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.genderOption,
                      Number(patientInfo.gender) === option.value && styles.genderOptionSelected
                    ]}
                    onPress={() => handlePatientInfoChange("gender", option.value)}
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
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Địa chỉ</Text>
              <TextInput
                style={styles.input}
                placeholder="Địa chỉ"
                placeholderTextColor="#666"
                value={patientInfo.address}
                onChangeText={(value) => handlePatientInfoChange("address", value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Số kênh</Text>
              <TextInput
                style={styles.input}
                placeholder="Số kênh"
                placeholderTextColor="#666"
                value={patientInfo.chanelNumber}
                onChangeText={(value) => handlePatientInfoChange("chanelNumber", value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email bệnh nhân</Text>
              <TextInput
                style={styles.input}
                placeholder="Email bệnh nhân"
                placeholderTextColor="#666"
                value={patientInfo.email}
                onChangeText={(value) => handlePatientInfoChange("email", value)}
                keyboardType="email-address"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSubmit}
            disabled={isUpdatingPatientProfile}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isUpdatingPatientProfile ? "Đang lưu..." : "Lưu thay đổi"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => setIsPasswordModalVisible(true)}
            activeOpacity={0.8}
          >
            <View style={styles.buttonIcon}>
              {renderFeatherIcon("lock", 20, "#4A90E2")}
            </View>
            <Text style={styles.outlineButtonText}>
              Đổi mật khẩu
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={() => setShowLogoutConfirm(true)}
            activeOpacity={0.8}
            disabled={isLoggingOut}
          >
            <View style={styles.buttonIcon}>
              {isLoggingOut ? (
                <ActivityIndicator size="small" color="#F87171" />
              ) : (
                renderFeatherIcon("log-out", 20, "#F87171")
              )}
            </View>
            <Text style={styles.dangerButtonText}>
              {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

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
                <Text style={styles.modalTitle}>
                  Đăng xuất
                </Text>
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
                    style={[styles.modalSaveButton, { backgroundColor: '#F87171' }]}
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
                <Text style={styles.modalTitle}>
                  Đổi mật khẩu
                </Text>

                <View style={styles.modalInputContainer}>
                  <Text style={styles.inputLabel}>Mật khẩu hiện tại</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập mật khẩu hiện tại"
                    placeholderTextColor="#666"
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
                    placeholderTextColor="#666"
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
                    placeholderTextColor="#666"
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: 'white',
  },
  formContainer: {
    padding: spacing.screenMargin,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionAccent: {
    width: 4,
    height: 20,
    backgroundColor: '#4A90E2',
    borderRadius: 2,
    marginRight: spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  inputGroup: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  inputLabel: {
    color: '#A1A1AA',
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#161B22',
    borderWidth: 1,
    borderColor: '#30363D',
    color: 'white',
    padding: spacing.md,
    borderRadius: spacing.borderRadius.lg,
    fontSize: 15,
  },
  disabledInput: {
    backgroundColor: '#242832',
    color: '#999',
  },
  dateText: {
    color: 'white',
  },
  datePickerContainer: {
    backgroundColor: '#161B22',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: '#30363D',
    paddingBottom: Platform.OS === 'ios' ? 36 : 0,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#30363D',
  },
  datePickerButton: {
    paddingHorizontal: 12,
  },
  datePickerCancelText: {
    color: 'white',
    fontSize: 16,
  },
  datePickerDoneText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
  iosDatePicker: {
    height: 200,
    width: '100%',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#30363D',
    borderRadius: spacing.borderRadius.lg,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#161B22',
  },
  genderOptionSelected: {
    borderColor: '#4A90E2',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  genderText: {
    color: 'white',
  },
  genderTextSelected: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
    padding: spacing.md,
    borderRadius: spacing.borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#4A90E2',
    padding: spacing.md,
    borderRadius: spacing.borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: spacing.xs,
  },
  outlineButtonText: {
    color: '#4A90E2',
    fontWeight: '600',
    fontSize: 16,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: '#F87171',
    padding: spacing.md,
    borderRadius: spacing.borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dangerButtonText: {
    color: '#F87171',
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
    backgroundColor: '#161B22',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  modalMessage: {
    color: '#A1A1AA',
    fontSize: 16,
    marginBottom: spacing.lg,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalInputContainer: {
    marginBottom: spacing.md,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#21262D',
    padding: spacing.md,
    borderRadius: spacing.borderRadius.lg,
    marginRight: spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  modalCancelButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    padding: spacing.md,
    borderRadius: spacing.borderRadius.lg,
    marginLeft: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default SettingsScreen;

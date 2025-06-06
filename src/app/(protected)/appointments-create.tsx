import { MaterialIcons, Ionicons, FontAwesome5, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StatusBar,
  SafeAreaView
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import dayjs from "dayjs";
import { Header } from "@/src/components/Header/Header";
import { useSpecialties, useDoctorsBySpecialty } from "@/src/hooks/useSpecialties";
import { useCreateAppointment } from "@/src/hooks/useAppointments";
import { PrimaryButton } from "@/src/components/Buttons/PrimaryButton";
import { SecondaryButton } from "@/src/components/Buttons/SecondaryButton";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const timeSlots = [
  "07:00 - 07:30",
  "08:00 - 08:30",
  "09:00 - 09:30",
  "09:30 - 10:00",
  "10:00 - 10:30",
  "10:30 - 11:00",
  "11:00 - 11:30",
  "13:00 - 13:30",
  "13:30 - 14:00",
  "14:00 - 14:30",
  "14:30 - 15:00",
  "15:00 - 15:30",
  "15:30 - 16:00",
  "16:00 - 16:30",
  "16:30 - 17:00",
];

const FIELD_COLORS = {
  iconBg: "rgba(74, 144, 226, 0.15)",
  border: "#30363D",
  inputBg: "#161B22",
  placeholder: "gray",
  highlight: "#4A90E2",
  text: "#FFFFFF",
  note: "gray"
};

const InputLabel = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <View className="flex-row items-center mb-3">
    <View className="mr-3 p-2 rounded-full" style={{ backgroundColor: FIELD_COLORS.iconBg }}>
      {icon}
    </View>
    <Text className="text-white font-semibold text-base">{label}</Text>
  </View>
);

const FormField = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <Animated.View className={`mb-5 ${className}`} entering={FadeInDown.duration(300)}>
    {children}
  </Animated.View>
);

const AppointmentsCreateScreen = () => {
  const router = useRouter();
  const { data: specialties = [] } = useSpecialties();
  const createAppointment = useCreateAppointment();

  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(timeSlots[0]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch doctors by selected specialty
  const { data: filteredDoctors = [], isLoading: isDoctorsLoading } = useDoctorsBySpecialty(selectedSpecialtyId);

  // Reset doctor selection when specialty changes
  useEffect(() => {
    setDoctorId("");
  }, [selectedSpecialtyId]);

  const handleConfirmDate = (date: any) => {
    setSelectedDate(date);
    setDatePickerVisibility(false);
  };

  const handleCreateAppointment = async () => {
    if (!selectedSpecialtyId) {
      return Alert.alert("Thông báo", "Vui lòng chọn chuyên khoa!");
    }

    if (filteredDoctors.length === 0) {
      return Alert.alert("Thông báo", "Chuyên khoa này hiện chưa có bác sĩ khả dụng. Vui lòng chọn chuyên khoa khác!");
    }

    if (!doctorId) {
      return Alert.alert("Thông báo", "Vui lòng chọn bác sĩ!");
    }

    if (!selectedDate) {
      return Alert.alert("Thông báo", "Vui lòng chọn ngày!");
    }

    if (dayjs(selectedDate).isBefore(dayjs(), "day")) {
      return Alert.alert(
        "Thông báo",
        "Ngày không hợp lệ! Vui lòng chọn ngày trong tương lai."
      );
    }

    if (!selectedTime) {
      return Alert.alert("Thông báo", "Vui lòng chọn giờ!");
    }

    setLoading(true);

    try {
      const formatTime = (time: any) => {
        const [hour, minute] = time.split(":");
        return { hour: Number(hour), minute: Number(minute) };
      };

      const [start, end] = selectedTime.split(" - ").map(formatTime);
      const startTime = dayjs(selectedDate)
        .hour(start.hour)
        .minute(start.minute)
        .format("YYYY-MM-DDTHH:mm:ss");
      const endTime = dayjs(selectedDate)
        .hour(end.hour)
        .minute(end.minute)
        .format("YYYY-MM-DDTHH:mm:ss");

      const payload = { doctorId, startTime, endTime, note };
      await createAppointment.mutateAsync(payload);

      Alert.alert("Thành công", "Lịch hẹn đã được tạo!", [
        {
          text: "OK",
          onPress: () => router.replace("/(protected)/appointments"),
        },
      ]);
    } catch (error) {
      Alert.alert("Lỗi", "Đã có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1">
        <Header title="Tạo lịch hẹn" />
        
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView 
            className="flex-1" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header Info Card */}
            <Animated.View
              className="mx-4 mt-4 mb-6 bg-[#161B22]/60 rounded-2xl border border-[#30363D] p-5 overflow-hidden"
              entering={FadeInDown.delay(100).duration(400)}
            >
              <LinearGradient
                colors={['rgba(74, 144, 226, 0.08)', 'rgba(74, 144, 226, 0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="absolute top-0 left-0 right-0 bottom-0"
              />
              <View className="flex-row items-center mb-2">
                <MaterialCommunityIcons name="calendar-clock" size={20} color={FIELD_COLORS.highlight} />
                <Text className="text-white font-bold ml-3 text-lg">Thông tin lịch hẹn</Text>
              </View>
              <Text className="text-gray-400 text-sm leading-5">
                Vui lòng điền đầy đủ thông tin bên dưới để đặt lịch hẹn
              </Text>
            </Animated.View>

            {/* Form Fields */}
            <View className="px-4">
              <FormField>
                <InputLabel
                  icon={<MaterialCommunityIcons name="medical-bag" size={16} color={FIELD_COLORS.highlight} />}
                  label="Chọn chuyên khoa"
                />
                <View className="bg-[#161B22] rounded-xl overflow-hidden" style={{ borderWidth: 1, borderColor: FIELD_COLORS.border }}>
                  <Picker
                    selectedValue={selectedSpecialtyId}
                    onValueChange={setSelectedSpecialtyId}
                    style={{ color: FIELD_COLORS.text }}
                    dropdownIconColor={FIELD_COLORS.highlight}
                    mode="dropdown"
                  >
                    <Picker.Item
                      label="-- Chọn chuyên khoa --"
                      value=""
                      style={{ color: FIELD_COLORS.placeholder }}
                    />
                    {specialties.map((specialty) => (
                      <Picker.Item
                        key={specialty.id}
                        label={specialty.name}
                        value={specialty.id}
                        color={FIELD_COLORS.text}
                      />
                    ))}
                  </Picker>
                </View>
              </FormField>

              <FormField>
                <InputLabel
                  icon={<FontAwesome5 name="user-md" size={16} color={selectedSpecialtyId ? FIELD_COLORS.highlight : FIELD_COLORS.placeholder} />}
                  label="Chọn bác sĩ"
                />
                <View 
                  className="rounded-xl overflow-hidden" 
                  style={{ 
                    backgroundColor: selectedSpecialtyId ? '#161B22' : '#0D1117',
                    borderWidth: 1, 
                    borderColor: selectedSpecialtyId ? FIELD_COLORS.border : FIELD_COLORS.placeholder,
                    opacity: selectedSpecialtyId ? 1 : 0.5
                  }}
                >
                  <Picker
                    selectedValue={doctorId}
                    onValueChange={setDoctorId}
                    style={{ color: selectedSpecialtyId ? FIELD_COLORS.text : FIELD_COLORS.placeholder }}
                    dropdownIconColor={selectedSpecialtyId ? FIELD_COLORS.highlight : FIELD_COLORS.placeholder}
                    mode="dropdown"
                    enabled={!!selectedSpecialtyId && !isDoctorsLoading}
                  >
                    <Picker.Item
                      label={
                        !selectedSpecialtyId 
                          ? "Vui lòng chọn chuyên khoa trước"
                          : isDoctorsLoading 
                            ? "Đang tải danh sách bác sĩ..."
                            : "-- Chọn bác sĩ --"
                      }
                      value=""
                      style={{ color: FIELD_COLORS.placeholder }}
                    />
                    {filteredDoctors.map((doctor) => (
                      <Picker.Item
                        key={doctor.id}
                        label={doctor.fullName}
                        value={doctor.id}
                        color={FIELD_COLORS.text}
                      />
                    ))}
                  </Picker>
                </View>
                {!selectedSpecialtyId && (
                  <Text className="text-gray-500 text-xs mt-2 ml-1">
                    * Chọn chuyên khoa để xem danh sách bác sĩ
                  </Text>
                )}
                {selectedSpecialtyId && isDoctorsLoading && (
                  <View className="flex-row items-center mt-2 ml-1">
                    <ActivityIndicator size="small" color={FIELD_COLORS.highlight} />
                    <Text className="text-blue-400 text-xs ml-2">
                      Đang tải danh sách bác sĩ...
                    </Text>
                  </View>
                )}
                {selectedSpecialtyId && !isDoctorsLoading && filteredDoctors.length === 0 && (
                  <Text className="text-yellow-500 text-xs mt-2 ml-1">
                    ⚠️ Chuyên khoa này hiện chưa có bác sĩ khả dụng
                  </Text>
                )}
                {selectedSpecialtyId && !isDoctorsLoading && filteredDoctors.length > 0 && (
                  <Text className="text-green-500 text-xs mt-2 ml-1">
                    ✓ Có {filteredDoctors.length} bác sĩ khả dụng
                  </Text>
                )}
              </FormField>

              <FormField>
                <InputLabel
                  icon={<AntDesign name="calendar" size={16} color={FIELD_COLORS.highlight} />}
                  label="Chọn ngày khám"
                />
                <TouchableOpacity
                  onPress={() => setDatePickerVisibility(true)}
                  className="bg-[#161B22] p-4 rounded-xl flex-row items-center justify-between"
                  style={{ borderWidth: 1, borderColor: FIELD_COLORS.border }}
                >
                  <Text className={`${selectedDate ? 'text-white' : 'text-gray-400'} text-base`}>
                    {selectedDate
                      ? dayjs(selectedDate).format("DD/MM/YYYY")
                      : "Chọn ngày khám"}
                  </Text>
                  <MaterialIcons name="date-range" size={20} color={FIELD_COLORS.highlight} />
                </TouchableOpacity>
              </FormField>

              <FormField>
                <InputLabel
                  icon={<Ionicons name="time-outline" size={16} color={FIELD_COLORS.highlight} />}
                  label="Chọn giờ khám"
                />
                <View className="bg-[#161B22] rounded-xl overflow-hidden" style={{ borderWidth: 1, borderColor: FIELD_COLORS.border }}>
                  <Picker
                    selectedValue={selectedTime}
                    onValueChange={setSelectedTime}
                    style={{ color: FIELD_COLORS.text }}
                    dropdownIconColor={FIELD_COLORS.highlight}
                    mode="dropdown"
                  >
                    {timeSlots.map((time) => (
                      <Picker.Item key={time} label={time} value={time} color={FIELD_COLORS.text} />
                    ))}
                  </Picker>
                </View>
              </FormField>

              <FormField>
                <InputLabel
                  icon={<MaterialIcons name="note-alt" size={16} color={FIELD_COLORS.highlight} />}
                  label="Ghi chú"
                />
                <TextInput
                  className="bg-[#161B22] text-white p-4 rounded-xl text-base"
                  placeholder="Nhập triệu chứng hoặc yêu cầu khám..."
                  placeholderTextColor={FIELD_COLORS.placeholder}
                  multiline
                  numberOfLines={4}
                  value={note}
                  onChangeText={setNote}
                  style={{ 
                    textAlignVertical: 'top', 
                    borderWidth: 1, 
                    borderColor: FIELD_COLORS.border,
                    minHeight: 100
                  }}
                />
              </FormField>

              {/* Action Buttons */}
              <FormField className="mt-2">
                <View className="flex-row justify-between space-x-3">
                  <View className="flex-1">
                    <SecondaryButton
                      title="Hủy"
                      onPress={() => router.back()}
                    />
                  </View>
                  <View className="flex-1">
                    <PrimaryButton
                      title="Đặt lịch"
                      onPress={handleCreateAppointment}
                      loading={loading}
                    />
                  </View>
                </View>
              </FormField>

              {/* Info Notes */}
              <Animated.View
                className="mt-4 bg-[#161B22]/50 p-4 rounded-xl border border-[#30363D]"
                entering={FadeInDown.delay(300).duration(400)}
              >
                <View className="flex-row items-start">
                  <Animated.View
                    className="bg-[rgba(74,144,226,0.15)] p-2 rounded-full mr-3 mt-0.5"
                    entering={FadeInRight.delay(400).duration(300)}
                  >
                    <MaterialIcons name="info-outline" size={16} color={FIELD_COLORS.highlight} />
                  </Animated.View>
                  <View className="flex-1">
                    <Text className="text-white font-semibold text-base mb-2">Lưu ý khi đặt lịch</Text>
                    <Text className="text-gray-400 text-sm leading-5 mb-1">
                      • Đến trước giờ hẹn 15 phút để làm thủ tục
                    </Text>
                    <Text className="text-gray-400 text-sm leading-5 mb-1">
                      • Mang theo giấy tờ cần thiết (nếu có)
                    </Text>
                    <Text className="text-gray-400 text-sm leading-5">
                      • Nếu có thay đổi, vui lòng hủy lịch trước 24 giờ
                    </Text>
                  </View>
                </View>
              </Animated.View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={() => setDatePickerVisibility(false)}
          minimumDate={new Date()}
          buttonTextColorIOS={FIELD_COLORS.highlight}
        />
      </SafeAreaView>
    </View>
  );
};

export default AppointmentsCreateScreen;

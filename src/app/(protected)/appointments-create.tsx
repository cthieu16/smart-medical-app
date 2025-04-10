import { MaterialIcons, Ionicons, FontAwesome5, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import dayjs from "dayjs";
import { Header } from "@/src/components/Header/Header";
import { useMyDoctors } from "@/src/hooks/useDoctors";
import { useCreateAppointment } from "@/src/hooks/useAppointments";
import { PrimaryButton } from "@/src/components/Buttons/PrimaryButton";
import { SecondaryButton } from "@/src/components/Buttons/SecondaryButton";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const timeSlots = [
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
  iconBg: "rgba(0, 174, 239, 0.15)",
  border: "#30363D",
  inputBg: "#161B22",
  placeholder: "#8B949E",
  highlight: "#00AEEF",
  text: "#FFFFFF",
  note: "#8B949E"
};

const InputLabel = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <View className="flex-row items-center mb-2">
    <View className="mr-2 p-1.5 rounded-full" style={{ backgroundColor: FIELD_COLORS.iconBg }}>
      {icon}
    </View>
    <Text className="text-white font-medium text-base">{label}</Text>
  </View>
);

const FormField = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <View className={`mb-6 ${className}`}>
    {children}
  </View>
);

const AppointmentsCreateScreen = () => {
  const router = useRouter();
  const { data: doctors = [] } = useMyDoctors();
  const createAppointment = useCreateAppointment();

  const [doctorId, setDoctorId] = useState(doctors[0]?.id || "");
  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(timeSlots[0]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmDate = (date: any) => {
    setSelectedDate(date);
    setDatePickerVisibility(false);
  };

  const handleCreateAppointment = async () => {
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 bg-[#0D1117]">
        <Header title="Tạo lịch hẹn" />
        
        <ScrollView className="flex-1">
          <View className="p-4">
            <Animated.View 
              className="bg-[#161B22]/50 rounded-2xl border border-[#30363D] p-4 mb-6 overflow-hidden" 
              entering={FadeInDown.delay(100).duration(400)}
            >
              <LinearGradient 
                colors={['rgba(0, 174, 239, 0.05)', 'rgba(0, 174, 239, 0)']} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 1 }} 
                className="absolute top-0 left-0 right-0 bottom-0"
              />
              <View className="flex-row items-center mb-2">
                <MaterialCommunityIcons name="calendar-clock" size={20} color={FIELD_COLORS.highlight} />
                <Text className="text-white font-bold ml-2 text-lg">Thông tin lịch hẹn</Text>
              </View>
              <Text className="text-[#8B949E] text-sm">
                Vui lòng điền đầy đủ thông tin bên dưới để đặt lịch hẹn
              </Text>
            </Animated.View>
            
            <Animated.View entering={FadeInDown.delay(200).duration(400)}>
              <FormField>
                <InputLabel 
                  icon={<FontAwesome5 name="user-md" size={18} color={FIELD_COLORS.highlight} />} 
                  label="Chọn bác sĩ" 
                />
                <View className="bg-[#161B22] rounded-xl overflow-hidden shadow-sm" style={{ borderWidth: 1, borderColor: FIELD_COLORS.border }}>
                  <Picker
                    selectedValue={doctorId}
                    onValueChange={setDoctorId}
                    style={{ color: FIELD_COLORS.text }}
                    dropdownIconColor={FIELD_COLORS.highlight}
                    mode="dropdown"
                  >
                    <Picker.Item 
                      label="-- Chọn bác sĩ --" 
                      value="" 
                      style={{ color: FIELD_COLORS.placeholder }} 
                    />
                    {doctors.map((doctor) => (
                      <Picker.Item
                        key={doctor.id}
                        label={doctor.fullName}
                        value={doctor.id}
                        color={FIELD_COLORS.text}
                      />
                    ))}
                  </Picker>
                </View>
              </FormField>

              <FormField>
                <InputLabel 
                  icon={<AntDesign name="calendar" size={18} color={FIELD_COLORS.highlight} />} 
                  label="Chọn ngày khám" 
                />
                <TouchableOpacity
                  onPress={() => setDatePickerVisibility(true)}
                  className="bg-[#161B22] p-4 rounded-xl flex-row items-center justify-between shadow-sm"
                  style={{ borderWidth: 1, borderColor: FIELD_COLORS.border }}
                >
                  <Text className={`${selectedDate ? 'text-white' : 'text-[#8B949E]'} text-base`}>
                    {selectedDate
                      ? dayjs(selectedDate).format("DD/MM/YYYY")
                      : "Chọn ngày khám"}
                  </Text>
                  <MaterialIcons name="date-range" size={22} color={FIELD_COLORS.highlight} />
                </TouchableOpacity>
              </FormField>

              <FormField>
                <InputLabel 
                  icon={<Ionicons name="time-outline" size={18} color={FIELD_COLORS.highlight} />} 
                  label="Chọn giờ khám" 
                />
                <View className="bg-[#161B22] rounded-xl overflow-hidden shadow-sm" style={{ borderWidth: 1, borderColor: FIELD_COLORS.border }}>
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
                  icon={<MaterialIcons name="note-alt" size={18} color={FIELD_COLORS.highlight} />} 
                  label="Ghi chú" 
                />
                <TextInput
                  className="bg-[#161B22] text-white p-4 rounded-xl h-32 text-base shadow-sm"
                  placeholder="Nhập triệu chứng hoặc yêu cầu khám..."
                  placeholderTextColor={FIELD_COLORS.placeholder}
                  multiline
                  value={note}
                  onChangeText={setNote}
                  style={{ textAlignVertical: 'top', borderWidth: 1, borderColor: FIELD_COLORS.border }}
                />
              </FormField>

              <View className="flex-row justify-between mt-6">
                <View className="flex-1 mr-3">
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
            </Animated.View>
            
            <Animated.View 
              className="mt-8 bg-[#161B22]/70 p-5 rounded-xl border border-[#30363D]"
              entering={FadeInDown.delay(300).duration(400)}
            >
              <View className="flex-row items-start mb-3">
                <Animated.View 
                  className="bg-[rgba(0,174,239,0.15)] p-2 rounded-full mr-3 mt-0.5"
                  entering={FadeInRight.delay(400).duration(300)}
                >
                  <MaterialIcons name="info-outline" size={20} color={FIELD_COLORS.highlight} />
                </Animated.View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-base mb-2">Lưu ý khi đặt lịch</Text>
                  <Text className="text-[#8B949E] text-sm leading-5 mb-1">
                    1. Đến trước giờ hẹn 15 phút để làm thủ tục
                  </Text>
                  <Text className="text-[#8B949E] text-sm leading-5 mb-1">
                    2. Mang theo giấy tờ cần thiết (nếu có)
                  </Text>
                  <Text className="text-[#8B949E] text-sm leading-5">
                    3. Nếu có thay đổi, vui lòng hủy lịch trước 24 giờ
                  </Text>
                </View>
              </View>
            </Animated.View>
          </View>
        </ScrollView>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={() => setDatePickerVisibility(false)}
          minimumDate={new Date()}
          buttonTextColorIOS={FIELD_COLORS.highlight}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AppointmentsCreateScreen;

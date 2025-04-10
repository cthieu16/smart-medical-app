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
import Animated, { FadeInDown } from "react-native-reanimated";
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

const InputLabel = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <View className="flex-row items-center mb-2">
    <View className="mr-2">{icon}</View>
    <Text className="text-white font-medium text-base">{label}</Text>
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
          <Animated.View 
            className="p-6" 
            entering={FadeInDown.delay(200).duration(400)}
          >            
            <View className="mb-6">
              <InputLabel 
                icon={<FontAwesome5 name="user-md" size={18} color="#00AEEF" />} 
                label="Chọn bác sĩ" 
              />
              <View className="bg-[#161B22] rounded-xl border border-[#30363D] overflow-hidden">
                <Picker
                  selectedValue={doctorId}
                  onValueChange={setDoctorId}
                  style={{ color: "white" }}
                  dropdownIconColor="#00AEEF"
                  mode="dropdown"
                >
                  <Picker.Item 
                    label="-- Chọn bác sĩ --" 
                    value="" 
                    style={{ color: "#8B949E" }} 
                  />
                  {doctors.map((doctor) => (
                    <Picker.Item
                      key={doctor.id}
                      label={doctor.fullName}
                      value={doctor.id}
                      color="#fff"
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View className="mb-6">
              <InputLabel 
                icon={<AntDesign name="calendar" size={18} color="#00AEEF" />} 
                label="Chọn ngày khám" 
              />
              <TouchableOpacity
                onPress={() => setDatePickerVisibility(true)}
                className="bg-[#161B22] p-4 rounded-xl border border-[#30363D] flex-row items-center justify-between"
              >
                <Text className={`${selectedDate ? 'text-white' : 'text-[#8B949E]'}`}>
                  {selectedDate
                    ? dayjs(selectedDate).format("DD/MM/YYYY")
                    : "Chọn ngày khám"}
                </Text>
                <MaterialIcons name="date-range" size={22} color="#00AEEF" />
              </TouchableOpacity>
            </View>

            <View className="mb-6">
              <InputLabel 
                icon={<Ionicons name="time-outline" size={18} color="#00AEEF" />} 
                label="Chọn giờ khám" 
              />
              <View className="bg-[#161B22] rounded-xl border border-[#30363D] overflow-hidden">
                <Picker
                  selectedValue={selectedTime}
                  onValueChange={setSelectedTime}
                  style={{ color: "white" }}
                  dropdownIconColor="#00AEEF"
                  mode="dropdown"
                >
                  {timeSlots.map((time) => (
                    <Picker.Item key={time} label={time} value={time} color="#fff" />
                  ))}
                </Picker>
              </View>
            </View>

            <View className="mb-6">
              <InputLabel 
                icon={<MaterialIcons name="note-alt" size={18} color="#00AEEF" />} 
                label="Ghi chú" 
              />
              <TextInput
                className="bg-[#161B22] text-white p-4 rounded-xl border border-[#30363D] h-32 text-base"
                placeholder="Nhập triệu chứng hoặc yêu cầu khám..."
                placeholderTextColor="#8B949E"
                multiline
                value={note}
                onChangeText={setNote}
                style={{ textAlignVertical: 'top' }}
              />
            </View>

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
            
            <View className="mt-8 bg-[#161B22] p-4 rounded-xl border border-[#30363D]">
              <View className="flex-row items-center mb-2">
                <MaterialIcons name="info-outline" size={18} color="#00AEEF" />
                <Text className="text-white font-bold ml-2">Lưu ý khi đặt lịch</Text>
              </View>
              <Text className="text-[#8B949E] text-sm leading-5">
                • Đến trước giờ hẹn 15 phút để làm thủ tục{'\n'}
                • Mang theo giấy tờ cần thiết (nếu có){'\n'}
                • Nếu có thay đổi, vui lòng hủy lịch trước 24 giờ
              </Text>
            </View>
          </Animated.View>
        </ScrollView>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={() => setDatePickerVisibility(false)}
          minimumDate={new Date()}
        />

        {loading && (
          <View className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <ActivityIndicator size="large" color="#00AEEF" />
            <Text className="text-white mt-4">Đang xử lý...</Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AppointmentsCreateScreen;

import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";

const patientInfo = {
    name: "Nguyễn Văn A",
    dob: "01/01/1990",
    gender: "Nam",
    recordNumber: "BA20231234",
};

const medicalRecords = [
    { id: "1", date: "25/02/2025", doctor: "BS. Trần Minh", diagnosis: "Cảm cúm" },
    { id: "2", date: "12/01/2025", doctor: "BS. Lê Thị Hoa", diagnosis: "Viêm họng" },
    { id: "3", date: "05/11/2024", doctor: "BS. Nguyễn Văn B", diagnosis: "Sốt xuất huyết" },
];

const Header = ({ onBack, onSearch }: { onBack: () => void; onSearch: () => void }) => (
    <View className="flex-row items-center justify-between p-4">
        <Pressable onPress={onBack} className="mr-4">
            <AntDesign name="left" size={24} color="white" />
        </Pressable>
        <Text className="text-2xl font-bold text-white">Hồ sơ bệnh án</Text>
        <Pressable onPress={onSearch}>
            <AntDesign name="search1" size={24} color="white" />
        </Pressable>
    </View>
);

// Component hiển thị thông tin bệnh nhân
const PatientInfoCard = ({ info }: { info: typeof patientInfo }) => (
    <View className="bg-gray-900 mx-4 mt-4 p-5 rounded-2xl shadow-lg">
        <Text className="text-xl font-bold text-white">{info.name}</Text>
        <View className="mt-2 space-y-1 flex-col gap-2">
            <Text className="text-gray-400">📅 Ngày sinh: <Text className="text-white">{info.dob}</Text></Text>
            <Text className="text-gray-400">⚧ Giới tính: <Text className="text-white">{info.gender}</Text></Text>
            <Text className="text-gray-400">📄 Mã bệnh án: <Text className="text-white">{info.recordNumber}</Text></Text>
        </View>
    </View>
);

const MedicalRecordItem = ({ record }: { record: typeof medicalRecords[0] }) => {
    const router = useRouter();

    return (
        <Pressable
            onPress={() => router.push(`/`)}
            className="bg-gray-800 mx-4 p-4 rounded-xl mt-3 shadow-sm border border-gray-700 flex-row justify-between items-center"
        >
            <View className="flex-col gap-2">
                <Text className="text-white font-semibold">📅 {record.date}</Text>
                <Text className="text-gray-400">👨‍⚕️ Bác sĩ: <Text className="text-white">{record.doctor}</Text></Text>
                <Text className="text-gray-400">💊 Chẩn đoán: <Text className="text-white">{record.diagnosis}</Text></Text>
            </View>
            <AntDesign name="right" size={20} color="white" />
        </Pressable>
    );
};

const AddNewRecordButton = ({ onPress }: { onPress: () => void }) => (
    <Pressable onPress={onPress} className="bg-[#4A90E2] p-4 rounded-full mx-6 mt-4 flex-row items-center justify-center shadow-lg mb-4">
        <AntDesign name="plus" size={20} color="white" />
        <Text className="text-white font-semibold ml-2 text-lg">Thêm hồ sơ mới</Text>
    </Pressable>
);

const MedicalRecordsScreen: React.FC = () => {
    const router = useRouter();

    return (
        <View className="flex-1 bg-[#121212]">
            <Header onBack={() => router.back()} onSearch={() => console.log("Search")} />
            <PatientInfoCard info={patientInfo} />
            <Text className="text-lg font-semibold text-gray-300 mx-4 mt-6">📂 Lịch sử khám bệnh</Text>
            <FlatList
                data={medicalRecords}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <MedicalRecordItem record={item} />}
                contentContainerStyle={{ paddingVertical: 10 }}
                ListEmptyComponent={<Text className="text-gray-400 text-center mt-6">Không có bệnh án nào.</Text>}
            />
            <AddNewRecordButton onPress={() => console.log("Add new record")} />
        </View>
    );
};

export default MedicalRecordsScreen;

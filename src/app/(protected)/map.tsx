import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Linking, Platform, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Header } from '@/src/components/Header/Header';
import { useLocalSearchParams } from 'expo-router';
import { useAppointmentDetail, Appointment } from '@/src/hooks/useAppointments';

// Interfaces for clinic data
interface Clinic {
  id: string;
  name: string;
  address: string;
  code: string;
  hours: string;
  latitude: string;
  longitude: string;
  phone: string;
  location: string | null;
}

// Extend the Appointment type for our use case
interface AppointmentWithClinic extends Appointment {
  clinic: Clinic;
  doctor: {
    id: string;
    fullName: string;
    address: string;
    phone: string;
    code: string;
    specialtyId: string;
    specialty: string | null;
  };
}

interface ClinicMarker {
  id: string | number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  hours: string;
  code?: string;
}

const MapScreen = () => {
  const { id } = useLocalSearchParams();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<ClinicMarker | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Only fetch appointment data if an ID is provided
  const { data: appointment } = useAppointmentDetail(id as string) as {
    data: AppointmentWithClinic | undefined
  };

  // Tọa độ trung tâm Hà Nội
  const HANOI_CENTER = {
    latitude: 21.0245,
    longitude: 105.8417,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Quyền truy cập vị trí bị từ chối');
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(location);
      } catch (error) {
        setErrorMsg('Không thể lấy vị trí hiện tại');
        console.error('Lỗi khi lấy vị trí:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Update selected clinic when appointment data changes
  useEffect(() => {
    if (appointment?.clinic) {
      setSelectedClinic({
        id: appointment.clinic.id,
        name: appointment.clinic.name,
        latitude: parseFloat(appointment.clinic.latitude),
        longitude: parseFloat(appointment.clinic.longitude),
        address: appointment.clinic.address,
        phone: appointment.clinic.phone,
        hours: appointment.clinic.hours,
        code: appointment.clinic.code,
      });
    }
  }, [appointment]);

  // Danh sách phòng khám mặc định khi không có lịch hẹn
  const defaultClinics: ClinicMarker[] = [
    {
      id: 1,
      name: "Bệnh viện Đại học Y Hà Nội",
      latitude: 21.0023,
      longitude: 105.8302,
      address: "1 Tôn Thất Tùng, Kim Liên, Đống Đa, Hà Nội",
      phone: "024 3825 3798",
      hours: "24/7",
    },
  ];

  // Sử dụng clinics từ lịch hẹn hoặc mặc định
  const clinics = appointment?.clinic && selectedClinic
    ? [selectedClinic] as ClinicMarker[]
    : defaultClinics;

  const handleClinicPress = (clinic: ClinicMarker) => {
    setSelectedClinic(clinic);
  };

  console.log("selectedClinic", selectedClinic);

  const handleDirections = async () => {
    if (!location || !selectedClinic) return;

    const origin = `${location.coords.latitude},${location.coords.longitude}`;
    const destination = `${selectedClinic.latitude},${selectedClinic.longitude}`;

    let url = '';
    if (Platform.OS === 'ios') {
      url = `maps://?saddr=${origin}&daddr=${destination}`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        // Fallback to Google Maps web version
        const webUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.error('Không thể mở chỉ đường:', error);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#0D1117] justify-center items-center">
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text className="text-white mt-4">Đang tải bản đồ...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View className="flex-1 bg-[#0D1117] justify-center items-center px-4">
        <Text className="text-red-500 text-center">{errorMsg}</Text>
        <TouchableOpacity
          className="mt-4 bg-[#4A90E2] py-2 px-4 rounded-lg"
          onPress={() => {
            setErrorMsg(null);
            setIsLoading(true);
            // Retry getting location
            Location.requestForegroundPermissionsAsync().then(({ status }) => {
              if (status === 'granted') {
                Location.getCurrentPositionAsync({}).then(setLocation).finally(() => setIsLoading(false));
              } else {
                setErrorMsg('Quyền truy cập vị trí bị từ chối');
                setIsLoading(false);
              }
            });
          }}
        >
          <Text className="text-white">Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const title = appointment?.clinic
    ? `Vị trí phòng khám ${appointment.clinic.name}`
    : "Bản đồ phòng khám";

  return (
    <View className="flex-1 bg-[#0D1117]">
      <Header title={title} />
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: selectedClinic?.latitude || (location?.coords.latitude || HANOI_CENTER.latitude),
          longitude: selectedClinic?.longitude || (location?.coords.longitude || HANOI_CENTER.longitude),
          latitudeDelta: 0.01, // Zoom in more when showing a specific clinic
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {clinics.map((clinic) => (
          <Marker
            key={clinic.id.toString()}
            coordinate={{
              latitude: clinic.latitude,
              longitude: clinic.longitude,
            }}
            title={clinic.name}
            description={clinic.address}
            onPress={() => handleClinicPress(clinic)}
          />
        ))}
      </MapView>

      {selectedClinic && (
        <View className="absolute bottom-4 left-4 right-4 bg-[#161B22] p-4 rounded-xl">
          <Text className="text-white text-lg font-semibold">{selectedClinic.name}</Text>
          {selectedClinic.code && (
            <Text className="text-[#4A90E2] text-sm">Mã phòng: {selectedClinic.code}</Text>
          )}
          <Text className="text-gray-400 text-sm mt-1">{selectedClinic.address}</Text>
          <Text className="text-gray-400 text-sm">Điện thoại: {selectedClinic.phone}</Text>
          <Text className="text-gray-400 text-sm">Giờ làm việc: {selectedClinic.hours}</Text>

          <View className="flex-row mt-2 space-x-2 gap-2">
            <TouchableOpacity
              className="flex-1 bg-[#4A90E2] py-2 px-4 rounded-lg"
              onPress={handleDirections}
            >
              <Text className="text-white text-center">Chỉ đường</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-[#2EA043] py-2 px-4 rounded-lg"
              onPress={() => Linking.openURL(`tel:${selectedClinic.phone}`)}
            >
              <Text className="text-white text-center">Gọi điện</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default MapScreen;
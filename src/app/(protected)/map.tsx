import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Linking, Platform, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Header } from '@/src/components/Header/Header';

const MapScreen = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const clinics = [
    {
      id: 1,
      name: "Bệnh viện Đa khoa Quốc tế Vinmec Times City",
      latitude: 20.9955,
      longitude: 105.8544,
      address: "458 Minh Khai, Vĩnh Tuy, Hai Bà Trưng, Hà Nội",
      phone: "024 3974 3556",
      hours: "24/7",
    },
    {
      id: 2,
      name: "Bệnh viện Đa khoa Tâm Anh Hà Nội",
      latitude: 21.0368,
      longitude: 105.8342,
      address: "108 Hoàng Như Tiếp, Bồ Đề, Long Biên, Hà Nội",
      phone: "1800 6858",
      hours: "24/7",
    },
    {
      id: 3,
      name: "Bệnh viện Bạch Mai",
      latitude: 20.9964,
      longitude: 105.8443,
      address: "78 Giải Phóng, Phương Mai, Đống Đa, Hà Nội",
      phone: "024 3869 3731",
      hours: "24/7",
    },
    {
      id: 4,
      name: "Bệnh viện Việt Đức",
      latitude: 21.0245,
      longitude: 105.8417,
      address: "40 Tràng Thi, Hàng Bông, Hoàn Kiếm, Hà Nội",
      phone: "024 3825 3531",
      hours: "24/7",
    },
  ];

  const handleClinicPress = (clinic: any) => {
    setSelectedClinic(clinic);
  };

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
              }
            });
          }}
        >
          <Text className="text-white">Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0D1117]">
      <Header title="Bản đồ phòng khám" />
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location?.coords.latitude || HANOI_CENTER.latitude,
          longitude: location?.coords.longitude || HANOI_CENTER.longitude,
          latitudeDelta: HANOI_CENTER.latitudeDelta,
          longitudeDelta: HANOI_CENTER.longitudeDelta,
        }}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {clinics.map((clinic) => (
          <Marker
            key={clinic.id}
            coordinate={{
              latitude: clinic.latitude,
              longitude: clinic.longitude,
            }}
            title={clinic.name}
            onPress={() => handleClinicPress(clinic)}
          />
        ))}
      </MapView>

      {selectedClinic && (
        <View className="absolute bottom-4 left-4 right-4 bg-[#161B22] p-4 rounded-xl">
          <Text className="text-white text-lg font-semibold">{selectedClinic.name}</Text>
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
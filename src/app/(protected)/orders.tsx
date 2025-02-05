import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useOrders, OrderStatus } from "../../hooks/useOrders";
import { Header } from "../../components/Header/Header";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const OrdersScreen = () => {
  const router = useRouter();
  const { data: orders, isLoading } = useOrders();
  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatus>("PROCESSING");

  const statusTypes: OrderStatus[] = [
    "PROCESSING",
    "CONFIRMED",
    "DELIVERED",
    "CANCELED",
  ];

  const filteredOrders = orders
    ? orders.filter((order) => order.status === selectedStatus)
    : [];

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "DELIVERED":
        return "text-green-500";
      case "PROCESSING":
        return "text-yellow-500";
      case "CONFIRMED":
        return "text-blue-500";
      case "CANCELED":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (isLoading) {
    return (
      <View className='flex-1 bg-[#121212] items-center justify-center'>
        <Text className='text-white'>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-[#121212]'>
      <Header title='My Orders' />

      {/* Status Tabs */}
      <View className='px-4 py-2 border-b border-gray-800'>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ width: SCREEN_WIDTH - 32 }}
        >
          {statusTypes.map((status) => (
            <Pressable
              key={status}
              className={`flex-1 py-3 ${
                selectedStatus === status ? "border-b-2 border-[#4A90E2]" : ""
              }`}
              onPress={() => setSelectedStatus(status)}
            >
              <Text
                className={`text-center capitalize ${
                  selectedStatus === status ? "text-[#4A90E2]" : "text-gray-400"
                }`}
              >
                {status.toLowerCase()}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView className='flex-1 px-4 mt-4'>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Pressable
              key={order.id}
              className='bg-[#1E1E1E] rounded-lg p-4 mb-4'
              onPress={() =>
                router.push({
                  pathname: "/(protected)/order-details",
                  params: { id: order.id },
                })
              }
            >
              <View className='flex-row items-start justify-between mb-2'>
                <View>
                  <Text className='mb-1 text-base text-white'>
                    Order #{order.id}
                  </Text>
                  <Text className='text-sm text-gray-400'>
                    Tracking number: {order.trackingNumber}
                  </Text>
                </View>
                <Text className={`capitalize ${getStatusColor(order.status)}`}>
                  {order.status.toLowerCase()}
                </Text>
              </View>

              <View className='flex-row items-center justify-between mt-2'>
                <Text className='text-gray-400'>
                  Quantity: {order.quantity}
                </Text>
                <Text className='text-lg font-semibold text-white'>
                  ${(order.quantity * order.productListing.price).toFixed(2)}
                </Text>
              </View>

              <Pressable
                className='bg-[#4A90E2] py-2 px-4 rounded-lg mt-3 self-start'
                onPress={() =>
                  router.push({
                    pathname: "/(protected)/order-details",
                    params: { id: order.id },
                  })
                }
              >
                <Text className='text-white'>Details</Text>
              </Pressable>
            </Pressable>
          ))
        ) : (
          <Text className='mt-4 text-center text-white'>
            No orders found for this status.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default OrdersScreen;

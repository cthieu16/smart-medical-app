import React from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useOrder } from "../../hooks/useOrders";
import { useProduct } from "../../hooks/useProducts";
import { Header } from "../../components/Header/Header";

const OrderDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data: order, isLoading: orderLoading } = useOrder(id as string);
  const { data: product, isLoading: productLoading } = useProduct(
    order?.productListing.productId || ""
  );

  const getStatusColor = (status: string) => {
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

  if (orderLoading || productLoading) {
    return (
      <View className='flex-1 bg-[#121212] items-center justify-center'>
        <Text className='text-white'>Loading order details...</Text>
      </View>
    );
  }

  if (!order || !product) {
    return (
      <View className='flex-1 bg-[#121212] items-center justify-center'>
        <Text className='text-white'>Order not found</Text>
      </View>
    );
  }

  const formattedDate = new Date(order.purchaseDate).toLocaleDateString();

  return (
    <View className='flex-1 bg-[#121212]'>
      <Header title='Order Details' />

      <ScrollView className='flex-1 px-4'>
        <View className='py-4 border-b border-gray-800'>
          <Text className='mb-2 text-xl font-bold text-white'>
            Order #{order.id}
          </Text>
          <Text className='mb-1 text-gray-400'>
            Tracking number: {order.trackingNumber}
          </Text>
          <View className='flex-row items-center justify-between mt-2'>
            <Text className='text-gray-400'>{formattedDate}</Text>
            <Text className={`capitalize ${getStatusColor(order.status)}`}>
              {order.status.toLowerCase()}
            </Text>
          </View>
        </View>

        <View className='py-4'>
          <Text className='mb-4 text-lg font-bold text-white'>
            {order.quantity} items
          </Text>

          <View className='flex-row items-center mb-4 bg-[#1E1E1E] p-4 rounded-lg'>
            <Image
              source={
                product.imageUrl
                  ? { uri: product.imageUrl }
                  : require("../../assets/images/no-image-available.jpg")
              }
              className='w-20 h-20 mr-4 rounded-lg'
            />
            <View className='flex-1'>
              <Text className='mb-1 text-base font-semibold text-white'>
                {product.name}
              </Text>
              <Text className='mb-1 text-gray-400'>
                Quantity: {order.quantity}
              </Text>
              <Text className='text-[#4A90E2] font-bold'>
                ${order.productListing.price.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View className='py-4 border-t border-gray-800'>
          <View className='flex-row items-center justify-between mb-2'>
            <Text className='text-gray-400'>Subtotal</Text>
            <Text className='text-white'>
              ${(order.quantity * order.productListing.price).toFixed(2)}
            </Text>
          </View>
          <View className='flex-row items-center justify-between mb-2'>
            <Text className='text-gray-400'>Shipping</Text>
            <Text className='text-white'>$0.00</Text>
          </View>
          <View className='flex-row items-center justify-between mt-4'>
            <Text className='text-lg font-bold text-white'>Total</Text>
            <Text className='text-lg font-bold text-white'>
              ${(order.quantity * order.productListing.price).toFixed(2)}
            </Text>
          </View>
        </View>

        <Pressable
          className='bg-[#4A90E2] py-3 px-6 rounded-lg mt-6 mb-8'
          onPress={() => router.push("/(protected)/orders")}
        >
          <Text className='font-semibold text-center text-white'>
            Back to Orders
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default OrderDetailsScreen;

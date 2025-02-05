import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable, Modal } from "react-native";
import { CartItemWithDetails, useCart } from "../../hooks/useProducts";
import { useRouter } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Header } from "../../components/Header/Header";
import Slider from "@react-native-community/slider";

const CartScreen = () => {
  const router = useRouter();
  const {
    cartItems,
    isLoading,
    error,
    updateQuantity,
    removeItem,
    calculateTotal,
  } = useCart();
  const [activeItem, setActiveItem] = useState<CartItemWithDetails | null>(
    null
  );
  const [showOptions, setShowOptions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editQuantity, setEditQuantity] = useState(1);

  if (isLoading) {
    return (
      <View className='flex-1 bg-[#121212] items-center justify-center'>
        <Text className='text-white'>Loading cart...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className='flex-1 bg-[#121212] items-center justify-center'>
        <Text className='text-white'>Error loading cart: {error.message}</Text>
      </View>
    );
  }

  const handleRemoveItem = (productId: string, sellerId: string) => {
    removeItem({ productId, sellerId });
    setShowOptions(false);
  };

  const handleUpdateQuantity = () => {
    if (activeItem) {
      updateQuantity({
        productId: activeItem.productListing.productId,
        sellerId: activeItem.sellerId,
        quantity: editQuantity,
      });
      setShowEditModal(false);
    }
  };

  const total = calculateTotal();

  return (
    <View className='flex-1 bg-[#121212]'>
      <Header title='My Shopping Cart' />

      <ScrollView className='flex-1 px-4 pt-6'>
        {cartItems?.map((item) => (
          <View
            key={item.productListing.productId}
            className='bg-[#1E1E1E] rounded-xl mb-4 overflow-hidden'
          >
            <View className='flex-row p-4'>
              <Image
                source={
                  item.product.imageUrl
                    ? { uri: item.product.imageUrl }
                    : require("../../assets/images/no-image-available.jpg")
                }
                className='w-20 h-20 mr-4 rounded-lg'
              />
              <View className='justify-between flex-1'>
                <View className='flex-row items-start justify-between'>
                  <Text className='mb-1 text-lg font-semibold text-white'>
                    {item.product.name}
                  </Text>
                  <Pressable
                    onPress={() => {
                      setActiveItem(item);
                      setShowOptions(true);
                    }}
                  >
                    <Feather name='more-vertical' size={24} color='white' />
                  </Pressable>
                </View>
                <View className='flex-row items-center justify-between mt-2'>
                  <Text className='text-gray-400'>
                    Cantidad: {item.quantity}
                  </Text>
                  <Text className='text-lg font-semibold text-white'>
                    ${(item.productListing.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View className='px-4 py-6 border-t border-gray-800'>
        <View className='flex-row justify-between mb-4'>
          <Text className='text-lg text-gray-400'>Total amount:</Text>
          <Text className='text-lg font-bold text-white'>
            ${total.toFixed(2)}
          </Text>
        </View>
        <Pressable
          className='bg-[#4A90E2] py-4 rounded-xl'
          onPress={() => router.push("/checkout")}
        >
          <Text className='text-lg font-semibold text-center text-white'>
            CHECK OUT
          </Text>
        </Pressable>
      </View>

      <Modal
        visible={showOptions}
        transparent={true}
        animationType='fade'
        onRequestClose={() => setShowOptions(false)}
      >
        <Pressable
          className='flex-1 bg-black/50'
          onPress={() => setShowOptions(false)}
        >
          <View className='justify-end flex-1'>
            <Pressable
              onPress={(e) => e.stopPropagation()}
              className='bg-[#1E1E1E] rounded-t-3xl'
            >
              <View className='p-4'>
                <Pressable
                  className='flex-row items-center py-4'
                  onPress={() => {
                    setShowOptions(false);
                    setEditQuantity(activeItem?.quantity || 1);
                    setShowEditModal(true);
                  }}
                >
                  <AntDesign
                    name='edit'
                    size={24}
                    color='white'
                    className='mr-4'
                  />
                  <Text className='text-lg text-white'>Edit quantity</Text>
                </Pressable>
                <Pressable
                  className='flex-row items-center py-4'
                  onPress={() =>
                    activeItem &&
                    handleRemoveItem(
                      activeItem.productListing.productId,
                      activeItem.sellerId
                    )
                  }
                >
                  <AntDesign
                    name='delete'
                    size={24}
                    color='#FF4B55'
                    className='mr-4'
                  />
                  <Text className='text-[#FF4B55] text-lg'>
                    Delete from cart
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showEditModal}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setShowEditModal(false)}
      >
        <View className='justify-end flex-1'>
          <View className='bg-[#1E1E1E] rounded-t-3xl p-6'>
            <Text className='mb-4 text-xl font-bold text-white'>
              Edit Quantity
            </Text>
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={1}
              maximumValue={activeItem?.productListing.stock || 10}
              step={1}
              value={editQuantity}
              onValueChange={setEditQuantity}
              minimumTrackTintColor='#4A90E2'
              maximumTrackTintColor='#FFFFFF'
            />
            <Text className='my-4 text-center text-white'>
              Quantity: {editQuantity}
            </Text>
            <Pressable
              className='bg-[#4A90E2] py-3 rounded-xl'
              onPress={handleUpdateQuantity}
            >
              <Text className='font-semibold text-center text-white'>
                Update Quantity
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CartScreen;

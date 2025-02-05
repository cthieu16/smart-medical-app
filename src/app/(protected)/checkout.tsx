import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../hooks/useProducts";
import { Header } from "../../components/Header/Header";
import { LoadingScreen } from "../../components/Loading/LoadingScreen";

const CheckoutScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems, calculateTotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const total = calculateTotal();

  const handleSubmitOrder = async () => {
    if (!user?.address) {
      Alert.alert("Error", "Please add a shipping address before proceeding.");
      return;
    }

    if (!cardNumber || !expiryDate || !cvv) {
      Alert.alert("Error", "Please fill in all payment details.");
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      router.push("/success");
    } catch (error) {
      Alert.alert("Error", "Failed to process payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return <LoadingScreen />;
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <View className='flex-1 bg-[#121212] items-center justify-center'>
        <Text className='text-lg text-white'>Your cart is empty</Text>
        <Pressable
          className='mt-4 bg-[#4A90E2] py-2 px-4 rounded-lg'
          onPress={() => router.push("/(protected)/home")}
        >
          <Text className='text-white'>Continue Shopping</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-[#121212]'>
      <Header title='Checkout' />

      <ScrollView className='flex-1' contentContainerStyle={{ paddingTop: 16 }}>
        {/* Shipping Address */}
        <View className='px-4 mb-6'>
          <Text className='mb-3 text-lg text-white'>Shipping address</Text>
          <Pressable
            className='bg-[#1E1E1E] p-4 rounded-xl'
            onPress={() => router.push("/(protected)/settings")}
          >
            <View className='flex-row items-start justify-between'>
              <View>
                <Text className='mb-1 text-base text-white'>
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text className='text-gray-400'>
                  {user?.address ? (
                    <>
                      <Text>{user.address.street}</Text>
                      <Text>
                        {user.address.city}, {user.address.state}{" "}
                        {user.address.postalCode}
                      </Text>
                      <Text>{user.address.country}</Text>
                    </>
                  ) : (
                    "Address not registered"
                  )}
                </Text>
              </View>
              <Text className='text-[#E63946]'>Change</Text>
            </View>
          </Pressable>
        </View>

        {/* Payment Information */}
        <View className='px-4 mb-6'>
          <Text className='mb-3 text-lg text-white'>Payment Information</Text>
          <View className='gap-3 space-y-4'>
            <TextInput
              className='bg-[#1E1E1E] text-white px-4 py-3 rounded-lg'
              placeholder='Name'
              placeholderTextColor='#666'
              value={name}
              onChangeText={setName}
              keyboardType='numeric'
            />
            <TextInput
              className='bg-[#1E1E1E] text-white px-4 py-3 rounded-lg'
              placeholder='Card Number'
              placeholderTextColor='#666'
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType='numeric'
            />
            <View className='flex-row gap-3 space-x-4'>
              <TextInput
                className='bg-[#1E1E1E] text-white px-4 py-3 rounded-lg flex-1'
                placeholder='MM/YY'
                placeholderTextColor='#666'
                value={expiryDate}
                onChangeText={setExpiryDate}
              />
              <TextInput
                className='bg-[#1E1E1E] text-white px-4 py-3 rounded-lg flex-1'
                placeholder='CVV'
                placeholderTextColor='#666'
                value={cvv}
                onChangeText={setCvv}
                keyboardType='numeric'
                secureTextEntry
              />
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View className='px-4 mb-6'>
          <View className='flex-row justify-between mb-4'>
            <Text className='text-gray-400'>Total:</Text>
            <Text className='font-bold text-white'>${total.toFixed(2)}</Text>
          </View>

          <Pressable
            className='bg-[#4A90E2] py-4 rounded-xl'
            onPress={handleSubmitOrder}
            disabled={isProcessing}
          >
            <Text className='text-lg font-semibold text-center text-white'>
              {isProcessing ? "Processing..." : "Place Order"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default function Checkout() {
  return <CheckoutScreen />;
}

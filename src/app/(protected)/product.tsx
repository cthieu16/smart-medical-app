import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useProduct, useProducts } from "../../hooks/useProducts";
import { ProductGridItem } from "../../components/Product/ProductGridItem";
import { useFavorites } from "../../hooks/useFavorites";
import { useCart } from "../../hooks/useProducts";

const ProductScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data: product, isLoading } = useProduct(id as string);
  const { data: allProducts } = useProducts();
  const { addFavorite, removeFavorite } = useFavorites();
  const { addToCart } = useCart();
  const [selectedSeller, setSelectedSeller] = useState<number | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  const relatedProducts = allProducts
    ?.filter(
      (p) => p.categoryId === product?.categoryId && p.id !== product?.id
    )
    .slice(0, 5);

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 1) {
      setQuantity("1");
    } else if (
      selectedSeller !== null &&
      num > product!.listings[selectedSeller].stock
    ) {
      setQuantity(product!.listings[selectedSeller].stock.toString());
    } else {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (selectedSeller === null) return;
    setIsAddingToCart(true);
    setCartMessage(null);
    if (!product) return;
    try {
      addToCart({
        productId: product.id,
        sellerId: product.listings[selectedSeller].sellerId,
        quantity: parseInt(quantity),
      });
      setCartMessage("Product added to cart successfully!");
      // Reset the selected seller and quantity
      setSelectedSeller(null);
      setQuantity("1");
    } catch (error) {
      console.error("Error adding to cart:", error);
      setCartMessage("Failed to add product to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleFavoriteToggle = () => {
    if (product) {
      if (product.isFavorite) {
        removeFavorite(product.id);
      } else {
        addFavorite(product.id);
      }
    }
  };

  if (isLoading || !product) {
    return (
      <View className='flex-1 bg-[#121212] items-center justify-center'>
        <Text className='text-white'>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className='flex-1 bg-[#121212]'>
      {/* Header */}
      <View className='flex-row items-center justify-between p-4 border-b border-gray-800'>
        <View className='flex-row items-center'>
          <Pressable onPress={() => router.back()} className='mr-4'>
            <AntDesign name='left' size={24} color='white' />
          </Pressable>
          <Text className='text-xl font-bold text-white'>{product.name}</Text>
        </View>
      </View>

      {/* Product Image */}
      <View className='relative'>
        <Image
          source={
            product.imageUrl
              ? { uri: product.imageUrl }
              : require("../../assets/images/no-image-available.jpg")
          }
          className='w-full h-[500px]'
          resizeMode='cover'
        />
        <Pressable
          className='absolute p-2 bg-black bg-opacity-50 rounded-full top-4 right-4'
          onPress={handleFavoriteToggle}
        >
          <AntDesign
            name={product.isFavorite ? "heart" : "hearto"}
            size={24}
            color='white'
          />
        </Pressable>
      </View>

      {/* Product Info */}
      <View className='p-4'>
        <Text className='mb-4 text-2xl font-bold text-white'>
          {product.name}
        </Text>
        <Text className='mb-6 text-gray-400'>{product.description}</Text>

        {/* Sellers List */}
        <Text className='mb-4 text-lg text-white'>Choose a Seller</Text>
        {product.listings.map((listing, index) => (
          <Pressable
            key={index}
            className={`flex-row justify-between items-center p-4 border rounded-lg mb-2 ${
              selectedSeller === index
                ? "border-[#4A90E2] bg-[#4A90E2]/10"
                : "border-gray-800"
            } ${listing.stock === 0 ? "opacity-50" : ""}`}
            onPress={() => listing.stock > 0 && setSelectedSeller(index)}
            disabled={listing.stock === 0}
          >
            <View>
              <Text className='text-base text-white'>{listing.sellerName}</Text>
              <Text
                className={`text-sm ${
                  listing.stock === 0 ? "text-red-500" : "text-gray-400"
                }`}
              >
                {listing.stock === 0
                  ? "Out of stock"
                  : `Stock: ${listing.stock} units`}
              </Text>
            </View>
            <View className='items-end'>
              <Text className='text-[#4A90E2] text-lg'>
                ${listing.price.toFixed(2)}
              </Text>
              {selectedSeller === index && (
                <View className='flex-row items-center mt-2'>
                  <Pressable
                    onPress={() =>
                      handleQuantityChange((parseInt(quantity) - 1).toString())
                    }
                    disabled={quantity === "1"}
                    className='items-center justify-center w-8 h-8 bg-gray-800 rounded-l'
                  >
                    <AntDesign name='minus' size={16} color='white' />
                  </Pressable>
                  <TextInput
                    value={quantity}
                    onChangeText={handleQuantityChange}
                    keyboardType='numeric'
                    className='w-12 h-8 text-center text-white bg-gray-800'
                  />
                  <Pressable
                    onPress={() =>
                      handleQuantityChange((parseInt(quantity) + 1).toString())
                    }
                    disabled={parseInt(quantity) >= listing.stock}
                    className='items-center justify-center w-8 h-8 bg-gray-800 rounded-r'
                  >
                    <AntDesign name='plus' size={16} color='white' />
                  </Pressable>
                </View>
              )}
            </View>
          </Pressable>
        ))}

        {/* Add to Cart Button */}
        <Pressable
          className={`mt-6 py-3 px-6 rounded-lg ${
            selectedSeller === null || isAddingToCart
              ? "bg-gray-700"
              : "bg-[#4A90E2]"
          }`}
          onPress={handleAddToCart}
          disabled={selectedSeller === null || isAddingToCart}
        >
          <Text className='font-semibold text-center text-white'>
            {isAddingToCart
              ? "Adding to Cart..."
              : selectedSeller === null
              ? "Select a seller"
              : "Add to Cart"}
          </Text>
        </Pressable>
        {cartMessage && (
          <Text
            className={`mt-2 text-center ${
              cartMessage.includes("successfully")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {cartMessage}
          </Text>
        )}
      </View>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <View className='p-4 border-t border-gray-800'>
          <Text className='mb-4 text-lg text-white'>You may also like</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {relatedProducts.map((relatedProduct) => (
              <View
                key={relatedProduct.id}
                className='mr-4'
                style={{ width: 150 }}
              >
                <ProductGridItem
                  product={relatedProduct}
                  onPress={() =>
                    router.push({
                      pathname: "/(protected)/product",
                      params: { id: relatedProduct.id },
                    })
                  }
                  showAddToCart
                  onAddToCart={() =>
                    console.log("Add to cart:", relatedProduct.id)
                  }
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
};

export default ProductScreen;

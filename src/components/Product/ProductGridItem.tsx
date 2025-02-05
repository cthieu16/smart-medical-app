import React, { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { ProductInfo } from "../../hooks/useProducts";
import { AntDesign } from "@expo/vector-icons";
import { useFavorites } from "../../hooks/useFavorites";

type ProductGridItemProps = {
  product: ProductInfo;
  onPress: () => void;
  showAddToCart?: boolean;
  onAddToCart?: () => void;
};

export const ProductGridItem = ({
  product,
  onPress,
  showAddToCart,
  onAddToCart,
}: ProductGridItemProps) => {
  const { addFavorite, removeFavorite } = useFavorites();
  const [isFavorite, setIsFavorite] = useState(product.isFavorite);

  const totalStock =
    product.listings?.reduce((sum, listing) => sum + listing.stock, 0) ?? 0;
  const isOutOfStock = !product.listings || totalStock === 0;

  const handleFavoritePress = async () => {
    try {
      if (isFavorite) {
        removeFavorite(product.id);
      } else {
        addFavorite(product.id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <Pressable
      onPress={onPress}
      className={`mb-4 ${isOutOfStock ? "opacity-50" : ""}`}
    >
      <View className='relative'>
        <Image
          source={
            product.imageUrl
              ? { uri: product.imageUrl }
              : require("../../assets/images/no-image-available.jpg")
          }
          className='w-full h-48 mb-2 rounded-lg'
        />
        <Pressable
          className='absolute p-2 bg-black bg-opacity-50 rounded-full top-2 right-2'
          onPress={(e) => {
            e.stopPropagation();
            showAddToCart ? onAddToCart?.() : handleFavoritePress();
          }}
          disabled={isOutOfStock && showAddToCart}
        >
          <AntDesign
            name={
              showAddToCart ? "shoppingcart" : isFavorite ? "heart" : "hearto"
            }
            size={20}
            color={isOutOfStock && showAddToCart ? "gray" : "white"}
          />
        </Pressable>
      </View>
      <Text className='mb-1 text-base text-white'>{product.name}</Text>
      {product.lowestPrice != null && (
        <Text className='text-[#4A90E2] text-sm'>
          From ${product.lowestPrice.toFixed(2)}
        </Text>
      )}
      {isOutOfStock && (
        <Text className='mt-1 text-sm text-red-500'>Out of stock</Text>
      )}
    </Pressable>
  );
};

import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { ProductInfo } from "../../hooks/useProducts";
import { AntDesign } from "@expo/vector-icons";
import { useFavorites } from "../../hooks/useFavorites";

type ProductListItemProps = {
  product: ProductInfo;
  onPress: () => void;
  showAddToCart?: boolean;
  onAddToCart?: () => void;
};

export const ProductListItem = ({
  product,
  onPress,
  showAddToCart,
  onAddToCart,
}: ProductListItemProps) => {
  const { addFavorite, removeFavorite } = useFavorites();
  const totalStock = product.listings.reduce(
    (sum, listing) => sum + listing.stock,
    0
  );
  const isOutOfStock = totalStock === 0;

  const handleFavoritePress = () => {
    if (product.isFavorite) {
      removeFavorite(product.id);
    } else {
      addFavorite(product.id);
    }
  };

  return (
    <Pressable
      className={`flex-row mb-4 bg-gray-900 rounded-lg overflow-hidden ${
        isOutOfStock ? "opacity-50" : ""
      }`}
      onPress={onPress}
    >
      <Image
        source={
          product.imageUrl
            ? { uri: product.imageUrl }
            : require("../../assets/images/no-image-available.jpg")
        }
        className='w-24 h-24'
      />
      <View className='justify-between flex-1 p-3'>
        <View>
          <Text className='mb-1 text-base text-white'>{product.name}</Text>
          {product.lowestPrice !== null && (
            <Text className='text-[#4A90E2]'>
              From ${product.lowestPrice.toFixed(2)}
            </Text>
          )}
          {isOutOfStock ? (
            <Text className='mt-1 text-sm text-red-500'>Out of stock</Text>
          ) : (
            <Text className='text-sm text-gray-400'>
              {product.listings.length} seller
              {product.listings.length !== 1 ? "s" : ""}
            </Text>
          )}
        </View>
      </View>
      <Pressable
        className='justify-center p-3'
        onPress={(e) => {
          e.stopPropagation();
          showAddToCart ? onAddToCart?.() : handleFavoritePress();
        }}
        disabled={isOutOfStock && showAddToCart}
      >
        <AntDesign
          name={
            showAddToCart
              ? "shoppingcart"
              : product.isFavorite
              ? "heart"
              : "hearto"
          }
          size={24}
          color={isOutOfStock && showAddToCart ? "gray" : "white"}
        />
      </Pressable>
    </Pressable>
  );
};

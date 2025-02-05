import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { ProductGridItem } from "../../components/Product/ProductGridItem";
import { ProductListItem } from "../../components/Product/ProductListItem";
import { SectionTitle } from "../../components/Section/SectionTitle";

type ViewMode = "grid" | "list";
type SortOption = "price-asc" | "price-desc" | "newest";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const FavoritesScreen = () => {
  const router = useRouter();
  const { data: allProducts, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const favorites = useMemo(() => {
    let filteredProducts =
      allProducts?.filter((product) => product.isFavorite) || [];
    if (selectedCategoryId) {
      filteredProducts = filteredProducts.filter(
        (product) => product.categoryId === selectedCategoryId
      );
    }
    return filteredProducts;
  }, [allProducts, selectedCategoryId]);

  const sortedProducts = useMemo(() => {
    if (!favorites) return [];

    return [...favorites].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return (a.lowestPrice || 0) - (b.lowestPrice || 0);
        case "price-desc":
          return (b.lowestPrice || 0) - (a.lowestPrice || 0);
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });
  }, [favorites, sortBy]);

  if (isLoading) {
    return (
      <View className='flex-1 bg-[#121212] items-center justify-center'>
        <Text className='text-white'>Loading favorites...</Text>
      </View>
    );
  }

  const handleAddToCart = (productId: string) => {
    // Implement add to cart logic
    console.log("Add to cart:", productId);
  };

  return (
    <ScrollView className='flex-1 bg-[#121212]'>
      {/* Header */}
      <View className='flex-row items-center justify-between p-4'>
        <View className='flex-row items-center'>
          <Pressable onPress={() => router.back()} className='mr-4'>
            <AntDesign name='left' size={24} color='white' />
          </Pressable>
          <Text className='text-xl font-bold text-white'>Favorites</Text>
        </View>
        <Pressable onPress={() => console.log("search")}>
          <AntDesign name='search1' size={24} color='white' />
        </Pressable>
      </View>

      {/* Categories ScrollView */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className='px-4 mb-4'
      >
        <Pressable
          onPress={() => setSelectedCategoryId(null)}
          className={`px-4 py-2 rounded-full mr-2 ${
            !selectedCategoryId ? "bg-[#4A90E2]" : "bg-gray-800"
          }`}
        >
          <Text className='text-white'>All</Text>
        </Pressable>
        {categories?.map((category) => (
          <Pressable
            key={category.id}
            onPress={() => setSelectedCategoryId(category.id)}
            className={`px-4 py-2 rounded-full mr-2 ${
              category.id === selectedCategoryId
                ? "bg-[#4A90E2]"
                : "bg-gray-800"
            }`}
          >
            <Text className='text-white'>{category.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* View Options */}
      <View className='flex-row items-center justify-between px-4 mb-4'>
        <Pressable
          onPress={() => setIsSortModalVisible(true)}
          className='flex-row items-center'
        >
          <AntDesign name='swap' size={20} color='white' className='mr-2' />
          <Text className='text-white'>Sort</Text>
        </Pressable>

        <Pressable
          onPress={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
        >
          <AntDesign
            name={viewMode === "grid" ? "bars" : "appstore-o"}
            size={20}
            color='white'
          />
        </Pressable>
      </View>

      {/* Products Section */}
      <View className='px-4'>
        <SectionTitle
          title={`Favorites ${
            selectedCategoryId
              ? `- ${
                  categories?.find((c) => c.id === selectedCategoryId)?.name
                }`
              : ""
          } (${favorites.length})`}
          viewAll={false}
        />
        {favorites.length > 0 ? (
          viewMode === "grid" ? (
            <View className='flex-row flex-wrap justify-between mt-4'>
              {sortedProducts.map((product) => (
                <View
                  key={product.id}
                  style={{ width: (SCREEN_WIDTH - 48) / 2 }}
                  className='mb-4'
                >
                  <ProductGridItem
                    product={product}
                    onPress={() =>
                      router.push({
                        pathname: "/product",
                        params: { id: product.id },
                      })
                    }
                    showAddToCart
                    onAddToCart={() => handleAddToCart(product.id)}
                  />
                </View>
              ))}
            </View>
          ) : (
            <View className='mt-4'>
              {sortedProducts.map((product) => (
                <ProductListItem
                  key={product.id}
                  product={product}
                  onPress={() =>
                    router.push({
                      pathname: "/product",
                      params: { id: product.id },
                    })
                  }
                  showAddToCart
                  onAddToCart={() => handleAddToCart(product.id)}
                />
              ))}
            </View>
          )
        ) : (
          <View className='py-8'>
            <Text className='text-lg text-center text-white'>
              No favorites yet
            </Text>
            <Text className='mt-2 text-center text-gray-400'>
              Items you favorite will appear here
            </Text>
          </View>
        )}
      </View>

      {/* Sort Modal */}
      <Modal
        animationType='slide'
        transparent={true}
        visible={isSortModalVisible}
        onRequestClose={() => setIsSortModalVisible(false)}
      >
        <Pressable
          className='flex-1 bg-black bg-opacity-50'
          onPress={() => setIsSortModalVisible(false)}
        >
          <View className='justify-end flex-1'>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View className='bg-[#121212] p-6 rounded-t-3xl'>
                <Text className='mb-4 text-xl font-bold text-white'>
                  Sort by
                </Text>
                <Pressable
                  className='py-3'
                  onPress={() => {
                    setSortBy("newest");
                    setIsSortModalVisible(false);
                  }}
                >
                  <Text
                    className={`text-white text-lg ${
                      sortBy === "newest" ? "font-bold" : ""
                    }`}
                  >
                    Newest
                  </Text>
                </Pressable>
                <Pressable
                  className='py-3'
                  onPress={() => {
                    setSortBy("price-asc");
                    setIsSortModalVisible(false);
                  }}
                >
                  <Text
                    className={`text-white text-lg ${
                      sortBy === "price-asc" ? "font-bold" : ""
                    }`}
                  >
                    Price: Low to High
                  </Text>
                </Pressable>
                <Pressable
                  className='py-3'
                  onPress={() => {
                    setSortBy("price-desc");
                    setIsSortModalVisible(false);
                  }}
                >
                  <Text
                    className={`text-white text-lg ${
                      sortBy === "price-desc" ? "font-bold" : ""
                    }`}
                  >
                    Price: High to Low
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
};

export default FavoritesScreen;

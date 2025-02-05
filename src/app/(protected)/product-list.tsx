import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import {
  useProducts,
  useProductsByCategory,
  ProductInfo,
} from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { ProductGridItem } from "../../components/Product/ProductGridItem";
import { ProductListItem } from "../../components/Product/ProductListItem";
import { SectionTitle } from "../../components/Section/SectionTitle";

type ViewMode = "grid" | "list";
type SortOption = "price-asc" | "price-desc" | "newest";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ProductListScreen = () => {
  const { categoryId } = useLocalSearchParams();
  const router = useRouter();
  const { data: allProducts, isLoading: allProductsLoading } = useProducts();
  const { data: categoryProducts, isLoading: categoryProductsLoading } =
    useProductsByCategory(categoryId as string);
  const { data: categories } = useCategories();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([
    0, 1000,
  ]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const products = categoryId ? categoryProducts : allProducts;
  const isLoading = categoryId ? categoryProductsLoading : allProductsLoading;

  const selectedCategory = categories?.find((c) => c.id === categoryId);

  const maxPrice = useMemo(() => {
    if (!products) return 1000;
    return Math.max(...products.map((p) => p.lowestPrice || 0));
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    const filtered = products.filter(
      (product) =>
        product.lowestPrice !== null &&
        product.lowestPrice >= priceRange[0] &&
        product.lowestPrice <= priceRange[1]
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return (a.lowestPrice || 0) - (b.lowestPrice || 0);
        case "price-desc":
          return (b.lowestPrice || 0) - (a.lowestPrice || 0);
        case "newest":
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        default:
          return 0;
      }
    });
  }, [products, priceRange, sortBy]);

  if (isLoading) {
    return (
      <View className='flex-1 bg-[#121212] items-center justify-center'>
        <Text className='text-white'>Loading products...</Text>
      </View>
    );
  }

  return (
    <ScrollView className='flex-1 bg-[#121212]'>
      {/* Header */}
      <View className='flex-row items-center justify-between p-4'>
        <Pressable onPress={() => router.back()} className='mr-4'>
          <AntDesign name='left' size={24} color='white' />
        </Pressable>
        <Text className='flex-1 text-xl font-bold text-white'>
          {selectedCategory ? selectedCategory.name : "All Products"}
        </Text>
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
          onPress={() => router.push("/product-list")}
          className={`px-4 py-2 rounded-full mr-2 ${
            !categoryId ? "bg-[#4A90E2]" : "bg-gray-800"
          }`}
        >
          <Text className='text-white'>All</Text>
        </Pressable>
        {categories?.map((category) => (
          <Pressable
            key={category.id}
            onPress={() =>
              router.push({
                pathname: "/product-list",
                params: { categoryId: category.id },
              })
            }
            className={`px-4 py-2 rounded-full mr-2 ${
              category.id === categoryId ? "bg-[#4A90E2]" : "bg-gray-800"
            }`}
          >
            <Text className='text-white'>{category.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Filter, Sort, and View Options */}
      <View className='flex-row items-center justify-between px-4 mb-4'>
        <Pressable
          onPress={() => setIsFilterModalVisible(true)}
          className='flex-row items-center'
        >
          <AntDesign name='filter' size={20} color='white' className='mr-2' />
          <Text className='text-white'>Filter</Text>
        </Pressable>

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
          title={selectedCategory ? selectedCategory.name : "All Products"}
          viewAll={false}
        />
        {filteredAndSortedProducts.length > 0 ? (
          viewMode === "grid" ? (
            <View className='flex-row flex-wrap justify-between mt-4'>
              {filteredAndSortedProducts.map((product) => (
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
                  />
                </View>
              ))}
            </View>
          ) : (
            <View className='mt-4'>
              {filteredAndSortedProducts.map((product) => (
                <ProductListItem
                  key={product.id}
                  product={product}
                  onPress={() =>
                    router.push({
                      pathname: "/product",
                      params: { id: product.id },
                    })
                  }
                />
              ))}
            </View>
          )
        ) : (
          <Text className='mt-4 text-center text-white'>
            No products found matching the current filters.
          </Text>
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

      {/* Filter Modal */}
      <Modal
        animationType='slide'
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <Pressable
          className='flex-1 bg-black bg-opacity-50'
          onPress={() => setIsFilterModalVisible(false)}
        >
          <View className='justify-end flex-1'>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View className='bg-[#121212] p-6 rounded-t-3xl'>
                <Text className='mb-4 text-xl font-bold text-white'>
                  Price Range
                </Text>

                <MultiSlider
                  values={tempPriceRange}
                  sliderLength={SCREEN_WIDTH - 60}
                  onValuesChange={(values) =>
                    setTempPriceRange(values as [number, number])
                  }
                  min={0}
                  max={maxPrice}
                  step={1}
                  allowOverlap={false}
                  snapped
                  containerStyle={{
                    height: 40,
                    marginBottom: 20,
                  }}
                  selectedStyle={{
                    backgroundColor: "#4A90E2",
                  }}
                  unselectedStyle={{
                    backgroundColor: "#666",
                  }}
                  markerStyle={{
                    backgroundColor: "#4A90E2",
                    height: 20,
                    width: 20,
                  }}
                />

                <Text className='mb-4 text-center text-white'>
                  ${tempPriceRange[0]} - ${tempPriceRange[1]}
                </Text>

                <View className='flex-row justify-between mt-4'>
                  <Pressable
                    className='px-4 py-2 bg-gray-700 rounded'
                    onPress={() => {
                      setTempPriceRange(priceRange);
                      setIsFilterModalVisible(false);
                    }}
                  >
                    <Text className='text-white'>Cancel</Text>
                  </Pressable>
                  <Pressable
                    className='bg-[#4A90E2] py-2 px-4 rounded'
                    onPress={() => {
                      setPriceRange(tempPriceRange);
                      setIsFilterModalVisible(false);
                    }}
                  >
                    <Text className='text-white'>Apply</Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* You may also like Section */}
      {!categoryId && (
        <View className='px-4 mt-8'>
          <SectionTitle title='You may also like' viewAll={false} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className='mt-4'
          >
            {allProducts?.slice(0, 5).map((product) => (
              <View key={product.id} className='mr-4' style={{ width: 150 }}>
                <ProductGridItem
                  product={product}
                  onPress={() =>
                    router.push({
                      pathname: "/product",
                      params: { id: product.id },
                    })
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

export default ProductListScreen;

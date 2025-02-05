import React from "react";
import { ScrollView, View, Text, Pressable, Image } from "react-native";
import { useRouter, Router } from "expo-router";
import { SectionTitle } from "../../components/Section/SectionTitle";
import { ProductGridItem } from "../../components/Product/ProductGridItem";
import { useCategories } from "../../hooks/useCategories";
import {
  useProducts,
  useProductsByCategory,
  ProductInfo,
} from "../../hooks/useProducts";

interface Category {
  id: string;
  name: string;
  updatedAt: string;
}

const Home = () => {
  const router = useRouter();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: allProducts, isLoading: productsLoading } = useProducts();

  const sortedProducts = React.useMemo(
    () =>
      allProducts?.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
    [allProducts]
  );

  const newProducts = sortedProducts?.slice(0, 10);

  const sortedCategories = React.useMemo(
    () =>
      categories?.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
    [categories]
  );

  const topCategories = sortedCategories?.slice(0, 3);

  if (categoriesLoading || productsLoading) {
    return (
      <View className='flex-1 bg-[#121212] items-center justify-center'>
        <Text className='text-white'>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className='flex-1 bg-[#121212]'>
      {/* Hero Section */}
      <View className='relative h-[400px]'>
        <Image
          source={require("../../assets/images/computer-hero.png")}
          className='w-full h-full'
          resizeMode='cover'
        />
        <View className='absolute bottom-8 left-4'>
          <Text className='mb-4 text-4xl font-bold text-white'>
            Electronics sale
          </Text>
        </View>
      </View>

      {/* New Products Section */}
      <View className='px-4 mt-6'>
        <SectionTitle
          title='New'
          viewAll
          onViewAll={() => console.log("View all new items")}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className='mt-4'
        >
          {newProducts?.map((product) => (
            <View key={product.id} className='mr-4' style={{ width: 150 }}>
              <ProductGridItem
                product={product}
                onPress={() =>
                  router.push({
                    pathname: "/(protected)/product",
                    params: { id: product.id },
                  })
                }
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Category Sections */}
      {topCategories?.map((category) => (
        <CategoryProductSection
          key={category.id}
          category={category}
          router={router}
        />
      ))}

      {/* View More Categories Button */}
      <Pressable
        className='mx-4 my-8 bg-[#4A90E2] py-3 rounded-lg'
        onPress={() => router.push("/(protected)/categories")}
      >
        <Text className='font-semibold text-center text-white'>
          View More Categories
        </Text>
      </Pressable>
    </ScrollView>
  );
};

interface CategoryProductSectionProps {
  category: Category;
  router: Router;
}

const CategoryProductSection = ({
  category,
  router,
}: CategoryProductSectionProps) => {
  const { data: categoryProducts, isLoading } = useProductsByCategory(
    category.id
  );

  const sortedCategoryProducts = React.useMemo(
    () =>
      categoryProducts
        ?.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .slice(0, 5) ?? [],
    [categoryProducts]
  );

  if (isLoading || !categoryProducts) {
    return null;
  }

  return (
    <View key={category.id} className='px-4 mt-8'>
      <SectionTitle
        title={category.name}
        viewAll
        onViewAll={() =>
          router.push({
            pathname: "/(protected)/product-list",
            params: { categoryId: category.id },
          })
        }
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className='mt-4'
      >
        {sortedCategoryProducts.map((product) => (
          <View key={product.id} className='mr-4' style={{ width: 150 }}>
            <ProductGridItem
              product={product}
              onPress={() =>
                router.push({
                  pathname: "/(protected)/product",
                  params: { id: product.id },
                })
              }
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Home;

import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useCategories } from "../../hooks/useCategories";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const CategoriesScreen = () => {
  const { data: categories, isLoading } = useCategories();
  const router = useRouter();

  return (
    <View className='flex-1 bg-[#121212]'>
      {/* Header */}
      <View className='flex-row items-center justify-between px-4 py-3'>
        <View className='flex-row items-center'>
          <Pressable onPress={() => router.back()} className='mr-4'>
            <AntDesign name='left' size={24} color='white' />
          </Pressable>
          <Text className='text-xl font-bold text-white'>Categories</Text>
        </View>
        <Pressable>
          <AntDesign name='search1' size={24} color='white' />
        </Pressable>
      </View>

      <ScrollView className='flex-1'>
        {/* View All Button */}
        <Pressable
          className='mx-4 mt-4 mb-2'
          onPress={() => router.push("/product-list")}
        >
          <View className='bg-[#4A90E2] py-3 rounded-lg'>
            <Text className='font-semibold text-center text-white'>
              VIEW ALL ITEMS
            </Text>
          </View>
        </Pressable>

        {/* Choose Category Text */}
        <Text className='px-4 py-2 text-sm text-gray-400'>Choose category</Text>

        {/* Categories List */}
        {!isLoading && categories && (
          <View className='px-4'>
            {categories.map((category) => (
              <Pressable
                key={category.id}
                className='py-4 border-b border-gray-800'
                onPress={() =>
                  router.push({
                    pathname: "/product-list",
                    params: { categoryId: category.id },
                  })
                }
              >
                <Text className='text-base text-white'>{category.name}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default CategoriesScreen;

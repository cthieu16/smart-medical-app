import { View, Text, ScrollView } from "react-native";
import { CategoryItem } from "./CategoryItem";
import { SectionTitle } from "../Section/SectionTitle";

type Category = {
  id: string;
  name: string;
};

type CategoryListProps = {
  categories: Category[];
  onCategoryPress: (category: Category) => void;
};

export const CategoryList = ({
  categories,
  onCategoryPress,
}: CategoryListProps) => {
  return (
    <View className='p-4'>
      <SectionTitle title='Categories' />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            name={category.name}
            onPress={() => onCategoryPress(category)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

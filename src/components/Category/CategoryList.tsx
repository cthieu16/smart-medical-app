import { ScrollView, View } from "react-native";
import { SectionTitle } from "../Section/SectionTitle";
import { CategoryItem } from "./CategoryItem";

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

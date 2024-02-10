import { CategoryButton } from "@/components/category-button";
import { Header } from "@/components/header";
import { View, FlatList, SectionList, Text } from "react-native";
import { CATEGORIES, ProductProps } from "@/utils/data/products";
import { MENU } from "@/utils/data/products";
import { useState, useRef } from "react";
import { Product } from "@/components/product";
import { Link } from "expo-router";
import { useCartStore } from "../stores/cart-store";

export default function Home() {
  const cartStore = useCartStore();
  const [category, setCategory] = useState(CATEGORIES[0]);

  const cartQuantity = cartStore.products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const sectionListRef = useRef<SectionList<ProductProps>>(null);

  function handleCategorySelect(selectedCategory: string) {
    setCategory(selectedCategory);

    const sectionIndex = CATEGORIES.findIndex(
      (category) => category === selectedCategory
    );

    if (sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        animated: true,
        sectionIndex,
        itemIndex: 0,
      });
    }
  }

  return (
    <View className="flex-1 pt-8">
      <Header title="Faça seu pedido!" cartQuantity={cartQuantity} />

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item}
        className="max-h-10 mt-5"
        contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <CategoryButton
            title={item}
            isSelected={item === category}
            onPress={() => handleCategorySelect(item)}
          />
        )}
      />

      <SectionList
        ref={sectionListRef}
        className="flex-1 p-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        keyExtractor={(item) => item.id}
        sections={MENU}
        stickySectionHeadersEnabled={false}
        renderItem={({ item }) => (
          <Link href={`/product/${item.id}`} asChild>
            <Product data={item} />
          </Link>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="text-xl text-white font-heading mt-8 mb-3">
            {title}
          </Text>
        )}
      />
    </View>
  );
}

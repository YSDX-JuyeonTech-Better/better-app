import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import axios from "axios";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

const bannerData = [
  {
    uri: "https://cdn.pixabay.com/photo/2020/08/09/16/02/cosmetics-5475915_640.jpg",
  },
  {
    uri: "https://cdn.pixabay.com/photo/2020/08/09/16/02/cosmetics-5475915_640.jpg",
  },
];

const HomeScreen: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://192.168.0.34:4000");
        setProducts(response.data.data.slice(0, 12));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const renderBanner = ({ item }: { item: { uri: string } }) => {
    return <Image source={{ uri: item.uri }} style={styles.bannerImage} />;
  };

  const renderProduct = ({ item }: { item: any }) => {
    return (
      <View style={styles.productContainer}>
        <Image source={{ uri: item.image_link }} style={styles.productImage} />
        <Text style={styles.productTitle}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.bannerContainer}>
        <Carousel
          loop={true}
          width={width}
          height={200}
          autoPlay={true}
          autoPlayInterval={2000}
          data={bannerData}
          renderItem={renderBanner}
          mode="default"
        />
      </View>

      <View style={styles.productSection}>
        <Text style={styles.sectionTitle}>최신상품</Text>
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productList}
          scrollEnabled={false}
          key={2} // numColumns 값에 따라 key를 설정하여 강제로 새로 렌더링
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bannerContainer: {
    marginBottom: 20,
  },
  bannerImage: {
    width: width,
    height: 200,
  },
  productSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  productList: {
    paddingHorizontal: 10,
  },
  productRow: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  productContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  productImage: {
    width: width / 2 - 20,
    height: 120,
    borderRadius: 10,
    marginBottom: 5,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  productDescription: {
    fontSize: 12,
    textAlign: "center",
  },
});

export default HomeScreen;

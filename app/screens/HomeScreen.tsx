import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import Carousel from "react-native-reanimated-carousel";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

// 배너 데이터
const bannerData = [
  {
    source: require("../../assets/images/banner1.jpg"),
  },
  {
    source: require("../../assets/images/banner9.jpg"),
  },
  {
    source: require("../../assets/images/banner3.jpg"),
  },
];

// 가격 형식
const formatPrice = (price) => {
  return parseInt(price).toLocaleString("ko-KR");
};

// 랜덤으로 배열을 섞는 함수
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const HomeScreen: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://192.168.0.34:4000/api/products",
          {
            params: {
              page: 1,
              pageSize: 950, // 충분히 많은 상품을 가져오기 위해 큰 수로 설정
            },
          }
        );
        console.log(response); // 전체 응답을 확인
        console.log(response.data); // 응답 데이터 확인

        // 조건에 맞게 필터링: 브랜드명, 가격이 있고, 이미지 링크가 "//"로 시작하는 상품만 포함
        const validProducts = response.data.data.filter(
          (product: any) =>
            product.brand && // 브랜드명이 있는 상품만
            product.price > 0 && // 가격이 있는 상품만
            product.image_link.startsWith("//") // 이미지 링크가 //로 시작하는 상품만
        );
        console.log("responsedata : ", response.data);
        // 상품을 랜덤하게 섞고, 12개만 추출
        const shuffledProducts = shuffleArray(validProducts).slice(0, 12);

        setProducts(shuffledProducts); // 랜덤으로 추출된 상품을 상태로 저장
      } catch (error) {
        console.error("Failed to fetch products:", error);
        //
        // if (error.response) {
        //   // 서버에서 응답이 왔으나 오류가 발생한 경우
        //   console.log("response.data : ", error.response.data);
        //   console.log("response.status : ", error.response.status);
        //   console.log("response.headers : ", error.response.headers);
        // } else if (error.request) {
        //   // 요청이 보내졌으나 응답을 받지 못한 경우
        //   console.log("error.request : ", error.request);
        // } else {
        //   // 요청 자체에서 오류가 발생한 경우
        //   console.log("Error", error.message);
        // }
      }
      //
    };

    fetchProducts();
  }, []);

  // 배너 렌더링 함수
  const renderBanner = ({ item }: { item: { source: any } }) => {
    return <Image source={item.source} style={styles.bannerImage} />;
  };

  // 상품 렌더링 함수
  const renderProduct = ({ item }: { item: any }) => {
    const imageUrl = `https:${item.image_link}`; // 이미지 링크가 "//"로 시작하는 경우 "https:" 추가

    return (
      <TouchableOpacity
        style={styles.productItem}
        onPress={() =>
          navigation.navigate("ProductScreen", { productId: item.id })
        }
      >
        <Image source={{ uri: imageUrl }} style={styles.productImage} />
        <Text style={styles.productBrand}>{item.brand}</Text>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{`₩${formatPrice(item.price)}`}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* 배너 섹션 */}
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

      {/* 추천 상품 섹션 */}
      <View style={styles.productSection}>
        <Text style={styles.sectionTitle}>오늘의 추천 상품</Text>
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3} // 한 줄에 3개의 아이템 표시
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productList}
          scrollEnabled={false}
          key={3}
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
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  productList: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  productRow: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  productItem: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: "contain",
  },
  productBrand: {
    fontSize: 14,
    color: "#888",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  productPrice: {
    fontSize: 16,
    color: "#000",
    marginTop: 5,
  },
});

export default HomeScreen;

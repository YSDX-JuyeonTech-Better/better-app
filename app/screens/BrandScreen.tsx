import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios"; // Axios 사용

const BrandScreen = () => {
  const [brandProducts, setBrandProducts] = useState([]); // 브랜드의 모든 상품을 저장할 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태를 관리할 상태
  const route = useRoute(); // 현재 라우트 정보를 가져옴
  const navigation = useNavigation();
  const { brandName } = route.params; // HomeScreen에서 전달된 브랜드명을 가져옴

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Axios를 사용하여 API에서 해당 브랜드의 상품을 가져옴
        const response = await axios.get(
          "http://192.168.0.34:4000/api/products",
          {
            params: {
              page: 1, // 첫 페이지
              pageSize: 931, // 충분한 데이터를 가져오기
              brand: brandName, // 브랜드 이름을 필터로 사용
            },
          }
        );
        const filteredProducts = response.data.data.filter(
          (item) => item.price > 0 && item.image_link // 가격이 0이 아니고 이미지가 있는 상품만 필터링
        );
        setBrandProducts(filteredProducts); // 상태값에 저장
        setIsLoading(false); // 데이터 로딩 완료 후 로딩 상태를 false로 설정
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setIsLoading(false); // 오류가 발생해도 로딩 상태를 false로 설정
      }
    };

    fetchProducts(); // 데이터 호출
  }, [brandName]); // 브랜드명이 변경될 때마다 데이터를 다시 가져옴

  // 브랜드의 상품을 렌더링하는 함수
  const renderProductItem = ({ item }) => {
    const imageUrl = item.image_link.startsWith("//")
      ? `https:${item.image_link}`
      : item.image_link;

    return (
      <TouchableOpacity
        style={styles.productContainer}
        onPress={() =>
          navigation.navigate("ProductScreen", { productId: item.id })
        }
      >
        <Image source={{ uri: imageUrl }} style={styles.productImage} />
        <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </Text>
        <Text style={styles.productPrice}>{`₩${parseInt(
          item.price
        ).toLocaleString()}`}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text style={styles.loadingText}>로딩 중...</Text>
      ) : brandProducts.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>{brandName}</Text>
          <FlatList
            data={brandProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2} // 2열로 정렬
          />
        </>
      ) : (
        <Text style={styles.noProductsText}>
          해당 브랜드의 상품이 없습니다.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 10,
    textAlign: "center",
  },
  loadingText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 18,
    color: "gray",
  },
  noProductsText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
  productContainer: {
    flex: 1,
    margin: 8,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    padding: 10,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    maxWidth: 120,
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: "black", // 가격 색깔
  },
});

export default BrandScreen;

import Header from "@/components/Header";
import { useNavigation } from "expo-router";
import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios"; // axios를 사용하기 위해 import
import BASE_URL from "../config";

const SearchScreen = () => {
  const [query, setQuery] = useState(""); // 검색어 상태
  const [results, setResults] = useState([]); // 검색 결과 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const navigation = useNavigation(); // navigation 객체 가져오기

  // 헤더 설정
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Header />, // Header 컴포넌트를 헤더로 사용
    });
  }, [navigation]);

  // API에서 제품 데이터 가져오기
  const fetchProducts = async (searchQuery) => {
    setLoading(true); // 로딩 시작
    try {
      // axios로 API 호출
      const response = await axios.get(`${BASE_URL}/api/products`, {
        params: {
          page: 1,
          pageSize: 950, // 충분히 많은 상품을 가져오기 위해 큰 수로 설정
        },
      });
      // 검색어와 조건에 맞는 제품으로 필터링하여 결과를 상태로 설정
      setResults(
        response.data.data.filter(
          (item) =>
            (item.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) || // 검색어를 포함하는 제품만 필터링, null이 될수도 있기 때문에 ? 포함
              item.brand?.toLowerCase()?.includes(searchQuery.toLowerCase())) && // 검색어 포함하는 브랜드, null이 될수도 있기 때문에 ? 포함
            item.price !== null &&
            item.price !== 0 &&
            item.image_link.startsWith("//") // 이미지 링크가 //로 시작하는 것만 필터링
        )
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]); // 오류 발생 시 결과를 비움
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 검색어 변경 시 API 호출
  useEffect(() => {
    if (query.length >= 2) {
      // 입력된 문자가 2개 이상일 때만 검색
      fetchProducts(query); // API 호출
    } else {
      setResults([]); // 입력이 2글자 미만일 때는 결과를 비웁니다
    }
  }, [query]); // `query`가 변경될 때마다 실행

  // 검색 결과 항목 렌더링 함수
  const renderProduct = ({ item }) => {
    // 이미지 링크가 "//"로 시작하면 앞에 "https:" 추가
    const imageUrl = item.image_link.startsWith("//")
      ? `https:${item.image_link}`
      : item.image_link;

    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => {
          // 검색 결과 클릭 시 상품 상세 페이지로 이동
          navigation.navigate("ProductScreen", { productId: item.id });
        }}
      >
        <Image source={{ uri: imageUrl }} style={styles.productImage} />
        <Text style={styles.productBrand}>{item.brand}</Text>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>
          {`₩${parseInt(item.price).toLocaleString()}`}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 검색 입력창 */}
      <TextInput
        style={styles.searchInput}
        placeholder="검색할 제품명을 입력해주세요"
        value={query}
        onChangeText={(text) => setQuery(text)} // 입력값을 상태에 저장
        returnKeyType="search" // '완료' 버튼을 '검색' 버튼으로 설정
        onSubmitEditing={() => fetchProducts(query)} // 'Enter' 키를 눌렀을 때 검색 실행
      />
      {loading && <Text>Loading...</Text>}
      {/* 검색 결과 리스트 */}
      <FlatList
        data={results}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()} // id를 문자열로 변환하여 고유 키 설정
        numColumns={2} // 두 개의 열로 설정
        contentContainerStyle={styles.productList}
      />
    </View>
  );
};

// 스타일 설정
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  productList: {
    justifyContent: "space-between",
  },
  resultItem: {
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

export default SearchScreen;

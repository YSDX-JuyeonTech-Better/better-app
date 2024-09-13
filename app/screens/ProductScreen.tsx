import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  StatusBar,
  Platform,
  Alert,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../config";
import { GRAY } from "@/constants/Colors";
import Hr from "@/components/Hr";

// API 데이터 타입 정의
type Product = {
  id: number;
  brand: string;
  name: string;
  price: string;
  currency: string;
  image_link: string;
  description: string;
};

type RootStackParamList = {
  ProductScreen: { productId: number };
  BrandScreen: { brandName: string }; // BrandScreen의 파라미터 정의
};

type ProductScreenRouteProp = RouteProp<RootStackParamList, "ProductScreen">;

const ProductScreen = () => {
  const route = useRoute<ProductScreenRouteProp>();
  const { productId } = route.params;
  const navigation = useNavigation(); // 네비게이션 객체 가져오기

  const [product, setProduct] = useState<Product | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 상태 관리
  const [fadeAnim] = useState(new Animated.Value(1)); // 애니메이션 상태 관리
  const [showFullDescription, setShowFullDescription] = useState(false); // 설명 전체 보기 상태

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/products/${productId}`
        );
        setProduct(response.data.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  // 외부 API를 호출하여 orders에 주문 데이터를 추가하는 함수
  const placeOrder = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("idx"); // 사용자의 user_idx

      if (!token || !userId) {
        Alert.alert("로그인이 필요합니다.");
        return;
      }

      const orderData = {
        user_idx: parseInt(userId), // 유저 ID
        total_amount: 1, // 기본 수량 1
        products: [
          {
            product_id: product.id,
            quantity: 1, // 수량은 1로 고정
            price: product.price,
            total_price: product.price * 1, // 기본 수량 1에 따른 총 가격
          },
        ],
      };

      // 주문 데이터를 서버로 전송
      const response = await axios.put(`${BASE_URL}/api/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        Alert.alert("주문 완료", "상품이 성공적으로 주문되었습니다.", [
          {
            text: "확인",
            onPress: () => navigation.goBack(), // 주문 완료 후 이전 화면으로 이동
          },
        ]);
      } else {
        Alert.alert("주문 실패", "다시 시도해주세요.");
      }
    } catch (error) {
      console.error("주문 처리 중 오류 발생:", error);
      Alert.alert("오류", "주문 처리 중 오류가 발생했습니다.");
    }
  };

  // 장바구니에 추가하는 함수
  const addToCart = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("idx");

      if (!token || !userId) {
        Alert.alert("로그인이 필요합니다.");
        return;
      }

      const cartData = {
        product_id: product.id,
        quantity: 1, // 장바구니에 담을 기본 수량은 1로 설정
        price: product.price,
      };

      const response = await axios.put(`${BASE_URL}/api/carts`, cartData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        setIsModalVisible(true);
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000, // 2초 동안 보이도록 설정
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 0, // 3초 후 즉시 사라지도록 설정
            useNativeDriver: true,
          }),
        ]).start(() => setIsModalVisible(false));
      } else {
        Alert.alert("장바구니 추가 실패", "다시 시도해주세요.");
      }
    } catch (error) {
      console.error("Cart Add Error:", error);
      Alert.alert("오류", "장바구니 추가 중 오류가 발생했습니다.");
    }
  };

  // 구매 버튼을 눌렀을 때 실행하는 함수
  const handlePurchase = () => {
    Alert.alert(
      "구매하시겠습니까?",
      `${product.name} 상품을 구매하시겠습니까?`,
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "예",
          onPress: placeOrder, // 예를 선택하면 주문 함수 호출
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={{
            uri: product.image_link.startsWith("//")
              ? `https:${product.image_link}`
              : product.image_link,
          }}
          style={styles.productImage}
        />
        <Hr />

        {/* 브랜드 이름을 터치할 수 있게 수정 */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("BrandScreen", { brandName: product.brand })
          } // BrandScreen으로 이동
          style={styles.brandButton} // 버튼 스타일 추가
        >
          <View style={styles.brandButtonContent}>
            <Text style={styles.brandButtonText}>{product.brand}</Text>
            <Text style={styles.brandButtonArrow}> &gt;</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.price}>{`₩${parseInt(
          product.price
        ).toLocaleString()}`}</Text>

        {/* 설명 글자수 제한 및 전체 보기 기능 구현 */}
        <View style={styles.descriptionContainer}>
          <Text
            style={styles.description}
            numberOfLines={showFullDescription ? undefined : 3} // 전체 보기 여부에 따라 줄 수 조정
          >
            {product.description}
          </Text>
          <TouchableOpacity
            onPress={() => setShowFullDescription(!showFullDescription)}
            style={styles.showMoreButton}
          >
            <Text style={styles.showMoreButtonText}>
              {showFullDescription ? "접기" : "더 보기"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={addToCart}>
          <Text style={styles.buttonText}>장바구니</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handlePurchase}>
          <Text style={styles.buttonText}>구매하기</Text>
        </TouchableOpacity>
      </View>

      {/* 모달 팝업 */}
      <Modal
        transparent={true} // 화면이 어두워지도록 설정
        animationType="fade"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
            <Text style={styles.modalText}>장바구니에 담겼습니다!</Text>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, // 안드로이드 상태 표시줄 높이만큼 패딩 추가
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100, // 버튼이 스크롤 내용과 겹치지 않도록 여유 공간을 둡니다.
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    marginBottom: 16,
  },
  brandButton: {
    alignSelf: "flex-start", // 버튼이 글자 크기만큼만 차지하도록 설정
    marginBottom: 16, // 버튼 아래 여백
  },
  brandButtonContent: {
    flexDirection: "row", // 브랜드 이름과 > 기호를 가로로 나란히 배치
    alignItems: "center", // 세로로 중앙 정렬
    paddingVertical: 10, // 상하 패딩을 더 크게 설정
    paddingHorizontal: 14, // 좌우 패딩을 더 크게 설정
    backgroundColor: "#f0f0f0", // 버튼의 배경색
    borderRadius: 5, // 모서리를 둥글게
    borderWidth: 1, // 테두리 추가
    borderColor: GRAY.DARK, // 테두리 색상
    shadowColor: "#000", // 그림자 색상
    shadowOffset: { width: 0, height: 2 }, // 그림자 위치
    shadowOpacity: 0.1, // 그림자 투명도
    shadowRadius: 8, // 그림자 퍼짐 정도
    elevation: 2, // Android 그림자
  },
  brandButtonText: {
    fontSize: 16, // 텍스트 크기
    fontWeight: "bold",
    color: "#000", // 글자 색상
  },
  brandButtonArrow: {
    fontSize: 16, // > 기호 크기
    color: "#000", // > 기호 색상
  },
  productName: {
    fontSize: 16,
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  descriptionContainer: {
    position: "relative",
  },
  description: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  showMoreButton: {
    marginTop: 8,
  },
  showMoreButtonText: {
    color: "#007BFF",
    fontSize: 14,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between", // 장바구니와 구매하기 버튼을 양쪽에 배치
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  button: {
    flex: 1, // 버튼이 남은 공간을 균등하게 차지하도록
    alignItems: "center",
    paddingVertical: 12,
    marginHorizontal: 5,
    backgroundColor: GRAY.DEFAULT, // 버튼 배경색
    borderRadius: 5,
    flexDirection: "row", // 아이콘과 텍스트가 나란히 배치되도록
    justifyContent: "center",
  },
  buttonText: {
    alignItems: "center",
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    borderColor: GRAY.DARK,
    borderWidth: 2,
  },
  modalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
});

export default ProductScreen;

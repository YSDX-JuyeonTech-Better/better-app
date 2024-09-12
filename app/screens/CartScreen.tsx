import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BASE_URL from "../config";
import { useCart } from "./CartProvider";

const CartScreen = () => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const [loading, setLoading] = useState(false);
  const [detailedCartItems, setDetailedCartItems] = useState([]); // 장바구니 아이템

  // 장바구니에서 각 상품의 상세 정보를 가져오는 함수
  const fetchProductDetails = async (cartItems) => {
    const detailedItems = await Promise.all(
      cartItems.map(async (item) => {
        try {
          const productResponse = await axios.get(
            `${BASE_URL}/api/products/${item.product_id}`
          );
          console.log("CartScreen의 Cart Item들:", item);
          console.log("CartScreen의 Cart Item cart_items_id:", item.id); // cart_items의 id 값 확인

          return {
            cart_items_id: item.id, // cart_items 테이블의 id 값
            product_id: item.product_id, // product_id는 별도로 저장
            ...productResponse.data.data, // 상품 상세 정보를 cart item에 추가
            quantity: item.quantity, // 장바구니에 저장된 수량 추가
          };
        } catch (error) {
          console.error(
            `Failed to fetch product details for product_id: ${item.product_id}`,
            error
          );
          return item; // 상품 정보를 가져오지 못한 경우 원래 아이템 그대로 반환
        }
      })
    );
    setDetailedCartItems(detailedItems);
  };

  // 장바구니 항목을 가져오는 함수
  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/carts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200 && response.data.success) {
        console.log("장바구니 데이터 로드 성공:", response.data);
        await fetchProductDetails(response.data.cartItems); // 상세 정보 가져오기
      }
    } catch (error) {
      console.error(
        "장바구니 데이터를 불러오는 중 오류가 발생했습니다:",
        error
      );
    }
    setLoading(false);
  };

  // useFocusEffect로 화면이 포커스될 때마다 장바구니 항목을 다시 가져옴
  useFocusEffect(
    useCallback(() => {
      fetchCartItems(); // 화면이 포커스될 때마다 장바구니 데이터를 새로고침
    }, [])
  );

  const calculateTotalPrice = () => {
    return detailedCartItems.reduce(
      (total, item) => total + (item.price || 0) * item.quantity,
      0
    );
  };

  const calculateTotalQuantity = () => {
    return detailedCartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // 구매 완료 후 장바구니를 비우는 함수
  const clearCartAfterPurchase = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (detailedCartItems.length > 0) {
        for (const item of detailedCartItems) {
          const cartItemsId = item.cart_items_id; // cart_items 테이블의 id 값 사용

          console.log("CartScreen의 cart_items_id 확인 : ", cartItemsId);

          // DELETE 요청에 cartItemsId를 쿼리 파라미터로 포함시켜서 서버로 전송
          const url = `${BASE_URL}/api/carts/${cartItemsId}`;
          console.log("삭제 요청 URL:", url);

          const response = await axios.delete(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("삭제 요청 응답 상태 코드:", response.status);
        }

        clearCart(); // 장바구니 비우기
        setDetailedCartItems([]); // UI에서 장바구니 항목 제거
      }
    } catch (error) {
      console.error("장바구니 비우기 오류:", error);
      Alert.alert("오류", "장바구니 비우기 중 오류가 발생했습니다.");
    }
  };

  // 상품을 삭제하는 함수
  const handleRemoveItem = async (item) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const cartItemsId = item.cart_items_id;

      console.log("삭제할 Cart Items ID:", cartItemsId);

      // DELETE 요청 전송
      const url = `${BASE_URL}/api/carts/${cartItemsId}`;
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("삭제 요청 응답 상태 코드:", response.status);

      // UI 업데이트: 해당 항목을 목록에서 제거
      const updatedItems = detailedCartItems.filter(
        (cartItem) => cartItem.cart_items_id !== cartItemsId
      );
      setDetailedCartItems(updatedItems);
    } catch (error) {
      console.error("상품 삭제 중 오류:", error);
      Alert.alert("오류", "상품 삭제 중 오류가 발생했습니다.");
    }
  };

  // 수량 감소 처리 함수
  const handleDecreaseQuantity = (item) => {
    if (item.quantity === 1) {
      Alert.alert("삭제 확인", "장바구니에서 해당 상품을 삭제하시겠습니까?", [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "삭제",
          onPress: () => handleRemoveItem(item), // cart_items_id로 삭제
          style: "destructive",
        },
      ]);
    } else {
      decreaseQuantity(item.cart_items_id); // cart_items_id로 수량 감소
    }
  };

  // 수량 증가 함수
  const handleIncreaseQuantity = async (item) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const newQuantity = item.quantity + 1;

      // 수량 증가 요청
      await axios.put(
        `${BASE_URL}/api/carts/${item.cart_items_id}`, // 개별 cart item에 대해 PUT 요청
        {
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 화면 업데이트
      const updatedItems = detailedCartItems.map((cartItem) =>
        cartItem.cart_items_id === item.cart_items_id
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      );
      setDetailedCartItems(updatedItems);
    } catch (error) {
      console.error("수량 증가 중 오류:", error);
      Alert.alert("수량 증가 중 오류가 발생했습니다.");
    }
  };

  // 구매 버튼을 눌렀을 때 처리 함수
  const handlePurchase = async () => {
    Alert.alert("구매 확인", "정말로 구매하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "예",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            const userId = await AsyncStorage.getItem("idx");

            if (!token || !userId) {
              Alert.alert("로그인이 필요합니다.");
              return;
            }

            const orderData = {
              user_idx: parseInt(userId), // 유저 ID
              total_amount: calculateTotalQuantity(), // 총 상품 개수
              products: detailedCartItems.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
                total_price: item.price * item.quantity,
              })),
            };

            // 주문 데이터를 서버로 전송
            const response = await axios.put(
              `${BASE_URL}/api/orders`,
              orderData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.status === 201) {
              Alert.alert("구매 완료", "주문이 완료되었습니다.", [
                {
                  text: "확인",
                  onPress: () => {
                    clearCartAfterPurchase(); // 주문 후 장바구니 비우기
                  },
                },
              ]);
            } else {
              Alert.alert("주문 실패", "다시 시도해주세요.");
            }
          } catch (error) {
            console.error("주문 처리 중 오류 발생:", error);
            Alert.alert("오류", "주문 처리 중 오류가 발생했습니다.");
          }
        },
      },
    ]);
  };

  // 각 아이템을 렌더링하는 함수
  const renderItem = ({ item }) => {
    const imageUrl = item.image_link.startsWith("//")
      ? `https:${item.image_link}`
      : item.image_link;

    return (
      <View style={styles.cartItem}>
        <Image source={{ uri: imageUrl }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.brand}>{item.brand}</Text>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => handleDecreaseQuantity(item)}>
              <Text style={styles.quantityButton}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => handleIncreaseQuantity(item)}>
              <Text style={styles.quantityButton}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.price}>
          {(item.price * item.quantity).toLocaleString("ko-KR")}원
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>로딩 중...</Text>
      ) : detailedCartItems.length === 0 ? (
        <Text style={styles.emptyText}>장바구니에 담긴 상품이 없습니다.</Text>
      ) : (
        <>
          <FlatList
            data={detailedCartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.product_id.toString()} // product_id를 key로 사용
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              총 {calculateTotalQuantity()}개
            </Text>
            <Text style={styles.totalText}>
              {calculateTotalPrice().toLocaleString("ko-KR")}원
            </Text>
          </View>
          <TouchableOpacity
            style={styles.purchaseButton}
            onPress={handlePurchase}
          >
            <Text style={styles.purchaseButtonText}>구매하기</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  cartItem: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  productImage: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
  },
  brand: {
    fontSize: 14,
    fontWeight: "bold",
  },
  name: {
    fontSize: 14,
    color: "#555",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    fontSize: 20,
    width: 30,
    textAlign: "center",
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  purchaseButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
  },
  purchaseButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginTop: 50,
  },
});

export default CartScreen;

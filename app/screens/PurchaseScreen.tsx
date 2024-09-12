import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BASE_URL from "../config";

const PurchaseScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null); // 주문 항목 확장 여부
  const [loadingDetails, setLoadingDetails] = useState(false); // 세부 정보 로딩 상태
  const [orderDetails, setOrderDetails] = useState({}); // 세부 정보 저장

  // 구매 목록을 불러오는 함수
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token"); // 사용자의 인증 토큰 가져오기
      const userIdx = await AsyncStorage.getItem("idx"); // 사용자의 user_idx 가져오기

      if (!token || !userIdx) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      // API 요청 보내기 (구매 목록 가져오기)
      const response = await axios.get(`${BASE_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`, // 인증 헤더 추가
        },
        params: {
          user_idx: userIdx, // user_idx를 기준으로 주문 필터링
        },
      });

      if (response.status === 200 && response.data.success) {
        setOrders(response.data.data); // 주문 데이터를 상태에 저장
      } else {
        setError("주문 목록을 불러오지 못했습니다.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("오류가 발생했습니다. 다시 시도해 주세요.");
    }
    setLoading(false);
  };

  // 특정 주문의 세부 상품 정보를 API로 불러오는 함수
  const fetchOrderDetails = async (orderId) => {
    setLoadingDetails(true);
    try {
      const token = await AsyncStorage.getItem("token");

      // 주문 세부 정보 API 호출
      const response = await axios.get(`${BASE_URL}/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 && response.data.success) {
        setOrderDetails((prevDetails) => ({
          ...prevDetails,
          [orderId]: response.data.data, // 주문 ID를 키로 세부 정보 저장
        }));
      } else {
        console.error("주문 세부 정보를 불러오지 못했습니다.");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
    setLoadingDetails(false);
  };

  // 주문 항목 클릭 시 세부 정보 확장 및 API 호출
  const toggleExpand = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null); // 이미 확장된 주문을 클릭하면 접기
    } else {
      setExpandedOrderId(orderId); // 해당 주문을 클릭하면 펼치기
      if (!orderDetails[orderId]) {
        await fetchOrderDetails(orderId); // 세부 정보가 없으면 API 호출
      }
    }
  };

  // 화면이 로드될 때 주문 목록 불러오기
  useEffect(() => {
    fetchOrders();
  }, []);

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => toggleExpand(item.order_id)}
    >
      <Text style={styles.orderText}>주문 번호: {item.order_id}</Text>
      <Text style={styles.orderText}>
        주문 날짜: {new Date(item.order_date).toLocaleDateString()}
      </Text>
      <Text style={styles.orderText}>총 금액: {item.total_amount}원</Text>

      {expandedOrderId === item.order_id && (
        <View style={styles.productList}>
          {loadingDetails && <ActivityIndicator size="small" color="#0000ff" />}
          {orderDetails[item.order_id] &&
            orderDetails[item.order_id].map((product) => (
              <View key={product.product_id} style={styles.productItem}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                />
                <View style={styles.productDetails}>
                  <Text style={styles.productBrand}>{product.brand}</Text>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>
                    {product.price.toLocaleString()}원
                  </Text>
                </View>
              </View>
            ))}
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>주문 목록을 불러오는 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>구매 목록</Text>
      {orders.length === 0 ? (
        <Text>주문 목록이 없습니다.</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.order_id.toString()}
        />
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    marginTop: 40, // 제목을 더 아래로 내리기
  },
  orderItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 4,
  },
  productList: {
    marginTop: 10,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
  },
  productBrand: {
    fontSize: 14,
    fontWeight: "bold",
  },
  productName: {
    fontSize: 14,
    color: "#555",
  },
  productPrice: {
    fontSize: 14,
    color: "#000",
  },
});

export default PurchaseScreen;

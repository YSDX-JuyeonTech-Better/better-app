import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { useCart } from "./CartProvider";

const CartScreen = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeItem } =
    useCart();

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity === 1) {
      Alert.alert("삭제 확인", "장바구니에서 해당 상품을 삭제하시겠습니까?", [
        {
          text: "취소",
          onPress: () => console.log("삭제 취소"),
          style: "cancel",
        },
        {
          text: "삭제",
          onPress: () => removeItem(item.id),
          style: "destructive",
        },
      ]);
    } else {
      decreaseQuantity(item.id);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.brand}>{item.brand}</Text>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => handleDecreaseQuantity(item)}>
            <Text style={styles.quantityButton}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
            <Text style={styles.quantityButton}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.price}>
        {(item.price * item.quantity).toLocaleString("ko-KR")}원
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>장바구니에 담긴 상품이 없습니다.</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              총 {calculateTotalQuantity()}개
            </Text>
            <Text style={styles.totalText}>
              {calculateTotalPrice().toLocaleString("ko-KR")}원
            </Text>
          </View>
          <TouchableOpacity style={styles.purchaseButton}>
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

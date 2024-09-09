import { StyleSheet, Text, View } from "react-native";

const PurchaseScreen = () => {
  return (
    <View style={styles.container}>
      <Text>구매목록입니다.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PurchaseScreen;

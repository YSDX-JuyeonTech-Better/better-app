import React from "react";
import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Header = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={require("../assets/images/Bblue.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.iconsContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("SearchScreen")}
            style={styles.iconButton}
          >
            <Ionicons name="search" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("CartScreen")}
            style={styles.iconButton}
          >
            <Ionicons name="cart" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 0,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, // 안드로이드 상태 표시줄 높이만큼 패딩 추가
  },
  container: {
    width: "100%",
    flexDirection: "row",
    height: 50,
    backgroundColor: "white",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  logo: {
    width: 100,
    height: "100%",
    marginRight: "auto",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  iconButton: {
    marginHorizontal: 10,
    padding: 5,
  },
});

export default Header;

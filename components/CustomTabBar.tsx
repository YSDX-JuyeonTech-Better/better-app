// components/CustomTabBar.tsx
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate("Category")}
      >
        <FontAwesome name="list" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabCenter}
        onPress={() => navigation.navigate("Home")}
      >
        <FontAwesome name="home" size={28} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate("Profile")}
      >
        <FontAwesome name="user" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    backgroundColor: "#fff",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CustomTabBar;

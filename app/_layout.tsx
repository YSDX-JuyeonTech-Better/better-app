// app/_layout.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider } from "./context/AuthContext";
import CustomTabBar from "../components/CustomTabBar";
import HomeScreen from "./screens/HomeScreen";
import CategoryScreen from "./screens/CategoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import Header from "@/components/Header";
import SearchScreen from "./screens/SearchScreen";
import CartScreen from "./screens/CartScreen";
import ProductScreen from "./screens/ProductScreen"; // ProductScreen 추가
import { CartProvider } from "./screens/CartProvider";

// Create Navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AppTabs = () => (
  <Tab.Navigator
    initialRouteName="Home"
    tabBar={(props) => <CustomTabBar {...props} />}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        header: () => <Header />, // 헤더 적용
      }}
    />
    <Tab.Screen
      name="Category"
      component={CategoryScreen}
      options={{
        header: () => <Header />, // 헤더 적용
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        header: () => <Header />, // 헤더 적용
      }}
    />
    {/* 새로운 스크린 추가 */}
    <Tab.Screen
      name="SearchScreen"
      component={SearchScreen}
      options={{
        header: () => <Header />,
      }}
    />
    <Tab.Screen
      name="CartScreen"
      component={CartScreen}
      options={{
        header: () => <Header />,
      }}
    />
  </Tab.Navigator>
);

const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AppTabs" component={AppTabs} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    {/* ProductScreen을 Stack Navigator에 추가 */}
    <Stack.Screen name="ProductScreen" component={ProductScreen} />
  </Stack.Navigator>
);

export default function Layout() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer independent={true}>
          <MainStack />
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}

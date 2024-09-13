import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../config";

const LoginScreen: React.FC = ({ navigation }: any) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // 서버로 로그인 요청을 보냅니다.
      console.log("Sending login request: ", {
        user_id: id,
        user_pw: password,
      });

      console.log("Client password:", password); // 클라이언트에서 입력한 비밀번호

      const response = await axios.post(
        `${BASE_URL}/api/users/login`,
        {
          user_id: id, // 서버에서 받는 user_id
          user_pw: password, // 서버에서 받는 user_pw
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // token이 있는 경우 로그인 성공으로 간주
      if (response.data.token) {
        // AsyncStorage에 토큰 저장
        console.log(response.data.token); // response.data.token있는지 확인
        await AsyncStorage.setItem("token", response.data.token); // token값 저장
        await AsyncStorage.setItem("idx", String(response.data.idx)); // idx 저장

        Alert.alert("로그인 성공", "환영합니다!");
        navigation.navigate("Profile"); // 프로필 화면으로 이동
      } else {
        Alert.alert("로그인 실패", "유효하지 않은 자격 증명입니다.");
        console.log(response.data.message || "로그인 실패");
      }
    } catch (error) {
      console.error("Login Error: ", error);

      Alert.alert("오류", "로그인 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="아이디"
        value={id}
        onChangeText={setId}
        keyboardType="default"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={styles.signupButtonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 16, // 입력 칸의 크기를 더 크게 만듭니다.
    marginBottom: 20, // 입력 칸 사이의 간격도 넓힙니다.
    borderRadius: 4,
    fontSize: 18, // 글자 크기 키움
  },
  loginButton: {
    backgroundColor: "#000",
    paddingVertical: 16, // 버튼의 크기를 더 크게 만듭니다.
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 20, // 로그인 버튼의 글자 크기도 키움
  },
  signupButton: {
    paddingVertical: 16, // 회원가입 버튼의 크기도 키움
    borderRadius: 5,
    alignItems: "center",
  },
  signupButtonText: {
    color: "#000",
    fontSize: 20, // 회원가입 버튼의 글자 크기도 키움
  },
});

export default LoginScreen;

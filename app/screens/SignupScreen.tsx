import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { useNavigation } from "expo-router";
import axios from "axios"; // axios를 사용하여 API 호출
import Header from "@/components/Header";
import { GRAY } from "@/constants/Colors";
import BASE_URL from "../config";

const SignUpScreen: React.FC = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState(""); // 성별 상태 추가
  const [phoneNum, setPhoneNum] = useState("");
  const [address, setAddress] = useState("");

  const [isIdFocused, setIsIdFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPhoneNumFocused, setIsPhoneNumFocused] = useState(false);
  const [isAddressFocused, setIsAddressFocused] = useState(false);

  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const phoneNumInputRef = useRef<TextInput>(null);
  const addressInputRef = useRef<TextInput>(null);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Header />,
    });
  }, [navigation]);

  const handleGenderSelect = (selectedGender: string) => {
    if (selectedGender === "male") {
      setGender("M");
    } else if (selectedGender === "female") {
      setGender("F");
    }
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("비밀번호 확인", "비밀번호가 맞지 않습니다.");
      return;
    }

    // 서버로 전송할 회원가입 정보
    const userData = {
      id: id,
      name: name,
      email: email,
      password: password,
      gender: gender, // 'M' 또는 'F'로 전송됨
      phone_num: phoneNum,
      address: address,
    };

    console.log("Sending userData: ", userData); // 콘솔에 출력

    try {
      // axios를 사용하여 회원가입 요청을 서버로 보냄
      const response = await axios.post(`${BASE_URL}/api/users`, userData);
      console.log("Response: ", response.data);

      // 요청 성공 시 처리
      Alert.alert("가입 완료", "회원가입이 완료되었습니다!");
      navigation.navigate("Profile");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // 중복된 아이디 또는 이메일에 대한 409 에러 처리
        Alert.alert("회원가입 실패", "이미 존재하는 아이디 또는 이메일입니다.");
      } else {
        // 기타 에러 처리
        Alert.alert("회원가입 실패", "회원가입에 실패하였습니다.");
        console.error("Signup Error: ", error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {Platform.OS === "android" && (
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      )}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.label}>아이디 입력</Text>
          <TextInput
            style={[
              styles.input,
              { borderColor: isIdFocused ? GRAY.DARK : GRAY.DEFAULT },
            ]}
            placeholder="아이디 입력"
            value={id}
            onChangeText={setId}
            onFocus={() => setIsIdFocused(true)}
            onBlur={() => setIsIdFocused(false)}
            keyboardType="default"
            returnKeyType="next"
            onSubmitEditing={() => passwordInputRef.current?.focus()}
          />

          <Text style={styles.label}>비밀번호 입력</Text>
          <TextInput
            ref={passwordInputRef}
            style={[
              styles.input,
              { borderColor: isPasswordFocused ? GRAY.DARK : GRAY.DEFAULT },
            ]}
            placeholder="비밀번호 입력"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            keyboardType="default"
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
          />

          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            ref={confirmPasswordInputRef}
            style={[
              styles.input,
              {
                borderColor: isConfirmPasswordFocused
                  ? GRAY.DARK
                  : GRAY.DEFAULT,
              },
            ]}
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            onFocus={() => setIsConfirmPasswordFocused(true)}
            onBlur={() => setIsConfirmPasswordFocused(false)}
            keyboardType="default"
            returnKeyType="next"
            onSubmitEditing={() => emailInputRef.current?.focus()}
          />

          <Text style={styles.label}>이름 입력</Text>
          <TextInput
            style={[
              styles.input,
              { borderColor: isNameFocused ? GRAY.DARK : GRAY.DEFAULT },
            ]}
            placeholder="이름 입력"
            value={name}
            onChangeText={setName}
            onFocus={() => setIsNameFocused(true)}
            onBlur={() => setIsNameFocused(false)}
            keyboardType="default"
            returnKeyType="next"
            onSubmitEditing={() => emailInputRef.current?.focus()}
          />

          <Text style={styles.label}>이메일 입력</Text>
          <TextInput
            ref={emailInputRef}
            style={[
              styles.input,
              { borderColor: isEmailFocused ? GRAY.DARK : GRAY.DEFAULT },
            ]}
            placeholder="example@naver.com"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setIsEmailFocused(true)}
            onBlur={() => setIsEmailFocused(false)}
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => phoneNumInputRef.current?.focus()}
          />

          <Text style={styles.label}>성별 선택</Text>
          <View style={styles.genderContainer}>
            <TouchableWithoutFeedback
              onPress={() => handleGenderSelect("male")}
            >
              <View
                style={[
                  styles.genderOption,
                  gender === "M" && styles.genderOptionSelected,
                ]}
              >
                <Text
                  style={
                    gender === "M"
                      ? styles.genderSelected
                      : styles.genderUnselected
                  }
                >
                  남성
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => handleGenderSelect("female")}
            >
              <View
                style={[
                  styles.genderOption,
                  gender === "F" && styles.genderOptionSelected,
                ]}
              >
                <Text
                  style={
                    gender === "F"
                      ? styles.genderSelected
                      : styles.genderUnselected
                  }
                >
                  여성
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <Text style={styles.label}>핸드폰번호 입력</Text>
          <TextInput
            ref={phoneNumInputRef}
            style={[
              styles.input,
              { borderColor: isPhoneNumFocused ? GRAY.DARK : GRAY.DEFAULT },
            ]}
            placeholder="핸드폰번호 입력"
            value={phoneNum}
            onChangeText={setPhoneNum}
            onFocus={() => setIsPhoneNumFocused(true)}
            onBlur={() => setIsPhoneNumFocused(false)}
            keyboardType="phone-pad"
            returnKeyType="next"
            onSubmitEditing={() => addressInputRef.current?.focus()}
          />

          <Text style={styles.label}>주소 입력</Text>
          <TextInput
            ref={addressInputRef}
            style={[
              styles.input,
              { borderColor: isAddressFocused ? GRAY.DARK : GRAY.DEFAULT },
            ]}
            placeholder="주소 입력"
            value={address}
            onChangeText={setAddress}
            onFocus={() => setIsAddressFocused(true)}
            onBlur={() => setIsAddressFocused(false)}
            keyboardType="default"
            returnKeyType="done"
          />
        </ScrollView>
        <View style={styles.fixedFooter}>
          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>회원가입</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 200, // 여백 추가하여 주소 입력 칸이 가려지지 않게 설정
  },
  label: {
    marginBottom: 6,
    color: "black",
    fontSize: 18, // 라벨 글자 크기 키움
    fontWeight: "500",
  },
  input: {
    height: 50, // 입력 칸 높이 키움
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 14, // 입력 칸 안쪽 패딩 조정
    borderRadius: 5,
    fontSize: 18, // 입력 칸의 글자 크기 키움
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  genderOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14, // 성별 선택 버튼 크기 조정
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  genderOptionSelected: {
    borderColor: "#000",
    borderWidth: 2,
  },
  genderSelected: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16, // 성별 선택 텍스트 크기 키움
  },
  genderUnselected: {
    color: "#aaa",
    fontSize: 16, // 선택되지 않은 성별 텍스트 크기 조정
  },
  fixedFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  signupButton: {
    backgroundColor: "#000",
    paddingVertical: 16, // 회원가입 버튼 높이 증가
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 12,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 20, // 회원가입 버튼 텍스트 크기 증가
  },
  loginButton: {
    paddingVertical: 16, // 로그인 버튼 높이 증가
    borderRadius: 5,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#000",
    fontSize: 20, // 로그인 버튼 텍스트 크기 증가
  },
});

export default SignUpScreen;

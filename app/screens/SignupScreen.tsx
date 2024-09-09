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
} from "react-native";
import { useNavigation } from "expo-router";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Header from "@/components/Header";
import { GRAY } from "@/constants/Colors";

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

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      console.error("Passwords do not match!");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.navigate("Profile");
    } catch (error) {
      console.error("Signup Error: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Android에서는 StatusBar 높이만큼 padding을 추가합니다. */}
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
            <TouchableWithoutFeedback onPress={() => setGender("male")}>
              <View
                style={[
                  styles.genderOption,
                  gender === "male" && styles.genderOptionSelected,
                ]}
              >
                <Text
                  style={
                    gender === "male"
                      ? styles.genderSelected
                      : styles.genderUnselected
                  }
                >
                  남성
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => setGender("female")}>
              <View
                style={[
                  styles.genderOption,
                  gender === "female" && styles.genderOptionSelected,
                ]}
              >
                <Text
                  style={
                    gender === "female"
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, // Android 상단 padding 적용
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 150, // 버튼 영역 확보를 위해 여유 공간 추가
  },
  label: {
    marginBottom: 6,
    color: "black",
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  genderOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
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
  },
  genderUnselected: {
    color: "#aaa",
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
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 12,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  loginButton: {
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#000",
    fontSize: 16,
  },
});

export default SignUpScreen;

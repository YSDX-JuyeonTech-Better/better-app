import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Hr from "@/components/Hr";

const ProfileScreen: React.FC = ({ navigation }: any) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage] = useState<string | null>(null); // 프로필 이미지만 표시
  const [nickname, setNickname] = useState("멜론빵");
  const [phone, setPhone] = useState("010-4690-4953");
  const [email, setEmail] = useState("gkthdud62@naver.com");
  const [address, setAddress] = useState("대구 동구 효동로3길 9");
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && !user) {
      navigation.navigate("Login");
    }
  }, [isFocused, user, navigation]);

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          {/* 상단 라벤더색 배경 */}
          <View style={styles.headerBackground} />

          {/* 오른쪽 상단에 고정된 수정 버튼 */}
          <TouchableOpacity style={styles.editIcon} onPress={handleEditToggle}>
            <Icon name="edit" size={24} color="#5E5E5E" />
          </TouchableOpacity>

          <View style={styles.profileContainer}>
            <View style={styles.profileImageContainer}>
              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require("../../assets/images/meerkat.jpg")
                }
                style={styles.profileImage}
              />
            </View>

            {isEditing ? (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>닉네임</Text>
                  <TextInput
                    style={[styles.input]}
                    value={nickname}
                    onChangeText={setNickname}
                    placeholder="닉네임"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>전화번호</Text>
                  <TextInput
                    style={[styles.input]}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="전화번호"
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>이메일</Text>
                  <TextInput
                    style={[styles.input]}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="이메일"
                    keyboardType="email-address"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>주소</Text>
                  <TextInput
                    style={[styles.input]}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="주소"
                  />
                </View>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleEditToggle}
                >
                  <Text style={styles.saveButtonText}>저장</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* 텍스트 부분을 감싸는 View */}
                <View style={styles.textContainer}>
                  <Text style={[styles.text, styles.leftAlignedText]}>
                    닉네임: {nickname}
                  </Text>
                  <Text style={[styles.text, styles.leftAlignedText]}>
                    Tel: {phone}
                  </Text>
                  <Text style={[styles.text, styles.leftAlignedText]}>
                    이메일: {email}
                  </Text>
                  <Text style={[styles.text, styles.leftAlignedText]}>
                    주소: {address}
                  </Text>
                  <View style={{ padding: 10 }}></View>
                  <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                  >
                    <Text style={styles.logoutButtonText}>로그아웃</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          <Hr />
        </>
      ) : (
        <Text style={styles.text}>Please log in.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackground: {
    backgroundColor: "#E6E6FA", // 라벤더 색상
    height: "25%", // 상단 30% 영역을 라벤더 색상으로
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  editIcon: {
    position: "absolute",
    top: 40, // 적절한 위치로 조정
    right: 20,
    zIndex: 1, // 다른 요소 위에 표시되도록 설정
  },
  profileContainer: {
    alignItems: "center",
    marginTop: "20%", // 프로필 이미지를 라벤더 배경 아래로 배치
  },
  profileImageContainer: {
    marginTop: -60, // 라벤더 배경과 겹치도록 프로필 이미지 위치 조정
    alignItems: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60, // 프로필 이미지는 둥글게
    borderWidth: 4,
    borderColor: "#fff", // 흰색 테두리
  },
  textContainer: {
    marginTop: 40, // 텍스트 부분만 밑으로 내림
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
  leftAlignedText: {
    textAlign: "left",
    alignSelf: "flex-start",
    marginLeft: "10%", // 왼쪽 여백 추가
    marginTop: 10,
  },
  inputContainer: {
    width: "80%",
    marginBottom: 15,
    marginTop: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  logoutButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 12,
    width: "50%",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    width: "50%",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  label: {
    marginBottom: 6,
    color: "black",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default ProfileScreen;

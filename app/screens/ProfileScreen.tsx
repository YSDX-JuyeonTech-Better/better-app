import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";
import BASE_URL from "../config";

const ProfileScreen: React.FC = ({ navigation }: any) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState(""); // API에서 가져온 유저 이름
  const [email, setEmail] = useState(""); // API에서 가져온 유저 이메일
  const [password, setPassword] = useState(""); // API에서 가져온 비밀번호
  const [gender, setGender] = useState(""); // API에서 가져온 성별
  const [phoneNum, setPhoneNum] = useState(""); // API에서 가져온 전화번호
  const [address, setAddress] = useState(""); // API에서 가져온 주소
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
  const isFocused = useIsFocused();

  // API를 통해 유저 정보를 가져오는 함수
  const fetchUserProfile = async (idx: string) => {
    try {
      console.log(`Fetching user profile with idx: ${idx}`);
      const response = await axios.get(`${BASE_URL}/api/users/${idx}`);

      console.log("ProfileScreen API Response:", response);
      const userData = response.data.data;
      console.log("ProfileScreen userData :", userData);
      setName(userData.name);
      setEmail(userData.email);
      setPassword(userData.password);
      setGender(userData.gender);
      setPhoneNum(userData.phone_num);
      setAddress(userData.address);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  // 로그인 상태를 확인하고, 유저 정보를 API로부터 가져오는 useEffect
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setIsAuthenticated(true);
        const idx = await AsyncStorage.getItem("idx");

        console.log("Profile Screen Token:", token);
        console.log("Profile Screen User idx:", idx);

        if (idx) {
          fetchUserProfile(idx);
        }
      } else {
        navigation.navigate("Login");
      }
    };

    if (isFocused) {
      checkAuthAndFetchData();
    }
  }, [isFocused, navigation]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("idx");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Logout Error: ", error);
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.uri);
    }
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        const token = await AsyncStorage.getItem("token");
        const idx = await AsyncStorage.getItem("idx");

        const response = await axios.put(
          `${BASE_URL}/api/users/${idx}`,
          {
            name,
            email,
            password,
            gender,
            phone_num: phoneNum,
            address,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("User data updated:", response.data);
      } catch (error) {
        console.error("Failed to update user data:", error);
      }
    }

    setIsEditing(!isEditing);
  };

  const handleNavigateToOrderHistory = () => {
    navigation.navigate("PurchaseScreen");
  };

  // 회원 탈퇴 처리 함수
  const handleDeleteAccount = async () => {
    Alert.alert(
      "회원 탈퇴",
      "정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "예",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              const idx = await AsyncStorage.getItem("idx");

              if (!token || !idx) {
                Alert.alert("로그인이 필요합니다.");
                return;
              }

              const response = await axios.delete(
                `${BASE_URL}/api/users/${idx}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (response.status === 200) {
                Alert.alert(
                  "회원 탈퇴 완료",
                  "계정이 성공적으로 삭제되었습니다."
                );
                await AsyncStorage.removeItem("token");
                await AsyncStorage.removeItem("idx");
                navigation.navigate("Login");
              } else {
                Alert.alert("회원 탈퇴 실패", "다시 시도해주세요.");
              }
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert("오류", "계정 삭제 중 오류가 발생했습니다.");
            }
          },
          style: "destructive", // 버튼 색상 빨간색
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {isAuthenticated ? (
        <>
          <View style={styles.separator} />

          <View style={styles.profileHeader}>
            <TouchableOpacity onPress={handleImagePick}>
              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require("../../assets/images/meerkat.jpg")
                }
                style={styles.profileImage}
              />
            </TouchableOpacity>

            {isEditing ? (
              <>
                <Text style={styles.label}>이름</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="이름"
                />
                <Text style={styles.label}>이메일</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="이메일"
                  keyboardType="email-address"
                />
                <Text style={styles.label}>비밀번호</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="비밀번호"
                  secureTextEntry
                />
                <Text style={styles.label}>성별</Text>
                <TextInput
                  style={styles.input}
                  value={gender}
                  onChangeText={setGender}
                  placeholder="성별"
                />
                <Text style={styles.label}>전화번호</Text>
                <TextInput
                  style={styles.input}
                  value={phoneNum}
                  onChangeText={setPhoneNum}
                  placeholder="전화번호"
                  keyboardType="phone-pad"
                />
                <Text style={styles.label}>주소</Text>
                <TextInput
                  style={styles.input}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="주소"
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleEditToggle}
                >
                  <Text style={styles.saveButtonText}>수정 완료</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.nickname}>{name}</Text>
                <Text style={styles.email}>{email}</Text>
              </>
            )}
          </View>

          <TouchableOpacity
            style={styles.sectionItem}
            onPress={handleNavigateToOrderHistory}
          >
            <Icon name="receipt" size={24} color="black" />
            <Text style={styles.sectionItemText}>구매 내역</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sectionItem}
            onPress={handleEditToggle}
          >
            <Icon name="edit" size={24} color="black" />
            <Text style={styles.sectionItemText}>정보 수정</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>로그아웃</Text>
          </TouchableOpacity>

          {/* 회원 탈퇴 버튼 */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteButtonText}>회원 탈퇴</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.text}>Please log in.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  separator: {
    height: 1,
    backgroundColor: "#d3d3d3",
    marginVertical: 10,
  },
  profileHeader: {
    alignItems: "center",
    padding: 16,
    marginTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  nickname: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: 16,
    marginTop: 8,
    fontSize: 14,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  sectionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionItemText: {
    marginLeft: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
    width: "50%",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: "red",
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "red",
    fontSize: 16,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 20,
  },
});

export default ProfileScreen;

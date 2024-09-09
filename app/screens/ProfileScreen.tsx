import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons";

const ProfileScreen: React.FC = ({ navigation }: any) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [nickname, setNickname] = useState("멜론빵");
  const [phone, setPhone] = useState("전화번호");
  const [email, setEmail] = useState("이메일");
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

  const handleNavigateToOrderHistory = () => {
    navigation.navigate("PurchaseScreen"); // 주문 내역 화면으로 이동
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing); // 수정 모드 활성화/비활성화
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

  return (
    <ScrollView style={styles.container}>
      {user ? (
        <>
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

            {/* 수정 중일 때는 TextInput으로 표시 */}
            {isEditing ? (
              <>
                <TextInput
                  style={styles.input}
                  value={nickname}
                  onChangeText={setNickname}
                  placeholder="닉네임"
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="이메일"
                  keyboardType="email-address"
                />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="전화번호"
                  keyboardType="phone-pad"
                />
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
                {/* 수정 중이 아닐 때는 텍스트로 표시 */}
                <Text style={styles.nickname}>{nickname}</Text>
                <Text style={styles.email}>{email}</Text>
              </>
            )}
          </View>

          {/* 구매 내역 버튼 */}
          <TouchableOpacity
            style={styles.sectionItem}
            onPress={handleNavigateToOrderHistory}
          >
            <Icon name="receipt" size={24} color="black" />
            <Text style={styles.sectionItemText}>구매 내역</Text>
          </TouchableOpacity>

          {/* 정보 수정 버튼 */}
          <TouchableOpacity
            style={styles.sectionItem}
            onPress={handleEditToggle}
          >
            <Icon name="edit" size={24} color="black" />
            <Text style={styles.sectionItemText}>정보 수정</Text>
          </TouchableOpacity>

          {/* 로그아웃 버튼 */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>로그아웃</Text>
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
  profileHeader: {
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
});

export default ProfileScreen;

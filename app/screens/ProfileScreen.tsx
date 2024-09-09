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
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { GRAY } from "@/constants/Colors";
import Hr from "@/components/Hr";

const ProfileScreen: React.FC = ({ navigation }: any) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
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
    <View style={styles.container}>
      {user ? (
        <>
          <Hr />
          {/* 오른쪽 상단에 고정된 수정 버튼 */}
          <TouchableOpacity style={styles.editIcon} onPress={handleEditToggle}>
            <Icon name="edit" size={24} color="#5E5E5E" />
          </TouchableOpacity>

          <View style={styles.profileContainer}>
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
                  style={styles.logoutButton}
                  onPress={handleEditToggle}
                >
                  <Text style={styles.logoutButtonText}>수정</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
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
              </>
            )}
          </View>
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
    padding: 16,
    backgroundColor: "#fff",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
    width: "80%",
    alignSelf: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
  leftAlignedText: {
    textAlign: "left",
    alignSelf: "flex-start",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  editIcon: {
    position: "absolute",
    top: 20,
    right: 20,
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
  label: {
    marginBottom: 6,
    color: "black",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default ProfileScreen;

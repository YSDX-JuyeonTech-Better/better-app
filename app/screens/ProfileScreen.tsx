import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
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

const ProfileScreen: React.FC = ({ navigation }: any) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [nickname, setNickname] = useState("에르빵");
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
          {/* 오른쪽 상단에 고정된 수정 버튼 */}
          <TouchableOpacity style={styles.editIcon} onPress={handleEditToggle}>
            <Icon name="edit" size={24} color="#007BFF" />
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
                <TextInput
                  style={[styles.input, styles.leftAlignedText]}
                  value={nickname}
                  onChangeText={setNickname}
                  placeholder="닉네임"
                />
                <TextInput
                  style={[styles.input, styles.leftAlignedText]}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="전화번호"
                  keyboardType="phone-pad"
                />
                <TextInput
                  style={[styles.input, styles.leftAlignedText]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="이메일"
                  keyboardType="email-address"
                />
                <TextInput
                  style={[styles.input, styles.leftAlignedText]}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="주소"
                />
                <Button title="Save" onPress={handleEditToggle} />
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
              </>
            )}
          </View>
          <Button title="Logout" onPress={handleLogout} />
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
    width: "80%", // 텍스트와 입력 필드를 왼쪽에 정렬하기 위해 추가
    alignSelf: "center", // 가운데 정렬
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
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  editIcon: {
    position: "absolute",
    top: 20, // 화면 상단으로부터의 거리
    right: 20, // 화면 오른쪽으로부터의 거리
  },
  editButton: {
    marginTop: 10,
  },
  editButtonText: {
    fontSize: 16,
    color: "#007BFF",
  },
});

export default ProfileScreen;

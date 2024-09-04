import { GRAY } from "@/constants/Colors";
import { StyleSheet, View } from "react-native";

const Hr = () => {
  return (
    <>
      <View style={[styles.border]}></View>
      <View style={{ paddingBottom: 20 }}></View>
    </>
  );
};

const styles = StyleSheet.create({
  border: {
    borderWidth: 0.5,
    borderRadius: 50,
    borderColor: GRAY.DEFAULT,
  },
});

export default Hr;

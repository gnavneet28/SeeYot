import React from "react";
import { StyleSheet } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome5";

import AppText from "./AppText";

import defaultStyles from "../config/styles";

function AddFavoritesButton({ onPress }) {
  return (
    <LinearGradient colors={["#4568DC", "#B06AB3"]} style={styles.container}>
      <FontAwesome
        onPress={onPress}
        style={styles.icon}
        name="grin-stars"
        size={20}
        color={defaultStyles.colors.white}
      />
      <AppText onPress={onPress} style={styles.add}>
        Add Favorites
      </AppText>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 32.5,
    elevation: 5,
    height: 65,
    justifyContent: "center",
    marginHorizontal: 5,
    width: 65,
  },
  add: {
    color: defaultStyles.colors.white,
    fontSize: 10,
    marginBottom: 0,
    marginTop: 2,
    padding: 0,
    textAlign: "center",
    width: "70%",
  },
  icon: {
    marginBottom: 2,
  },
});

export default AddFavoritesButton;

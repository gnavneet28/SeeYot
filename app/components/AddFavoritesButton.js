import React from "react";
import { StyleSheet, TouchableHighlight } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import Materialicons from "react-native-vector-icons/MaterialIcons";

import AppText from "./AppText";

import defaultStyles from "../config/styles";

function AddFavoritesButton({ onPress }) {
  return (
    <TouchableHighlight
      underlayColor={defaultStyles.colors.white}
      onPress={onPress}
    >
      <>
        <LinearGradient
          colors={["#4568DC", "#B06AB3"]}
          style={styles.container}
        >
          <Materialicons
            onPress={onPress}
            style={styles.icon}
            name="add-circle-outline"
            size={20}
            color={defaultStyles.colors.white}
          />
          <AppText onPress={onPress} style={styles.add}>
            Favorites
          </AppText>
        </LinearGradient>
      </>
    </TouchableHighlight>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    marginHorizontal: 5,
    width: 60,
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

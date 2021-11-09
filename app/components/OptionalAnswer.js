import React from "react";
import { View, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import AppText from "./AppText";

import defaultStyles from "../config/styles";

function OptionalAnswer({ answer, onPress }) {
  return (
    <View style={styles.container}>
      <AppText style={styles.answer}>{answer}</AppText>
      <Ionicons
        onPress={onPress}
        name="close"
        size={25}
        color={defaultStyles.colors.lightGrey}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  answer: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 10,
    color: defaultStyles.colors.blue,
    marginLeft: 10,
    maxWidth: "85%",
    paddingHorizontal: 10,
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    padding: 5,
    width: "95%",
  },
});

export default OptionalAnswer;

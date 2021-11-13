import React from "react";
import { View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppText from "./AppText";

import defaultStyles from "../config/styles";

function OptionalAnswer({ answer, onPress }) {
  return (
    <View style={styles.container}>
      <AppText style={styles.answer}>{answer}</AppText>
      <Ionicons
        color={defaultStyles.colors.lightGrey}
        name="close"
        onPress={onPress}
        size={scale(22)}
      />
    </View>
  );
}
const styles = ScaledSheet.create({
  answer: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "10@s",
    color: defaultStyles.colors.blue,
    marginLeft: "10@s",
    maxWidth: "85%",
    paddingHorizontal: "10@s",
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: "5@s",
    padding: "5@s",
    width: "95%",
  },
});

export default OptionalAnswer;

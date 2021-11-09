import React from "react";
import { View, StyleSheet } from "react-native";

import AppText from "./AppText";

import defaultStyles from "../config/styles";

const defaultOption = {
  _id: "",
  selected: false,
  answer: "",
};

function ReplyOption({ option = defaultOption, onPress, selectedMessageId }) {
  selectedMessageId == option._id
    ? (option.selected = true)
    : (option.selected = false);
  return (
    <View style={styles.container}>
      <AppText
        onPress={onPress}
        style={[
          styles.answer,
          {
            backgroundColor: option.selected
              ? defaultStyles.colors.blue
              : defaultStyles.colors.light,
            color: option.selected
              ? defaultStyles.colors.white
              : defaultStyles.colors.dark_Variant,
          },
        ]}
      >
        {option.answer}
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  answer: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: "center",
    textAlignVertical: "center",
  },
  container: {
    alignItems: "flex-start",
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 5,
    width: "100%",
  },
});

export default ReplyOption;

import React from "react";
import { View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

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
const styles = ScaledSheet.create({
  answer: {
    borderRadius: "10@s",
    paddingHorizontal: "10@s",
    paddingVertical: "5@s",
    textAlign: "center",
    textAlignVertical: "center",
  },
  container: {
    alignItems: "flex-start",
    borderRadius: "10@s",
    justifyContent: "center",
    paddingHorizontal: "20@s",
    paddingVertical: "5@s",
    width: "100%",
  },
});

export default ReplyOption;

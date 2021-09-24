import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import AppTextInput from "./AppTextInput";
import Icon from "./Icon";

import defaultStyles from "../config/styles";

const height = defaultStyles.height;

function SendThoughtsInput({ style, submit, onFocus, onBlur }) {
  const [message, setMessage] = useState("");

  const handlePress = () => {
    submit(message);
    setMessage("");
  };
  return (
    <View style={[styles.container, style]}>
      <AppTextInput
        maxLength={250}
        onBlur={onBlur}
        onChangeText={setMessage}
        onFocus={onFocus}
        placeholder="Send your thoughts..."
        style={styles.inputBox}
        value={message}
      />
      <TouchableOpacity
        disabled={!message}
        onPress={handlePress}
        style={styles.send}
      >
        <Icon
          color={message ? defaultStyles.colors.secondary : "lightgrey"}
          name="send"
          size={height * 0.04}
        />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.light,
    borderRadius: 30,
    borderWidth: 1,
    elevation: 1,
    flexDirection: "row",
    height: defaultStyles.dimensionConstants.height,
    width: "92%",
  },
  inputBox: {
    borderRadius: 30,
    height: "100%",
    marginRight: 5,
    paddingHorizontal: 10,
    width: "86%",
  },
  send: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 40,
  },
});

export default SendThoughtsInput;

import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

import Icon from "./Icon";

import defaultStyles from "../config/styles";
import debounce from "../utilities/debounce";

function SendThoughtsInput({
  onBlur,
  onFocus,
  placeholder = "Send your thoughts...",
  style,
  submit,
}) {
  const [message, setMessage] = useState("");

  const handlePress = debounce(
    () => {
      submit(message);
      setMessage("");
    },
    1000,
    true
  );

  return (
    <View style={[styles.container, style]}>
      <TextInput
        maxLength={250}
        onBlur={onBlur}
        onChangeText={setMessage}
        onFocus={onFocus}
        placeholder={placeholder}
        style={[
          styles.inputBox,
          { fontFamily: "Comic-Bold", fontWeight: "normal" },
        ]}
        value={message}
      />
      <TouchableOpacity
        disabled={message.replace(/\s/g, "").length >= 1 ? false : true}
        onPress={handlePress}
        style={styles.send}
      >
        <Icon
          color={
            message.replace(/\s/g, "").length >= 1
              ? defaultStyles.colors.secondary
              : defaultStyles.colors.lightGrey
          }
          name="send"
          size={scale(28)}
        />
      </TouchableOpacity>
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.light,
    borderRadius: "30@s",
    borderWidth: 1,
    elevation: 1,
    flexDirection: "row",
    height: "38@s",
    justifyContent: "space-between",
    width: "92%",
  },
  inputBox: {
    borderRadius: "30@s",
    flex: 1,
    fontSize: "15@s",
    height: "100%",
    marginRight: "5@s",
    paddingHorizontal: "10@s",
    width: "86%",
  },
  send: {
    alignItems: "center",
    height: "40@s",
    justifyContent: "center",
    marginRight: "5@s",
    width: "40@s",
  },
});

export default SendThoughtsInput;

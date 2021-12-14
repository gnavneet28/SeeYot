import React from "react";
import { View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import AppText from "../components/AppText";
import AppButton from "../components/AppButton";

import defaultStyles from "../config/styles";

function SettingsAction({
  onPress,
  buttonTitle,
  info,
  title,
  containerStyle,
  titleStyle,
  buttonStyle,
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      <AppText style={[styles.title, titleStyle]}>{title}</AppText>
      <AppText style={styles.info}>{info}</AppText>
      <AppButton
        title={buttonTitle}
        onPress={onPress}
        style={[styles.button, buttonStyle]}
      />
    </View>
  );
}

const styles = ScaledSheet.create({
  button: {
    backgroundColor: defaultStyles.colors.tomato,
    height: "30@s",
    marginVertical: "5@s",
    width: "90%",
  },
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "5@s",
    elevation: 4,
    justifyContent: "center",
    marginTop: "10@s",
    padding: "5@s",
    width: "95%",
  },
  info: {
    color: defaultStyles.colors.dark_Variant,
    fontSize: "13@s",
    marginBottom: "5@s",
    width: "90%",
  },
  title: {
    alignSelf: "flex-start",
    color: defaultStyles.colors.dark,
    fontSize: "15@s",
    marginBottom: "5@s",
  },
});

export default SettingsAction;

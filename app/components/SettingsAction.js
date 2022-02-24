import React from "react";
import { View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import ApiProcessingContainer from "./ApiProcessingContainer";

import defaultStyles from "../config/styles";

function SettingsAction({
  processing,
  onPress,
  buttonTitle,
  info,
  title,
  containerStyle,
  titleStyle,
  buttonStyle,
  AdditionalActionComponent,
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      <AppText style={[styles.title, titleStyle]}>{title}</AppText>
      <AppText style={styles.info}>{info}</AppText>
      {AdditionalActionComponent ? <AdditionalActionComponent /> : null}
      <ApiProcessingContainer
        style={styles.apiProcessingContainer}
        processing={processing}
      >
        <AppButton
          title={buttonTitle}
          onPress={onPress}
          style={[styles.button, buttonStyle]}
        />
      </ApiProcessingContainer>
    </View>
  );
}

const styles = ScaledSheet.create({
  apiProcessingContainer: {
    borderColor: defaultStyles.colors.lightGrey,
    borderRadius: "5@s",
    borderWidth: 1,
    height: "30@s",
    marginVertical: "5@s",
    padding: 0,
    width: "90%",
  },
  button: {
    backgroundColor: defaultStyles.colors.tomato,
    height: "30@s",
    width: "100%",
  },
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    //borderRadius: "5@s",
    //elevation: 4,
    borderBottomWidth: 1,
    borderColor: defaultStyles.colors.light,
    justifyContent: "center",
    marginTop: "10@s",
    padding: "5@s",
    width: "100%",
  },
  info: {
    color: defaultStyles.colors.dark_Variant,
    fontSize: "13@s",
    marginBottom: "5@s",
    width: "90%",
  },
  title: {
    // alignSelf: "flex-start",
    color: defaultStyles.colors.dark,
    fontSize: "15@s",
    marginBottom: "5@s",
    textAlign: "left",
    width: "90%",
  },
});

export default SettingsAction;

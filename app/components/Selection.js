import React, { memo } from "react";
import { View, TouchableOpacity } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import Feather from "../../node_modules/react-native-vector-icons/Feather";

import AppText from "./AppText";
import ApiProcessingContainer from "./ApiProcessingContainer";

import useConnection from "../hooks/useConnection";

import defaultStyles from "../config/styles";

function Selection({
  style,
  onPress,
  opted,
  containerStyle,
  value = "",
  iconSize = scale(14),
  fontStyle,
  processing,
}) {
  const isConnected = useConnection();
  const doNull = () => {};
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        disabled={!isConnected}
        onPress={isConnected ? onPress : doNull}
        style={[[styles.checkBox, containerStyle]]}
      >
        <ApiProcessingContainer processing={processing}>
          {opted ? (
            <Feather
              size={iconSize}
              color={defaultStyles.colors.secondary_Variant}
              name="check"
            />
          ) : null}
        </ApiProcessingContainer>
      </TouchableOpacity>
      {value ? (
        <AppText
          style={[styles.value, fontStyle]}
          onPress={isConnected ? onPress : doNull}
        >
          {value}
        </AppText>
      ) : null}
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    flexDirection: "row",
    minHeight: "40@s",
    padding: "5@s",
    width: "95%",
  },
  checkBox: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "8@s",
    borderWidth: 2,
    height: "25@s",
    justifyContent: "center",
    marginHorizontal: "5@s",
    width: "25@s",
  },
  value: {
    flexShrink: 1,
    fontSize: "14@s",
    opacity: 0.8,
    width: "100%",
  },
});

export default memo(Selection);

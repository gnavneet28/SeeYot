import React from "react";
import { View, ActivityIndicator } from "react-native";
import { scale, ScaledSheet } from "react-native-size-matters";
import defaultStyles from "../config/styles";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";
import * as Animatable from "react-native-animatable";

import AppText from "./AppText";

function AppActivityIndicator({
  color = defaultStyles.colors.secondary_Variant,
  size = scale(25),
  info = "",
}) {
  return (
    <View style={styles.overlay}>
      {info ? (
        <View style={styles.info}>
          <Animatable.View
            iterationCount="infinite"
            animation="rotate"
            style={styles.iconContainer}
            useNativeDriver={true}
          >
            <MaterialIcons
              style={{ transform: [{ rotateX: "180deg" }] }}
              name="sync"
              size={scale(35)}
              color={defaultStyles.colors.secondary}
            />
          </Animatable.View>
          <AppText style={styles.infoText}>{info}</AppText>
        </View>
      ) : (
        <ActivityIndicator size={size} color={color} style={{ flex: 1 }} />
      )}
    </View>
  );
}

const styles = ScaledSheet.create({
  info: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    color: defaultStyles.colors.dark_Variant,
  },
  iconContainer: {
    alignItems: "center",
    height: "40@s",
    justifyContent: "center",
    width: "40@s",
  },
  overlay: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
});

export default AppActivityIndicator;

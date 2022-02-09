import React from "react";
import { View, ActivityIndicator } from "react-native";
import MaterialCommunityIcons from "../../node_modules/react-native-vector-icons/MaterialCommunityIcons";
import { ScaledSheet, scale } from "react-native-size-matters";

import defaultStyles from "../config/styles";

function DeleteAction({ onPress, apiAction, processing, style }) {
  if (!apiAction)
    return (
      <View style={[styles.deleteIconContainer, style]}>
        <MaterialCommunityIcons
          name="delete-circle-outline"
          size={scale(17)}
          onPress={onPress}
          color={defaultStyles.colors.danger}
        />
      </View>
    );

  return (
    <View style={[styles.deleteIconContainer, style]}>
      {!processing ? (
        <MaterialCommunityIcons
          name="delete-circle-outline"
          size={scale(17)}
          onPress={onPress}
          color={defaultStyles.colors.danger}
        />
      ) : (
        <ActivityIndicator
          size={scale(16)}
          color={defaultStyles.colors.tomato}
        />
      )}
    </View>
  );
}
const styles = ScaledSheet.create({
  deleteIconContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderColor: defaultStyles.colors.light,
    borderRadius: "10@s",
    borderWidth: 1,
    height: "30@s",
    justifyContent: "center",
    marginHorizontal: "15@s",
    width: "30@s",
  },
});

export default DeleteAction;

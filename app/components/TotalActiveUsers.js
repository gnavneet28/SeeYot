import React from "react";
import { TouchableOpacity } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";

import AppText from "./AppText";

import defaultStyles from "../config/styles";

function TotalActiveUsers({ totalActiveUsers, conatinerStyle }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.totalActivePeople, conatinerStyle]}
    >
      <AppText style={styles.totalActivePeopleCount}>
        {totalActiveUsers.length}
      </AppText>
      <MaterialIcons
        name="remove-red-eye"
        size={scale(15)}
        color={defaultStyles.colors.yellow_Variant}
      />
    </TouchableOpacity>
  );
}
const styles = ScaledSheet.create({
  totalActivePeople: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.dark_Variant,
    borderRadius: "5@s",
    flexDirection: "row",
    height: "30@s",
    justifyContent: "center",
    paddingHorizontal: "5@s",
  },
  totalActivePeopleCount: {
    color: defaultStyles.colors.white,
  },
});

export default TotalActiveUsers;

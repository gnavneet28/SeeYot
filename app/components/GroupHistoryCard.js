import React from "react";
import { TouchableOpacity } from "react-native";
import { scale, ScaledSheet } from "react-native-size-matters";
import AntDesign from "../../node_modules/react-native-vector-icons/AntDesign";

import AppText from "./AppText";
import ApiProcessingContainer from "./ApiProcessingContainer";

import defaultStyles from "../config/styles";

function GroupHistoryCard({
  group = { name: "", _id: "" },
  onPress,
  onDeletePress,
  deletingGroup,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.container}
    >
      <AppText onPress={onPress} numberOfLines={1} style={styles.groupName}>
        {group.name}
      </AppText>
      <ApiProcessingContainer
        style={styles.iconContainer}
        processing={deletingGroup == group._id}
        size={scale(12)}
      >
        <AntDesign
          name="close"
          color={defaultStyles.colors.dark_Variant}
          size={scale(12)}
          onPress={onDeletePress}
        />
      </ApiProcessingContainer>
    </TouchableOpacity>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.dark,
    borderWidth: 1,
    borderColor: defaultStyles.colors.white,
    borderRadius: "20@s",
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: "5@s",
    paddingHorizontal: "10@s",
    paddingVertical: "5@s",
  },
  groupName: {
    fontSize: "11@s",
    marginRight: "15@s",
    maxWidth: "80@s",
    paddingVertical: 0,
    textAlign: "center",
    textAlignVertical: "center",
    color: defaultStyles.colors.white,
  },
  iconContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.lightGrey,
    borderRadius: "5@s",
    height: "22@s",
    justifyContent: "center",
    width: "22@s",
  },
});

export default GroupHistoryCard;

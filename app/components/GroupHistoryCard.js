import React from "react";
import { View } from "react-native";
import { scale, ScaledSheet } from "react-native-size-matters";
import AntDesign from "../../node_modules/react-native-vector-icons/AntDesign";

import AppText from "./AppText";
import ApiProcessingContainer from "./ApiProcessingContainer";

import defaultStyles from "../config/styles";

function GroupHistoryCard({ group, onPress, onDeletePress, deletingGroup }) {
  return (
    <View style={styles.container}>
      <AppText onPress={onPress} numberOfLines={2} style={styles.groupName}>
        {group.name}
      </AppText>
      <ApiProcessingContainer
        style={styles.iconContainer}
        processing={deletingGroup}
        size={scale(12)}
      >
        <AntDesign
          name="close"
          color={defaultStyles.colors.dark_Variant}
          size={scale(12)}
          onPress={onDeletePress}
        />
      </ApiProcessingContainer>
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "20@s",
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: "5@s",
    paddingHorizontal: "10@s",
    paddingVertical: "5@s",
  },
  groupName: {
    fontSize: "12@s",
    marginRight: "10@s",
    maxWidth: "80@s",
    paddingVertical: 0,
    textAlign: "center",
    textAlignVertical: "center",
  },
  iconContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.lightGrey,
    borderRadius: "5@s",
    height: "18@s",
    justifyContent: "center",
    width: "18@s",
  },
});

export default GroupHistoryCard;

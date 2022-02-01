import React, { memo } from "react";
import { View, TouchableOpacity } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppText from "./AppText";
import Icon from "./Icon";

import defaultStyles from "../config/styles";

function UserDetailsCard({
  data,
  editable = false,
  fw,
  iconName,
  size,
  style,
  title = "",
  onEditIconPress,
  onDataPress,
  dataStyle,
}) {
  return (
    <>
      <View style={[styles.container, style]}>
        <Icon
          color={defaultStyles.colors.tomato}
          fw={fw}
          name={iconName}
          size={size}
          style={{ marginHorizontal: 2 }}
        />
        <View style={styles.userDetail}>
          <AppText
            numberOfLines={1}
            style={{
              fontSize: scale(15),
              paddingBottom: 0,
              opacity: 0.9,
            }}
          >
            {title}
          </AppText>
          <AppText
            onPress={onDataPress}
            numberOfLines={1}
            style={[styles.data, dataStyle]}
          >
            {data}
          </AppText>
        </View>
        {editable === true ? (
          <TouchableOpacity onPress={onEditIconPress}>
            <Icon
              color={defaultStyles.colors.secondary}
              name="mode-edit"
              size={scale(14)}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.light,
    flexDirection: "row",
    height: "50@s",
    justifyContent: "space-between",
    width: "90%",
  },
  data: {
    color: defaultStyles.colors.dark_Variant,
    fontFamily: "ComicNeue-Bold",
    fontSize: "14@s",
    paddingTop: 0,
  },
  userDetail: {
    flex: 1,
  },
});

export default memo(UserDetailsCard);

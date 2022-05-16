import React, { memo } from "react";
import { View, TouchableOpacity } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";

import AppImage from "./AppImage";
import AppText from "./AppText";

import defaultStyles from "../config/styles";
import defaultProps from "../utilities/defaultProps";

import checkFileType from "../utilities/checkFileType";

function EchoMessageCard({
  echoMessage = defaultProps.defaultEchoMessage,
  cardStyle,
  onEchoMessagePress,
}) {
  const handleOneEchoMessagePress = () => {
    onEchoMessagePress(echoMessage);
  };
  return (
    <>
      <View style={[styles.container, cardStyle]}>
        <AppImage
          activeOpacity={1}
          imageUrl={echoMessage.picture}
          style={styles.image}
          subStyle={styles.subImage}
        />
        <View style={styles.echoMessageDetailsContainer}>
          <AppText numberOfLines={1} style={styles.name}>
            {echoMessage.name}
          </AppText>
          {checkFileType(echoMessage.message) ? (
            <MaterialIcons
              name="audiotrack"
              size={scale(15)}
              color={defaultStyles.colors.secondary}
            />
          ) : (
            <AppText numberOfLines={1} style={styles.message}>
              {echoMessage.message}
            </AppText>
          )}
        </View>
        <TouchableOpacity
          onPress={handleOneEchoMessagePress}
          style={styles.contactsActionConatiner}
        >
          <MaterialIcons
            onPress={handleOneEchoMessagePress}
            color={defaultStyles.colors.secondary}
            name="more-vert"
            size={scale(16)}
            style={styles.actionIcon}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}
const styles = ScaledSheet.create({
  actionIcon: {
    opacity: 0.8,
  },
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.light,
    borderRadius: "10@s",
    borderWidth: 0.5,
    elevation: 0.5,
    flexDirection: "row",
    height: "55@s",
    justifyContent: "center",
    marginBottom: "5@s",
    paddingHorizontal: "10@s",
    width: "95%",
  },
  contactsActionConatiner: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "8@s",
    elevation: 1,
    height: "32@s",
    justifyContent: "center",
    marginRight: "8@s",
    overflow: "hidden",
    width: "32@s",
  },
  echoMessageDetailsContainer: {
    flexShrink: 1,
    width: "100%",
  },
  image: {
    alignItems: "center",
    borderColor: defaultStyles.colors.light,
    borderRadius: "20@s",
    borderWidth: 2,
    height: "40@s",
    justifyContent: "center",
    marginRight: "5@s",
    width: "40@s",
  },
  name: {
    color: defaultStyles.colors.dark,
    fontSize: "13@s",
    paddingBottom: 0,
  },
  message: {
    color: defaultStyles.colors.dark_Variant,
    fontSize: "12@s",
    paddingTop: 0,
  },
  subImage: {
    borderRadius: "19@s",
    height: "38@s",
    width: "38@s",
  },
});

export default memo(EchoMessageCard);

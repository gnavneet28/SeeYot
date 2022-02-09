import React, { memo } from "react";
import { View, TouchableOpacity } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";

import AppImage from "./AppImage";
import AppText from "./AppText";

import defaultStyles from "../config/styles";
import defaultProps from "../utilities/defaultProps";

function EchoMessageCard({
  echoMessage = defaultProps.defaultEchoMessage,
  cardStyle,
  onEchoMessagePress,
}) {
  return (
    <>
      <View style={[styles.container, cardStyle]}>
        <AppImage
          imageUrl={echoMessage.picture}
          style={styles.image}
          subStyle={styles.subImage}
        />
        <View style={styles.echoMessageDetailsContainer}>
          <AppText numberOfLines={1} style={styles.name}>
            {echoMessage.name}
          </AppText>
          <AppText numberOfLines={1} style={styles.message}>
            {echoMessage.message}
          </AppText>
        </View>
        <TouchableOpacity
          onPress={onEchoMessagePress}
          style={styles.contactsActionConatiner}
        >
          <MaterialIcons
            onPress={onEchoMessagePress}
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
    flexDirection: "row",
    height: "60@s",
    justifyContent: "center",
    paddingHorizontal: "10@s",
    width: "100%",
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

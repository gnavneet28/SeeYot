import React, { memo } from "react";
import { View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

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
          onPress={onEchoMessagePress}
          style={styles.image}
          subStyle={styles.subImage}
        />
        <AppText numberOfLines={1} style={styles.name}>
          {echoMessage.name}
        </AppText>
      </View>
    </>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "10@s",
    height: "75@s",
    justifyContent: "center",
    marginHorizontal: "5@s",
    paddingLeft: "2@s",
    paddingRight: "2@s",
    paddingTop: "5@s",
    width: "70@s",
  },
  image: {
    alignItems: "center",
    borderColor: defaultStyles.colors.light,
    borderRadius: "20@s",
    borderWidth: 2,
    height: "40@s",
    justifyContent: "center",
    width: "40@s",
  },
  name: {
    color: defaultStyles.colors.dark,
    fontSize: "12@s",
  },
  subImage: {
    borderRadius: "19@s",
    height: "38@s",
    width: "38@s",
  },
});

export default memo(EchoMessageCard);

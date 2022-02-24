import React, { memo, useContext } from "react";
import { View } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";
import LottieView from "lottie-react-native";

import defaultStyles from "../config/styles";
import AppImage from "./AppImage";
import AppText from "./AppText";

import TypingContext from "../utilities/typingContext";

const typingIndicator = "typing.json";
const headerColor = "#343436";

function ThoughtsScreenHeader({
  imageUrl,
  onPress,
  onOptionPress,
  name,
  onActiveChatModePress,
  onThoughtsModePress,
  activeChat,
  isRecipientActive,
}) {
  const { typing } = useContext(TypingContext);
  return (
    <View style={styles.container}>
      <View style={styles.leftSectionMainContainer}>
        <MaterialIcons
          name="arrow-back"
          onPress={onPress}
          color={defaultStyles.colors.white}
          style={styles.icon}
          size={scale(23)}
        />
        <View
          style={[
            styles.imageContainer,
            {
              borderColor: isRecipientActive
                ? defaultStyles.colors.green
                : defaultStyles.colors.white,
            },
          ]}
        >
          {activeChat && typing ? (
            <LottieView
              autoPlay
              loop
              source={typingIndicator}
              style={{
                width: scale(30),
                height: scale(30),
              }}
            />
          ) : (
            <AppImage
              activeOpacity={1}
              style={[styles.image]}
              subStyle={styles.imageSub}
              imageUrl={imageUrl}
            />
          )}
        </View>
      </View>
      <View style={styles.middleSectionContainer}>
        {activeChat ? (
          <AppText style={[styles.name]}>
            {activeChat && isRecipientActive
              ? `${name} is Active`
              : `${name} is not Active`}
          </AppText>
        ) : (
          <AppText style={styles.name}>{name}</AppText>
        )}
        <View style={[styles.modeChangerContainer]}>
          <AppText
            style={[
              styles.thoughtMode,
              {
                backgroundColor: activeChat
                  ? defaultStyles.colors.lightGrey
                  : defaultStyles.colors.white,

                color: activeChat
                  ? defaultStyles.colors.dark
                  : defaultStyles.colors.dark,
              },
            ]}
            onPress={onThoughtsModePress}
          >
            Thoughts
          </AppText>
          <AppText
            style={[
              styles.activeMode,
              {
                backgroundColor: activeChat
                  ? defaultStyles.colors.white
                  : defaultStyles.colors.lightGrey,
                color: !activeChat
                  ? defaultStyles.colors.dark
                  : defaultStyles.colors.dark,
              },
            ]}
            onPress={onActiveChatModePress}
          >
            Active Chat
          </AppText>
        </View>
        {/* {activeChat ? (
          <AppText style={[styles.name]}>
            {activeChat && isRecipientActive
              ? `${name} is Active`
              : `${name} is not Active`}
          </AppText>
        ) : (
          <AppText style={styles.name}>{name}</AppText>
        )} */}
      </View>
      <MaterialIcons
        name="more-vert"
        size={scale(23)}
        color={defaultStyles.colors.white}
        onPress={onOptionPress}
        style={styles.optionIcon}
      />
    </View>
  );
}
const styles = ScaledSheet.create({
  activeMode: {
    flexShrink: 1,
    height: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    width: "100%",
  },
  container: {
    alignItems: "center",
    backgroundColor: headerColor,
    borderTopRightRadius: "20@s",
    //elevation: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
    width: "100%",
  },
  leftSectionMainContainer: {
    alignItems: "flex-end",
    backgroundColor: defaultStyles.colors.primary,
    borderBottomRightRadius: "40@s",
    height: "100%",
    justifyContent: "flex-end",
    minHeight: "70@s",
    width: "100@s",
  },
  imageContainer: {
    alignItems: "center",
    borderRadius: "25@s",
    borderWidth: "1.5@s",
    height: "50@s",
    justifyContent: "center",
    marginBottom: "15@s",
    marginRight: "15@s",
    overflow: "hidden",
    width: "50@s",
  },
  image: {
    borderRadius: "24@s",
    height: "48@s",
    width: "48@s",
  },
  imageSub: {
    borderRadius: "24@s",
    height: "48@s",
    width: "48@s",
  },
  icon: {
    left: "10@s",
    position: "absolute",
    top: "5@s",
  },
  middleSectionContainer: {
    alignItems: "center",
    backgroundColor: headerColor,
    flexShrink: 1,
    justifyContent: "flex-start",
    marginHorizontal: "5@s",
    minHeight: "70@s",
    paddingTop: "5@s",
    width: "100%",
  },
  modeChangerContainer: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "20@s",
    flexDirection: "row",
    height: "30@s",
    overflow: "hidden",
    width: "100%",
    //alignSelf: "flex-end",
    position: "absolute",
    bottom: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  name: {
    color: defaultStyles.colors.white,
    fontSize: "14@s",
    paddingTop: "5@s",
  },
  optionIcon: {
    marginRight: "10@s",
  },
  thoughtMode: {
    flexShrink: 1,
    height: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    width: "100%",
  },
});

export default memo(ThoughtsScreenHeader);

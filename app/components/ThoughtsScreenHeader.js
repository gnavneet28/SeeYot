import React, { memo, useContext, useState, useEffect } from "react";
import { View } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";
import LottieView from "lottie-react-native";

import defaultStyles from "../config/styles";
import AppImage from "./AppImage";
import AppText from "./AppText";

import { SocketContext } from "../api/socketClient";
import useAuth from "../auth/useAuth";

const typingIndicator = "typing.json";
const headerColor = "#343436";

let timeOut;
let TIMER_LENGTH = 2000;

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
  const { user } = useAuth();
  const [typing, setTyping] = useState(false);

  const socket = useContext(SocketContext);

  useEffect(() => {
    const listener1 = (data) => {
      if (!typing) {
        setTyping(true);
      } else {
        clearTimeout(timeOut);
      }
      let lastTypingTime = new Date().getTime();
      timeOut = setTimeout(() => {
        let typingTimer = new Date().getTime();
        let timeDiff = typingTimer - lastTypingTime;

        if (timeDiff >= TIMER_LENGTH && typing) {
          setTyping(false);
        }
      }, TIMER_LENGTH);
    };

    socket.on(`typing${user._id}`, listener1);

    const listener2 = (data) => {
      if (typing) setTyping(false);
    };

    socket.on(`stopTyping${user._id}`, listener2);

    return () => {
      socket.off(`typing${user._id}`, listener1);
      socket.off(`stopTyping${user._id}`, listener2);
    };
  }, [typing]);

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
              style={styles.typingAnimation}
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
          <AppText style={styles.name}>
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
                  ? defaultStyles.colors.white
                  : defaultStyles.colors.green,

                color: activeChat
                  ? defaultStyles.colors.dark
                  : defaultStyles.colors.white,
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
                  ? defaultStyles.colors.green
                  : defaultStyles.colors.white,
                color: activeChat
                  ? defaultStyles.colors.white
                  : defaultStyles.colors.dark,
              },
            ]}
            onPress={onActiveChatModePress}
          >
            Active Chat
          </AppText>
        </View>
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
    fontSize: "13@s",
    height: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    width: "100%",
  },
  container: {
    alignItems: "center",
    backgroundColor: headerColor,
    borderTopRightRadius: "20@s",
    flexDirection: "row",
    height: "66@s",
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
    width: "85@s",
  },
  imageContainer: {
    alignItems: "center",
    borderRadius: "20@s",
    borderWidth: "1.5@s",
    height: "40@s",
    justifyContent: "center",
    marginBottom: "18@s",
    marginRight: "10@s",
    overflow: "hidden",
    width: "40@s",
  },
  image: {
    borderRadius: "18@s",
    height: "35@s",
    width: "35@s",
  },
  imageSub: {
    borderRadius: "18@s",
    height: "35@s",
    width: "35@s",
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
    height: "100%",
    justifyContent: "space-between",
    marginHorizontal: "5@s",
    width: "100%",
  },
  modeChangerContainer: {
    backgroundColor: defaultStyles.colors.white,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderRadius: "20@s",
    flexDirection: "row",
    height: "25@s",
    overflow: "hidden",
    width: "80%",
  },
  name: {
    color: defaultStyles.colors.white,
    flex: 1,
    fontSize: "14@s",
    paddingBottom: 0,
    paddingTop: 0,
    textAlignVertical: "center",
  },
  optionIcon: {
    marginRight: "10@s",
  },
  thoughtMode: {
    flexShrink: 1,
    fontSize: "13@s",
    height: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    width: "100%",
  },
  typingAnimation: {
    height: "30@s",
    width: "30@s",
  },
});

export default memo(ThoughtsScreenHeader);

import React, { memo, useContext, useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";
import LottieView from "lottie-react-native";

import defaultStyles from "../config/styles";
import AppImage from "./AppImage";
import AppText from "./AppText";

import { SocketContext } from "../api/socketClient";
import useAuth from "../auth/useAuth";
import TotalActiveUsers from "./TotalActiveUsers";

const typingIndicator = "typing.json";
const headerColor = "#343436";

let timeOut;
let TIMER_LENGTH = 2000;

function GroupChatHeader({
  totalActiveUsers = [],
  onBackPress,
  onOptionPress,
  group = {
    _id: "",
    picture: "",
    name: "",
  },
}) {
  const [typing, setTyping] = useState(false);

  let isUnmounting = false;

  const socket = useContext(SocketContext);

  useEffect(() => {
    const listener1 = (data) => {
      if (!typing && !isUnmounting) {
        setTyping(true);
      } else {
        clearTimeout(timeOut);
      }
      let lastTypingTime = new Date().getTime();
      timeOut = setTimeout(() => {
        let typingTimer = new Date().getTime();
        let timeDiff = typingTimer - lastTypingTime;

        if (timeDiff >= TIMER_LENGTH && typing && !isUnmounting) {
          setTyping(false);
        }
      }, TIMER_LENGTH);
    };

    socket.on(`typing${group._id}`, listener1);

    const listener2 = (data) => {
      if (typing && !isUnmounting) setTyping(false);
    };

    socket.on(`stopTyping${group._id}`, listener2);

    return () => {
      isUnmounting = true;
      socket.off(`typing${group._id}`, listener1);
      socket.off(`stopTyping${group._id}`, listener2);
    };
  }, [typing]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: headerColor,
        },
      ]}
    >
      <View style={styles.leftSectionMainContainer}>
        <MaterialIcons
          name="arrow-back"
          onPress={onBackPress}
          color={defaultStyles.colors.white}
          style={styles.icon}
          size={scale(23)}
        />
        <View
          style={[
            styles.imageContainer,
            {
              borderColor: defaultStyles.colors.white,
            },
          ]}
        >
          {typing ? (
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
              imageUrl={group.picture}
            />
          )}
        </View>
      </View>
      <View
        style={[
          styles.middleSectionContainer,
          {
            backgroundColor: headerColor,
          },
        ]}
      >
        <AppText style={styles.name}>{group.name}</AppText>
      </View>
      <TotalActiveUsers totalActiveUsers={totalActiveUsers} />
      <MaterialIcons
        name="more-vert"
        size={scale(23)}
        color={defaultStyles.colors.white}
        Back
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
    borderTopRightRadius: "20@s",
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
    justifyContent: "center",
    marginHorizontal: "5@s",
    minHeight: "70@s",
    paddingTop: "5@s",
    width: "100%",
  },
  name: {
    color: defaultStyles.colors.white,
    fontSize: "14@s",
    paddingTop: "5@s",
  },
  optionIcon: {
    marginRight: "10@s",
  },
});

export default memo(GroupChatHeader);

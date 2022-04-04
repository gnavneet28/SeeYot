import React, { memo, useContext, useEffect, useState } from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import Autolink from "react-native-autolink";
import { SocketContext } from "../api/socketClient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import ActiveChatImage from "./ActiveChatImage";

import defaultStyles from "../config/styles";
import ActiveChatReply from "./ActiveChatReply";

let defaultThought = {
  message: "",
  createdAt: Date.now(),
  secondaryId: "",
  media: "",
  reply: {
    createdBy: "",
    message: "",
    media: "",
  },
};

function ActiveChatBubble({
  thought = defaultThought,
  mine,
  onLongPress,
  onSelectReply,
  user = { _id: "" },
  recipient = { name: "" },
}) {
  const socket = useContext(SocketContext);
  const [refresh, setRefresh] = useState(false);
  let isUnmounting = false;

  const translateX = useSharedValue(-20);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  }, [thought]);

  useEffect(() => {
    if (thought.seen) {
      translateX.value = withTiming(0);
    }
    const listener = () => {
      thought.seen = true;

      translateX.value = withTiming(0);

      if (!isUnmounting) {
        setRefresh(!refresh);
      }
    };

    socket.on(`${thought.secondaryId}`, listener);

    return () => {
      socket.off(`${thought.secondaryId}`, listener);
      isUnmounting = true;
    };
  }, [thought]);

  return (
    <TouchableWithoutFeedback onLongPress={onSelectReply}>
      <Animated.View
        style={[
          styles.message,
          !mine ? styles.mine : styles.not_mine,
          mine ? rStyle : {},
        ]}
      >
        {thought.reply.message || thought.reply.media ? (
          <ActiveChatReply
            style={{
              minWidth: "20%",
              maxWidth: "50%",
              alignSelf: mine ? "flex-end" : "flex-start",
              borderBottomRightRadius: !mine ? scale(10) : 0,
              borderBottomLeftRadius: !mine ? 0 : scale(10),
            }}
            media={thought.reply.media}
            message={thought.reply.message}
            creator={
              thought.reply.createdBy == user._id ? "You" : recipient.name
            }
            show={false}
          />
        ) : null}
        <View
          style={[
            styles.cloud,
            {
              backgroundColor: !mine
                ? defaultStyles.colors.secondary
                : defaultStyles.colors.yellow_Variant,
              paddingHorizontal: thought.media ? 0 : scale(10),
              paddingVertical: thought.media ? 0 : scale(6),

              borderTopLeftRadius: mine
                ? scale(15)
                : thought.reply.message || thought.reply.media
                ? 0
                : scale(5),
              borderTopRightRadius: mine
                ? thought.reply.message || thought.reply.media
                  ? 0
                  : scale(5)
                : scale(15),
            },
          ]}
        >
          {thought.media ? (
            <ActiveChatImage
              containerStyle={{
                borderTopLeftRadius: mine ? scale(15) : 0,
                borderTopRightRadius: mine ? 0 : scale(15),
              }}
              mine={mine}
              onLongPress={onSelectReply}
              uri={thought.media}
            />
          ) : (
            <Autolink
              showAlert={true}
              text={thought.message}
              linkProps={{
                suppressHighlighting: true,
                testID: "link",
              }}
              linkStyle={{
                ...styles.text,
                color: defaultStyles.colors.blue,
              }}
              textProps={{
                selectable: true,
                style: [
                  styles.text,
                  {
                    color: !mine
                      ? defaultStyles.colors.white
                      : defaultStyles.colors.dark,
                  },
                ],
                onLongPress,
              }}
              email={true}
              phone="sms"
            />
          )}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  cloud: {
    borderRadius: scale(15),
    maxWidth: moderateScale(250, 2),
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    overflow: "hidden",
  },
  createdAt: {
    fontSize: scale(8),
    fontFamily: "ComicNeue-Bold",
    paddingTop: 0,
    textAlign: "right",
  },
  message: {
    marginVertical: scale(3),
    overflow: "hidden",
    width: "100%",
  },
  mine: {
    alignItems: "flex-start",
    paddingLeft: scale(15),
  },
  not_mine: {
    alignItems: "flex-end",
    paddingRight: scale(15),
  },
  text: {
    ...defaultStyles.text,
    color: defaultStyles.colors.dark,
    fontFamily: "ComicNeue-Bold",
    fontSize: scale(13.5),
    lineHeight: scale(16),
    paddingBottom: 0,
  },
});

export default memo(ActiveChatBubble);

import React, { memo } from "react";
import { View, TouchableOpacity } from "react-native";
import { scale, ScaledSheet } from "react-native-size-matters";
import AntDesign from "../../node_modules/react-native-vector-icons/AntDesign";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";
import FontAwesome from "../../node_modules/react-native-vector-icons/FontAwesome";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import defaultStyles from "../config/styles";

import AppText from "./AppText";

let defaultReply = {
  _id: "",
  text: "This is my very first reply. Please let me know what do you think about it.This is my very first reply. Please let me know what do you think about it. This is my very first reply. Please let me know what do you think about it.",
  createdAt: new Date().toString(),
  liked: false,
  heartBeat: false,
  loved: false,
};

const ICON_SIZE = scale(20);

const FavoritePostReplyCard = ({
  reply = defaultReply,
  showMoreOptions = false,
  onReactIconPress = () => {},
  showReactionOptions = true,
}) => {
  dayjs.extend(relativeTime);

  const raiseLikePressEvent = () => {
    if (reply.liked || !showReactionOptions) return;
    onReactIconPress(reply, "Like");
  };

  const raiseHeartBeatPress = () => {
    if (reply.heartBeat || !showReactionOptions) return;
    onReactIconPress(reply, "HeartBeat");
  };

  const raiseLovePressEvent = () => {
    if (reply.loved || !showReactionOptions) return;
    onReactIconPress(reply, "Love");
  };

  return (
    <View style={styles.container}>
      <View style={styles.postHeader}>
        <AntDesign
          style={styles.icon}
          name="star"
          size={scale(20)}
          color={defaultStyles.colors.yellow_Variant}
        />
        <View style={styles.postContentContainer}>
          <AppText style={styles.postText}>{reply.text}</AppText>
          <AppText style={styles.postDate}>
            {dayjs(reply.createdAt).fromNow()}
          </AppText>
        </View>
        {showMoreOptions ? (
          <TouchableOpacity
            onPress={raiseMoreOptionsPressAction}
            style={styles.moreOptionsIconContainer}
          >
            <MaterialIcons
              onPress={raiseMoreOptionsPressAction}
              color={defaultStyles.colors.secondary}
              name="more-vert"
              size={scale(16)}
              style={styles.actionIcon}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={styles.reacttionContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={raiseLovePressEvent}
          style={styles.reactionIconContainer}
        >
          <FontAwesome
            size={ICON_SIZE}
            name={reply.loved ? "heart" : "heart-o"}
            color={
              reply.loved
                ? defaultStyles.colors.danger
                : defaultStyles.colors.dark
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={raiseLikePressEvent}
          style={styles.reactionIconContainer}
        >
          <FontAwesome
            size={ICON_SIZE}
            name={reply.liked ? "thumbs-up" : "thumbs-o-up"}
            color={
              reply.liked
                ? defaultStyles.colors.green
                : defaultStyles.colors.dark
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={raiseHeartBeatPress}
          style={styles.reactionIconContainer}
        >
          <FontAwesome
            size={ICON_SIZE}
            name="heartbeat"
            color={
              reply.heartBeat
                ? defaultStyles.colors.blue
                : defaultStyles.colors.dark
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = ScaledSheet.create({
  actionIcon: {
    opacity: 0.8,
  },
  container: {
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.light,
    borderRadius: "5@s",
    borderWidth: 1,
    marginBottom: "10@s",
    marginTop: "1@s",
    overflow: "hidden",
    width: "95%",
  },
  moreOptionsIconContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "8@s",
    elevation: 1,
    height: "25@s",
    justifyContent: "center",
    margin: "5@s",
    marginRight: "8@s",
    overflow: "hidden",
    width: "25@s",
  },
  postHeader: {
    flexDirection: "row",
  },
  postContentContainer: {
    flexShrink: 1,
    marginHorizontal: "5@s",
    padding: "5@s",
    width: "100%",
  },
  postText: {
    fontSize: "12.5@s",
    padding: 0,
  },
  postDate: {
    color: defaultStyles.colors.lightGrey,
    fontSize: "10@s",
    paddingLeft: 0,
  },
  replyButton: {
    backgroundColor: defaultStyles.colors.light,
    color: defaultStyles.colors.dark,
    fontSize: "12@s",
    paddingVertical: "7@s",
    textAlign: "center",
    width: "100%",
  },
  icon: {
    marginLeft: "5@s",
    marginTop: "5@s",
  },
  reacttionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: "5@s",
  },
  reactionIconContainer: {
    alignItems: "center",
    flexShrink: 1,
    justifyContent: "center",
    width: "100%",
  },
});

export default memo(FavoritePostReplyCard);

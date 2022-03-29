import React, { memo, useContext, useEffect, useState } from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import Autolink from "react-native-autolink";

import ActiveChatImage from "./ActiveChatImage";
import AppImage from "../components/AppImage";

import defaultStyles from "../config/styles";
import ActiveChatReply from "./ActiveChatReply";
import AppText from "./AppText";

let defaultMessage = {
  message: "",
  createdBy: {
    _id: "Gaurav Navneet",
    name: "Gaurav Navneet",
    picture:
      "https://seeyot-photos.s3.amazonaws.com/64026bca-a40e-4b72-a291-8ab8a861d3ae.jpg-user-1647584463567.jpg",
  },
  createdAt: Date.now(),
  secondaryId: "",
  media:
    "https://seeyot-photos.s3.amazonaws.com/64026bca-a40e-4b72-a291-8ab8a861d3ae.jpg-user-1647584463567.jpg",
  reply: {
    createdBy: {
      _id: "",
      name: "",
      picture: "",
    },
    message: "",
    media: "",
  },
};

function GroupChatBubble({
  groupMessage = defaultMessage,
  mine,
  onLongPress,
  onSelectReply,
  user = { _id: "" },
  onImagePress,
}) {
  return (
    <TouchableWithoutFeedback onLongPress={onSelectReply}>
      <>
        <View
          style={[
            styles.message,
            mine ? styles.myMessageContainer : styles.notMyMessageContainer,
          ]}
        >
          {/* {groupMessage.reply.message || groupMessage.reply.media ? (
          <ActiveChatReply
            style={{
              minWidth: "20%",
              maxWidth: "50%",
            }}
            media={groupMessage.reply.media}
            message={groupMessage.reply.message}
            creator={
              groupMessage.reply.createdBy == user._id ? "You" : recipient.name
            }
            show={false}
          />
        ) : null} */}
          <AppImage
            onPress={onImagePress}
            imageUrl={groupMessage.createdBy.picture}
            style={
              user._id == groupMessage.createdBy._id
                ? styles.imageMine
                : styles.imageNotMine
            }
            subStyle={
              user._id == groupMessage.createdBy._id
                ? styles.imageSubMine
                : styles.imageSubNotMine
            }
          />
          <View
            style={[
              styles.cloud,
              mine ? styles.myMessage : styles.notMyMessage,
              {
                paddingHorizontal: groupMessage.media ? 0 : scale(10),
                paddingVertical: groupMessage.media ? 0 : scale(6),
              },
            ]}
          >
            {groupMessage.media ? (
              <ActiveChatImage
                containerStyle={
                  {
                    // borderTopLeftRadius: mine ? scale(15) : 0,
                    // borderTopRightRadius: mine ? 0 : scale(15),
                  }
                }
                mine={mine}
                onLongPress={onSelectReply}
                uri={groupMessage.media}
              />
            ) : (
              <Autolink
                showAlert={true}
                text={groupMessage.message}
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
        </View>
      </>
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
  imageMine: {
    borderWidth: scale(2),
    borderColor: defaultStyles.colors.yellow_Variant,
    height: scale(22),
    width: scale(22),
    borderRadius: scale(5),
  },
  imageNotMine: {
    height: scale(20),
    width: scale(20),
    borderRadius: scale(10),
  },
  imageSubMine: {
    height: scale(20),
    width: scale(20),
    borderRadius: scale(4),
  },
  imageSubNotMine: {
    height: scale(20),
    width: scale(20),
    borderRadius: scale(10),
  },
  message: {
    marginVertical: scale(5),
    overflow: "hidden",
    width: "100%",
    paddingLeft: scale(15),
    flexDirection: "row",
    // backgroundColor: "blue",
  },
  myMessageContainer: {
    alignItems: "flex-start",
    paddingRight: scale(20),
    flexDirection: "row-reverse",
  },
  notMyMessageContainer: {
    alignItems: "flex-start",
  },
  myMessage: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    marginRight: scale(5),
  },
  notMyMessage: {
    backgroundColor: defaultStyles.colors.secondary,
    marginLeft: scale(5),
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

export default memo(GroupChatBubble);

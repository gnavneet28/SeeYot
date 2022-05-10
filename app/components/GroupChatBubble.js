import React, { memo } from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import Autolink from "react-native-autolink";

import ActiveChatImage from "./ActiveChatImage";
import AppImage from "../components/AppImage";

import defaultStyles from "../config/styles";

import GroupChatReplyBubble from "./GroupChatReplyBubble";

import defaultProps from "../utilities/defaultProps";

function GroupChatBubble({
  groupMessage = defaultProps.defaultGroupChatMessage,
  mine,
  onSelectReply,
  user = { _id: "" },
  onImagePress,
  onImageLongPress = () => {},
}) {
  return (
    <TouchableWithoutFeedback onLongPress={onSelectReply}>
      <>
        <View
          style={[
            styles.mainContainer,
            mine ? styles.myMessageContainer : styles.notMyMessageContainer,
          ]}
        >
          {groupMessage.reply.message || groupMessage.reply.media ? (
            <GroupChatReplyBubble
              style={{
                minWidth: "20%",
                maxWidth: "50%",
                alignSelf: mine ? "flex-end" : "flex-start",
                borderBottomRightRadius: !mine ? scale(8) : scale(3),
                borderBottomLeftRadius: !mine ? scale(3) : scale(8),
                marginBottom: scale(2),
              }}
              media={groupMessage.reply.media}
              message={groupMessage.reply.message}
              creator={
                groupMessage.reply.createdBy._id == user._id
                  ? "You"
                  : groupMessage.reply.createdBy.name
              }
              show={false}
            />
          ) : null}
          <View
            style={[
              styles.message,
              mine
                ? { flexDirection: "row-reverse" }
                : { flexDirection: "row" },
            ]}
          >
            <AppImage
              delayLongPress={200}
              onLongPress={onImageLongPress}
              onPress={onImagePress}
              imageUrl={groupMessage.createdBy.picture}
              style={styles.image}
              subStyle={styles.image}
            />
            <View
              style={[
                styles.cloud,
                mine ? styles.myMessage : styles.notMyMessage,
                {
                  paddingHorizontal: groupMessage.media ? 0 : scale(10),
                  paddingVertical: groupMessage.media ? 0 : scale(6),
                  borderTopLeftRadius: mine ? scale(10) : scale(3),
                  borderTopRightRadius: mine ? scale(3) : scale(10),
                },
              ]}
            >
              {groupMessage.media ? (
                <ActiveChatImage
                  containerStyle={{
                    height: defaultStyles.width * 0.5,
                    width: defaultStyles.width * 0.5,
                  }}
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
                    onLongPress: onSelectReply,
                  }}
                  email={true}
                  phone="sms"
                />
              )}
            </View>
          </View>
        </View>
      </>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  cloud: {
    borderRadius: scale(10),
    maxWidth: moderateScale(250, 2),
    overflow: "hidden",
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
  },
  image: {
    borderRadius: scale(10),
    height: scale(20),
    width: scale(20),
  },
  imageSub: {
    borderRadius: scale(4),
    height: scale(20),
    width: scale(20),
  },
  mainContainer: {
    justifyContent: "center",
    marginVertical: scale(5),
    overflow: "hidden",
  },
  message: {
    alignItems: "flex-start",
    flexDirection: "row",
    overflow: "hidden",
    width: "100%",
  },
  myMessageContainer: {
    paddingRight: scale(15),
  },
  notMyMessageContainer: {
    paddingLeft: scale(15),
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

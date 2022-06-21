import React, { memo, useContext } from "react";
import { View, TouchableOpacity } from "react-native";
import { scale, ScaledSheet } from "react-native-size-matters";
import AntDesign from "../../node_modules/react-native-vector-icons/AntDesign";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import defaultStyles from "../config/styles";

import AppText from "./AppText";
import DeleteAction from "./DeleteAction";

let defaultPost = {
  _id: "",
  text: "This is my very first post. Please let me know what do you think about it.This is my very first post. Please let me know what do you think about it. This is my very first post. Please let me know what do you think about it.",
  createdAt: new Date().toString(),
};

const FavoritePostCard = ({
  post = defaultPost,
  onPress = () => {},
  showMoreOptions = false,
  onMoreOptionsPress = () => {},
  showReplyOption = true,
  showActionButton = true,
  deleting,
  onDelete = () => {},
  showDeleteOption,
}) => {
  dayjs.extend(relativeTime);
  const raiseOnPressAction = () => {
    onPress(post);
  };

  const raiseMoreOptionsPressAction = () => {
    onMoreOptionsPress(post);
  };

  const raiseDeleteAction = () => {
    onDelete(post);
  };
  return (
    <View style={styles.container}>
      <View style={styles.postHeader}>
        <AntDesign
          style={styles.icon}
          name="star"
          size={scale(25)}
          color={defaultStyles.colors.yellow_Variant}
        />
        <View style={styles.postContentContainer}>
          <AppText numberOfLines={10} style={styles.postText}>
            {post.text}
          </AppText>
          <AppText style={styles.postDate}>
            {dayjs(post.createdAt).fromNow()}
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
        {showDeleteOption === true ? (
          <DeleteAction
            onPress={raiseDeleteAction}
            apiAction={true}
            style={styles.deleteIcon}
            processing={post._id == deleting}
          />
        ) : null}
      </View>
      {showActionButton ? (
        <AppText style={styles.replyButton} onPress={raiseOnPressAction}>
          {showReplyOption ? "Reply anonymously" : "See Replies"}
        </AppText>
      ) : null}
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
    borderRadius: "10@s",
    elevation: 2,
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
    fontSize: "13.5@s",
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
  deleteIcon: {
    marginTop: "5@s",
  },
});

export default memo(FavoritePostCard);

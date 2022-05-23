import React, { memo } from "react";
import { View, Modal, Text, Image, TouchableOpacity } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import AntDesign from "../../node_modules/react-native-vector-icons/AntDesign";
import Feather from "../../node_modules/react-native-vector-icons/Feather";

import AppText from "./AppText";
import Backdrop from "./Backdrop";

import defaultStyles from "../config/styles";
import useAuth from "../auth/useAuth";

const modalHeaderColor = defaultStyles.colors.secondary_Variant;

function GroupReplyModal({
  visible = false,
  data = {
    groupName: "",
    messageMedia: "",
    messageText: "",
    replyMedia: "",
    replyText: "",
    groupPassword: "",
  },
  createdBy = { _id: "", name: "", picture: "" },
  onClose,
  onVisitGroup = () => {},
  onSendThoughtPress = () => {},
}) {
  const { user } = useAuth();
  const onGroupNamePress = () => {
    onVisitGroup(data.groupName, data.groupPassword);
  };
  return (
    <Modal
      animationType="slide"
      transparent
      onRequestClose={onClose}
      visible={visible}
    >
      <View style={styles.container}>
        <Backdrop onPress={onClose} />
        <View style={styles.closeMessageIconContainer}>
          <AntDesign
            onPress={onClose}
            name="downcircle"
            color={defaultStyles.colors.white}
            size={scale(28)}
          />
        </View>
        <View style={styles.mainContainer}>
          <AppText style={styles.title}>Reply</AppText>
          <AppText
            numberOfLines={2}
            onPress={onGroupNamePress}
            style={styles.groupName}
          >
            Group : {data.groupName}
          </AppText>
          <View style={styles.contentContainer}>
            <View style={styles.messageCreatorDetailsContainer}>
              <Image
                style={styles.messageCreatorPicture}
                source={{ uri: user.picture ? user.picture : "user" }}
              />
              <View style={styles.messageDetails}>
                <AppText numberOfLines={1} style={styles.messageCreatorName}>
                  {user.name}
                </AppText>
                {data.messageText ? (
                  <AppText style={styles.messageText}>
                    {data.messageText}
                  </AppText>
                ) : (
                  <View style={styles.mediaContainer}>
                    <Image
                      style={styles.messageMedia}
                      source={{ uri: data.messageMedia }}
                    />
                  </View>
                )}
              </View>
            </View>

            <View style={styles.replyCreatorDetailsContainer}>
              <Image
                style={styles.messageCreatorPicture}
                source={{ uri: createdBy.picture ? createdBy.picture : "user" }}
              />
              <View style={styles.messageDetails}>
                <AppText numberOfLines={1} style={styles.messageCreatorName}>
                  {createdBy.name}
                </AppText>
                {data.replyText ? (
                  <AppText style={styles.messageText}>{data.replyText}</AppText>
                ) : (
                  <View style={styles.mediaContainer}>
                    <Image
                      style={styles.messageMedia}
                      source={{ uri: data.replyMedia }}
                    />
                  </View>
                )}
              </View>
              <TouchableOpacity
                onPress={() => onSendThoughtPress(createdBy)}
                style={styles.contactsActionConatiner}
              >
                <Feather
                  onPress={() => onSendThoughtPress(createdBy)}
                  color={defaultStyles.colors.secondary}
                  name="send"
                  size={scale(16)}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
const styles = ScaledSheet.create({
  closeMessageIconContainer: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: modalHeaderColor,
    borderRadius: "25@s",
    bottom: "-25@s",
    height: "40@s",
    justifyContent: "center",
    padding: "5@s",
    width: "40@s",
    zIndex: 222,
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
    width: "100%",
  },
  contactsActionConatiner: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "8@s",
    elevation: 1,
    height: "30@s",
    justifyContent: "center",
    marginHorizontal: "5@s",
    overflow: "hidden",
    width: "30@s",
  },
  contentContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    paddingTop: "10@s",
    width: "100%",
  },
  groupName: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "15@s",
    fontSize: "13@s",
    marginBottom: "5@s",
    maxWidth: "90%",
    paddingHorizontal: "10@s",
  },
  mainContainer: {
    alignItems: "center",
    backgroundColor: modalHeaderColor,
    borderRadius: "5@s",
    borderTopLeftRadius: "10@s",
    borderTopRightRadius: "10@s",
    justifyContent: "center",
    overflow: "hidden",
    paddingTop: "20@s",
    width: "100%",
  },
  messageCreatorDetailsContainer: {
    flexDirection: "row",
    paddingHorizontal: "10@s",
    paddingVertical: "5@s",
    width: "100%",
  },
  replyCreatorDetailsContainer: {
    flexDirection: "row",
    paddingHorizontal: "10@s",
    paddingLeft: "40@s",
    paddingVertical: "5@s",
    width: "100%",
  },
  messageDetails: {
    alignItems: "flex-start",
    flexShrink: 1,
    paddingHorizontal: "5@s",
    width: "100%",
  },
  messageCreatorPicture: {
    borderRadius: "10@s",
    height: "20@s",
    width: "20@s",
  },
  messageText: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "10@s",
    fontSize: "12@s",
    paddingHorizontal: "5@s",
  },
  messageCreatorName: {
    backgroundColor: defaultStyles.colors.secondary_Variant,
    borderRadius: "10@s",
    color: defaultStyles.colors.white,
    fontSize: "12@s",
    marginBottom: "5@s",
    paddingHorizontal: "5@s",
    textAlign: "left",
  },
  messageMedia: {
    borderRadius: "20@s",
    height: "100@s",
    width: "100@s",
  },
  mediaContainer: {
    borderRadius: "5@s",
    overflow: "hidden",
  },
  title: {
    backgroundColor: modalHeaderColor,
    color: defaultStyles.colors.white,
    textAlign: "center",
    width: "100%",
  },
});

export default memo(GroupReplyModal);

import React, { memo, useMemo } from "react";
import { View, Modal } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import * as Animatable from "react-native-animatable";

import Option from "./Option";
import ApiOption from "./ApiOption";

import defaultStyles from "../config/styles";
import defaultProps from "../utilities/defaultProps";

import AppImage from "./AppImage";
import AppText from "./AppText";

function GroupChatUserOptions({
  handleCloseModal,
  isVisible,
  group = defaultProps.defaultGroup,
  user = { _id: "", blocked: [] },
  onAddEchoPress,
  onSendThoughtsPress,
  onBlockFromGroupPress,
  onBlockFromPersonalAccountPress,
  onReportUserPress,
  blockingFromGroup,
  blockingPersonally,
  interestedUser = { name: "", picture: "", _id: "" },
}) {
  let blockedFromGroup = useMemo(() => {
    return group.blocked.filter((b) => b._id == interestedUser._id).length;
  }, [group]);

  let blockedPersonally = useMemo(() => {
    return user.blocked.filter((b) => b._id == interestedUser._id).length;
  }, [group, user]);

  return (
    <Modal
      animationType="none"
      onRequestClose={handleCloseModal}
      transparent={true}
      visible={isVisible}
    >
      <View style={[styles.groupOptionMainContainer]}>
        <Animatable.View
          useNativeDriver={true}
          animation="pulse"
          style={styles.optionsContainer}
        >
          <Option
            onPress={handleCloseModal}
            title="Close"
            titleStyle={styles.optionClose}
          />

          <View style={styles.userInfoContainer}>
            <AppImage
              imageUrl={interestedUser.picture}
              style={styles.image}
              subStyle={styles.image}
            />
            <AppText style={styles.userName}>{interestedUser.name}</AppText>
          </View>

          <ApiOption onPress={onAddEchoPress} title="Add Echo" />
          <ApiOption onPress={onSendThoughtsPress} title="Send Thoughts" />
          {!blockedFromGroup && interestedUser._id != user._id ? (
            <ApiOption
              processing={blockingFromGroup}
              onPress={onBlockFromGroupPress}
              title="Block from Group"
            />
          ) : null}
          {!blockedPersonally && interestedUser._id != user._id ? (
            <ApiOption
              processing={blockingPersonally}
              onPress={onBlockFromPersonalAccountPress}
              title="Block from Personal account"
            />
          ) : null}
          {interestedUser._id != user._id ? (
            <ApiOption onPress={onReportUserPress} title="Report profile" />
          ) : null}
        </Animatable.View>
      </View>
    </Modal>
  );
}
const styles = ScaledSheet.create({
  groupOptionMainContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  optionsContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.dark_Variant,
    borderRadius: "15@s",
    borderWidth: 1,
    overflow: "hidden",
    width: "60%",
  },
  optionClose: {
    ...defaultStyles.closeIcon,
  },
  userInfoContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    justifyContent: "center",
    marginVertical: "5@s",
    padding: "5@s",
    width: "100%",
  },
  image: {
    borderRadius: "18@s",
    height: "35@s",
    width: "35@s",
  },
  userName: {
    color: defaultStyles.colors.blue,
    marginTop: "5@s",
    textAlign: "center",
  },
});

export default memo(GroupChatUserOptions);

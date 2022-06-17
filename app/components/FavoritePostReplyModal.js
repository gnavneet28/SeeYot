import React, { memo, useContext, useState } from "react";
import {
  View,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AntDesign from "../../node_modules/react-native-vector-icons/AntDesign";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppText from "./AppText";
import Backdrop from "./Backdrop";
import ApiProcessingContainer from "./ApiProcessingContainer";
import Icon from "./Icon";

import defaultStyles from "../config/styles";

const modalHeaderColor = defaultStyles.colors.secondary_Variant;

function FavoritePostReplyModal({
  isVisible,
  reply,
  sendingReply,
  setReply,
  handleCloseMessage,
  handleMessageReply,
  interestedPost = { text: "" },
}) {
  dayjs.extend(relativeTime);
  const [height, setHeight] = useState(0);

  const doNull = () => {};

  return (
    <Modal
      visible={isVisible}
      onRequestClose={sendingReply ? doNull : handleCloseMessage}
      transparent
      animationType="slide"
    >
      <View style={styles.messageBackground}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollView}
        >
          <Backdrop onPress={sendingReply ? doNull : handleCloseMessage} />
          <View style={styles.closeMessageIconContainer}>
            <AntDesign
              onPress={sendingReply ? doNull : handleCloseMessage}
              name="downcircle"
              color={defaultStyles.colors.white}
              size={scale(28)}
            />
          </View>
          <View style={styles.messageMainContainer}>
            <AppText style={styles.favoriteMessaggingTitle}>Reply</AppText>
            <View style={styles.contentContainer}>
              <AppText numberOfLines={2} style={styles.interestedPostText}>
                {interestedPost.text}
              </AppText>
              <View style={styles.inputContainer}>
                <TextInput
                  multiline={true}
                  editable={!sendingReply}
                  maxLength={250}
                  onChangeText={setReply}
                  placeholder="Reply anonymously"
                  onContentSizeChange={(event) =>
                    setHeight(event.nativeEvent.contentSize.height)
                  }
                  style={[
                    styles.inputBox,
                    { height: Math.min(100, Math.max(40, height)) },
                  ]}
                  value={reply}
                />
                <TouchableOpacity
                  disabled={reply.replace(/\s/g, "").length >= 1 ? false : true}
                  onPress={sendingReply ? doNull : handleMessageReply}
                  style={styles.send}
                >
                  <ApiProcessingContainer processing={sendingReply}>
                    <Icon
                      color={
                        reply.replace(/\s/g, "").length >= 1 && !sendingReply
                          ? defaultStyles.colors.secondary
                          : defaultStyles.colors.lightGrey
                      }
                      icon="MaterialIcons"
                      name="send"
                      size={scale(28)}
                    />
                  </ApiProcessingContainer>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
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
  contentContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    width: "100%",
    paddingTop: "10@s",
  },
  favoriteMessaggingTitle: {
    backgroundColor: modalHeaderColor,
    color: defaultStyles.colors.white,
    marginBottom: "5@s",
    textAlign: "center",
    width: "100%",
  },
  inputContainer: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "30@s",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "15@s",
    minHeight: "38@s",
    width: "90%",
  },
  inputBox: {
    borderRadius: "30@s",
    flex: 1,
    fontFamily: "ComicNeue-Bold",
    fontSize: "14@s",
    fontWeight: "normal",
    height: "100%",
    marginRight: "5@s",
    paddingHorizontal: "10@s",
    paddingLeft: "15@s",
    paddingVertical: "8@s",
    width: "86%",
  },
  interestedPostText: {
    borderLeftColor: defaultStyles.colors.yellow_Variant,
    borderLeftWidth: 2,
    marginBottom: "10@s",
    paddingLeft: "10@s",
    textAlign: "left",
    width: "90%",
  },
  messageBackground: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
  },
  messageMainContainer: {
    alignItems: "center",
    backgroundColor: modalHeaderColor,
    borderTopLeftRadius: "10@s",
    borderTopRightRadius: "10@s",
    overflow: "hidden",
    paddingTop: "20@s",
    width: "100%",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  send: {
    alignItems: "center",
    height: "40@s",
    justifyContent: "center",
    marginRight: "5@s",
    width: "40@s",
  },
});

export default memo(FavoritePostReplyModal);

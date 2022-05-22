import React, { memo, useContext, useState } from "react";
import {
  View,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AntDesign from "../../node_modules/react-native-vector-icons/AntDesign";
import Feather from "../../node_modules/react-native-vector-icons/Feather";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppImage from "./AppImage";
import AppText from "./AppText";
import Backdrop from "./Backdrop";
import ReplyOption from "./ReplyOption";
import ApiProcessingContainer from "./ApiProcessingContainer";
import Icon from "./Icon";

import ActiveForContext from "../utilities/activeForContext";

import defaultStyles from "../config/styles";
import FavoritesReplyCard from "./FavoritesReplyCard";

const modalHeaderColor = defaultStyles.colors.secondary_Variant;

function FavoriteMessageReplyModal({
  isVisible,
  reply,
  sendingReply,
  setReply,
  handleCloseMessage,
  messageCreator,
  message,
  handleMessageReply,
  selectedMessageId,
  setSelectedMessageId,
  onSendThoughtPress,
  user,
}) {
  dayjs.extend(relativeTime);
  const [height, setHeight] = useState(0);

  const { activeFor } = useContext(ActiveForContext);

  let isRecipientActive = activeFor.filter((u) => u == user._id)[0];

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
            <AppText style={styles.favoriteMessaggingTitle}>
              Favorite Messaging
            </AppText>
            <View style={styles.contentContainer}>
              <View style={styles.messageCreatorDetails}>
                <AppImage
                  activeOpacity={1}
                  style={styles.image}
                  subStyle={styles.imageSub}
                  imageUrl={messageCreator.picture}
                />
                <View style={styles.messageDetailsContainer}>
                  <AppText style={styles.creatorName}>
                    {messageCreator.name}
                  </AppText>
                  <AppText style={styles.message}>{message.message}</AppText>
                  <AppText style={styles.createdAt}>
                    {dayjs(message.createdAt).fromNow()}
                  </AppText>
                </View>
                {message.replied && messageCreator.name !== "**********" ? (
                  <TouchableOpacity
                    onPress={
                      sendingReply
                        ? doNull
                        : () => onSendThoughtPress(messageCreator)
                    }
                    style={[
                      styles.contactsActionConatiner,
                      {
                        backgroundColor: !isRecipientActive
                          ? defaultStyles.colors.yellow_Variant
                          : defaultStyles.colors.green,
                      },
                    ]}
                  >
                    <Feather
                      onPress={
                        sendingReply
                          ? doNull
                          : () => onSendThoughtPress(messageCreator)
                      }
                      color={
                        !isRecipientActive
                          ? defaultStyles.colors.secondary
                          : defaultStyles.colors.white
                      }
                      name="send"
                      size={scale(16)}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>

              {message.options.length >= 1 ? (
                <View style={styles.optionContainerMain}>
                  <ScrollView keyboardShouldPersistTaps="handled">
                    <AppText style={styles.selectOption}>
                      Select a Reply
                    </AppText>
                    {message.options.map((d, index) => (
                      <ReplyOption
                        key={d._id + index.toString()}
                        selectedMessageId={selectedMessageId}
                        option={d}
                        onPress={
                          sendingReply
                            ? doNull
                            : () => setSelectedMessageId(d._id)
                        }
                      />
                    ))}
                  </ScrollView>
                </View>
              ) : null}
              {message.replies.length >= 1 ? (
                <View style={styles.optionContainerMain}>
                  <ScrollView keyboardShouldPersistTaps="handled">
                    {message.replies.map((d, index) => (
                      <FavoritesReplyCard
                        key={d._id + index.toString()}
                        user={user}
                        reply={d}
                      />
                    ))}
                  </ScrollView>
                </View>
              ) : null}

              <View style={styles.inputContainer}>
                <TextInput
                  multiline={true}
                  editable={!sendingReply}
                  maxLength={250}
                  onChangeText={setReply}
                  placeholder={
                    message.replied
                      ? "Reply again..."
                      : "Reply to know who sent this message..."
                  }
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
  contactsActionConatiner: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "8@s",
    elevation: 1,
    height: "32@s",
    justifyContent: "center",
    marginHorizontal: "5@s",
    overflow: "hidden",
    width: "32@s",
  },
  createdAt: {
    color: defaultStyles.colors.lightGrey,
    fontSize: "10@s",
  },
  creatorName: {
    color: defaultStyles.colors.primary,
    fontSize: "15@s",
  },
  contentContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    width: "100%",
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
  messageCreatorDetails: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderBottomColor: defaultStyles.colors.light,
    borderBottomWidth: 1,
    flexDirection: "row",
    marginVertical: "5@s",
    minHeight: "70@s",
    paddingHorizontal: "5@s",
    width: "95%",
  },
  messageDetailsContainer: {
    flexShrink: 1,
    padding: "5@s",
    width: "100%",
  },
  image: {
    borderColor: defaultStyles.colors.light,
    borderRadius: "22.5@s",
    borderWidth: 1,
    height: "45@s",
    marginRight: "8@s",
    width: "45@s",
  },
  imageSub: {
    borderRadius: "22@s",
    height: "44@s",
    width: "44@s",
  },
  message: {
    borderColor: defaultStyles.colors.yellow_Variant,
    borderLeftWidth: 2,
    color: defaultStyles.colors.blue,
    fontSize: "14@s",
    opacity: 0.8,
    paddingHorizontal: "10@s",
    textAlign: "left",
  },
  optionContainerMain: {
    marginVertical: "5@s",
    width: "100%",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  selectOption: {
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "20@s",
    fontSize: "13@s",
    marginBottom: "10@s",
    marginLeft: "10@s",
    paddingHorizontal: "10@s",
    textAlign: "center",
    textAlignVertical: "center",
  },
  send: {
    alignItems: "center",
    height: "40@s",
    justifyContent: "center",
    marginRight: "5@s",
    width: "40@s",
  },
});

export default memo(FavoriteMessageReplyModal);

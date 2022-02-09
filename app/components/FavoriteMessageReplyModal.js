import React, { memo } from "react";
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

import AppImage from "./AppImage";
import AppText from "./AppText";
import ReplyOption from "./ReplyOption";
import ApiProcessingContainer from "./ApiProcessingContainer";
import Icon from "./Icon";

import defaultStyles from "../config/styles";

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
  isConnected,
}) {
  dayjs.extend(relativeTime);
  return (
    <Modal
      visible={isVisible}
      onRequestClose={sendingReply ? () => null : handleCloseMessage}
      transparent
      animationType="slide"
    >
      <View style={styles.messageBackground}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-end",
          }}
        >
          <View style={styles.closeMessageIconContainer}>
            <AntDesign
              onPress={sendingReply ? null : handleCloseMessage}
              name="downcircle"
              color={defaultStyles.colors.tomato}
              size={scale(28)}
            />
          </View>
          <View style={styles.messageMainContainer}>
            <AppText style={styles.favoriteMessaggingTitle}>
              Favorite Messaging
            </AppText>
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
            </View>

            {message.options.length >= 1 ? (
              <View style={styles.optionContainerMain}>
                <ScrollView keyboardShouldPersistTaps="handled">
                  <AppText style={styles.selectOption}>Select a Reply</AppText>
                  {message.options.map((d, index) => (
                    <ReplyOption
                      key={d._id + index.toString()}
                      selectedMessageId={selectedMessageId}
                      option={d}
                      onPress={
                        sendingReply ? null : () => setSelectedMessageId(d._id)
                      }
                    />
                  ))}
                </ScrollView>
              </View>
            ) : null}

            <View style={styles.inputContainer}>
              <TextInput
                editable={!sendingReply}
                maxLength={250}
                onChangeText={setReply}
                placeholder="Reply to know who sent this message..."
                style={[
                  styles.inputBox,
                  { fontFamily: "ComicNeue-Bold", fontWeight: "normal" },
                ]}
                value={reply}
              />
              <TouchableOpacity
                disabled={
                  reply.replace(/\s/g, "").length >= 1 && isConnected
                    ? false
                    : true
                }
                onPress={
                  sendingReply || !isConnected ? null : handleMessageReply
                }
                style={styles.send}
              >
                <ApiProcessingContainer processing={sendingReply}>
                  <Icon
                    color={
                      reply.replace(/\s/g, "").length >= 1 &&
                      !sendingReply &&
                      isConnected
                        ? defaultStyles.colors.secondary
                        : defaultStyles.colors.lightGrey
                    }
                    name="send"
                    size={scale(28)}
                  />
                </ApiProcessingContainer>
              </TouchableOpacity>
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
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "25@s",
    bottom: "-25@s",
    height: "40@s",
    justifyContent: "center",
    padding: "5@s",
    width: "40@s",
    zIndex: 222,
  },
  createdAt: {
    color: defaultStyles.colors.lightGrey,
    fontSize: "10@s",
  },
  creatorName: {
    color: defaultStyles.colors.primary,
    fontSize: "15@s",
  },
  favoriteMessaggingTitle: {
    borderBottomColor: defaultStyles.colors.lightGrey,
    borderBottomWidth: 1,
    marginBottom: "10@s",
    textAlign: "center",
    width: "100%",
  },
  inputContainer: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "30@s",
    flexDirection: "row",
    height: "38@s",
    justifyContent: "space-between",
    marginVertical: "15@s",
    width: "90%",
  },
  inputBox: {
    borderRadius: "30@s",
    flex: 1,
    fontSize: "14@s",
    height: "100%",
    marginRight: "5@s",
    paddingHorizontal: "10@s",
    width: "86%",
  },
  messageBackground: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
  },
  messageMainContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderTopLeftRadius: "10@s",
    borderTopRightRadius: "10@s",
    overflow: "hidden",
    paddingTop: "25@s",
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
    flex: 1,
    padding: "5@s",
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
    color: defaultStyles.colors.secondary,
    fontSize: "14@s",
    opacity: 0.8,
    paddingHorizontal: "10@s",
    textAlign: "left",
  },
  optionContainerMain: {
    marginVertical: "5@s",
    width: "100%",
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

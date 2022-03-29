import React, { memo, useState } from "react";
import { View, ScrollView, TextInput, Modal } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import AntDesign from "../../node_modules/react-native-vector-icons/AntDesign";

import AppText from "./AppText";
import AppImage from "./AppImage";
import AppButton from "./AppButton";
import Mood from "./Mood";
import ApiProcessingContainer from "./ApiProcessingContainer";
import OptionalAnswer from "./OptionalAnswer";

import defaultStyles from "../config/styles";
import Backdrop from "./Backdrop";

const modalHeaderColor = defaultStyles.colors.secondary_Variant;

function FavoriteMessageInput({
  handleAddOptionPress,
  handleCloseMessage,
  handleRemoveOptionalAnswer,
  handleSendMessagePress,
  handleSetMood,
  isConnected,
  isVisible,
  message,
  moodData,
  optionalAnswer,
  processing,
  recipient,
  setMessage,
  textInputRef,
}) {
  const [height, setHeight] = useState(0);
  const checkSendButtonDisability = () => {
    if (!isConnected) return true;
    if (optionalAnswer.length) {
      if (
        message.textMessage.replace(/\s/g, "").length >= 1 &&
        optionalAnswer.length > 1
      ) {
        return false;
      }

      return true;
    }

    if (!optionalAnswer.length) {
      if (message.textMessage.replace(/\s/g, "").length < 1) {
        return true;
      }

      return false;
    }
  };
  return (
    <Modal
      visible={isVisible}
      onRequestClose={processing === true ? () => null : handleCloseMessage}
      transparent
      animationType="slide"
    >
      <View style={styles.messageBackground}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollView}
        >
          <Backdrop
            onPress={processing === true ? () => null : handleCloseMessage}
          />
          <View style={styles.closeMessageIconContainer}>
            <AntDesign
              onPress={processing === true ? () => null : handleCloseMessage}
              name="downcircle"
              color={defaultStyles.colors.white}
              size={scale(28)}
            />
          </View>
          <View
            style={[
              styles.messageMainContainer,
              {
                borderBottomColor:
                  checkSendButtonDisability() || processing === true
                    ? defaultStyles.colors.lightGrey
                    : defaultStyles.colors.secondary,
              },
            ]}
          >
            <AppText style={styles.favoriteMessaggingTitle}>
              Favorite Messaging
            </AppText>
            <View style={styles.contentContainer}>
              <View style={styles.inputBoxContainerMain}>
                <AppImage
                  imageUrl={recipient.picture}
                  style={styles.image}
                  subStyle={styles.imageSub}
                />
                <View style={styles.inputBoxContainer}>
                  <TextInput
                    ref={textInputRef}
                    editable={!processing}
                    placeholder="Type your message here..."
                    multiline={true}
                    value={message.textMessage}
                    maxLength={250}
                    onChangeText={(text) =>
                      setMessage({ ...message, textMessage: text })
                    }
                    onContentSizeChange={(event) =>
                      setHeight(event.nativeEvent.contentSize.height)
                    }
                    style={[
                      styles.messageInput,
                      { height: Math.min(100, Math.max(40, height)) },
                    ]}
                  />
                  <AppText style={styles.wordCount}>
                    {message.textMessage.length}/250
                  </AppText>
                </View>
              </View>
              <View style={styles.moodContainerMain}>
                <AppText style={styles.selectMood}>Select your mood</AppText>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.moodContainerSub}
                >
                  {moodData.map((d, index) => (
                    <Mood
                      key={d.mood + index.toString()}
                      mood={d.mood}
                      isSelected={message.mood === d.mood ? true : false}
                      onPress={
                        processing === true
                          ? () => null
                          : () => handleSetMood(d.mood)
                      }
                    />
                  ))}
                </ScrollView>
              </View>
              {optionalAnswer.length >= 1 ? (
                <View style={styles.optionContainerMain}>
                  <ScrollView>
                    <AppText style={styles.selectOption}>
                      Optional Replies
                    </AppText>
                    {optionalAnswer.map((d, index) => (
                      <OptionalAnswer
                        key={d + index.toString()}
                        answer={d}
                        onPress={
                          processing === true
                            ? () => null
                            : () => handleRemoveOptionalAnswer(d)
                        }
                      />
                    ))}
                  </ScrollView>
                </View>
              ) : null}
              {optionalAnswer.length < 4 ? (
                <AppButton
                  onPress={
                    processing === true ? () => null : handleAddOptionPress
                  }
                  title="Add Options"
                  style={styles.addOptions}
                  subStyle={styles.addOptionsSub}
                />
              ) : null}
              <ApiProcessingContainer
                style={[
                  styles.apiProcessingContainer,
                  {
                    backgroundColor:
                      checkSendButtonDisability() || processing === true
                        ? defaultStyles.colors.lightGrey
                        : defaultStyles.colors.secondary,
                  },
                ]}
                processing={processing}
              >
                <AppButton
                  disabled={checkSendButtonDisability() ? true : false}
                  style={[
                    styles.sendButton,
                    {
                      backgroundColor:
                        checkSendButtonDisability() || processing === true
                          ? defaultStyles.colors.lightGrey
                          : defaultStyles.colors.secondary,
                    },
                  ]}
                  title="Send"
                  onPress={
                    processing === true ? () => null : handleSendMessagePress
                  }
                />
              </ApiProcessingContainer>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
const styles = ScaledSheet.create({
  addOptions: {
    backgroundColor: defaultStyles.colors.dark_Variant,
    borderRadius: "20@s",
    height: "25@s",
    marginVertical: "10@s",
    width: "80@s",
  },
  addOptionsSub: {
    fontSize: "12@s",
  },
  apiProcessingContainer: {
    height: "40@s",
    marginTop: "10@s",
    width: "100%",
  },
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
    paddingTop: "10@s",
    width: "100%",
  },
  favoriteMessaggingTitle: {
    backgroundColor: modalHeaderColor,
    color: defaultStyles.colors.white,
    marginBottom: "5@s",
    textAlign: "center",
    width: "100%",
  },
  messageBackground: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
  },
  messageMainContainer: {
    alignItems: "center",
    backgroundColor: modalHeaderColor,
    borderBottomWidth: 2,
    borderTopLeftRadius: "10@s",
    borderTopRightRadius: "10@s",
    overflow: "hidden",
    paddingTop: "20@s",
    width: "100%",
  },
  inputBoxContainerMain: {
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  inputBoxContainer: {
    alignItems: "center",
    flexShrink: 1,
    width: "100%",
  },
  image: {
    alignSelf: "flex-start",
    borderRadius: "19@s",
    height: "38@s",
    marginLeft: "15@s",
    width: "38@s",
  },
  imageSub: {
    borderRadius: "19@s",
    height: "38@s",
    width: "38@s",
  },
  messageInput: {
    borderColor: defaultStyles.colors.light,
    borderRadius: "5@s",
    borderWidth: 1,
    fontFamily: "ComicNeue-Bold",
    fontSize: "14@s",
    fontWeight: "normal",
    padding: "5@s",
    paddingHorizontal: "10@s",
    textAlignVertical: "top",
    width: "94%",
  },
  moodContainerMain: {
    alignItems: "center",
    flexDirection: "row",
    height: "50@s",
    marginVertical: "5@s",
    width: "100%",
  },
  moodContainerSub: {
    alignItems: "center",
    height: "50@s",
  },
  optionContainerMain: {
    marginVertical: "5@s",
    width: "100%",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  selectMood: {
    backgroundColor: defaultStyles.colors.light,
    borderTopLeftRadius: "5@s",
    borderBottomLeftRadius: "5@s",
    color: defaultStyles.colors.dark,
    fontSize: "12@s",
    height: "35@s",
    marginLeft: "5@s",
    paddingHorizontal: "10@s",
    textAlign: "center",
    textAlignVertical: "center",
  },
  selectOption: {
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "20@s",
    fontSize: "13@s",
    height: "32@s",
    marginBottom: "10@s",
    marginLeft: "10@s",
    paddingHorizontal: "15@s",
    textAlign: "center",
    textAlignVertical: "center",
  },
  sendButton: {
    borderRadius: 0,
    height: "40@s",
  },
  wordCount: {
    fontSize: "12@s",
    textAlign: "right",
    width: "94%",
  },
});

export default memo(FavoriteMessageInput);

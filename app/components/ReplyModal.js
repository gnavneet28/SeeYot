import React from "react";
import { View, Modal, ScrollView } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import AntDesign from "../../node_modules/react-native-vector-icons/AntDesign";

import ReplyCardSub from "../components/ReplyCardSub";
import ReplyOption from "../components/ReplyOption";
import AppText from "./AppText";

import defaultStyles from "../config/styles";

import defaultProps from "../utilities/defaultProps";
import Backdrop from "./Backdrop";

const defaultMessage = {
  message: defaultProps.defaultMessage,
  isVisible: false,
};

const modalHeaderColor = defaultStyles.colors.secondary_Variant;

function ReplyModal({ message = defaultMessage, handleCloseModal }) {
  return (
    <Modal
      animationType="slide"
      onRequestClose={handleCloseModal}
      transparent
      visible={message.isVisible}
    >
      <View style={styles.messageBackground}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollView}
        >
          <Backdrop onPress={handleCloseModal} />
          <View style={styles.closeMessageIconContainer}>
            <AntDesign
              onPress={handleCloseModal}
              name="downcircle"
              color={defaultStyles.colors.white}
              size={scale(28)}
            />
          </View>
          <View style={styles.messageMainContainer}>
            <AppText style={styles.replyModalTitle}>Replies</AppText>

            <View style={styles.contentContainer}>
              <AppText style={styles.modalMessage}>
                {message.message.message}
              </AppText>

              {message.message.options.length >= 1 ? (
                <View style={styles.optionContainerMain}>
                  <ScrollView keyboardShouldPersistTaps="handled">
                    {message.message.options.map((d, index) => (
                      <ReplyOption
                        key={d._id + index.toString()}
                        selectedMessageId={
                          message.message.options.filter(
                            (m) => m.selected == true
                          )[0]
                            ? message.message.options.filter(
                                (m) => m.selected == true
                              )[0]._id
                            : ""
                        }
                        option={d}
                      />
                    ))}
                  </ScrollView>
                </View>
              ) : null}
              {message.message.reply.map((r) => (
                <ReplyCardSub key={r._id} reply={r} message={message.message} />
              ))}
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
    paddingTop: "10@s",
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
    borderTopLeftRadius: "10@s",
    borderTopRightRadius: "10@s",
    overflow: "hidden",
    paddingTop: "20@s",
    width: "100%",
  },
  modalMessage: {
    borderLeftColor: defaultStyles.colors.yellow_Variant,
    borderLeftWidth: 2,
    color: defaultStyles.colors.blue,
    fontSize: "14@s",
    marginBottom: "20@s",
    maxWidth: "80%",
    paddingHorizontal: "10@s",
    textAlign: "left",
  },
  optionContainerMain: {
    marginVertical: "5@s",
    width: "100%",
  },
  replyModalTitle: {
    backgroundColor: modalHeaderColor,
    color: defaultStyles.colors.white,
    marginBottom: "5@s",
    textAlign: "center",
    width: "100%",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
});

export default ReplyModal;

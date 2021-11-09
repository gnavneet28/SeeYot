import React from "react";
import { View, StyleSheet, Modal, ScrollView } from "react-native";

import ReplyCardSub from "../components/ReplyCardSub";
import ReplyOption from "../components/ReplyOption";
import AppText from "./AppText";

import defaultStyles from "../config/styles";

import defaultProps from "../utilities/defaultProps";

const defaultMessage = {
  message: defaultProps.defaultMessage,
  isVisible: false,
};

function ReplyModal({ message = defaultMessage, handleCloseModal }) {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={message.isVisible}
      onRequestClose={handleCloseModal}
    >
      <View style={styles.messageBackground}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-end",
          }}
        >
          <View style={styles.messageMainContainer}>
            <AppText onPress={handleCloseModal} style={styles.closeMessage}>
              Close
            </AppText>
            <AppText style={styles.modalMessage}>
              {message.message.message}
            </AppText>
            <AppText style={styles.repliesHeading}>Replies</AppText>

            {message.message.options.length >= 1 ? (
              <View style={styles.optionContainerMain}>
                <ScrollView>
                  {message.message.options.map((d, index) => (
                    <ReplyOption
                      key={d._id + index.toString()}
                      selectedMessageId={
                        message.message.options.filter(
                          (m) => m.selected == true
                        )[0]._id
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
        </ScrollView>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  closeMessage: {
    color: defaultStyles.colors.danger,
    marginBottom: 15,
    marginTop: 5,
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
    backgroundColor: defaultStyles.colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    width: "100%",
  },
  modalMessage: {
    borderLeftColor: defaultStyles.colors.yellow_Variant,
    borderLeftWidth: 2,
    color: defaultStyles.colors.blue,
    marginBottom: 10,
    maxWidth: "80%",
    paddingHorizontal: 10,
    textAlign: "left",
  },
  optionContainerMain: {
    marginVertical: 5,
    width: "100%",
  },
  repliesHeading: {
    alignSelf: "center",
    borderBottomColor: defaultStyles.colors.light,
    borderBottomWidth: 1,
    color: defaultStyles.colors.dark_Variant,
    fontSize: 14,
    height: 35,
    marginBottom: 10,
    marginLeft: 10,
    paddingHorizontal: 20,
    textAlign: "center",
    textAlignVertical: "center",
    width: "70%",
  },
});

export default ReplyModal;

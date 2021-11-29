import React from "react";
import { View, Modal, ScrollView } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import AntDesign from "react-native-vector-icons/AntDesign";

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
      animationType="slide"
      onRequestClose={handleCloseModal}
      transparent
      visible={message.isVisible}
    >
      <View style={styles.messageBackground}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-end",
          }}
        >
          <View style={styles.closeMessageIconContainer}>
            <AntDesign
              onPress={handleCloseModal}
              name="downcircle"
              color={defaultStyles.colors.tomato}
              size={scale(28)}
            />
          </View>
          <View style={styles.messageMainContainer}>
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
  modalMessage: {
    borderLeftColor: defaultStyles.colors.yellow_Variant,
    borderLeftWidth: 2,
    color: defaultStyles.colors.blue,
    marginBottom: "10@s",
    maxWidth: "80%",
    paddingHorizontal: "10@s",
    textAlign: "left",
  },
  optionContainerMain: {
    marginVertical: "5@s",
    width: "100%",
  },
  repliesHeading: {
    alignSelf: "center",
    borderBottomColor: defaultStyles.colors.light,
    borderBottomWidth: 1,
    color: defaultStyles.colors.dark_Variant,
    fontSize: "14@s",
    height: "35@s",
    marginBottom: "10@s",
    marginLeft: "10@s",
    paddingHorizontal: "20@s",
    textAlign: "center",
    textAlignVertical: "center",
    width: "70%",
  },
});

export default ReplyModal;

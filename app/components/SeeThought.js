import React, { memo } from "react";
import { View, Modal, Text } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import AntDesign from "../../node_modules/react-native-vector-icons/AntDesign";

import defaultStyles from "../config/styles";
import AppText from "./AppText";
import Backdrop from "./Backdrop";

const modalHeaderColor = defaultStyles.colors.secondary_Variant;

function SeeThought({
  visible = false,
  thought = { message: "", hint: "" },
  onClose,
}) {
  return (
    <Modal
      animationType="fade"
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
          <AppText style={styles.title}>Thought</AppText>
          <View style={styles.contentContainer}>
            <AppText style={styles.message}>
              {thought.message
                ? thought.message
                : "Please subscribe to SeeYot Vip to see thoughts without being matched."}
            </AppText>

            <AppText style={styles.hint}>
              <Text style={{ color: defaultStyles.colors.blue }}>Hint:</Text>{" "}
              {thought.hint ? thought.hint : "No hints were provided!"}
            </AppText>
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
    backgroundColor: "rgba(0,0,0,0.7)",
    flex: 1,
    justifyContent: "space-between",
    width: "100%",
  },
  contentContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    paddingTop: "10@s",
    width: "100%",
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
  message: {
    color: defaultStyles.colors.dark_Variant,
    marginBottom: "15@s",
    textAlign: "center",
    width: "80%",
  },
  hint: {
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "10@s",
    color: defaultStyles.colors.dark_Variant,
    marginBottom: "15@s",
    maxWidth: "80%",
    paddingHorizontal: "10@s",
    textAlign: "center",
  },
  title: {
    backgroundColor: modalHeaderColor,
    color: defaultStyles.colors.white,
    marginBottom: "5@s",
    textAlign: "center",
    width: "100%",
  },
});

export default memo(SeeThought);

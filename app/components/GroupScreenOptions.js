import React, { memo } from "react";
import { View, Modal } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import * as Animatable from "react-native-animatable";

import Option from "./Option";
import ApiOption from "./ApiOption";

import defaultStyles from "../config/styles";

function GroupScreenOptions({
  handleCloseModal,
  isVisible,
  onDeletePress,
  onReportPress,
  user,
  group,
  deletingGroup,
  inHistory,
  removingFromHistory,
  onRemovePress,
}) {
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

          {group.createdBy._id == user._id ? (
            <ApiOption
              processing={deletingGroup}
              onPress={onDeletePress}
              title="Delete this Group"
            />
          ) : null}

          {inHistory ? (
            <ApiOption
              processing={removingFromHistory}
              onPress={onRemovePress}
              title="Remove from History"
            />
          ) : null}

          {group.createdBy._id != user._id ? (
            <ApiOption onPress={onReportPress} title="Report this Group" />
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
    borderRadius: "20@s",
    borderWidth: 1,
    overflow: "hidden",
    width: "60%",
  },
  optionClose: {
    backgroundColor: defaultStyles.colors.dark_Variant,
    color: defaultStyles.colors.white,
    opacity: 1,
  },
});

export default memo(GroupScreenOptions);

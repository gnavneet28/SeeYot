import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import AppText from "./AppText";
import DeleteAction from "./DeleteAction";
import defaultStyles from "../config/styles";

function LocalThoughtCard({ thought, onPress, onDeletePress }) {
  return (
    <View style={styles.container}>
      <View style={styles.thoughtContainer}>
        {thought.sentTo ? (
          <AppText style={styles.recipientName}>
            <AppText
              onPress={() => onPress(thought.message)}
              style={styles.thoughtRecipientTitle}
            >
              Sent To
            </AppText>{" "}
            {thought.sentTo}
          </AppText>
        ) : null}
        <AppText
          onPress={() => onPress(thought.message)}
          style={styles.message}
        >
          <AppText style={styles.thoughtMessageTitle}>Thought</AppText>{" "}
          {thought.message}
        </AppText>
      </View>
      <DeleteAction onPress={() => onDeletePress(thought)} />
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderBottomColor: defaultStyles.colors.light,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    justifyContent: "space-between",
    padding: "5@s",
    paddingHorizontal: "10@s",
    width: "100%",
  },
  message: {
    fontSize: "13@s",
  },
  recipientName: {
    fontSize: "14@s",
    paddingBottom: 0,
  },

  thoughtRecipientTitle: {
    color: defaultStyles.colors.secondary,
    fontWeight: "normal",
  },
  thoughtMessageTitle: {
    color: defaultStyles.colors.blue,
    fontWeight: "normal",
  },
  thoughtContainer: {
    flexShrink: 1,
  },
});

export default memo(LocalThoughtCard);

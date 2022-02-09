import React, { memo } from "react";
import { View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import AppText from "./AppText";
import DeleteAction from "./DeleteAction";
import defaultStyles from "../config/styles";

function LocalThoughtCard({ thought, onPress, onDeletePress }) {
  dayjs.extend(relativeTime);
  let currentDate = new Date();

  let canBeDeleted = dayjs(currentDate).diff(thought.createdAt, "minutes") < 10;

  return (
    <View style={styles.container}>
      <View style={styles.thoughtContainer}>
        {thought.sentTo ? (
          <AppText style={styles.recipientName}>
            <AppText
              onPress={() => onPress(thought.message)}
              style={styles.thoughtRecipientTitle}
            >
              Sent To :
            </AppText>{" "}
            {thought.sentTo}
          </AppText>
        ) : null}
        <AppText
          onPress={() => onPress(thought.message)}
          style={styles.message}
        >
          <AppText style={styles.thoughtMessageTitle}>Thought :</AppText>{" "}
          {thought.message}
        </AppText>
      </View>
      <DeleteAction
        style={{
          backgroundColor: canBeDeleted
            ? defaultStyles.colors.yellow_Variant
            : defaultStyles.colors.light,
        }}
        onPress={() => onDeletePress(thought)}
      />
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
    color: defaultStyles.colors.dark_Variant,
    fontWeight: "normal",
  },
  thoughtMessageTitle: {
    color: defaultStyles.colors.dark_Variant,
    fontWeight: "normal",
  },
  thoughtContainer: {
    flexShrink: 1,
  },
});

export default memo(LocalThoughtCard);

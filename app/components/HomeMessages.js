import React, { memo } from "react";
import { View, ScrollView } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ScaledSheet } from "react-native-size-matters";

import Message from "./Message";

import defaultStyles from "../config/styles";

function HomeMessages({ messages = [], onMessagePress }) {
  dayjs.extend(relativeTime);
  return (
    <View style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.contentContainerStyle}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {messages
          .sort((a, b) => a.createdAt < b.createdAt)
          .filter(
            (m) => dayjs(new Date()).diff(dayjs(m.createdAt), "hours") <= 24
          )
          .map((m) => (
            <Message
              seen={m.seen}
              key={m._id}
              mood={m.mood}
              onPress={() => onMessagePress(m)}
            />
          ))}
      </ScrollView>
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    borderBottomWidth: 0.5,
    borderColor: defaultStyles.colors.light,
    height: "65@s",
    paddingLeft: "10@s",
    width: "100%",
  },
  contentContainerStyle: {
    alignItems: "center",
  },
});

export default memo(HomeMessages);

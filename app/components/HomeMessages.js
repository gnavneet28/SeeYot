import React, { memo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Message from "./Message";

import defaultStyles from "../config/styles";

function HomeMessages({ messages = [], onMessagePress }) {
  dayjs.extend(relativeTime);
  return (
    <View style={styles.container}>
      <ScrollView
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
const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.5,
    borderColor: defaultStyles.colors.light,
    height: 80,
    marginBottom: 5,
    paddingLeft: 10,
    width: "100%",
  },
  contentContainerStyle: {
    alignItems: "center",
  },
});

export default memo(HomeMessages);

import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import AddFavoritesButton from "./AddFavoritesButton";
import Message from "./Message";

import defaultStyles from "../config/styles";

function HomeMessages({ onPress, messages = [], onMessagePress }) {
  dayjs.extend(relativeTime);
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainerStyle}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <AddFavoritesButton onPress={onPress} />
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
    borderBottomWidth: 1,
    borderColor: defaultStyles.colors.light,
    borderRadius: 5,
    height: 80,
    marginBottom: 5,
    paddingLeft: 5,
    width: "100%",
  },
  contentContainerStyle: {
    alignItems: "center",
  },
});

export default HomeMessages;

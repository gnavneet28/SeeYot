import React, { useCallback, memo } from "react";
import { View, FlatList } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Message from "./Message";
import defaultStyles from "../config/styles";

function HomeMessagesList({ messages = [], onMessagePress, style }) {
  dayjs.extend(relativeTime);
  const renderItem = useCallback(
    ({ item }) => {
      return (
        <Message
          seen={item.seen}
          key={item._id}
          mood={item.mood}
          onPress={() => onMessagePress(item)}
        />
      );
    },
    [messages]
  );

  const keyExtractor = useCallback((item) => item._id, []);

  const getItemLayout = useCallback(
    (data, index) => ({
      length: scale(50),
      offset: scale(50) * index,
      index,
    }),
    []
  );

  return (
    <View style={[styles.container, style]}>
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={messages
          .sort((a, b) => a.createdAt < b.createdAt)
          .filter(
            (m) => dayjs(new Date()).diff(dayjs(m.createdAt), "hours") <= 24
          )}
        getItemLayout={getItemLayout}
        horizontal={true}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
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

export default memo(HomeMessagesList);

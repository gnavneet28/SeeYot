import React, { useCallback, memo, useMemo } from "react";
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
          message={item}
          seen={item.seen}
          key={item._id}
          mood={item.mood}
          onPress={onMessagePress}
        />
      );
    },
    [messages]
  );

  const keyExtractor = useCallback((item) => item._id, []);

  const getItemLayout = useCallback(
    (data, index) => ({
      length: scale(60),
      offset: scale(60) * index,
      index,
    }),
    []
  );

  const data = useMemo(() => {
    return messages
      .sort((a, b) => a.createdAt > b.createdAt)
      .sort((a, b) => a.seen > b.seen)
      .filter((m) => dayjs(new Date()).diff(dayjs(m.createdAt), "hours") < 24);
  }, [messages]);

  return (
    <View style={[styles.container, style]}>
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={data}
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

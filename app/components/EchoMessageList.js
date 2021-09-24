import React, { useCallback, memo } from "react";
import { View, StyleSheet, FlatList } from "react-native";

import EchoMessageCard from "./EchoMessageCard";

function EchoMessageList({ echoMessages = [], onEchoMessagePress, style }) {
  const renderItem = useCallback(({ item }) => {
    return (
      <EchoMessageCard
        echoMessage={item}
        onEchoMessagePress={() => onEchoMessagePress(item)}
      />
    );
  }, []);

  const keyExtractor = useCallback((item) => item._id, []);

  const getItemLayout = useCallback(
    (data, index) => ({
      length: 80,
      offset: 80 * index,
      index,
    }),
    []
  );

  const getData = useCallback(() => {
    return echoMessages.sort((a, b) => a.name > b.name);
  }, [echoMessages]);

  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={getData()}
        horizontal={true}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews={true}
        getItemLayout={getItemLayout}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: 100,
    justifyContent: "center",
  },
});

export default memo(EchoMessageList);

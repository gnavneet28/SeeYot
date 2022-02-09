import React, { useCallback, memo } from "react";
import { View, FlatList } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

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
      length: scale(60),
      offset: scale(60) * index,
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
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        removeClippedSubviews={true}
        getItemLayout={getItemLayout}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={15}
        windowSize={10}
      />
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    flex: 1,
    marginBottom: "5@s",
    justifyContent: "center",
  },
});

export default memo(EchoMessageList);

import React, { useCallback, memo, useRef } from "react";
import { View, FlatList, Animated } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

import EchoMessageCard from "./EchoMessageCard";

function EchoMessageList({ echoMessages = [], onEchoMessagePress, style }) {
  const scrollY = useRef(new Animated.Value(0)).current;

  const renderItem = useCallback(({ item, index }) => {
    const inputRange = [-1, 0, scale(60 * index), scale(60 * (index + 2))];

    const scaleItem = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0],
    });
    return (
      <Animated.View style={{ transform: [{ scale: scaleItem }] }}>
        <EchoMessageCard
          index={index}
          echoMessage={item}
          onEchoMessagePress={() => onEchoMessagePress(item)}
        />
      </Animated.View>
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
      <Animated.FlatList
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { y: scrollY } },
            },
          ],
          { useNativeDriver: true }
        )}
        data={getData()}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        removeClippedSubviews={true}
        getItemLayout={getItemLayout}
        showsVerticalScrollIndicator={false}
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

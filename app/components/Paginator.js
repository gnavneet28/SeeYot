import React from "react";
import { View, Animated, useWindowDimensions } from "react-native";

import { ScaledSheet, scale } from "react-native-size-matters";

function Paginator({ data, scrollX }) {
  const { width } = useWindowDimensions();
  return (
    <View style={styles.container}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [scale(8), scale(16), scale(8)],
          extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            style={[styles.dot, { width: dotWidth, opacity }]}
            key={i.toString()}
          />
        );
      })}
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    flexDirection: "row",
    height: "50@s",
  },
  dot: {
    backgroundColor: "#493d8a",
    borderRadius: "5@s",
    height: "8@s",
    marginHorizontal: "8@s",
    marginVertical: "10@s",
  },
});

export default Paginator;

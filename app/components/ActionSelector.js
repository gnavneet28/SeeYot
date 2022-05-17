import React, { useState } from "react";
import { View } from "react-native";
import { scale, ScaledSheet } from "react-native-size-matters";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Ionicons from "../../node_modules/react-native-vector-icons/Ionicons";

import defaultstyles from "../config/styles";
let timeOut;

function ActionSelector({ style, plusAction, children, processing }) {
  const width = useSharedValue(scale(40));
  const translateX = useSharedValue(10);
  const opacity = useSharedValue(0);

  const [expanded, setExpanded] = useState(false);

  const rStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
    };
  }, []);

  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  }, []);

  const handlePress = () => {
    if (width.value < 70) {
      width.value = withTiming(scale(110));
      translateX.value = withTiming(0);
      opacity.value = withTiming(1);
      setExpanded(true);
      timeOut = setTimeout(() => {
        width.value = withTiming(scale(40));
        translateX.value = withTiming(10);
        opacity.value = withTiming(0, { duration: 200 });
        setExpanded(false);
      }, 5000);
    } else {
      if (timeOut) {
        clearTimeout(timeOut);
      }
      width.value = withTiming(scale(40));
      translateX.value = withTiming(10);
      opacity.value = withTiming(0, { duration: 200 });
      setExpanded(false);
    }
  };
  return (
    <Animated.View key={processing} style={[styles.container, style, rStyle]}>
      <View>
        {!expanded ? (
          <Ionicons
            onPress={handlePress}
            name={
              plusAction
                ? "ios-add-circle-outline"
                : "ios-remove-circle-outline"
            }
            size={scale(22)}
            color={defaultstyles.colors.white}
            style={styles.icon}
          />
        ) : (
          <Ionicons
            name="ios-close"
            size={scale(22)}
            onPress={handlePress}
            color={defaultstyles.colors.white}
            style={styles.icon}
          />
        )}
      </View>

      <Animated.View style={titleAnimatedStyle}>{children}</Animated.View>
    </Animated.View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultstyles.colors.secondary,
    borderRadius: "8@s",
    flexDirection: "row",
    height: "32@s",
    justifyContent: "space-between",
    overflow: "hidden",
    paddingHorizontal: "8@s",
    width: "110@s",
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ActionSelector;

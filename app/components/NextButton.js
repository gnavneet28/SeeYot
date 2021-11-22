import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity, Animated } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { ScaledSheet, scale } from "react-native-size-matters";

import Svg, { G, Circle } from "react-native-svg";

function NextButton({ percentage, scrollTo }) {
  const size = 110;
  const strokeWidth = 2;
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const progressAnimation = useRef(new Animated.Value(0)).current;
  const progressRef = useRef(null);

  const animation = (toValue) => {
    return Animated.timing(progressAnimation, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animation(percentage);
  }, [percentage]);

  useEffect(() => {
    progressAnimation.addListener(
      (value) => {
        const strokeDashoffset =
          circumference - (circumference * value.value) / 100;

        if (progressRef?.current) {
          progressRef.current.setNativeProps({
            strokeDashoffset,
          });
        }
      },
      [percentage]
    );

    return () => {
      progressAnimation.removeAllListeners();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={center}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#e6e7e8"
            strokeWidth={strokeWidth}
          />
          <Circle
            cx={center}
            cy={center}
            r={radius}
            ref={progressRef}
            stroke="#f4338f"
            strokeDasharray={circumference}
            strokeWidth={strokeWidth}
          />
        </G>
      </Svg>
      <TouchableOpacity
        onPress={scrollTo}
        style={styles.button}
        activeOpacity={0.6}
      >
        <AntDesign name="arrowright" size={scale(28)} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#f4338f",
    borderRadius: "100@s",
    padding: "14@s",
    position: "absolute",
  },
});

export default NextButton;

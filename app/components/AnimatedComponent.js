import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";

function AnimatedComponent(style, children) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animate();
  }, []);

  const animate = () => {
    Animated.timing(fadeAnim, {
      toValue: 25,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    setTimeout(() => reverseAnimate(), 1000);
  };

  const reverseAnimate = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    setTimeout(() => animate(), 1000);
  };

  return (
    <Animated.View style={[style, { borderRadius: fadeAnim }]}>
      {children}
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  container: {},
});

export default AnimatedComponent;

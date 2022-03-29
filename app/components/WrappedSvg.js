import React from "react";
import { View, StyleSheet } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import AppText from "./AppText";

import defaultStyles from "../config/styles";

import Svg, { Circle, Path } from "react-native-svg";

const vHeight = 134.9375;
const vWidth = 52.91667;

const WrappedSvg = () => (
  <View
    style={{
      aspectRatio: vHeight / vWidth,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Svg
      preserveAspectRatio="xMinYMin slice"
      height="100%"
      width="100%"
      viewBox={[0, 0, vHeight, vWidth]}
    >
      <Path
        fill={defaultStyles.colors.secondary_Variant}
        stroke="white"
        strokeWidth={2}
        d="M 77.723474,47.280936 C 68.557551,50.304745 58.446688,47.658912 58.446688,47.658912 31.137908,55.501918 26.885676,38.681978 26.885676,38.681978 3.6401408,41.800281 1.5612718,29.799537 1.5612718,29.799537 -1.0845622,19.12171 15.924368,16.381383 15.924368,16.381383 c 0,0 0.377975,-13.8906254 23.245534,-8.5044644 0,0 6.99256,-7.46502999 24.284971,-3.212798 0,0 17.670387,-8.315476 33.450894,2.645834 0,0 25.796873,-4.44122 20.977683,10.2998504 0,0 24.56845,5.764137 12.37872,17.481399 0,0 -5.95313,5.669643 -16.53646,6.614583 0,0 -4.53572,17.103423 -36.002236,5.575149 z"
      />
    </Svg>
    <View style={styles.messageContainer}>
      <AppText style={styles.text}>Welcome to SeeYot</AppText>
    </View>
  </View>
);

const styles = StyleSheet.create({
  text: {
    width: "70%",
    textAlign: "center",
    color: defaultStyles.colors.white,
  },
  messageContainer: {
    position: "absolute",
    right: 0,
    left: 0,
    bottom: 0,
    top: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WrappedSvg;

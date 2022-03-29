import React from "react";
import { View, StyleSheet } from "react-native";

import Svg, { Path } from "react-native-svg";
import { moderateScale, scale } from "react-native-size-matters";

import defaultStyles from "../config/styles";

function Bubble({ mine = "" }) {
  return (
    // <View style={[styles.cloud]}>
    //   <View
    //     style={[
    //       styles.arrow_container,
    //       !mine ? styles.arrow_left_container : styles.arrow_right_container,
    //     ]}
    //   >
    <Svg
      //enable-background="new 32.485 17.5 15.515 17.5"
      height={moderateScale(17.5, 0.6)}
      //style={!mine ? styles.arrow_left : styles.arrow_right}
      viewBox="0 0 200.8 200.22"
      width={moderateScale(15.5, 0.6)}
    >
      <Path
        d="M 0 0 C 6.6667 -0.6667 13.3333 -1.3333 16 7 C 14.6667 11.3333 13.3333 15.6667 -1 16 C -5.6667 14 -10.3333 12 0 0"
        fill="#000000"
        // x="0"
        // y="0"
      />
    </Svg>
    //   </View>
    // </View>
  );
}
const styles = StyleSheet.create({
  arrow_container: {
    bottom: 0,
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: -1,
  },
  arrow_left_container: {
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  arrow_right_container: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  arrow_left: {
    left: moderateScale(-6, 0.5),
  },
  arrow_right: {
    right: moderateScale(-6, 0.5),
  },
  cloud: {
    backgroundColor: "tomato",
    borderRadius: scale(10),
    maxWidth: moderateScale(250, 2),
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    height: 20,
    alignSelf: "center",
  },
  createdAt: {
    color: defaultStyles.colors.dark_Variant,
    fontSize: scale(8),
    paddingTop: 0,
    textAlign: "right",
  },
  message: {
    flexDirection: "row",
    marginVertical: moderateScale(7, 2),
  },
  mine: {
    marginLeft: scale(10),
  },
  not_mine: {
    alignSelf: "flex-end",
    marginRight: scale(10),
  },
  recipientPicture: {
    alignSelf: "flex-end",
    borderColor: defaultStyles.colors.white,
    borderWidth: 1,
    height: scale(20),
    marginRight: scale(10),
    width: scale(20),
  },
  recipientPictureSub: {
    height: scale(22),
    width: scale(22),
  },

  text: {
    ...defaultStyles.text,
    color: defaultStyles.colors.dark,
    fontFamily: "ComicNeue-Bold",
    fontSize: scale(13),
    lineHeight: scale(16),
    paddingBottom: 0,
  },
});

export default Bubble;

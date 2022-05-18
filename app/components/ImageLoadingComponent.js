import React from "react";
import { ImageBackground } from "react-native";
import { ScaledSheet, s } from "react-native-size-matters";
import * as Progress from "react-native-progress";

import defaultStyles from "../config/styles";

const ImageLoadingComponent = ({
  overLayStyle,
  image,
  defaultImage = "user",
  progress,
  progressBarSize,
}) => {
  return (
    <ImageBackground
      source={{
        uri: image ? image : defaultImage,
      }}
      blurRadius={5}
      resizeMode="contain"
      style={[
        styles.overLay,
        { zIndex: progress == 1 ? -100 : 100 },
        overLayStyle,
      ]}
    >
      <Progress.Circle
        size={progressBarSize ? progressBarSize : s(40)}
        progress={progress}
        color={defaultStyles.colors.white}
        thickness={1.5}
      />
    </ImageBackground>
  );
};

const styles = ScaledSheet.create({
  overLay: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    bottom: 0,
    height: "100%",
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    width: "100%",
  },
});

export default ImageLoadingComponent;

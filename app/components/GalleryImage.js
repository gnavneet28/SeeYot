import React from "react";
import { TouchableHighlight } from "react-native";
import FastImage from "react-native-fast-image";
import { ScaledSheet } from "react-native-size-matters";

import defaultStyles from "../config/styles";

const width = defaultStyles.width;
const IMAGE_WIDTH = width / 3;
const IMAGE_HEIGHT = width / 2;

const GalleryImage = ({ uri, onPress, selected }) => {
  return (
    <TouchableHighlight
      underlayColor={defaultStyles.colors.light}
      onPress={onPress}
      style={[
        styles.container,
        {
          padding: selected == uri ? 2 : 0,
          backgroundColor:
            selected == uri
              ? defaultStyles.colors.yellow_Variant
              : defaultStyles.colors.primary,
        },
      ]}
    >
      <FastImage
        style={styles.image}
        source={{
          uri: uri,
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.immutable,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
    </TouchableHighlight>
  );
};

const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.primary,
    borderRadius: "10@s",
    height: IMAGE_HEIGHT,
    justifyContent: "center",
    width: IMAGE_WIDTH - 5,
  },
  image: {
    borderRadius: "10@s",
    height: "95%",
    width: "95%",
  },
});

export default GalleryImage;

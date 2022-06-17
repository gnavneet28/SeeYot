import React, { memo } from "react";
import {
  View,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import LottieView from "lottie-react-native";
import * as Animatable from "react-native-animatable";
import MaterialCommunityIcons from "../../node_modules/react-native-vector-icons/MaterialCommunityIcons";

import AppImage from "./AppImage";
import AppText from "./AppText";

import defaultStyles from "../config/styles";

function AppHeader({
  style,
  onPressRight = () => null,
  onPressLeft = () => null,
  rightImageUrl = "",
  onSeePostPress = () => {},
}) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.animationContainer}>
        <LottieView
          autoPlay
          loop={false}
          source={"chatanimation.json"}
          style={{ width: 50 }}
        />
        <Animatable.View
          iterationCount={3}
          useNativeDriver={true}
          animation="rubberBand"
          style={[styles.animatedViewContainer]}
        >
          <AppText onPress={onPressLeft} style={styles.title}>
            SeeYot
          </AppText>
        </Animatable.View>
      </View>
      <View style={styles.rightOptionContainer}>
        <>
          <TouchableHighlight style={styles.postIcon} onPress={onSeePostPress}>
            <>
              <MaterialCommunityIcons
                name="post"
                size={scale(20)}
                color={defaultStyles.colors.white}
              />
              <View style={styles.notificationDot} />
            </>
          </TouchableHighlight>
          <TouchableWithoutFeedback onPress={onPressRight}>
            <Animatable.View
              useNativeDriver={true}
              animation="zoomIn"
              style={styles.rightOption}
            >
              <AppImage
                imageUrl={rightImageUrl}
                onPress={onPressRight}
                style={styles.image}
                subStyle={styles.imageSub}
              />
            </Animatable.View>
          </TouchableWithoutFeedback>
        </>
      </View>
    </View>
  );
}
const styles = ScaledSheet.create({
  animatedViewContainer: {
    flexShrink: 1,
  },
  animationContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingLeft: "10@s",
  },
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.primary,
    flexDirection: "row",
    height: "50@s",
    justifyContent: "space-between",
    padding: "2@s",
    width: "100%",
  },
  image: {
    borderRadius: "15@s",
    height: "30@s",
    width: "30@s",
    borderWidth: "1@s",
    borderColor: defaultStyles.colors.white,
  },
  imageSub: {
    borderRadius: "15@s",
    height: "29@s",
    width: "29@s",
  },
  leftOption: {
    alignItems: "center",
    bottom: 0,
    borderRadius: "20@s",
    backgroundColor: defaultStyles.colors.primary,
    height: "50@s",
    justifyContent: "center",
    left: "10@s",
    position: "absolute",
    width: "50@s",
  },
  rightOptionContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    height: "50@s",
    width: "85@s",
    flexDirection: "row",
    paddingHorizontal: "5@s",
  },
  postIcon: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "25@s",
    height: "32@s",
    justifyContent: "center",
    width: "32@s",
  },
  rightOption: {
    alignItems: "center",
    justifyContent: "center",
    height: "50@s",
    width: "50@s",
  },
  title: {
    color: defaultStyles.colors.white,
    flexShrink: 1,
    fontFamily: "ComicNeue-Bold",
    fontSize: "20@s",
    letterSpacing: "0.3@s",
    textAlign: "left",
  },
  notificationDot: {
    backgroundColor: defaultStyles.colors.danger,
    borderRadius: "10@s",
    height: "10@s",
    position: "absolute",
    right: 0,
    top: 0,
    width: "10@s",
    zIndex: 200,
  },
});

export default memo(AppHeader);

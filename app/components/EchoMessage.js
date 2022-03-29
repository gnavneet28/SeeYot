import React, { useEffect } from "react";
import { View } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import { SharedElement } from "react-navigation-shared-element";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import EchoIcon from "./EchoIcon";
import AppText from "./AppText";
import AudioEchoMessagePlayer from "./AudioEchoMessagePlayer";
import checkFileType from "../utilities/checkFileType";

import useMountedRef from "../hooks/useMountedRef";

function EchoMessage({ echoMessage, style, id }) {
  const isMounted = useMountedRef();

  const translateY = useSharedValue(200);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  }, []);

  useEffect(() => {
    translateY.value = withDelay(
      1000,
      withTiming(0, {}, (isFinished) => {
        if (isFinished) {
          translateY.value = withTiming(0);
        }
      })
    );
  }, []);

  if (!isMounted) return null;
  return (
    <View style={[styles.container, style]}>
      <SharedElement id={id}>
        <EchoIcon
          size={scale(18)}
          forInfo={true}
          containerStyle={styles.echoIcon}
        />
      </SharedElement>
      {checkFileType(echoMessage) ? (
        <Animated.View style={[styles.audioMessageContainer, rStyle]}>
          <AudioEchoMessagePlayer recordedFile={echoMessage} />
        </Animated.View>
      ) : (
        <Animated.View style={[styles.audioMessageContainer, rStyle]}>
          <AppText style={styles.echoMessage}>{echoMessage}</AppText>
        </Animated.View>
      )}
    </View>
  );
}
const styles = ScaledSheet.create({
  audioMessageContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "90%",
  },
  container: {
    flexDirection: "row",
    paddingTop: "5@s",
    width: "95%",
  },
  echoIcon: {
    borderRadius: "6@s",
    height: "24@s",
    width: "24@s",
  },
  echoMessage: {
    alignSelf: "center",
    flexShrink: 1,
    overflow: "hidden",
    paddingTop: 0,
    textAlign: "center",
    textAlignVertical: "center",
    width: "95%",
  },
});

export default EchoMessage;

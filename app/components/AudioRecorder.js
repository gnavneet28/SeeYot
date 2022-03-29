import React, { useState, useEffect, useCallback } from "react";
import { View, Pressable, Linking } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import Ionicons from "../../node_modules/react-native-vector-icons/Ionicons";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import LinearGradient from "react-native-linear-gradient";
import { Audio } from "expo-av";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  interpolate,
  withDelay,
} from "react-native-reanimated";

import InfoAlert from "../components/InfoAlert";
import Alert from "../components/Alert";
import defaultStyles from "../config/styles";
import AppText from "./AppText";

const Ring = ({ delay, animatedStyle }) => {
  return <Animated.View style={[styles.animatedCircle, animatedStyle]} />;
};

function AudioRecorder({ style, onStopRecording }) {
  const [recording, setRecording] = useState(undefined);
  const [isPlaying, setPlaying] = useState(false);
  const [constTime, setConstTime] = useState(10);
  const [showPermission, setShowPermission] = useState(false);
  const [permitted, setPermitted] = useState(false);

  const ring = useSharedValue(0);

  let animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.9 - ring.value,
      transform: [{ scale: interpolate(ring.value, [0, 1], [0, 4]) }],
    };
  }, []);

  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });

  let isUnmounting = false;

  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(() => {
    setInfoAlert({ ...infoAlert, showInfoAlert: false });
  }, []);

  // ALERT ACTIONS

  const handleClosePermission = () => {
    setShowPermission(false);
  };

  const openSettings = async () => {
    setShowPermission(false);
    await Linking.openSettings();
  };

  const _onLongPress = async () => {
    if (!permitted) return requestPermission();
    ring.value = withDelay(
      100,
      withRepeat(withTiming(1, { duration: 700 }), -1)
    );
    try {
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
      setPlaying(true);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };
  const _onPressOut = async () => {
    if (isPlaying) {
      setPlaying(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(undefined);
      onStopRecording(uri);
    }
  };

  const requestPermission = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      if (!granted) return setShowPermission(true);
      if (!isUnmounting) {
        setPermitted(true);
      }
    } catch (error) {
      if (!isUnmounting) {
        showPermission(true);
      }
    }
  };

  useEffect(() => {
    requestPermission();

    return () => (isUnmounting = true);
  }, []);

  return (
    <>
      <View style={[styles.container, style]}>
        <CountdownCircleTimer
          size={scale(93)}
          isPlaying={isPlaying}
          duration={constTime}
          key={"somerandomid"}
          onComplete={_onPressOut}
          colors={"#ff1a1a"}
        >
          {({ remainingTime, elapsedTime }) => (
            <Pressable onLongPress={_onLongPress} onPressOut={_onPressOut}>
              <LinearGradient
                colors={["#FF0000", "#FADD0B"]}
                style={styles.linearGradient}
              >
                <Ionicons
                  name="mic-sharp"
                  color={defaultStyles.colors.white}
                  size={scale(30)}
                />
                {[...Array(5).keys()].map((index) => {
                  return (
                    <Ring
                      key={index}
                      animatedStyle={animatedStyle}
                      delay={index * 200}
                    />
                  );
                })}
              </LinearGradient>
            </Pressable>
          )}
        </CountdownCircleTimer>
        <AppText style={styles.recordInfo}>Long Press to record</AppText>
      </View>
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
      <Alert
        visible={showPermission}
        title="Microphone Permission"
        description="Please allow the app to record audio."
        onRequestClose={handleClosePermission}
        leftOption="Cancel"
        rightOption="Ok"
        leftPress={handleClosePermission}
        rightPress={openSettings}
      />
    </>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "15@s",
    height: "135@s",
    justifyContent: "center",
    marginVertical: "5@s",
    width: "100%",
  },
  linearGradient: {
    alignItems: "center",
    borderRadius: "47.5@s",
    height: "85@s",
    justifyContent: "center",
    width: "85@s",
  },
  animatedCircle: {
    position: "absolute",
    backgroundColor: defaultStyles.colors.tomato,
    borderRadius: "20@s",
    height: "40@s",
    width: "40@s",
    borderRadius: "50@s",
    alignSelf: "center",
  },
  textStyle: {
    color: defaultStyles.colors.white,
    fontFamily: "ComicNeue-Bold",
    fontSize: "25@s",
  },
  recordInfo: {
    color: defaultStyles.colors.dark,
    fontSize: "12@s",
    marginTop: "5@s",
    paddingBottom: 0,
  },
  secsStyle: {
    color: defaultStyles.colors.white,
    fontFamily: "ComicNeue-Bold",
    fontSize: "14@s",
    opacity: 0.7,
  },
});

export default AudioRecorder;

import React, { useState, useEffect, useCallback } from "react";
import { View, Animated, Pressable } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import AntDesign from "../../node_modules/react-native-vector-icons/AntDesign";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import LinearGradient from "react-native-linear-gradient";
import { Audio } from "expo-av";

import AppActivityIndicator from "./ActivityIndicator";
import InfoAlert from "../components/InfoAlert";

import defaultStyles from "../config/styles";
import checkFileType from "../utilities/checkFileType";

function AudioEchoMessagePlayer({ recordedFile }) {
  const [sound, setSound] = useState(null);
  const [playerStatus, setPlayerStatus] = useState({
    isPlaying: false,
    durationMillis: 0,
    isBuffering: false,
    isLoaded: false,
  });
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });

  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

  let isUnmounting = false;

  const updatePlaybackStatus = (status) => {
    if (!isUnmounting) {
      setPlayerStatus(status);
    }
  };

  const setUpRecordingToPlay = async () => {
    if (sound && !isUnmounting) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
    if (!isUnmounting) {
      try {
        const { sound, status } = await Audio.Sound.createAsync(
          { uri: recordedFile },
          { shouldPlay: false }
        );
        if (!isUnmounting) {
          setSound(sound);
        }

        if (!isUnmounting) {
          setPlayerStatus({
            isPlaying: false,
            duration: status.durationMillis / 1000,
          });
        }

        if (!isUnmounting) {
          sound.setOnPlaybackStatusUpdate(updatePlaybackStatus);
        }
      } catch (error) {
        setInfoAlert({
          infoAlertMessage:
            "There is a problem loading the audio note due to weak internet connection. If the problem persists please restart the app.",
          showInfoAlert: true,
        });
      }
    }
  };

  const unloadSound = async () => {
    if (sound && playerStatus.isLoaded) {
      try {
        await sound.setOnPlaybackStatusUpdate(null);
        await sound.unloadAsync();
      } catch (error) {
        if (!isUnmounting) {
          setInfoAlert({
            infoAlertMessage:
              "Something went wrong with the echo while removing the audio note.",
            showInfoAlert: true,
          });
        }
      }
    }
  };

  useEffect(() => {
    if (!isUnmounting && checkFileType(recordedFile)) {
      setUpRecordingToPlay();
    }

    return () => {
      isUnmounting = true;
      unloadSound();
    };
  }, [recordedFile]);

  const playAudio = async () => {
    if (!sound)
      return setInfoAlert({
        infoAlertMessage: "Audio note is loading please wait!",
        showInfoAlert: true,
      });
    if (!playerStatus.isPlaying) {
      try {
        await sound.replayAsync();
      } catch (error) {
        setInfoAlert({
          infoAlertMessage:
            "A problem has occured while playing the audio note.",
          showInfoAlert: true,
        });
      }
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <CountdownCircleTimer
            size={scale(41)}
            key={playerStatus.isPlaying}
            colorsTime={[
              playerStatus.durationMillis / 1000,
              playerStatus.durationMillis / 2000,
              0,
            ]}
            isPlaying={playerStatus.isPlaying}
            duration={playerStatus.durationMillis / 1000}
            colors={["#228B22", "#FFCC00", "#FF0000"]}
            onComplete={
              !isUnmounting
                ? () => setPlayerStatus({ ...playerStatus, isPlaying: false })
                : () => null
            }
          >
            {({ remainingTime }) => (
              <Pressable onPress={playAudio}>
                <LinearGradient
                  colors={["#FF0000", "#FADD0B"]}
                  style={styles.linearGradient}
                >
                  {playerStatus.isBuffering ? (
                    <AppActivityIndicator
                      size={scale(20)}
                      color={defaultStyles.colors.white}
                    />
                  ) : !playerStatus.isPlaying ? (
                    <AntDesign
                      name="playcircleo"
                      size={scale(18)}
                      color={defaultStyles.colors.white}
                    />
                  ) : (
                    <>
                      <Animated.Text style={styles.textStyle}>
                        {remainingTime}
                      </Animated.Text>
                    </>
                  )}
                </LinearGradient>
              </Pressable>
            )}
          </CountdownCircleTimer>
        </View>
      </View>
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
    </>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    borderRadius: "30@s",
    flexShrink: 1,
    height: "45@s",
    justifyContent: "flex-start",
    width: "80%",
  },
  linearGradient: {
    alignItems: "center",
    borderRadius: "18@s",
    height: "35@s",
    justifyContent: "center",
    width: "35@s",
  },
  textStyle: {
    color: defaultStyles.colors.white,
    fontFamily: "ComicNeue-Bold",
    fontSize: "13@s",
  },
  wrapper: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "24@s",
    height: "44@s",
    justifyContent: "center",
    width: "44@s",
  },
});

export default AudioEchoMessagePlayer;

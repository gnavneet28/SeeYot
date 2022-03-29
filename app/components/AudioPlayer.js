import React, { useState, useEffect, useCallback } from "react";
import { View, Animated, Pressable } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import AntDesign from "../../node_modules/react-native-vector-icons/AntDesign";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import LinearGradient from "react-native-linear-gradient";
import { Audio } from "expo-av";

import AppActivityIndicator from "./ActivityIndicator";
import InfoAlert from "../components/InfoAlert";

import AppText from "./AppText";

import defaultStyles from "../config/styles";
import checkFileType from "../utilities/checkFileType";

function AudioPlayer({ recordedFile, onRefresh }) {
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
        if (!isUnmounting) {
          setInfoAlert({
            infoAlertMessage:
              "There is a problem loading the audio note due to weak internet connection. If the problem persists please restart the app.",
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
      if (sound) {
        try {
          sound.unloadAsync();
        } catch (error) {
          // setInfoAlert({
          //   infoAlertMessage:
          //     "Something went wrong with the echo while removing the audio note.",
          //   showInfoAlert: true,
          // });
        }
      }
    };
  }, [recordedFile]);

  const playAudio = async () => {
    if (!sound || isUnmounting)
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

  const onRefreshIconPress = async () => {
    if (sound && playerStatus.isLoaded) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        setInfoAlert({
          infoAlertMessage:
            "Something went wrong while refreshing the audio note.",
          showInfoAlert: true,
        });
      }
    }
    onRefresh();
  };

  return (
    <>
      <View style={styles.container}>
        <CountdownCircleTimer
          size={scale(93)}
          colorsTime={[
            playerStatus.durationMillis / 1000,
            playerStatus.durationMillis / 2000,
            0,
          ]}
          key={playerStatus.isPlaying}
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
                    color={defaultStyles.colors.white}
                    size={scale(20)}
                  />
                ) : !playerStatus.isPlaying ? (
                  <AntDesign
                    name="playcircleo"
                    size={scale(40)}
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
        <AppText onPress={onRefreshIconPress} style={styles.recordInfo}>
          Record again
        </AppText>
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
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "15@s",
    // flexDirection: "row",
    height: "115@s",
    justifyContent: "center",
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
  textStyle: {
    color: defaultStyles.colors.white,
    fontFamily: "ComicNeue-Bold",
    fontSize: "25@s",
  },
  refreshIcon: { marginHorizontal: "20@s" },
  recordInfo: {
    backgroundColor: defaultStyles.colors.secondary,
    borderRadius: "15@s",
    color: defaultStyles.colors.white,
    fontSize: "12@s",
    marginTop: "10@s",
    paddingHorizontal: "10@s",
    paddingVertical: "8@s",
  },
});

export default AudioPlayer;

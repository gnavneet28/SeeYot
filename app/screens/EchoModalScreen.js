import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  ImageBackground,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";
import { ScaledSheet, s } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";

import { SharedElement } from "react-navigation-shared-element";
import ImageModal from "react-native-image-modal";

import echosApi from "../api/echos";
import usersApi from "../api/users";

import AppText from "../components/AppText";
import EchoMessage from "../components/EchoMessage";
import Screen from "../components/Screen";

import useAuth from "../auth/useAuth";

import debounce from "../utilities/debounce";

import defaultStyles from "../config/styles";
import ScreenSub from "../components/ScreenSub";
import ImageLoadingComponent from "../components/ImageLoadingComponent";

const height = defaultStyles.height;
const width = defaultStyles.width;

const GAP = 30;

function EchoModalScreen({ route, navigation }) {
  let { recipient } = route.params;
  const { user } = useAuth();
  const isFocused = useIsFocused();
  const imageModalRef = useRef(null);

  let isUnmounting = false;

  const [echoMessage, setEchoMessage] = useState({ message: "" });
  const [loaded, setLoaded] = useState(0);

  const getEchoMessage = async () => {
    if (user._id != recipient._id) {
      usersApi.updatePhotoTapsCount(recipient._id);
    }
    const { data, problem, ok } = await echosApi.getEcho(recipient._id);
    if (ok && !isUnmounting) {
      setEchoMessage(data);
    }
  };

  useEffect(() => {
    if (!isUnmounting) {
      getEchoMessage();
    }

    return () => (isUnmounting = true);
  }, []);

  useEffect(() => {
    if (!isFocused && imageModalRef.current) {
      if (imageModalRef.current.props.isOpen) {
        handleBack();
      }
    }
  }, [isFocused]);

  let imageUri = recipient.picture;

  const handleBack = useCallback(
    debounce(() => navigation.goBack(), 500, true),
    []
  );

  const handleLoadComplete = () => setLoaded(1);

  return (
    <Screen style={styles.container}>
      <ScreenSub style={styles.screenSub}>
        <TouchableWithoutFeedback onPress={handleBack}>
          <ImageBackground
            resizeMode="cover"
            blurRadius={4}
            source={imageUri ? { uri: imageUri } : { uri: "user" }}
            style={styles.largeImageModalFallback}
          >
            <View style={[styles.contentContainer]}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollView}
              >
                <View style={styles.inlargedHeader}>
                  <MaterialIcons
                    onPress={handleBack}
                    name="arrow-back"
                    size={s(23)}
                    color={defaultStyles.colors.primary}
                    style={styles.closeIcon}
                  />

                  <AppText style={{ zIndex: 222, fontSize: s(15) }}>
                    {recipient.name}
                  </AppText>
                </View>
                <SharedElement id={recipient._id}>
                  <View style={styles.inlargedImage}>
                    <ImageModal
                      modalRef={imageModalRef}
                      onLoad={handleLoadComplete}
                      onProgress={(e) =>
                        setLoaded(e.nativeEvent.loaded / e.nativeEvent.total)
                      }
                      imageBackgroundColor={defaultStyles.colors.dark_Variant}
                      resizeMode="contain"
                      style={styles.inlargedImage}
                      source={{
                        uri: recipient.picture ? recipient.picture : "user",
                      }}
                    />
                    <ImageLoadingComponent
                      image={recipient.picture}
                      defaultImage={"user"}
                      progress={loaded}
                    />
                  </View>
                </SharedElement>
                {echoMessage ? (
                  <EchoMessage
                    id={`echoIcon${recipient._id}`}
                    echoMessage={echoMessage.message}
                    style={styles.echoMessage}
                  />
                ) : null}
              </ScrollView>
            </View>
          </ImageBackground>
        </TouchableWithoutFeedback>
      </ScreenSub>
    </Screen>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.primary,
  },
  screenSub: {
    backgroundColor: defaultStyles.colors.primary,
  },
  closeIcon: {
    left: "15@s",
    position: "absolute",
    zIndex: 222,
  },
  contentContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "15@s",
    elevation: 5,
    overflow: "hidden",
    width: width < height ? width - GAP : height - GAP,
  },
  echoMessage: { marginTop: "5@s", marginBottom: "10@s" },
  inlargedImage: {
    height: width < height ? width - GAP : height - GAP,
    width: width < height ? width - GAP : height - GAP,
  },
  inlargedHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    padding: "10@s",
    width: "100%",
  },
  largeImageModalFallback: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingVertical: "10@s",
    width: "100%",
  },
  scrollView: { alignItems: "center" },
});

export default EchoModalScreen;

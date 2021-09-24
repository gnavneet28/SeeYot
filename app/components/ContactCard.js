import React, { useState, useCallback, memo } from "react";
import { Modal, StyleSheet, TouchableHighlight, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AppButton from "./AppButton";
import AppImage from "./AppImage";
import AppText from "./AppText";

import defaultStyles from "../config/styles";

import echosApi from "../api/echos";

let defaultUser = {
  _id: "",
  picture: "",
  name: "",
  phoneNumber: parseInt(""),
};

function ContactCard({
  onAddEchoPress = () => null,
  onSendThoughtsPress = () => null,
  style,
  user = defaultUser,
}) {
  const [state, setState] = useState({
    visible: false,
    echoMessage: null,
  });

  const handleImagePress = useCallback(async () => {
    const { data, problem, ok } = await echosApi.getEcho(user._id);
    if (ok) {
      return setState({ visible: true, echoMessage: data });
    }
  }, []);

  const handleCloseModal = useCallback(
    () => setState({ ...state, visible: false }),
    []
  );

  const onSendThoughtPress = useCallback(
    () => onSendThoughtsPress(user),
    [user]
  );

  const onAddEchoButtonPress = useCallback(() => onAddEchoPress(user), [user]);

  return (
    <>
      <View style={[styles.container, style]}>
        <AppImage
          imageUrl={user.picture}
          onPress={handleImagePress}
          style={styles.image}
          subStyle={styles.imageSub}
        />
        <View style={styles.userDetailsContainer}>
          <AppText numberOfLines={1} style={[styles.infoNameText]}>
            {user.name ? user.name : user.phoneNumber}
          </AppText>

          <AppButton
            onPress={onAddEchoButtonPress}
            style={styles.addEchoButton}
            subStyle={styles.subAddEchoButton}
            title="Add Echo"
          />
        </View>
        <TouchableHighlight
          onPress={onSendThoughtPress}
          style={styles.sendThoughtIcon}
          underlayColor={defaultStyles.colors.light}
        >
          <MaterialCommunityIcons
            color={defaultStyles.colors.white}
            name="thought-bubble-outline"
            size={30}
          />
        </TouchableHighlight>
      </View>
      <Modal
        onRequestClose={handleCloseModal}
        transparent={true}
        visible={state.visible}
      >
        <View style={styles.largeImageConatainer}>
          <View style={styles.contentContainer}>
            {state.echoMessage ? (
              <AppText style={styles.echoMessage}>
                {state.echoMessage.message}
              </AppText>
            ) : null}
            <AppImage
              imageUrl={user.picture}
              subStyle={styles.inlargedImage}
              style={styles.inlargedImage}
              onPress={handleCloseModal}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  addEchoButton: {
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.yellow_Variant,
    borderRadius: 8,
    borderWidth: 1,
    height: 30,
    marginLeft: 10,
    width: "45%",
  },
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    flexDirection: "row",
    height: 80,
    paddingHorizontal: 10,
    paddingVertical: 2,
    width: "100%",
  },
  contentContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.yellow,
    borderRadius: 25,
    borderWidth: 2,
    elevation: 10,
    overflow: "hidden",
    width: 320,
  },
  echoMessage: {
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    marginVertical: 10,
    textAlign: "center",
    textAlignVertical: "center",
    width: "95%",
  },
  image: {
    borderColor: defaultStyles.colors.light,
    borderRadius: 25,
    borderWidth: 1,
    height: 50,
    marginHorizontal: 8,
    width: 50,
  },
  imageSub: {
    borderRadius: 24.5,
    height: 49,
    width: 49,
  },
  infoNameText: {
    color: defaultStyles.colors.dark,
    fontSize: 18,
    marginBottom: 5,
    marginLeft: 10,
    opacity: 0.8,
    paddingBottom: 0,
  },
  inlargedImage: {
    borderRadius: 0,
    height: 320,
    width: 320,
  },
  largeImageConatainer: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  sendThoughtIcon: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderBottomRightRadius: 22,
    borderColor: defaultStyles.colors.secondary,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 15,
    borderWidth: 1,
    elevation: 1,
    height: 45,
    justifyContent: "center",
    marginRight: 10,
    transform: [{ rotate: "45deg" }],
    width: 45,
  },
  subAddEchoButton: {
    color: defaultStyles.colors.secondary,
    fontSize: 17,
  },
  userDetailsContainer: {
    flex: 1,
    height: 80,
    justifyContent: "center",
  },
});

export default memo(ContactCard);

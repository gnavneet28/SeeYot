import React, { useState, useCallback, memo, useContext } from "react";
import { View, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppButton from "./AppButton";
import AppImage from "./AppImage";
import AppText from "./AppText";

import ActiveForContext from "../utilities/activeForContext";

import defaultStyles from "../config/styles";

import EchoMessageModal from "./EchoMessageModal";

import echosApi from "../api/echos";
import usersApi from "../api/users";
import useAuth from "../auth/useAuth";

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
  index,
}) {
  const [state, setState] = useState({
    visible: false,
    echoMessage: null,
  });

  const { user: currentUser } = useAuth();

  const { activeFor } = useContext(ActiveForContext);

  const handleImagePress = useCallback(async () => {
    setState({ visible: true, echoMessage: null });
    const { data, problem, ok } = await echosApi.getEcho(user._id);
    if (ok) {
      if (currentUser._id != user._id) {
        usersApi.updatePhotoTapsCount(user._id);
      }
      return setState({ visible: true, echoMessage: data });
    }

    if (problem) return;
  }, [user._id]);

  const handleCloseModal = useCallback(
    () => setState({ ...state, visible: false }),
    []
  );

  const onSendThoughtPress = useCallback(
    () => onSendThoughtsPress(user),
    [user]
  );

  const onAddEchoButtonPress = useCallback(() => onAddEchoPress(user), [user]);

  if (!user.name) return <View style={styles.emptyContacts} />;

  let isRecipientActive = activeFor.filter((u) => u == user._id)[0];

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
        <TouchableOpacity
          onPress={onSendThoughtPress}
          style={[
            styles.sendThoughtIconContainer,
            {
              backgroundColor: !isRecipientActive
                ? defaultStyles.colors.yellow_Variant
                : "green",
            },
          ]}
        >
          <Feather
            onPress={onSendThoughtPress}
            color={
              !isRecipientActive
                ? defaultStyles.colors.secondary
                : defaultStyles.colors.white
            }
            name="send"
            size={scale(18)}
            style={styles.sendThoughtIcon}
          />
        </TouchableOpacity>
      </View>
      <EchoMessageModal
        user={user}
        handleCloseModal={handleCloseModal}
        state={state}
      />
    </>
  );
}
const styles = ScaledSheet.create({
  addEchoButton: {
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "15@s",
    borderWidth: "0.5@s",
    height: "26@s",
    marginLeft: "5@s",
    width: "40%",
  },
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    flexDirection: "row",
    height: "70@s",
    paddingHorizontal: "10@s",
    paddingVertical: "2@s",
    width: "100%",
  },
  emptyContacts: {
    height: "80@s",
    width: "100%",
  },
  image: {
    borderColor: defaultStyles.colors.light,
    borderRadius: "22.5@s",
    borderWidth: 1,
    height: "45@s",
    marginRight: "2@s",
    marginLeft: "5@s",
    width: "45@s",
  },
  imageSub: {
    borderRadius: "22@s",
    height: "44@s",
    width: "44@s",
  },
  infoNameText: {
    color: defaultStyles.colors.dark,
    fontSize: "14.5@s",
    marginBottom: "5@s",
    marginLeft: "5@s",
    opacity: 0.9,
    paddingBottom: 0,
  },
  sendThoughtIconContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderColor: defaultStyles.colors.yellow,
    borderRadius: "10@s",
    borderWidth: 1,
    elevation: 2,
    height: "35@s",
    justifyContent: "center",
    marginRight: "8@s",
    width: "35@s",
  },
  sendThoughtIcon: {
    opacity: 0.8,
  },
  subAddEchoButton: {
    color: defaultStyles.colors.secondary,
    fontSize: "14@s",
  },
  userDetailsContainer: {
    flex: 1,
    height: "70@s",
    justifyContent: "center",
  },
});

export default memo(ContactCard);

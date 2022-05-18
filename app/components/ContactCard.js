import React, { useCallback, memo, useContext } from "react";
import { View, TouchableOpacity } from "react-native";
import Feather from "../../node_modules/react-native-vector-icons/Feather";
import { ScaledSheet, scale } from "react-native-size-matters";
import { SharedElement } from "react-navigation-shared-element";

import AppImage from "./AppImage";
import AppText from "./AppText";
import EchoIcon from "./EchoIcon";

import ActiveForContext from "../utilities/activeForContext";

import defaultStyles from "../config/styles";

import defaultProps from "../utilities/defaultProps";

function ContactCard({
  onImagePress = () => null,
  onAddEchoPress = () => null,
  onSendThoughtsPress = () => null,
  style,
  user = defaultProps.defaultUser,
}) {
  const { activeFor } = useContext(ActiveForContext);

  const onSendThoughtPress = useCallback(
    () => onSendThoughtsPress(user),
    [user]
  );

  const handleImagePress = () => {
    onImagePress(user);
  };

  const onAddEchoButtonPress = useCallback(() => onAddEchoPress(user), [user]);

  if (!user.name) return <View style={styles.emptyContacts} />;

  let isRecipientActive = activeFor.filter((u) => u == user._id)[0];

  return (
    <View style={[styles.container, style]}>
      <SharedElement id={user._id}>
        <AppImage
          conditionalPress={true}
          imageUrl={user.picture}
          onPress={handleImagePress}
          style={styles.image}
          subStyle={styles.imageSub}
        />
      </SharedElement>
      <View style={styles.userDetailsContainer}>
        <AppText numberOfLines={1} style={[styles.infoNameText]}>
          {user.name ? user.name : user.phoneNumber}
        </AppText>

        <AppText numberOfLines={2} style={styles.myNickName}>
          {user.myNickName
            ? `calls you ${user.myNickName}`
            : "Nickname not available."}
        </AppText>
      </View>
      <SharedElement id={`echoIcon${user._id}`}>
        <EchoIcon
          containerStyle={styles.addEchoIconContainer}
          onPress={onAddEchoButtonPress}
        />
      </SharedElement>
      <TouchableOpacity
        onPress={onSendThoughtPress}
        style={[
          styles.contactsActionConatiner,
          {
            backgroundColor: !isRecipientActive
              ? defaultStyles.colors.yellow_Variant
              : defaultStyles.colors.green,
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
          size={scale(16)}
          style={styles.actionIcon}
        />
      </TouchableOpacity>
    </View>
  );
}
const styles = ScaledSheet.create({
  actionIcon: {
    opacity: 0.8,
  },
  addEchoIconContainer: {
    backgroundColor: defaultStyles.colors.secondary,
    marginRight: "15@s",
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
  contactsActionConatiner: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "8@s",
    elevation: 1,
    height: "32@s",
    justifyContent: "center",
    marginRight: "8@s",
    overflow: "hidden",
    width: "32@s",
  },
  emptyContacts: {
    height: "80@s",
    width: "100%",
  },
  image: {
    borderRadius: "21@s",
    elevation: 1,
    height: "42@s",
    marginRight: "2@s",
    marginLeft: "5@s",
    width: "42@s",
  },
  imageSub: {
    borderRadius: "21@s",
    height: "42@s",
    width: "42@s",
  },
  infoNameText: {
    color: defaultStyles.colors.dark,
    fontSize: "14.5@s",
    marginLeft: "5@s",
    opacity: 0.9,
    paddingBottom: 0,
  },
  myNickName: {
    backgroundColor: defaultStyles.colors.white,
    color: defaultStyles.colors.dark_Variant,
    marginLeft: "5@s",
    paddingTop: 0,
    textAlign: "left",
    textAlignVertical: "center",
  },
  userDetailsContainer: {
    flex: 1,
    height: "70@s",
    justifyContent: "center",
  },
});

export default memo(ContactCard);

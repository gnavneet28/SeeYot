import React, { useCallback, memo, useContext } from "react";
import { View, TouchableOpacity } from "react-native";
import Feather from "../../node_modules/react-native-vector-icons/Feather";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppImage from "./AppImage";
import AppText from "./AppText";

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

  const onAddEchoButtonPress = useCallback(() => onAddEchoPress(user), [user]);

  if (!user.name) return <View style={styles.emptyContacts} />;

  let isRecipientActive = activeFor.filter((u) => u == user._id)[0];

  return (
    <View style={[styles.container, style]}>
      <AppImage
        imageUrl={user.picture}
        onPress={onImagePress}
        style={styles.image}
        subStyle={styles.imageSub}
      />
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
      <TouchableOpacity
        onPress={onAddEchoButtonPress}
        style={[styles.contactsActionConatiner, styles.addEchoIconContainer]}
      >
        <Feather
          onPress={onAddEchoButtonPress}
          color={defaultStyles.colors.primary}
          name="plus"
          size={scale(16)}
          style={styles.actionIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onSendThoughtPress}
        style={[
          styles.contactsActionConatiner,
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
    backgroundColor: defaultStyles.colors.light,
    borderColor: defaultStyles.colors.lightGrey,
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
    borderColor: defaultStyles.colors.yellow,
    borderRadius: "10@s",
    borderWidth: 1,
    height: "32@s",
    justifyContent: "center",
    marginRight: "8@s",
    width: "32@s",
  },
  emptyContacts: {
    height: "80@s",
    width: "100%",
  },
  image: {
    borderRadius: "22.5@s",
    elevation: 1,
    height: "42@s",
    marginRight: "2@s",
    marginLeft: "5@s",
    width: "42@s",
    elevation: 1,
  },
  imageSub: {
    borderRadius: "22@s",
    height: "41@s",
    width: "41@s",
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

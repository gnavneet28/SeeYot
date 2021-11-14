import React, { useState, memo } from "react";
import { View, TouchableOpacity, Modal } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppButton from "./AppButton";
import AppText from "./AppText";
import AppTextInput from "./AppTextInput";
import Icon from "./Icon";

import defaultStyles from "../config/styles";

function UserDetailsCard({
  data,
  editable = false,
  fw,
  iconName,
  onNameChange,
  size,
  style,
  title = "",
  userName = "",
}) {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState(userName);

  const handlePress = () => {
    setVisible(true);
  };

  const onSave = () => {
    onNameChange(name);
    setVisible(false);
  };
  return (
    <>
      <View style={[styles.container, style]}>
        <Icon
          color={defaultStyles.colors.tomato}
          fw={fw}
          name={iconName}
          size={size}
          style={{ marginHorizontal: 2 }}
        />
        <View style={styles.userDetail}>
          <AppText
            numberOfLines={1}
            style={{
              fontSize: scale(15),
              paddingBottom: 0,
              opacity: 0.9,
            }}
          >
            {title}
          </AppText>
          <AppText numberOfLines={1} style={styles.data}>
            {data}
          </AppText>
        </View>
        {editable === true ? (
          <TouchableOpacity onPress={handlePress}>
            <Icon
              color={defaultStyles.colors.secondary}
              name="mode-edit"
              size={scale(14)}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      <Modal
        onRequestClose={() => setVisible(false)}
        transparent={true}
        visible={visible}
      >
        <View style={styles.modal}>
          <View style={styles.editContainer}>
            <AppText style={styles.editName}>Edit your name</AppText>
            <View style={styles.inputBoxContainer}>
              <AppTextInput
                maxLength={30}
                minLength={3}
                onChangeText={(text) => setName(text)}
                placeholder={userName}
                style={styles.inputBox}
                subStyle={{ opacity: 0.8, paddingHorizontal: scale(5) }}
                value={name}
              />
              <AppText style={styles.nameLength}>{name.length}/30</AppText>
            </View>
            <View style={styles.actionButtonContainer}>
              <AppButton
                onPress={() => {
                  setVisible(false);
                  setName(userName);
                }}
                style={[
                  styles.button,
                  { backgroundColor: defaultStyles.colors.light },
                ]}
                subStyle={{ color: defaultStyles.colors.dark, opacity: 0.8 }}
                title="Cancel"
              />
              <AppButton
                disabled={
                  name && name.replace(/\s/g, "").length >= 4 ? false : true
                }
                onPress={onSave}
                style={styles.button}
                subStyle={styles.saveButtonSub}
                title="Save"
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = ScaledSheet.create({
  actionButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    height: "30@s",
    marginHorizontal: "10@s",
    width: "60@s",
  },
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.light,
    flexDirection: "row",
    height: "50@s",
    justifyContent: "space-between",
    width: "90%",
  },
  data: {
    color: defaultStyles.colors.dark_Variant,
    fontFamily: "Comic-Bold",
    fontSize: "14@s",
    paddingTop: 0,
  },
  editName: {
    backgroundColor: defaultStyles.colors.light,
    color: defaultStyles.colors.dark_Variant,
    fontSize: "14@s",
    height: "35@s",
    textAlign: "center",
    textAlignVertical: "center",
  },
  editContainer: {
    backgroundColor: defaultStyles.colors.white,
    borderTopRightRadius: "20@s",
    borderTopStartRadius: "20@s",
    height: "150@s",
    overflow: "hidden",
    width: "100%",
  },
  inputBoxContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderBottomWidth: 1,
    borderColor: defaultStyles.colors.light,
    flexDirection: "row",
    height: defaultStyles.dimensionConstants.height,
    justifyContent: "space-between",
    marginBottom: "10@s",
    paddingHorizontal: "5@s",
  },
  inputBox: {
    paddingHorizontal: "5@s",
    width: "85%",
  },
  modal: {
    backgroundColor: "rgba(0,0,0,0.7)",
    flex: 1,
    justifyContent: "flex-end",
  },
  nameLength: {
    opacity: 0.7,
    fontSize: "12@s",
  },
  saveButtonSub: {
    color: defaultStyles.colors.secondary,
  },
  userDetail: {
    flex: 1,
  },
});

export default memo(UserDetailsCard);

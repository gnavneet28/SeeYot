import React, { useState, memo } from "react";
import { View, StyleSheet, TouchableOpacity, Modal } from "react-native";

import AppButton from "./AppButton";
import AppText from "./AppText";
import AppTextInput from "./AppTextInput";
import Icon from "./Icon";

import defaultStyles from "../config/styles";

const height = defaultStyles.height;

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
          color={defaultStyles.colors.secondary}
          fw={fw}
          name={iconName}
          size={size}
          style={{ marginHorizontal: 2 }}
        />
        <View style={styles.userDetail}>
          <AppText
            numberOfLines={1}
            style={{
              fontFamily: "Comic-Bold",
              fontSize: height * 0.02,
              paddingBottom: 0,
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
              size={height * 0.019}
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
                autoFocus={true}
                maxLength={30}
                minLength={3}
                onChangeText={(text) => setName(text)}
                placeholder={userName}
                style={styles.inputBox}
                subStyle={{ opacity: 0.7 }}
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
                subStyle={{ color: defaultStyles.colors.dark, opacity: 0.7 }}
                title="Cancel"
              />
              <AppButton
                disabled={name && name.length >= 3 ? false : true}
                onPress={onSave}
                style={styles.button}
                title="Save"
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  actionButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    height: 35,
    marginHorizontal: 10,
    width: 80,
  },
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.light,
    flexDirection: "row",
    height: defaultStyles.dimensionConstants.height + 5,
    justifyContent: "space-between",
    width: "90%",
  },
  data: {
    fontFamily: "Comic-Bold",
    fontSize: height * 0.02,
    paddingTop: 0,
  },
  editName: {
    backgroundColor: defaultStyles.colors.primary,
    color: defaultStyles.colors.white,
    height: 30,
    fontSize: 18,
    textAlign: "center",
    textAlignVertical: "center",
  },
  editContainer: {
    backgroundColor: defaultStyles.colors.white,
    borderTopRightRadius: 20,
    borderTopStartRadius: 20,
    height: 150,
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
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  inputBox: {
    paddingHorizontal: 5,
    width: "85%",
  },
  modal: {
    backgroundColor: "rgba(0,0,0,0.6)",
    flex: 1,
    justifyContent: "flex-end",
  },
  nameLength: {
    opacity: 0.7,
  },
  userDetail: {
    flex: 1,
  },
});

export default memo(UserDetailsCard);

import React, { useState, useRef, useCallback } from "react";
import { TextInput, View, ScrollView } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { ScaledSheet, scale } from "react-native-size-matters";
import RNFS from "react-native-fs";
import CameraRoll from "@react-native-community/cameraroll";

import AppModal from "./AppModal";
import AppText from "./AppText";
import ApiProcessingContainer from "./ApiProcessingContainer";
import AppButton from "./AppButton";
import AppHeader from "./AppHeader";
import InfoAlert from "./InfoAlert";

import defaultStyles from "../config/styles";

import groupsApi from "../api/groups";

import apiActivity from "../utilities/apiActivity";

function CreateGroupModal({ visible, onRequestClose, onCreate }) {
  const { tackleProblem } = apiActivity;
  let svg = useRef(null);

  const [nameInput, setNameInput] = useState("");
  const [nameAvailable, setNameAvailable] = useState({
    name: "",
    isAvailable: false,
  });
  const [checkingName, setCheckingName] = useState(false);
  const [nameRequestInfo, setNameRequestInfo] = useState("");

  const [creatingGroup, setCreatingGroup] = useState(false);

  const [infoAlert, setInfoAlert] = useState({
    showInfoAlert: false,
    infoAlertMessage: "",
  });

  const [groupInfo, setGroupInfo] = useState("");

  const handleCloseInfoAlert = () => {
    setInfoAlert({ showInfoAlert: false, infoAlertMessage: "" });
  };

  const checkNameAvailablity = async () => {
    setCheckingName(true);
    const { ok, data, problem } = await groupsApi.checkGroupName(nameInput);
    if (ok) {
      setNameRequestInfo(data.message);
      if (data.message == "This name is available") {
        setNameAvailable({
          name: nameInput,
        });
      }
      return setCheckingName(false);
    }
    setNameAvailable({
      name: "",
    });
    setNameRequestInfo("Invalid name!");
    setCheckingName(false);
    tackleProblem(problem, data, setInfoAlert);
  };

  const handleInputChange = (text) => {
    if (nameAvailable.name) {
      setNameAvailable({
        name: "",
      });
    }
    if (nameRequestInfo) {
      setNameRequestInfo("");
    }
    setNameInput(text);
  };

  const createGroup = async () => {
    setCreatingGroup(true);
    svg.toDataURL((data) => {
      RNFS.writeFile(
        RNFS.CachesDirectoryPath + `/${nameAvailable.name}.png`,
        data,
        "base64"
      ).then(() =>
        CameraRoll.save(
          RNFS.CachesDirectoryPath + `/${nameAvailable.name}.png`,
          "photo"
        ).then(async (picture) => {
          const { ok, data, problem } = await groupsApi.createGroup(
            nameAvailable.name.trim(),
            picture,
            groupInfo.trim()
          );
          if (ok) {
            setCreatingGroup(false);
            setNameAvailable({ name: "" });
            setNameInput("");
            setGroupInfo("");
            return onCreate(data.groupName);
          }
          setCreatingGroup(false);
          tackleProblem(problem, data, setInfoAlert);
        })
      );
    });
  };

  return (
    <>
      <AppModal
        animationType="slide"
        visible={visible}
        onRequestClose={creatingGroup ? () => null : onRequestClose}
        style={styles.modal}
      >
        <View style={styles.container}>
          <AppHeader
            leftIcon="arrow-back"
            title="Create Group"
            onPressLeft={creatingGroup ? () => null : onRequestClose}
          />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
            }}
          >
            <View style={styles.scrollViewContainer}>
              <AppText style={styles.groupInfo}>
                Group is a place where you connect with people around you. Scan
                Qr code or enter name of group you want to interact within.
                Groups are by default public and anyone can join the group.
                Joining any group will share your name and display picture with
                people in that group. Every group has a recycle period of 24
                hours, means anything shared within the group will be auto
                deleted after every 24 hours.
              </AppText>
              <View style={styles.selectNameContainer}>
                <TextInput
                  editable={!creatingGroup}
                  style={styles.textInput}
                  placeholder="Name of the group..."
                  placeholderTextColor={defaultStyles.colors.placeholder}
                  onChangeText={handleInputChange}
                  maxLength={300}
                  value={nameInput}
                />
                {nameRequestInfo && nameInput ? (
                  <AppText style={styles.nameRequestInfo}>
                    {nameRequestInfo}
                  </AppText>
                ) : null}
                <ApiProcessingContainer
                  color={defaultStyles.colors.white}
                  processing={checkingName}
                  style={styles.checkNameAvailablityProcessingContainer}
                >
                  <AppButton
                    onPress={checkNameAvailablity}
                    disabled={nameInput && !creatingGroup ? false : true}
                    title="Check Availablity"
                    style={[
                      styles.checkNameAvailablityButton,
                      {
                        backgroundColor: !nameInput.replace(/\s/g, "").length
                          ? defaultStyles.colors.secondary_Variant
                          : defaultStyles.colors.secondary,
                      },
                    ]}
                    subStyle={styles.checkNameAvailablityButtonSub}
                  />
                </ApiProcessingContainer>
              </View>

              {nameAvailable.name ? (
                <View style={styles.qrCodeContainer}>
                  <QRCode
                    value={nameAvailable.name}
                    size={150}
                    getRef={(c) => (svg = c)}
                    linearGradient={["rgb(255,0,0)", "rgb(0,255,255)"]}
                    enableLinearGradient={true}
                    quietZone={10}
                  />

                  <TextInput
                    editable={!creatingGroup}
                    multiline={true}
                    numberOfLines={4}
                    style={[
                      styles.textInputGroupDescription,
                      { marginTop: scale(10), width: "90%" },
                    ]}
                    placeholder="Short description of group..."
                    placeholderTextColor={defaultStyles.colors.placeholder}
                    onChangeText={setGroupInfo}
                    maxLength={5000}
                    value={groupInfo}
                  />
                </View>
              ) : null}
            </View>
          </ScrollView>
          <ApiProcessingContainer
            color={defaultStyles.colors.white}
            processing={creatingGroup}
            style={styles.createGroupButtonContainer}
          >
            <AppButton
              disabled={
                nameAvailable.name.replace(/\s/g, "").length >= 3 &&
                !creatingGroup
                  ? false
                  : true
              }
              style={[
                styles.createGroupButton,
                {
                  backgroundColor: !nameAvailable.name.replace(/\s/g, "").length
                    ? defaultStyles.colors.secondary_Variant
                    : defaultStyles.colors.secondary,
                },
              ]}
              onPress={createGroup}
              title="Create Group"
            />
          </ApiProcessingContainer>
        </View>
      </AppModal>
      <InfoAlert
        description={infoAlert.infoAlertMessage}
        leftPress={handleCloseInfoAlert}
        visible={infoAlert.showInfoAlert}
      />
    </>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    flex: 1,
    width: "100%",
  },
  checkNameAvailablityButton: {
    borderRadius: "5@s",
    height: "35@s",
    width: "100%",
  },
  checkNameAvailablityButtonSub: {
    color: defaultStyles.colors.white,
  },
  checkNameAvailablityProcessingContainer: {
    backgroundColor: defaultStyles.colors.secondary,
    borderRadius: "5@s",
    height: "35@s",
    marginTop: "10@s",
    overflow: "hidden",
    padding: 0,
    width: "95%",
  },
  createGroupButtonContainer: {
    backgroundColor: defaultStyles.colors.secondary,
    height: "40@s",
    width: "100%",
  },
  createGroupButton: {
    borderRadius: 0,
    height: "40@s",
  },
  groupInfo: {
    color: defaultStyles.colors.dark_Variant,
    fontSize: "13@s",
    marginTop: "5@s",
    textAlign: "left",
    width: "90%",
  },
  modal: {
    width: "100%",
  },
  nameRequestInfo: {
    color: defaultStyles.colors.blue,
    fontSize: "12@s",
    textAlign: "left",
    width: "95%",
  },
  qrCodeContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "5@s",
    justifyContent: "center",
    marginTop: "20@s",
    paddingVertical: "10@s",
    width: "90%",
  },
  scrollViewContainer: {
    alignItems: "center",
    flex: 1,
    width: defaultStyles.width,
  },
  selectNameContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "5@s",
    marginVertical: "10@s",
    paddingHorizontal: "10@s",
    paddingVertical: "10@s",
    width: "90%",
  },
  textInput: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "5@s",
    fontFamily: "ComicNeue-Bold",
    fontSize: "14@s",
    fontStyle: "normal",
    fontWeight: "normal",
    paddingHorizontal: "10@s",
    paddingVertical: "5@s",
    width: "95%",
  },
  textInputGroupDescription: {
    borderLeftColor: defaultStyles.colors.yellow_Variant,
    borderLeftWidth: 2,
    borderRadius: "3@s",
    fontFamily: "ComicNeue-Bold",
    fontSize: "14@s",
    fontStyle: "normal",
    fontWeight: "normal",
    marginTop: "10@s",
    paddingHorizontal: "10@s",
    paddingVertical: "5@s",
    width: "90%",
  },
});

export default CreateGroupModal;

import React, { useState, useEffect } from "react";
import { TextInput, View, ScrollView } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import dynamicLinks from "@react-native-firebase/dynamic-links";

import AppModal from "./AppModal";
import AppText from "./AppText";
import ApiProcessingContainer from "./ApiProcessingContainer";
import AppButton from "./AppButton";
import AppHeader from "./AppHeader";
import InfoAlert from "./InfoAlert";
import DropdownSelect from "./DropdownSelect";

import defaultStyles from "../config/styles";

import groupsApi from "../api/groups";

import apiActivity from "../utilities/apiActivity";
import useAuth from "../auth/useAuth";
import defaultProps from "../utilities/defaultProps";

const filterSubCategory = (category) => {
  if (category == "Entertainment")
    return defaultProps.categoriesData.entertainmentCategory;
  else if (category == "Art") return defaultProps.categoriesData.artCategory;
  else if (category == "Food") return defaultProps.categoriesData.foodCategory;
  else if (category == "Relationship")
    return defaultProps.categoriesData.relationShipCategory;
  else if (category == "Wellness and Care")
    return defaultProps.categoriesData.wellnessCategory;
  else if (category == "Jobs") return defaultProps.categoriesData.jobsCategory;
};

function CreateGroupModal({ visible, onRequestClose, onCreate }) {
  const { tackleProblem } = apiActivity;
  let isUnmounting = false;
  const { user } = useAuth();

  const [nameInput, setNameInput] = useState("");
  const [nameAvailable, setNameAvailable] = useState({
    name: "",
    isAvailable: false,
  });
  const [checkingName, setCheckingName] = useState(false);
  const [nameRequestInfo, setNameRequestInfo] = useState("");

  const [creatingGroup, setCreatingGroup] = useState(false);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [type, setType] = useState("Public");

  const [height, setHeight] = useState(0);

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

  useEffect(() => {
    if (!isUnmounting) {
      setSubCategories(filterSubCategory(category));
      setSubCategory("");
    }

    return () => (isUnmounting = true);
  }, [category]);

  const createGroupInviteLink = () => {
    let name = nameAvailable.name.trim();
    let password = type == "Private" ? user._id.substring(0, 8) : "";
    return dynamicLinks().buildShortLink({
      domainUriPrefix: "https://seeyot.page.link",
      android: {
        packageName: "com.seeyot",
        fallbackUrl: "https://play.google.com/store/apps/details?id=com.seeyot",
      },
      link: `https://seeyot.page.link/groupInvite?a=${name}&b=${password}`,
      navigation: {
        forcedRedirectEnabled: false,
      },
    });
  };

  const createGroup = async () => {
    if (!isUnmounting) {
      setCreatingGroup(true);
    }
    let qrCodeLink = await createGroupInviteLink();
    const { ok, data, problem } = await groupsApi.createGroup(
      nameAvailable.name.trim(),
      qrCodeLink,
      groupInfo.trim(),
      category,
      subCategory,
      type
    );
    if (ok && !isUnmounting) {
      setCreatingGroup(false);
      setNameAvailable({ name: "" });
      setNameInput("");
      setGroupInfo("");
      setCategory("");
      setSubCategories([]);
      setSubCategory("");
      return onCreate(data.groupName, data.password);
    }

    if (!isUnmounting) {
      setCreatingGroup(false);
      tackleProblem(problem, data, setInfoAlert);
    }
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
                Group is a place where you can have active conversation with
                active people. Scan Qr code or enter name of group you want to
                interact within. You can create public as well as private
                groups. Joining any group will share your name and display
                picture with people in that group. Every group has a recycle
                period of 24 hours, means anything shared within the group will
                be auto deleted after every 24 hours.
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

              <View style={styles.optionSelectionContainer}>
                <DropdownSelect
                  selected={category}
                  containerStyle={styles.selectorStyle}
                  data={defaultProps.categoriesData.categories}
                  onOptionSelection={setCategory}
                />
                <DropdownSelect
                  defaultPlaceholder={"Select Subcategory"}
                  selected={subCategory}
                  containerStyle={styles.selectorStyle}
                  data={subCategories}
                  onOptionSelection={setSubCategory}
                />
                <DropdownSelect
                  defaultPlaceholder={"Select Type"}
                  selected={type}
                  data={["Public", "Private"]}
                  onOptionSelection={setType}
                />
              </View>

              {nameAvailable.name ? (
                <View style={styles.qrCodeContainer}>
                  <TextInput
                    editable={!creatingGroup}
                    multiline={true}
                    numberOfLines={4}
                    style={[
                      styles.textInputGroupDescription,
                      { height: Math.min(100, Math.max(60, height)) },
                    ]}
                    placeholder="Short description of group..."
                    placeholderTextColor={defaultStyles.colors.placeholder}
                    onChangeText={setGroupInfo}
                    maxLength={5000}
                    value={groupInfo}
                    onContentSizeChange={(event) =>
                      setHeight(event.nativeEvent.contentSize.height)
                    }
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
                !creatingGroup &&
                type &&
                category &&
                subCategory
                  ? false
                  : true
              }
              style={[
                styles.createGroupButton,
                {
                  backgroundColor:
                    nameAvailable.name.replace(/\s/g, "").length >= 3 &&
                    !creatingGroup &&
                    type &&
                    category &&
                    subCategory
                      ? defaultStyles.colors.secondary
                      : defaultStyles.colors.lightGrey,
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
    borderColor: defaultStyles.colors.light,
    borderRadius: "5@s",
    borderWidth: 1,
    color: defaultStyles.colors.dark_Variant,
    elevation: 1,
    fontSize: "13@s",
    marginTop: "5@s",
    padding: "5@s",
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
  optionSelectionContainer: {
    flexDirection: "row",
    minHeight: "30@s",
    width: "90%",
  },
  qrCodeContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "5@s",
    justifyContent: "center",
    marginTop: "20@s",
    padding: "5@s",
    width: "90%",
  },
  selectorStyle: {
    marginRight: "5@s",
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
    borderRadius: "3@s",
    fontFamily: "ComicNeue-Bold",
    fontSize: "14@s",
    fontStyle: "normal",
    fontWeight: "normal",
    paddingHorizontal: "10@s",
    paddingVertical: "5@s",
    width: "98%",
  },
});

export default CreateGroupModal;

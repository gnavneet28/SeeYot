import React, { useState, useEffect } from "react";
import { TextInput, View, ScrollView } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import AppModal from "./AppModal";
import AppText from "./AppText";
import ApiProcessingContainer from "./ApiProcessingContainer";
import AppButton from "./AppButton";
import AppHeader from "./AppHeader";
import InfoAlert from "./InfoAlert";

import defaultStyles from "../config/styles";

import favoritePostsApi from "../api/favoritePosts";

import apiActivity from "../utilities/apiActivity";

function CreateFavoritePostModal({ visible, onRequestClose, onCreate }) {
  const { tackleProblem } = apiActivity;
  let isUnmounting = false;

  const [nameInput, setNameInput] = useState("");

  const [creatingPost, setCreatingPost] = useState(false);

  const [height, setHeight] = useState(0);

  const [infoAlert, setInfoAlert] = useState({
    showInfoAlert: false,
    infoAlertMessage: "",
  });

  const handleCloseInfoAlert = () => {
    setInfoAlert({ showInfoAlert: false, infoAlertMessage: "" });
  };

  const createPost = async () => {
    if (!isUnmounting) {
      setCreatingPost(true);
    }
    const { ok, data, problem } = await favoritePostsApi.createNewPost(
      nameInput
    );
    if (ok && !isUnmounting) {
      setCreatingPost(false);
      setNameInput("");
      return onCreate();
    }
    if (!isUnmounting) {
      setCreatingPost(false);
      tackleProblem(problem, data, setInfoAlert);
    }
  };

  return (
    <>
      <AppModal
        animationType="slide"
        visible={visible}
        onRequestClose={creatingPost ? () => null : onRequestClose}
        style={styles.modal}
      >
        <View style={styles.container}>
          <AppHeader
            leftIcon="arrow-back"
            title="Create Favorite Post"
            onPressLeft={creatingPost ? () => null : onRequestClose}
          />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
            }}
          >
            <View style={styles.scrollViewContainer}>
              <AppText style={styles.groupInfo}>
                Share what is on your mind with people in your favorites and
                people who added you in their favorites, anonymously.
              </AppText>
              <View style={styles.inputBoxContainer}>
                <TextInput
                  editable={!creatingPost}
                  style={[
                    styles.textInput,
                    { height: Math.min(100, Math.max(60, height)) },
                  ]}
                  onContentSizeChange={(event) =>
                    setHeight(event.nativeEvent.contentSize.height)
                  }
                  placeholder="So what are you thinking..."
                  placeholderTextColor={defaultStyles.colors.lightGrey}
                  onChangeText={setNameInput}
                  maxLength={500}
                  value={nameInput}
                />
              </View>
            </View>
          </ScrollView>
          <ApiProcessingContainer
            color={defaultStyles.colors.white}
            processing={creatingPost}
            style={styles.createGroupButtonContainer}
          >
            <AppButton
              disabled={
                nameInput.replace(/\s/g, "").length >= 1 && !creatingPost
                  ? false
                  : true
              }
              style={[
                styles.createGroupButton,
                {
                  backgroundColor:
                    nameInput.replace(/\s/g, "").length >= 1 && !creatingPost
                      ? defaultStyles.colors.secondary
                      : defaultStyles.colors.lightGrey,
                },
              ]}
              onPress={createPost}
              title="Create Post"
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
    borderBottomColor: defaultStyles.colors.light,
    borderBottomWidth: "1@s",
    borderRadius: "5@s",
    color: defaultStyles.colors.dark_Variant,
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
    borderColor: defaultStyles.colors.light,
    borderRadius: "5@s",
    borderWidth: "1@s",
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
  inputBoxContainer: {
    alignItems: "center",
    borderColor: defaultStyles.colors.blue,
    borderBottomWidth: "1@s",
    borderRadius: "5@s",
    marginVertical: "10@s",
    paddingHorizontal: "10@s",
    paddingVertical: "10@s",
    width: "90%",
  },
  textInput: {
    //backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: "5@s",
    fontFamily: "ComicNeue-Bold",
    fontSize: "14@s",
    fontStyle: "normal",
    fontWeight: "normal",
    paddingHorizontal: "10@s",
    paddingVertical: "5@s",
    width: "95%",
  },
});

export default CreateFavoritePostModal;

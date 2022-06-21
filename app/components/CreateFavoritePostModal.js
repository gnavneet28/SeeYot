import React, { useState, useCallback } from "react";
import { TextInput, View, ScrollView } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import AppModal from "./AppModal";
import AppText from "./AppText";
import ApiProcessingContainer from "./ApiProcessingContainer";
import AppButton from "./AppButton";
import AppHeader from "./AppHeader";
import InfoAlert from "./InfoAlert";
import Selection from "./Selection";
import SearchBox from "./SearchBox";

import defaultStyles from "../config/styles";

import favoritePostsApi from "../api/favoritePosts";
import usersApi from "../api/users";

import apiActivity from "../utilities/apiActivity";

import debounce from "../utilities/debounce";
import SearchUserCard from "./SearchUserCard";

function CreateFavoritePostModal({ visible, onRequestClose, onCreate }) {
  const { tackleProblem } = apiActivity;
  let isUnmounting = false;

  const [nameInput, setNameInput] = useState("");
  const [audience, setAudience] = useState("InFavorites");
  const [searchList, setSearchList] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState("");

  const [creatingPost, setCreatingPost] = useState(false);

  const [height, setHeight] = useState(0);

  const [infoAlert, setInfoAlert] = useState({
    showInfoAlert: false,
    infoAlertMessage: "",
  });

  const handleSetAudience = (category) => {
    setAudience(category);
  };

  const handleCloseInfoAlert = () => {
    setInfoAlert({ showInfoAlert: false, infoAlertMessage: "" });
  };

  const createPost = async () => {
    if (!isUnmounting) {
      setCreatingPost(true);
    }
    const { ok, data, problem } = await favoritePostsApi.createNewPost(
      nameInput,
      audience,
      selected
    );
    if (ok && !isUnmounting) {
      setCreatingPost(false);
      setNameInput("");
      setSelected("");
      setSearching([]);
      setAudience("InFavorites");
      return onCreate();
    }
    if (!isUnmounting) {
      setCreatingPost(false);
      tackleProblem(problem, data, setInfoAlert);
    }
  };

  // SEARCH ACTION
  const handleSearchQuery = useCallback(
    debounce(
      async (searchQuery) => {
        if (searchQuery && searchQuery.length >= 2) {
          if (!isUnmounting) {
            setSearching(true);
          }
          const { data, problem, ok } = await usersApi.searchUser(searchQuery);
          if (ok && !isUnmounting) {
            setSearching(false);
            return setSearchList(data);
          }
          if (!isUnmounting) {
            setSearching(false);
            tackleProblem(problem, data, setInfoAlert);
          }
        }
        setSearchList([]);
      },
      500,
      true
    ),
    [searchList]
  );

  const handleSetSelected = (u) => {
    setSelected(u._id);
  };

  const doNull = () => {};

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
                Share what is on your mind with your selected people,
                anonymously.
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
              <AppText style={styles.selectAudienceTitle}>
                Select your audience
              </AppText>
              <Selection
                onPress={
                  creatingPost ? doNull : () => handleSetAudience("InFavorites")
                }
                opted={audience === "InFavorites"}
                value="People in your favorites"
              />
              <Selection
                onPress={
                  creatingPost
                    ? doNull
                    : () => handleSetAudience("ContainFavorites")
                }
                opted={audience === "ContainFavorites"}
                value="People who have added you in their favorites hi there hbvahv advanvsdm"
              />
              <Selection
                onPress={
                  creatingPost ? doNull : () => handleSetAudience("Contacts")
                }
                opted={audience === "Contacts"}
                value="People in your friends list"
              />
              <Selection
                onPress={
                  creatingPost ? doNull : () => handleSetAudience("Specific")
                }
                opted={audience === "Specific"}
                value="A specific person"
              />
              {audience === "Specific" ? (
                <View style={styles.searchContainer}>
                  <SearchBox
                    list={searchList}
                    loading={searching}
                    onChange={handleSearchQuery}
                    placeholder="Search to select"
                  />
                  {searchList.map((u) => (
                    <SearchUserCard
                      user={u}
                      selected={selected}
                      key={u._id}
                      onPress={handleSetSelected}
                    />
                  ))}
                </View>
              ) : null}
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
  selectAudienceTitle: {
    textAlign: "left",
    width: "100%",
    paddingLeft: "20@s",
    marginTop: "10@s",
  },
  searchContainer: {
    backgroundColor: defaultStyles.colors.light,
    flex: 1,
    width: "100%",
  },
  result: {
    width: "100%",
    paddingLeft: "15@s",

    paddingVertical: "7@s",
  },
});

export default CreateFavoritePostModal;

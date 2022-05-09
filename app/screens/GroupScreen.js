import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  useContext,
} from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Share,
} from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";
import ImagePicker from "react-native-image-crop-picker";
import QRCode from "react-native-qrcode-svg";
import dynamicLinks from "@react-native-firebase/dynamic-links";

import Alert from "../components/Alert";
import AppActivityIndicator from "../components/ActivityIndicator";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import EditImageOptionSelecter from "../components/EditImageOptionSelecter";
import GroupScreenOptions from "../components/GroupScreenOptions";
import InfoAlert from "../components/InfoAlert";
import LoadingIndicator from "../components/LoadingIndicator";
import ModalFallback from "../components/ModalFallback";
import ReportModal from "../components/ReportModal";
import Screen from "../components/Screen";
import ScreenSub from "../components/ScreenSub";

import debounce from "../utilities/debounce";

import defaultStyles from "../config/styles";
import NavigationConstants from "../navigation/NavigationConstants";

import apiActivity from "../utilities/apiActivity";
import defaultProps from "../utilities/defaultProps";
import storeDetails from "../utilities/storeDetails";

import useConnection from "../hooks/useConnection";

import useAuth from "../auth/useAuth";

import groupsApi from "../api/groups";
import usersApi from "../api/users";
import EditGroupInfoModal from "../components/EditGroupInfoModal";
import EditGroupPasswordModal from "../components/EditGroupPasswordModal";

function GroupScreen({ navigation, route }) {
  const { user, setUser } = useAuth();
  const { tackleProblem } = apiActivity;
  const isConnected = useConnection();
  let isUnmounting = false;

  const [group, setGroup] = useState(defaultProps.defaultGroup);
  const [openGroupInfo, setOpenGroupInfo] = useState(false);
  const [groupInfo, setGroupInfo] = useState(group.information);
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showImageEdit, setShowImageEdit] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });
  const [deletingGroup, setDeletingGroup] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [problemDescription, setProblemDescription] = useState("");
  const [removingFromHistory, setRemovingFromHistory] = useState(false);

  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

  let inHistory = useMemo(() => {
    if (user.groupHistory) {
      return user.groupHistory.filter((h) => h._id == group._id).length;
    }

    return 0;
  }, [user, group._id]);

  useEffect(() => {
    return () => (isUnmounting = true);
  }, []);

  // ON PAGE LOAD
  const getGroupDetails = async () => {
    setIsReady(false);
    const { ok, data, problem } = await groupsApi.getGroupByName(
      route.params.groupName,
      route.params.password
    );
    if (ok) {
      setGroup(data.group);
      if (data.group.createdBy._id != user._id) {
        addToMyGroupHistory(data.group._id);
      }
      return setIsReady(true);
    }
    setIsReady(true);
    tackleProblem(problem, data, setInfoAlert);
  };

  const addToMyGroupHistory = async (groupId) => {
    const { ok, data, problem } = await usersApi.addToGroupHistory(groupId);
    if (ok) {
      await storeDetails(data.user);
      return setUser(data.user);
    }
  };

  const handleRemoveFromMyGroupHistory = async () => {
    setRemovingFromHistory(true);
    const { ok, data, problem } = await usersApi.removeGroupFromHistory(
      group._id
    );
    if (ok) {
      await storeDetails(data.user);
      setUser(data.user);
      setRemovingFromHistory(false);
      return setShowOptions(false);
    }

    setRemovingFromHistory(false);
    setShowOptions(false);
    tackleProblem(problem, data, setInfoAlert);
  };

  useEffect(() => {
    getGroupDetails();
  }, []);

  // HEADER ACTCIONS

  const handleBackPress = useCallback(
    debounce(() => navigation.goBack(), 500, true),
    []
  );

  // GROUP PICTURE ALERT ACTIONS
  const handleHideAlert = () => {
    setShowAlert(false);
  };
  const handleAlertRightOptionPress = () => {
    setShowAlert(false);
    removeGroupPicture();
  };

  // GROUP PICTURE EDIT OPTIONS ACTIONS
  const handleHideImageEditOptions = () => {
    setShowImageEdit(false);
  };

  const openGroupPictureEditOptions = () => setShowImageEdit(true);

  // UPDATE GROUP PICTURE API ACTIONS
  const changeGroupPicture = async (picture) => {
    setIsLoading(true);
    const { ok, data, problem } = await groupsApi.updateGroupPicture(
      picture,
      group._id
    );
    if (ok) {
      setGroup(data.group);
      return setIsLoading(false);
    }

    setIsLoading(false);
    tackleProblem(problem, data, setInfoAlert);
  };

  const removeGroupPicture = async () => {
    setIsLoading(true);
    const { ok, data, problem } = await groupsApi.removeGroupPicture(group._id);
    if (ok) {
      setGroup(data.group);
      return setIsLoading(false);
    }

    setIsLoading(false);
    tackleProblem(problem, data, setInfoAlert);
  };

  const selectImage = () => {
    ImagePicker.openPicker({
      width: 700,
      height: 400,
      cropping: true,
      mediaType: "photo",
      compressImageQuality: 0.7,
    })
      .then((image) => {
        changeGroupPicture(image.path);
      })
      .catch((err) => null);
  };

  const hanldeRemovePicturePress = () => {
    if (!group.picture) return setShowImageEdit(false);
    setShowImageEdit(false);
    setShowAlert(true);
  };

  const handleSelectPicture = () => {
    setShowImageEdit(false);
    selectImage();
  };

  const handleReportGroupOptionPress = () => {
    setShowOptions(false);
    setOpenReportModal(true);
  };
  const handleOnChangePasswordOptionPress = () => {
    setShowOptions(false);
    setOpenPasswordModal(true);
  };

  const handleReportGroup = async () => {
    setIsLoading(true);

    const { ok, data, problem } = await groupsApi.reportGroup(
      problemDescription,
      group._id
    );
    if (ok) {
      setIsLoading(false);
      setOpenReportModal(false);
      return setInfoAlert({
        infoAlertMessage: data.message,
        showInfoAlert: true,
      });
    }
    setIsLoading(false);
    setOpenReportModal(false);
    tackleProblem(problem, data, setInfoAlert);
  };

  const handleDeleteGroup = async () => {
    setDeletingGroup(true);
    const { ok, data, problem } = await groupsApi.deleteGroup(group._id);
    if (ok) {
      setDeletingGroup(false);
      setShowOptions(false);
      return navigation.goBack();
    }

    setDeletingGroup(false);
    setShowOptions(false);
    tackleProblem(problem, data, setInfoAlert);
  };

  const handleOpenGroupInfoEditModal = () => setOpenGroupInfo(true);

  const handleUpdateGroupInfo = async (groupInfo) => {
    setIsLoading(true);
    const { ok, data, problem } = await groupsApi.updateGroupInformation(
      groupInfo,
      group._id
    );
    if (ok) {
      setGroup(data.group);
      setOpenGroupInfo(false);
      return setIsLoading(false);
    }
    setIsLoading(false);
    tackleProblem(problem, data, setInfoAlert);
  };

  const handleSubmitPassword = async (password) => {
    if (!isUnmounting) {
      setIsLoading(true);
    }
    const { ok, data, problem } = await groupsApi.updatePassword(
      group._id,
      password,
      ""
    );
    if (ok && !isUnmounting) {
      setGroup(data);
      return setIsLoading(false);
    }
    if (!isUnmounting) {
      setIsLoading(false);
      tackleProblem(problem, data, setInfoAlert);
    }
  };

  const createGroupInviteLink = (group) => {
    return dynamicLinks().buildShortLink({
      domainUriPrefix: "https://seeyot.page.link",
      android: {
        packageName: "com.seeyot",
        fallbackUrl: "https://play.google.com/store/apps/details?id=com.seeyot",
      },
      link: `https://seeyot.page.link/groupInvite?a=${group.name}&b=${
        group.password ? group.password : ""
      }`,
      navigation: {
        forcedRedirectEnabled: false,
      },
    });
  };

  const handleInvitePress = useCallback(
    debounce(
      async () => {
        try {
          setIsLoading(true);
          let link = await createGroupInviteLink(group);
          setIsLoading(false);
          const result = await Share.share({
            message: `Join this group and have live conversation with active people.[Group : ${group.name}]:${link}`,
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          setIsLoading(false);
        }
      },
      5000,
      true
    ),
    [group]
  );

  return (
    <>
      <Screen style={styles.container}>
        <AppHeader
          title="Group"
          leftIcon="arrow-back"
          onPressLeft={handleBackPress}
          rightIcon="more-vert"
          onPressRight={() => setShowOptions(true)}
        />
        <ScreenSub style={styles.screenSub}>
          {isReady ? (
            <>
              <ScrollView
                contentContainerStyle={styles.scrollViewContentContainer}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.scrollView}>
                  <View style={styles.groupDisplayPicture}>
                    <ImageBackground
                      resizeMode={group.picture ? "cover" : "contain"}
                      source={{
                        uri: group.picture ? group.picture : "defaultgroupdp",
                      }}
                      style={styles.imageBackground}
                    >
                      <View style={styles.groupWallActionContainer}>
                        {group.createdBy._id == user._id ? (
                          <TouchableOpacity
                            onPress={openGroupPictureEditOptions}
                            style={styles.editPhoto}
                            activeOpacity={0.7}
                          >
                            <MaterialIcons
                              name="edit"
                              size={scale(15)}
                              color={defaultStyles.colors.yellow_Variant}
                            />
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </ImageBackground>
                    <View style={styles.groupQrCodeContainer}>
                      <QRCode
                        value={group.qrCodeLink}
                        enableLinearGradient={true}
                        quietZone={10}
                        size={scale(95)}
                      />
                    </View>
                  </View>

                  <AppText style={styles.groupName}>{group.name}</AppText>

                  <TouchableOpacity
                    onPress={handleInvitePress}
                    activeOpacity={0.8}
                    style={styles.shareIconContainer}
                  >
                    <AppText style={styles.shareText}>Share</AppText>
                    <MaterialIcons
                      name="share"
                      color={defaultStyles.colors.white}
                      size={scale(12)}
                    />
                  </TouchableOpacity>

                  <View style={styles.groupInfoContainer}>
                    {group.createdBy._id == user._id ? (
                      <TouchableOpacity
                        style={styles.editInfoIcon}
                        onPress={handleOpenGroupInfoEditModal}
                      >
                        <MaterialIcons
                          size={scale(12)}
                          color={defaultStyles.colors.lightGrey}
                          name="edit"
                        />
                      </TouchableOpacity>
                    ) : null}

                    <AppText style={styles.groupInfo}>
                      {group.information
                        ? group.information
                        : "Welcome to this Group."}
                    </AppText>
                  </View>
                </View>
              </ScrollView>

              {user.vip.subscription ? (
                <AppText
                  style={styles.chatButtonIncognito}
                  onPress={() =>
                    navigation.navigate(NavigationConstants.GROUP_CHAT_SCREEN, {
                      group: {
                        _id: group._id,
                        name: group.name,
                        picture: group.picture,
                        type: group.type,
                        canInvite: group.canInvite,
                      },
                      incognito: true,
                    })
                  }
                >
                  Join Conversation ( Incognito )
                </AppText>
              ) : null}
              <AppText
                style={styles.chatButton}
                onPress={() =>
                  navigation.navigate(NavigationConstants.GROUP_CHAT_SCREEN, {
                    group: {
                      _id: group._id,
                      name: group.name,
                      picture: group.picture,
                      type: group.type,
                      canInvite: group.canInvite,
                    },
                    incognito: false,
                  })
                }
              >
                Join Conversation
              </AppText>
            </>
          ) : (
            <AppActivityIndicator />
          )}
        </ScreenSub>
      </Screen>
      <GroupScreenOptions
        deletingGroup={deletingGroup}
        onDeletePress={handleDeleteGroup}
        onReportPress={handleReportGroupOptionPress}
        user={user}
        group={group}
        isVisible={showOptions}
        handleCloseModal={() => setShowOptions(false)}
        inHistory={inHistory}
        removingFromHistory={removingFromHistory}
        onRemovePress={handleRemoveFromMyGroupHistory}
        onChangePasswordOptionPress={handleOnChangePasswordOptionPress}
      />
      <EditImageOptionSelecter
        style={styles.imageEditOptionSelector}
        showImageEdit={showImageEdit}
        setShowImageEdit={setShowImageEdit}
        handleHideImageEditOptions={handleHideImageEditOptions}
        handleSelectPicture={handleSelectPicture}
        hanldeRemovePicturePress={hanldeRemovePicturePress}
      />
      <Alert
        onRequestClose={handleHideAlert}
        description="Are you sure you want to remove this picture?"
        leftPress={handleHideAlert}
        leftOption="Cancel"
        rightOption="Ok"
        rightPress={handleAlertRightOptionPress}
        setVisible={setShowAlert}
        title="Remove"
        visible={showAlert}
      />
      <LoadingIndicator visible={isLoading} />
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
      {openReportModal ||
      showImageEdit ||
      openGroupInfo ||
      openPasswordModal ? (
        <ModalFallback />
      ) : null}
      <ReportModal
        handleProblemSubmitPress={handleReportGroup}
        isLoading={isLoading}
        openReport={openReportModal}
        setOpenReport={setOpenReportModal}
        problemDescription={problemDescription}
        setProblemDescription={setProblemDescription}
        isConnected={isConnected}
      />
      <EditGroupInfoModal
        key={group.information + new Date().toString()}
        isConnected={isConnected}
        handleSubmitInfoChange={handleUpdateGroupInfo}
        openGroupInfo={openGroupInfo}
        setOpenGroupInfo={setOpenGroupInfo}
        isLoading={isLoading}
        group={group}
      />
      <EditGroupPasswordModal
        key={group.password ? group.password : ""}
        isConnected={isConnected}
        isLoading={isLoading}
        handleSubmitPassword={handleSubmitPassword}
        group={group}
        openPasswordModal={openPasswordModal}
        setOpenPasswordModal={setOpenPasswordModal}
      />
    </>
  );
}
const styles = ScaledSheet.create({
  container: {},
  chatButton: {
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.secondary,
    borderRadius: "8@s",
    color: defaultStyles.colors.white,
    elevation: 5,
    fontSize: "14@s",
    marginBottom: "15@s",
    paddingVertical: "10@s",
    textAlign: "center",
    textAlignVertical: "center",
    width: "90%",
  },
  chatButtonIncognito: {
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.dark,
    borderRadius: "8@s",
    color: defaultStyles.colors.white,
    elevation: 5,
    fontSize: "14@s",
    marginBottom: "5@s",
    paddingVertical: "10@s",
    textAlign: "center",
    textAlignVertical: "center",
    width: "90%",
  },
  groupQrCodeContainer: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.secondary_Variant,
    borderColor: defaultStyles.colors.white,
    borderRadius: "5@s",
    borderWidth: "4@s",
    bottom: 0,
    elevation: 5,
    height: "100@s",
    justifyContent: "center",
    position: "absolute",
    width: "100@s",
  },
  creatorPicture: {
    borderRadius: "45@s",
    height: "90@s",
    width: "90@s",
  },
  editInfoIcon: {
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "5@s",
    height: "20@s",
    justifyContent: "center",
    width: "20@s",
  },
  editPhoto: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "15@s",
    height: "30@s",
    justifyContent: "center",
    marginBottom: "5@s",
    width: "30@s",
  },
  groupName: {
    fontSize: "16@s",
    marginTop: "5@s",
    textAlign: "center",
  },
  groupInfoContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "8@s",
    marginTop: "10@s",
    paddingHorizontal: "10@s",
    paddingVertical: "10@s",
    width: "90%",
    borderWidth: 1,
    elevation: 1,
    borderColor: defaultStyles.colors.light,
  },
  groupDisplayPicture: {
    backgroundColor: defaultStyles.colors.white,
    height: "300@s",
    width: "100%",
  },
  groupInfo: {
    alignSelf: "center",
    textAlign: "center",
  },
  groupWallActionContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
    position: "absolute",
    right: "10@s",
    top: "10@s",
  },
  imageEditOptionSelector: {
    backgroundColor: defaultStyles.colors.primary,
    borderTopWidth: 0,
  },
  imageBackground: {
    width: "100%",
    height: "250@s",
    backgroundColor: defaultStyles.colors.dark,
  },
  qrImage: {
    height: "150@s",
    width: "150@s",
  },
  scrollView: {
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  scrollViewContentContainer: {
    alignItems: "center",
    flexGrow: 1,
  },
  screenSub: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  shareIconContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.secondary,
    borderRadius: "5@s",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: "5@s",
  },
  shareText: {
    color: defaultStyles.colors.white,
    fontSize: "10@s",
  },
});

export default GroupScreen;

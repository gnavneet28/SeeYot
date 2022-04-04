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
  Text,
} from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";
import ImagePicker from "react-native-image-crop-picker";
import QRCode from "react-native-qrcode-svg";

import Alert from "../components/Alert";
import AppActivityIndicator from "../components/ActivityIndicator";
import AppHeader from "../components/AppHeader";
import AppImage from "../components/AppImage";
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

import { SocketContext } from "../api/socketClient";

import useConnection from "../hooks/useConnection";

import useAuth from "../auth/useAuth";

import groupsApi from "../api/groups";
import usersApi from "../api/users";
import EditGroupInfoModal from "../components/EditGroupInfoModal";

function GroupScreen({ navigation, route }) {
  const { user, setUser } = useAuth();
  const { tackleProblem } = apiActivity;
  const isConnected = useConnection();
  const socket = useContext(SocketContext);

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

  // ON PAGE LOAD
  const getGroupDetails = async () => {
    setIsReady(false);
    const { ok, data, problem } = await groupsApi.getGroupByName(
      route.params.groupName
    );
    if (ok) {
      setGroup(data.group);
      await addToMyGroupHistory(data.group._id);
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

  const handleUpdateGroupInfo = async () => {
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
        <ScreenSub style={styles.container}>
          {isReady ? (
            <>
              <ScrollView
                contentContainerStyle={{
                  alignItems: "center",
                  flexGrow: 1,
                }}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.scrollView}>
                  <View style={styles.groupDisplayPicture}>
                    <ImageBackground
                      resizeMode="cover"
                      source={{ uri: group.picture ? group.picture : "user" }}
                      style={{ width: "100%", flex: 1 }}
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
                    <View style={styles.creatorDisplayPictureContainer}>
                      <AppImage
                        imageUrl={group.createdBy.picture}
                        style={styles.creatorPicture}
                        subStyle={styles.creatorPicture}
                      />
                    </View>
                  </View>
                  <AppText style={styles.groupName}>{group.name}</AppText>
                  <AppText style={styles.creatorName}>
                    <Text style={{ color: defaultStyles.colors.blue }}>
                      Admin:
                    </Text>{" "}
                    {group.createdBy.name}
                  </AppText>

                  <View style={styles.groupInfoContainer}>
                    {group.createdBy._id == user._id ? (
                      <TouchableOpacity
                        style={styles.editInfoIcon}
                        onPress={handleOpenGroupInfoEditModal}
                      >
                        <MaterialIcons
                          size={scale(12)}
                          color={defaultStyles.colors.white}
                          name="edit"
                        />
                      </TouchableOpacity>
                    ) : null}
                    {group.information ? (
                      <AppText style={styles.groupInfo}>
                        {group.information ? group.information : ""}
                      </AppText>
                    ) : null}

                    <QRCode
                      value={group.name}
                      enableLinearGradient={true}
                      quietZone={10}
                      size={scale(150)}
                    />
                  </View>
                </View>
              </ScrollView>

              <AppText
                style={styles.chatButton}
                onPress={() =>
                  navigation.navigate(NavigationConstants.GROUP_CHAT_SCREEN, {
                    group: {
                      _id: group._id,
                      name: group.name,
                      picture: group.picture,
                    },
                  })
                }
              >
                Chat
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
      {openReportModal || showImageEdit || openGroupInfo ? (
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
        isConnected={isConnected}
        handleSubmitInfoChange={handleUpdateGroupInfo}
        openGroupInfo={openGroupInfo}
        setOpenGroupInfo={setOpenGroupInfo}
        groupInfo={groupInfo}
        setGroupInfo={setGroupInfo}
        isLoading={isLoading}
      />
    </>
  );
}
const styles = ScaledSheet.create({
  container: {},
  chatButton: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderTopLeftRadius: "5@s",
    borderTopRightRadius: "5@s",
    bottom: 0,
    elevation: 5,
    fontSize: "15@s",
    paddingVertical: "10@s",
    textAlign: "center",
    textAlignVertical: "center",
    width: "100%",
  },
  creatorDisplayPictureContainer: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.secondary_Variant,
    borderColor: defaultStyles.colors.white,
    borderRadius: "50@s",
    borderWidth: "4@s",
    bottom: "-50@s",
    height: "100@s",
    justifyContent: "center",
    position: "absolute",
    width: "100@s",
  },
  creatorName: {
    fontSize: "12@s",
    textAlign: "center",
  },
  creatorPicture: {
    borderRadius: "45@s",
    height: "90@s",
    width: "90@s",
  },
  editInfoIcon: {
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: defaultStyles.colors.secondary,
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
    marginTop: "48@s",
    textAlign: "center",
  },
  groupInfoContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "8@s",
    marginTop: "10@s",
    paddingHorizontal: "10@s",
    paddingVertical: "10@s",
    width: "90%",
  },
  groupDisplayPicture: {
    backgroundColor: defaultStyles.colors.secondary_Variant,
    height: 250,
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
  qrImage: {
    height: "150@s",
    width: "150@s",
  },
  scrollView: {
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
});

export default GroupScreen;

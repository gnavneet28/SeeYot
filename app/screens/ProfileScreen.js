import React, { useState, useCallback, useEffect } from "react";
import { Modal, ScrollView, Share, View } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useIsFocused } from "@react-navigation/native";

import AddPicture from "../components/AddPicture";
import ApiActivity from "../components/ApiActivity";
import AppButton from "../components/AppButton";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import InfoAlert from "../components/InfoAlert";
import LoadingIndicator from "../components/LoadingIndicator";
import ProfileOption from "../components/ProfileOption";
import Screen from "../components/Screen";
import Selection from "../components/Selection";
import UserDetailsCard from "../components/UserDetailsCard";

import Constant from "../navigation/NavigationConstants";
import DataConstants from "../utilities/DataConstants";

import useAuth from "../auth/useAuth";

import asyncStorage from "../utilities/cache";
import apiFlow from "../utilities/ApiActivityStatus";
import debounce from "../utilities/debounce";

import expoPushTokensApi from "../api/expoPushTokens";
import problemsApi from "../api/problems";
import usersApi from "../api/users";

import useMountedRef from "../hooks/useMountedRef";

import defaultStyles from "../config/styles";
import Alert from "../components/Alert";

function ProfileScreen({ navigation }) {
  const { user, setUser, logOut } = useAuth();
  const mounted = useMountedRef().current;
  const isFocused = useIsFocused();
  const { apiActivityStatus, initialApiActivity } = apiFlow;

  // STATES
  const [visible, setVisible] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [problemDescription, setProblemDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });
  const [apiActivity, setApiActivity] = useState({
    message: "",
    processing: true,
    visible: false,
    success: false,
  });
  const [showLogOut, setShowLogOut] = useState(false);

  useEffect(() => {
    if (!isFocused && mounted && isLoading === true) {
      setIsLoading(false);
    }
  }, [isFocused, mounted]);

  useEffect(() => {
    if (!isFocused && mounted && infoAlert.showInfoAlert === true) {
      setInfoAlert({
        infoAlertMessage: "",
        showInfoAlert: false,
      });
    }
  }, [isFocused, mounted]);

  useEffect(() => {
    if (!isFocused && mounted && apiActivity.visible === true) {
      setApiActivity({
        message: "",
        processing: true,
        visible: false,
        success: false,
      });
    }
  }, [isFocused, mounted]);

  useEffect(() => {
    if (!isFocused && mounted && showLogOut === true) {
      setShowLogOut(false);
    }
  }, [isFocused, mounted]);

  //LOG OUT ACTION
  const handleCloseLogout = useCallback(() => setShowLogOut(false), []);

  const handleOpenLogout = useCallback(() => setShowLogOut(true), []);

  // API ACTIVITY ACTIONS
  const handleApiActivityClose = useCallback(
    () => setApiActivity({ ...apiActivity, visible: false }),
    []
  );

  // HEADER ACTION
  const handleBack = useCallback(
    debounce(
      () => {
        setVisible(false);
        navigation.goBack();
      },
      500,
      true
    ),
    []
  );

  const handleRightHeaderPress = useCallback(() => setVisible(true), []);

  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

  // SETTING OPTION AND ACTION
  const handleBlockListPress = useCallback(() => {
    setVisible(false);
    navigation.navigate(Constant.BLOCKED_SCREEN);
  }, []);

  const handleSubscriptionPress = useCallback(() => {
    setVisible(false);
    navigation.navigate(Constant.SUBSCRIPTION_NAVIGATOR, {
      from: Constant.PROFILE_SCREEN,
    });
  }, []);

  const handleReportPress = useCallback(() => {
    setVisible(false);
    setOpenReport(true);
  }, [problemDescription]);

  const handleProblemSubmitPress = useCallback(async () => {
    setOpenReport(false);
    setIsLoading(true);

    const { ok, data, problem } = await problemsApi.registerProblem(
      problemDescription
    );

    if (ok) {
      setIsLoading(false);
      setProblemDescription("");
      return setInfoAlert({
        ...infoAlert,
        infoAlertMessage: data.message,
        showInfoAlert: true,
      });
    }

    setIsLoading(false);
    setInfoAlert({
      ...infoAlert,
      infoAlertMessage: problem,
      showInfoAlert: true,
    });
  }, [problemDescription]);

  const handleLogOutPress = useCallback(async () => {
    const { ok } = await expoPushTokensApi.removeToken();
    if (ok) {
      return logOut();
    }
    setInfoAlert({
      infoAlertMessage: "Action failed! Please try again.",
      showInfoAlert: true,
    });
  }, []);

  const handleHelpPress = useCallback(() => {
    setVisible(false);
    navigation.navigate(Constant.HELP_SCREEN);
  }, []);

  const handleSettingsPress = useCallback(() => {
    setVisible(false);
    navigation.navigate(Constant.SETTINGS);
  }, []);

  // PICTURE CHANGE ACTION
  const handleImageChange = useCallback(
    debounce(
      async (image) => {
        initialApiActivity(setApiActivity, "Updating your picture...");

        let modifiedUser = { ...user };
        let cachedUserDetails = {
          _id: user._id,
          name: user.name,
          picture: user.picture,
          phoneNumber: user.phoneNumber,
        };
        let picture = image;

        if (image) {
          const response = await usersApi.updateCurrentUserPhoto(picture);
          if (response.ok) {
            modifiedUser.picture = response.data.picture;
            cachedUserDetails.picture = response.data.data;
            setUser(modifiedUser);
            await asyncStorage.store(DataConstants.DETAILS, cachedUserDetails);
          }
          return apiActivityStatus(response, setApiActivity);
        }

        const response2 = await usersApi.removeCurrentUserPhoto();
        if (response2.ok) {
          modifiedUser.picture = response2.data.picture;
          cachedUserDetails.picture = response2.data.data;
          setUser(modifiedUser);
          await asyncStorage.store(DataConstants.DETAILS, cachedUserDetails);
        }
        return apiActivityStatus(response2, setApiActivity);
      },
      1000,
      true
    ),
    [user]
  );

  // ECHO CONDITION ACTION
  const handleMessageSelection = useCallback(
    debounce(
      async () => {
        setIsLoading(true);
        let modifiedUser = { ...user };

        const { data, ok, problem } = await usersApi.updateEchoWhenMessage();

        if (ok) {
          modifiedUser.echoWhen = data;
          await asyncStorage.store(DataConstants.ECHO_WHEN, data);
          setUser(modifiedUser);
          return setIsLoading(false);
        }

        if (data) {
          setIsLoading(false);
          return setInfoAlert({
            ...infoAlert,
            infoAlertMessage: data.message,
            showInfoAlert: true,
          });
        }

        setIsLoading(false);
        return setInfoAlert({
          ...infoAlert,
          infoAlertMessage: problem,
          showInfoAlert: true,
        });
      },
      1000,
      true
    ),
    [user]
  );

  const handlePhotoTapSelection = useCallback(
    debounce(
      async () => {
        setIsLoading(true);
        let modifiedUser = { ...user };

        const { data, ok, problem } = await usersApi.updateEchoWhenPhotoTap();

        if (ok) {
          modifiedUser.echoWhen = data;
          await asyncStorage.store(DataConstants.ECHO_WHEN, data);
          setUser(modifiedUser);
          return setIsLoading(false);
        }

        if (data) {
          setIsLoading(false);
          return setInfoAlert({
            infoAlertMessage: data.message,
            showInfoAlert: true,
          });
        }

        setIsLoading(false);
        return setInfoAlert({
          infoAlertMessage: problem,
          showInfoAlert: true,
        });
      },
      2000,
      true
    ),
    [user]
  );

  // NAME CHANGE ACTION
  const handleNameChange = useCallback(
    async (name) => {
      initialApiActivity(setApiActivity, "Updating your name...");
      let modifiedUser = { ...user };
      let cachedUserDetails = {
        _id: user._id,
        name: user.name,
        picture: user.picture,
        phoneNumber: user.phoneNumber,
      };

      const response = await usersApi.updateCurrentUserName(name);

      if (response.ok) {
        modifiedUser.name = response.data.name;
        cachedUserDetails.name = response.data.name;
        await asyncStorage.store(DataConstants.DETAILS, cachedUserDetails);
        setUser(modifiedUser);
      }
      return apiActivityStatus(response, setApiActivity);
    },
    [user]
  );

  // INVITE ACTION
  const handleInvitePress = useCallback(
    debounce(
      async () => {
        try {
          const result = await Share.share({
            message:
              "Join this awesome place and not hold anything back. Just say it",
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
          console.log(error.message);
        }
      },
      2000,
      true
    ),
    []
  );

  return (
    <>
      <Screen style={styles.container}>
        <AppHeader
          fwr={true}
          leftIcon="arrow-back"
          onPressLeft={handleBack}
          onPressRight={handleRightHeaderPress}
          rightIcon="gear"
          title="Profile"
        />
        <ApiActivity
          message={apiActivity.message}
          onDoneButtonPress={handleApiActivityClose}
          onRequestClose={handleApiActivityClose}
          processing={apiActivity.processing}
          success={apiActivity.success}
          visible={apiActivity.visible}
        />
        <Alert
          visible={showLogOut}
          title="Log Out"
          description="Are you sure you want to logout?"
          onRequestClose={handleCloseLogout}
          leftOption="Cancel"
          rightOption="Yes"
          leftPress={handleCloseLogout}
          rightPress={handleLogOutPress}
        />
        <LoadingIndicator visible={isLoading} />
        <InfoAlert
          leftPress={handleCloseInfoAlert}
          description={infoAlert.infoAlertMessage}
          visible={infoAlert.showInfoAlert}
        />
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={{ width: "100%" }}
        >
          <View style={styles.container}>
            <AddPicture
              icon={user.picture ? "edit" : "camera-alt"}
              image={user.picture}
              imageView={true}
              onChangeImage={handleImageChange}
              style={styles.addPicture}
            />
            <UserDetailsCard
              data={user.name}
              editable={true}
              fw={true}
              iconName="user-o"
              onNameChange={handleNameChange}
              size={scale(20)}
              style={styles.userDetailsName}
              title="Name"
              userName={user.name}
            />
            <UserDetailsCard
              data={user.phoneNumber.toString().slice(-10)}
              fw={true}
              iconName="phone"
              size={scale(20)}
              title="Phone Number"
            />
            <View style={styles.echoBox}>
              <AppText style={styles.echoWhen}>Echo when?</AppText>
              <Selection
                onPress={handleMessageSelection}
                opted={user.echoWhen.message}
                value="Someone sends you their thoughts."
              />
              <Selection
                onPress={handlePhotoTapSelection}
                opted={user.echoWhen.photoTap}
                value="Someone taps on your profile picture."
              />
            </View>
            <ProfileOption
              iconColor={defaultStyles.colors.tomato}
              onPress={handleInvitePress}
              title="Invite your friends"
              icon="people"
              style={styles.inviteOption}
            />
          </View>
        </ScrollView>
      </Screen>
      {visible || openReport ? <View style={styles.modalFallback} /> : null}
      <Modal
        animationType="slide"
        onRequestClose={() => setVisible(false)}
        transparent={true}
        visible={visible}
      >
        <View style={styles.optionsContainerBackground}>
          <View style={styles.closeMessageIconContainer}>
            <AntDesign
              onPress={() => setVisible(false)}
              name="downcircle"
              color={defaultStyles.colors.tomato}
              size={scale(28)}
            />
          </View>
          <View style={styles.optionsContainer}>
            <ProfileOption
              icon="block"
              onPress={handleBlockListPress}
              title="Blocklist"
            />
            <ProfileOption
              icon="library-books"
              onPress={handleSubscriptionPress}
              title="Subscriptions"
            />

            <ProfileOption
              icon="report-problem"
              onPress={handleReportPress}
              title="Report problem"
            />

            <ProfileOption
              icon="help-center"
              onPress={handleHelpPress}
              title="Help"
            />

            <ProfileOption
              icon="settings"
              onPress={handleSettingsPress}
              title="Settings"
            />

            <ProfileOption
              icon="logout"
              onPress={handleOpenLogout}
              title="Log Out"
            />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        onRequestClose={() => setOpenReport(false)}
        transparent={true}
        visible={openReport}
      >
        <View style={styles.reportModal}>
          <View style={styles.closeMessageIconContainer}>
            <AntDesign
              onPress={() => setOpenReport(false)}
              name="downcircle"
              color={defaultStyles.colors.tomato}
              size={scale(28)}
            />
          </View>
          <View style={styles.optionsContainerReport}>
            <AppTextInput
              maxLength={250}
              multiline={true}
              onChangeText={setProblemDescription}
              placeholder="Describe your problem..."
              subStyle={styles.inputProblem}
              style={styles.problemInput}
            />
            <View style={styles.actionContainer}>
              <AppText style={styles.problemDescriptionLength}>
                {problemDescription.length}/250
              </AppText>
              <AppButton
                disabled={
                  problemDescription.replace(/\s/g, "").length >= 1
                    ? false
                    : true
                }
                onPress={handleProblemSubmitPress}
                style={styles.submitProblemButton}
                subStyle={styles.submitProblemButtonSub}
                title="Submit"
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = ScaledSheet.create({
  actionContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "5@s",
    width: "100%",
  },
  addPicture: {
    marginTop: "10@s",
    marginBottom: "20@s",
  },
  container: {
    alignItems: "center",
    width: "100%",
  },
  closeMessageIconContainer: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "25@s",
    bottom: "-25@s",
    height: "40@s",
    justifyContent: "center",
    padding: "5@s",
    width: "40@s",
    zIndex: 222,
  },
  echoBox: {
    alignItems: "center",
    borderColor: defaultStyles.colors.light,
    borderTopWidth: 1,
    marginTop: "5@s",
    paddingTop: "10@s",
    width: "95%",
  },
  echoWhen: {
    alignSelf: "flex-start",
    fontSize: "15@s",
    paddingHorizontal: 10,
    opacity: 0.8,
  },
  inputProblem: {
    fontSize: "15@s",
    height: "100%",
    textAlignVertical: "top",
  },
  inviteOption: {
    borderColor: defaultStyles.colors.light,
    borderTopWidth: 1,
    marginVertical: "15@s",
    width: "95%",
  },
  modalFallback: {
    backgroundColor: "rgba(0,0,0,0.7)",
    height: "100%",
    position: "absolute",
    width: "100%",
    zIndex: 22,
  },
  optionsContainerBackground: {
    flex: 1,
    justifyContent: "flex-end",
    overflow: "hidden",
    width: "100%",
  },
  optionsContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderLeftColor: defaultStyles.colors.light,
    borderLeftWidth: 1,
    borderRightColor: defaultStyles.colors.light,
    borderRightWidth: 1,
    borderTopColor: defaultStyles.colors.light,
    borderTopLeftRadius: "10@s",
    borderTopRightRadius: "10@s",
    borderTopWidth: 1,
    bottom: 0,
    height: "260@s",
    overflow: "hidden",
    paddingTop: "20@s",
    width: "100%",
  },
  optionsContainerReport: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderLeftColor: defaultStyles.colors.light,
    borderLeftWidth: 1,
    borderRightColor: defaultStyles.colors.light,
    borderRightWidth: 1,
    borderTopColor: defaultStyles.colors.light,
    borderTopLeftRadius: "10@s",
    borderTopRightRadius: "10@s",
    borderTopWidth: 1,
    bottom: 0,
    height: "200@s",
    overflow: "hidden",
    paddingHorizontal: "10@s",
    paddingTop: "25@s",
    width: "100%",
  },
  problemInput: {
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.light,
    borderRadius: "5@s",
    borderWidth: 1,
    height: "100@s",
    marginBottom: "10@s",
    padding: "5@s",
  },
  problemDescriptionLength: {
    fontSize: "12@s",
  },
  reportModal: {
    flex: 1,
    justifyContent: "flex-end",
    overflow: "hidden",
    width: "100%",
  },
  submitProblemButton: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    height: "30@s",
    width: "60@s",
  },
  submitProblemButtonSub: {
    color: defaultStyles.colors.secondary,
  },
  userDetailsName: {
    borderBottomWidth: 1,
  },
});

export default ProfileScreen;

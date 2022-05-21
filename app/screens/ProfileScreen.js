import React, { useState, useCallback, useEffect, useRef } from "react";
import { ScrollView, Share, View, Text } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";

import AddPicture from "../components/AddPicture";
import Alert from "../components/Alert";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import EditNameModal from "../components/EditNameModal";
import InfoAlert from "../components/InfoAlert";
import LoadingIndicator from "../components/LoadingIndicator";
import ModalFallback from "../components/ModalFallback";
import ProfileOption from "../components/ProfileOption";
import ProfileOptionsModal from "../components/ProfileOptionsModal";
import ReportModal from "../components/ReportModal";
import Screen from "../components/Screen";
import Selection from "../components/Selection";
import UserDetailsCard from "../components/UserDetailsCard";

import Constant from "../navigation/NavigationConstants";

import storeDetails from "../utilities/storeDetails";
import debounce from "../utilities/debounce";
import apiActivity from "../utilities/apiActivity";
import createShortInviteLink from "../utilities/createDynamicLinks";

import useAuth from "../auth/useAuth";

import expoPushTokensApi from "../api/expoPushTokens";
import problemsApi from "../api/problems";
import usersApi from "../api/users";

import defaultStyles from "../config/styles";
import ScreenSub from "../components/ScreenSub";
import defaultProps from "../utilities/defaultProps";

function ProfileScreen({ navigation }) {
  const { user, setUser, logOut } = useAuth();
  let isUnmounting = false;
  const isFocused = useIsFocused();
  const { tackleProblem } = apiActivity;
  // STATES
  const [name, setName] = useState(user.name.trim());
  const [openEditName, setOpenEditName] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [visible, setVisible] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [problemDescription, setProblemDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });
  const [showLogOut, setShowLogOut] = useState(false);
  const [changingEcho, setChangingEcho] = useState(false);
  const [changingTapEcho, setChangingTapEcho] = useState(false);

  // OnUnmount
  useEffect(() => {
    return () => (isUnmounting = true);
  }, []);

  useEffect(() => {
    if (!isFocused && !isUnmounting && isLoading === true) {
      setIsLoading(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && !isUnmounting && infoAlert.showInfoAlert === true) {
      setInfoAlert({
        infoAlertMessage: "",
        showInfoAlert: false,
      });
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && !isUnmounting && showLogOut === true) {
      setShowLogOut(false);
    }
  }, [isFocused]);

  //LOG OUT ACTION
  const handleCloseLogout = useCallback(() => setShowLogOut(false), []);

  const handleOpenLogout = useCallback(() => setShowLogOut(true), []);

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
  }, []);

  const handleProblemSubmitPress = useCallback(async () => {
    setOpenReport(false);
    setIsLoading(true);

    const { ok, data, problem } = await problemsApi.registerProblem(
      problemDescription.trim()
    );

    if (ok) {
      setIsLoading(false);
      setProblemDescription("");
      return setInfoAlert({
        infoAlertMessage: data.message,
        showInfoAlert: true,
      });
    }

    setIsLoading(false);
    tackleProblem(problem, data, setInfoAlert);
  }, [problemDescription]);

  const handleLogOutPress = useCallback(async () => {
    setShowLogOut(false);
    expoPushTokensApi.removeToken();
    await logOut();
    return;
  }, []);

  const handleHelpPress = useCallback(() => {
    setVisible(false);
    navigation.navigate(Constant.HELP_SCREEN);
  }, []);

  const handleSettingsPress = useCallback(() => {
    setVisible(false);
    navigation.navigate(Constant.SETTINGS);
  }, []);

  const handleInsightsPress = useCallback(() => {
    setVisible(false);
    navigation.navigate(Constant.INSIGHTS_SCREEN);
  }, []);

  // PICTURE CHANGE ACTION
  const handleImageChange = useCallback(
    debounce(
      async (image) => {
        setIsLoading(true);

        let picture = image;

        if (image) {
          const { ok, data, problem } = await usersApi.updateCurrentUserPhoto(
            picture
          );
          if (ok) {
            await storeDetails(data.user);
            setUser(data.user);
            return setIsLoading(false);
          }
          setIsLoading(false);
          tackleProblem(problem, data, setInfoAlert);
        }

        const { ok, data, problem } = await usersApi.removeCurrentUserPhoto();
        if (ok) {
          await storeDetails(data.user);
          setUser(data.user);
          return setIsLoading(false);
        }
        setIsLoading(false);
        tackleProblem(problem, data, setInfoAlert);
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
        setChangingEcho(true);

        const { data, ok, problem } = await usersApi.updateEchoWhenMessage();

        if (ok) {
          await storeDetails(data.user);
          setUser(data.user);
          return setChangingEcho(false);
        }

        setChangingEcho(false);
        tackleProblem(problem, data, setInfoAlert);
      },
      1000,
      true
    ),
    [user]
  );

  const handlePhotoTapSelection = useCallback(
    debounce(
      async () => {
        setChangingTapEcho(true);

        const { data, ok, problem } = await usersApi.updateEchoWhenPhotoTap();

        if (ok) {
          await storeDetails(data.user);
          setUser(data.user);
          return setChangingTapEcho(false);
        }

        setChangingTapEcho(false);
        tackleProblem(problem, data, setInfoAlert);
      },
      2000,
      true
    ),
    [user]
  );

  // NAME CHANGE ACTION
  const handleNameChange = useCallback(async () => {
    setSavingName(true);

    const { ok, data, problem } = await usersApi.updateCurrentUserName(
      name.trim()
    );

    if (ok) {
      await storeDetails(data.user);
      setUser(data.user);
      setSavingName(false);
      setOpenEditName(false);
      return showMessage({
        ...defaultProps.alertMessageConfig,
        type: "success",
        message: "Name Updated.",
      });
    }
    setOpenEditName(false);
    setSavingName(false);
    tackleProblem(problem, data, setInfoAlert);
  }, [user, name]);

  // INVITE ACTION
  const handleInvitePress = useCallback(
    debounce(
      async () => {
        try {
          setIsLoading(true);
          let link = await createShortInviteLink();
          setIsLoading(false);
          const result = await Share.share({
            message: `Let's connect in a more interesting way than ever before. ${link}`,
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
    []
  );

  const doNull = useCallback(() => {}, []);

  return (
    <>
      <Screen style={styles.container}>
        <AppHeader
          leftIcon="arrow-back"
          onPressLeft={handleBack}
          onPressRight={handleRightHeaderPress}
          rightIcon="more-vert"
          title="Profile"
        />
        <ScreenSub>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={{ width: "100%" }}
            contentContainerStyle={{ flexGrow: 1 }}
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
                size={scale(18)}
                style={styles.userDetailsName}
                title="Name"
                onEditIconPress={() => setOpenEditName(true)}
              />
              <UserDetailsCard
                data={user.phoneNumber.toString().slice(-10)}
                fw={true}
                iconName="phone"
                size={scale(18)}
                title="Phone Number"
              />
              <View style={styles.echoBox}>
                <AppText style={styles.echoWhen}>Echo when?</AppText>
                <Selection
                  processing={changingEcho}
                  onPress={
                    !changingEcho && !changingTapEcho
                      ? handleMessageSelection
                      : doNull
                  }
                  opted={user.echoWhen.message}
                  value="Someone sends you their thoughts."
                />
                <Selection
                  processing={changingTapEcho}
                  onPress={
                    !changingTapEcho && !changingEcho
                      ? handlePhotoTapSelection
                      : doNull
                  }
                  opted={user.echoWhen.photoTap}
                  value="Someone taps on your profile picture."
                />
              </View>
              <ProfileOption
                onPress={handleInvitePress}
                title="Invite your friends"
                icon="people"
                style={styles.inviteOption}
              />
            </View>
          </ScrollView>
        </ScreenSub>
      </Screen>

      {visible || openReport ? <ModalFallback /> : null}
      <ProfileOptionsModal
        handleBlockListPress={handleBlockListPress}
        handleHelpPress={handleHelpPress}
        handleInsightsPress={handleInsightsPress}
        handleOpenLogout={handleOpenLogout}
        handleReportPress={handleReportPress}
        handleSettingsPress={handleSettingsPress}
        handleSubscriptionPress={handleSubscriptionPress}
        setVisible={setVisible}
        visible={visible}
      />
      <ReportModal
        handleProblemSubmitPress={handleProblemSubmitPress}
        isLoading={isLoading}
        openReport={openReport}
        problemDescription={problemDescription}
        setOpenReport={setOpenReport}
        setProblemDescription={setProblemDescription}
      />
      <EditNameModal
        name={name}
        setName={setName}
        handleNameChange={handleNameChange}
        savingName={savingName}
        openEditName={openEditName}
        setOpenEditName={setOpenEditName}
        user={user}
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
    </>
  );
}
const styles = ScaledSheet.create({
  text: {},
  body: {},
  addPicture: {
    marginTop: "10@s",
    marginBottom: "20@s",
  },
  container: {
    alignItems: "center",
    width: "100%",
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
  inviteOption: {
    borderColor: defaultStyles.colors.light,
    borderTopWidth: 1,
    marginTop: "25@s",
    width: "95%",
  },
  userDetailsName: {
    borderBottomWidth: 1,
  },
});

export default ProfileScreen;

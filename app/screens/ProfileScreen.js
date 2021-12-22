import React, { useState, useCallback, useEffect, useContext } from "react";
import { Modal, ScrollView, Share, View } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useIsFocused } from "@react-navigation/native";

import AddPicture from "../components/AddPicture";
import Alert from "../components/Alert";
import ApiProcessingContainer from "../components/ApiProcessingContainer";
import AppButton from "../components/AppButton";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import InfoAlert from "../components/InfoAlert";
import LoadingIndicator from "../components/LoadingIndicator";
import ModalFallback from "../components/ModalFallback";
import ProfileOption from "../components/ProfileOption";
import Screen from "../components/Screen";
import Selection from "../components/Selection";
import SuccessMessageContext from "../utilities/successMessageContext";
import UserDetailsCard from "../components/UserDetailsCard";

import Constant from "../navigation/NavigationConstants";

import storeDetails from "../utilities/storeDetails";
import debounce from "../utilities/debounce";
import apiActivity from "../utilities/apiActivity";

import useAuth from "../auth/useAuth";

import expoPushTokensApi from "../api/expoPushTokens";
import problemsApi from "../api/problems";
import usersApi from "../api/users";

import useMountedRef from "../hooks/useMountedRef";

import defaultStyles from "../config/styles";

function ProfileScreen({ navigation }) {
  const { user, setUser, logOut } = useAuth();
  const mounted = useMountedRef().current;
  const isFocused = useIsFocused();
  const { setSuccess } = useContext(SuccessMessageContext);
  const { tackleProblem, showSucessMessage } = apiActivity;

  // STATES
  const [name, setName] = useState(user.name);
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
    if (!isFocused && mounted && showLogOut === true) {
      setShowLogOut(false);
    }
  }, [isFocused, mounted]);

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
        infoAlertMessage: data.message,
        showInfoAlert: true,
      });
    }

    setIsLoading(false);
    tackleProblem(problem, data, setInfoAlert);
  }, [problemDescription]);

  const handleLogOutPress = useCallback(async () => {
    const { ok, data, problem } = await expoPushTokensApi.removeToken();
    if (ok) {
      return logOut();
    }
    tackleProblem(problem, data, setInfoAlert);
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
        setIsLoading(true);

        let picture = image;

        if (image) {
          const { ok, data, problem } = await usersApi.updateCurrentUserPhoto(
            picture
          );
          if (ok) {
            const res = await usersApi.getCurrentUser();
            if (res.ok && res.data) {
              if (res.data.__v > data.user.__v) {
                await storeDetails(res.data);
                setUser(res.data);
                return setIsLoading(false);
              }
            }
            await storeDetails(data.user);
            setUser(data.user);
            return setIsLoading(false);
          }
          setIsLoading(false);
          tackleProblem(problem, data, setInfoAlert);
        }

        const { ok, data, problem } = await usersApi.removeCurrentUserPhoto();
        if (ok) {
          const res = await usersApi.getCurrentUser();
          if (res.ok && res.data) {
            if (res.data.__v > data.user.__v) {
              await storeDetails(res.data);
              setUser(res.data);
              return setIsLoading(false);
            }
          }
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
        setIsLoading(true);

        const { data, ok, problem } = await usersApi.updateEchoWhenMessage();

        if (ok) {
          const res = await usersApi.getCurrentUser();
          if (res.ok && res.data) {
            if (res.data.__v > data.user.__v) {
              await storeDetails(res.data);
              setUser(res.data);
              return setIsLoading(false);
            }
          }

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

  const handlePhotoTapSelection = useCallback(
    debounce(
      async () => {
        setIsLoading(true);

        const { data, ok, problem } = await usersApi.updateEchoWhenPhotoTap();

        if (ok) {
          const res = await usersApi.getCurrentUser();
          if (res.ok && res.data) {
            if (res.data.__v > data.user.__v) {
              await storeDetails(res.data);
              setUser(res.data);
              return setIsLoading(false);
            }
          }

          await storeDetails(data.user);
          setUser(data.user);
          return setIsLoading(false);
        }

        setIsLoading(false);
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

    const { ok, data, problem } = await usersApi.updateCurrentUserName(name);

    if (ok) {
      const res = await usersApi.getCurrentUser();
      if (res.ok && res.data) {
        if (res.data.__v > data.user.__v) {
          await storeDetails(res.data);
          setUser(res.data);
          setSavingName(false);
          setOpenEditName(false);
          return showSucessMessage(setSuccess, "Name Updated.");
        }
      }

      await storeDetails(data.user);
      setUser(data.user);
      setSavingName(false);
      setOpenEditName(false);
      return showSucessMessage(setSuccess, "Name Updated.");
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
          leftIcon="arrow-back"
          onPressLeft={handleBack}
          onPressRight={handleRightHeaderPress}
          rightIcon="more-vert"
          title="Profile"
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
              size={scale(20)}
              style={styles.userDetailsName}
              title="Name"
              onEditIconPress={() => setOpenEditName(true)}
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
      {visible || openReport ? <ModalFallback /> : null}
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
      <Modal
        onRequestClose={() => setOpenEditName(false)}
        transparent={true}
        visible={openEditName}
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
                placeholder={user.name}
                style={styles.inputBox}
                subStyle={{ opacity: 0.8, paddingHorizontal: scale(5) }}
                value={name}
              />
              <AppText style={styles.nameLength}>{name.length}/30</AppText>
            </View>
            <View style={styles.actionButtonContainer}>
              <AppButton
                onPress={() => {
                  setOpenEditName(false);
                  setName(user.name);
                }}
                style={[
                  styles.button,
                  { backgroundColor: defaultStyles.colors.light },
                ]}
                subStyle={{ color: defaultStyles.colors.dark, opacity: 0.8 }}
                title="Cancel"
              />
              <ApiProcessingContainer
                processing={savingName}
                style={styles.apiProcessingContainer}
              >
                <AppButton
                  disabled={
                    name && name.replace(/\s/g, "").length >= 4 ? false : true
                  }
                  onPress={handleNameChange}
                  style={styles.button}
                  subStyle={styles.saveButtonSub}
                  title="Save"
                />
              </ApiProcessingContainer>
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

  actionButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  apiProcessingContainer: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "5@s",
    height: "30@s",
    marginHorizontal: "10@s",
    overflow: "hidden",
    width: "60@s",
  },
  button: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    height: "30@s",
    width: "60@s",
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
    borderTopRightRadius: "10@s",
    borderTopStartRadius: "10@s",
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
});

export default ProfileScreen;

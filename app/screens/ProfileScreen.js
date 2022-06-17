import React, { useState, useCallback, useEffect, useRef } from "react";
import { ScrollView, Share, View } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";

import AddPicture from "../components/AddPicture";
import Alert from "../components/Alert";
import AppHeader from "../components/AppHeader";
import EditNameModal from "../components/EditNameModal";
import InfoAlert from "../components/InfoAlert";
import LoadingIndicator from "../components/LoadingIndicator";
import ModalFallback from "../components/ModalFallback";
import ProfileOption from "../components/ProfileOption";
import ProfileOptionsModal from "../components/ProfileOptionsModal";
import ReportModal from "../components/ReportModal";
import Screen from "../components/Screen";
import UserDetailsCard from "../components/UserDetailsCard";
import AppText from "../components/AppText";
import FavoritePostsList from "../components/FavoritePostsList";
import AppActivityIndicator from "../components/ActivityIndicator";

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
import favoritePostsApi from "../api/favoritePosts";

function ProfileScreen({ navigation }) {
  const { user, setUser, logOut } = useAuth();
  let isUnmounting = false;
  let canShowOnProfileScreen = useRef(true);
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

  const [postsAreReady, setPostsAreReady] = useState(false);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // OnUnmount
  useEffect(() => {
    return () => (isUnmounting = true);
  }, []);

  useEffect(() => {
    if (isFocused && !isUnmounting && !canShowOnProfileScreen.current) {
      canShowOnProfileScreen.current = true;
    } else if (!isFocused && !isUnmounting) {
      canShowOnProfileScreen.current = false;
    }
  }, [isFocused]);

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
      if (canShowOnProfileScreen.current) {
        setInfoAlert({
          infoAlertMessage: data.message,
          showInfoAlert: true,
        });
      }
      return;
    }

    setIsLoading(false);
    if (!isUnmounting && canShowOnProfileScreen.current) {
      tackleProblem(problem, data, setInfoAlert);
    }
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
          if (canShowOnProfileScreen.current) {
            tackleProblem(problem, data, setInfoAlert);
          }
          return;
        }

        const { ok, data, problem } = await usersApi.removeCurrentUserPhoto();
        if (ok) {
          await storeDetails(data.user);
          setUser(data.user);
          return setIsLoading(false);
        }
        setIsLoading(false);
        if (canShowOnProfileScreen.current) {
          tackleProblem(problem, data, setInfoAlert);
        }
      },
      1000,
      true
    ),
    [user]
  );

  // NAME CHANGE ACTION

  const updateNameInput = (text) => {
    if (/^[^!-\/:-@\[-`{-~]+$/.test(text) || text === "") {
      setName(text.replace(/[^a-zA-Z0-9 ]/gm, ""));
    }
  };

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
    if (canShowOnProfileScreen.current) {
      tackleProblem(problem, data, setInfoAlert);
    }
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

  // FavoritePosts

  const getAllPosts = async () => {
    const { ok, data, problem } = await favoritePostsApi.getAllMyPosts();
    if (ok && !isUnmounting) {
      setPosts(data.sort((a, b) => a.createdAt < b.createdAt));
      return setPostsAreReady(true);
    }
    if (!isUnmounting) {
      setPostsAreReady(true);
    }
    if (canShowOnProfileScreen.current) {
      tackleProblem(problem, data, setInfoAlert);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getAllPosts();
    }
  }, [isFocused]);

  const handleSeeRepliesPress = useCallback((post) => {
    navigation.navigate(Constant.POST_DETAILS_POFILE, {
      id: post._id,
    });
  }, []);

  const handleOnRefresh = useCallback(async () => {
    setRefreshing(true);
    await getAllPosts();
    setRefreshing(false);
  }, []);

  return (
    <>
      <Screen>
        <AppHeader
          leftIcon="arrow-back"
          onPressLeft={handleBack}
          onPressRight={handleRightHeaderPress}
          rightIcon="more-vert"
          title="Profile"
        />
        <ScreenSub>
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
            <ProfileOption
              onPress={handleInvitePress}
              title="Invite your friends"
              icon="people"
              style={styles.inviteOption}
            />
            <AppText style={styles.allPostTitle}>All posts</AppText>
            <View style={styles.listContainer}>
              {!postsAreReady ? (
                <AppActivityIndicator />
              ) : (
                <>
                  {posts.length ? (
                    <FavoritePostsList
                      showReplyOption={false}
                      posts={posts}
                      onReplyPress={handleSeeRepliesPress}
                      onRefresh={handleOnRefresh}
                      refreshing={refreshing}
                    />
                  ) : (
                    <AppText style={styles.noPostInfo}>
                      No posts to show.
                    </AppText>
                  )}
                </>
              )}
            </View>
          </View>
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
        setName={updateNameInput}
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
  allPostTitle: {
    width: "100%",
    textAlign: "center",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    color: defaultStyles.colors.dark,
    paddingVertical: "7@s",
    // borderTopRightRadius: "20@s",
    // borderTopLeftRadius: "20@s",
  },
  text: {},
  body: {},
  addPicture: {
    marginTop: "10@s",
    marginBottom: "20@s",
  },
  container: {
    alignItems: "center",
    flex: 1,
    width: "100%",
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
  listContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.primary,
    flex: 1,
    width: "100%",
  },
  noPostInfo: {
    alignSelf: "center",
    color: defaultStyles.colors.white,
    marginTop: "100@s",
    textAlign: "center",
    width: "60%",
  },
});

export default ProfileScreen;

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Linking, View, PermissionsAndroid } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";

import Alert from "../components/Alert";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import CreateGroupModal from "../components/CreateGroupModal";
import ExploreGroupsModal from "../components/ExploreGroupsModal";
import InfoAlert from "../components/InfoAlert";
import LoadingIndicator from "../components/LoadingIndicator";
import MyGroupsModal from "../components/MyGroupsModal";
import ScannerBottomContent from "../components/ScannerBottomContent";
import ScannerTopContent from "../components/ScannerTopContent";
import Screen from "../components/Screen";
import ScreenSub from "../components/ScreenSub";

import defaultStyles from "../config/styles";

import NavigationConstants from "../navigation/NavigationConstants";

import groupsApi from "../api/groups";

import debounce from "../utilities/debounce";
import apiActivity from "../utilities/apiActivity";
import useAuth from "../auth/useAuth";
import usersApi from "../api/users";
import storeDetails from "../utilities/storeDetails";

function QrScannerScreen({ navigation, route }) {
  const isFocused = useIsFocused();
  const cameraRef = useRef(null);
  let canShowOnQrScreen = useRef(true);
  const { tackleProblem } = apiActivity;
  const { user, setUser } = useAuth();

  let isUnmounting = false;

  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  const [permitted, setPermitted] = useState(false);
  const [deletingGroupFromHistory, setDeletingGroupFromHistory] =
    useState(false);
  const [flash, setFlash] = useState(false);
  const [front, setFront] = useState(false);
  const [
    cameraAccessDeniedAlertVisibility,
    setCameraAccessDeniedAlertVisibility,
  ] = useState(false);

  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });

  const [checkingGroupName, setCheckingGroupName] = useState(false);

  const [showMyGroupsModal, setShowMyGroupsModal] = useState(false);
  const [showExplore, setShowExplore] = useState(false);

  const handleCloseExploreModal = () => setShowExplore(false);

  // INFO ALERT ACTIONS
  const handleCloseInfoAlert = useCallback(async () => {
    setInfoAlert({ infoAlertMessage: "", showInfoAlert: false });
  }, []);

  const handleCameraAccessDeniedAlertVisibility = useCallback(() => {
    setCameraAccessDeniedAlertVisibility(false);
  }, []);

  const permission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "SeeYot Camera Permission",
        message: "SeeYot needs access to your camera to scan.",
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const checkPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "SeeYot Camera Permission",
        message: "SeeYot needs access to your camera to scan.",
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return setPermitted(true);
    }

    setCameraAccessDeniedAlertVisibility(true);
  };

  const openPermissionSettings = useCallback(async () => {
    const cameraIsAccessible = await permission();

    if (cameraIsAccessible == true) {
      return setCameraAccessDeniedAlertVisibility(false);
    }
    setCameraAccessDeniedAlertVisibility(false);
    await Linking.openSettings();
  }, []);

  useEffect(() => {
    if (isFocused) {
      checkPermission();
    }
  }, [isFocused]);

  useEffect(() => {
    if (route.params && isFocused) {
      enterGroup(route.params.name, route.params.password);
    }
    if (!isFocused) {
      route.params = null;
    }
  }, [route.params, isFocused]);

  useEffect(() => {
    if (!isFocused && !isUnmounting) {
      if (checkingGroupName) {
        setCheckingGroupName(false);
      }
      if (infoAlert.showInfoAlert) {
        setInfoAlert({
          ...infoAlert,
          showInfoAlert: false,
        });
      }

      if (showCreateGroupModal) {
        setShowCreateGroupModal(false);
      }

      if (showMyGroupsModal) {
        setShowMyGroupsModal(false);
      }
      if (showExplore) {
        setShowExplore(false);
      }
    }
  }, [isFocused]);

  // on page mount and unmount
  useEffect(() => {
    return () => (isUnmounting = true);
  }, []);

  useEffect(() => {
    if (isFocused && !isUnmounting && !canShowOnQrScreen.current) {
      canShowOnQrScreen.current = true;
    } else if (!isFocused && !isUnmounting) {
      canShowOnQrScreen.current = false;
    }
  }, [isFocused]);

  const onSuccess = async (e) => {
    if (!checkingGroupName) {
      Linking.openURL(e.data);
    }
  };

  const handleCameraChange = useCallback(() => {
    setFront(!front);
  }, [front]);

  const handleFlashmode = useCallback(() => {
    setFlash(!flash);
  }, [flash]);

  const handleBackPress = useCallback(
    debounce(() => navigation.goBack(), 500, true),
    []
  );

  const handleVisitGroup = (name, password) => {
    setShowCreateGroupModal(false);
    navigation.navigate(NavigationConstants.GROUP_INFO_SCREEN, {
      groupName: name,
      password: password,
    });
  };

  const enterGroup = async (name, password) => {
    if (!isUnmounting) {
      setCheckingGroupName(true);
    }
    const { ok, data, problem } = await groupsApi.getGroupByName(
      name,
      password
    );
    if (ok && !isUnmounting) {
      setCheckingGroupName(false);
      return navigation.navigate(NavigationConstants.GROUP_INFO_SCREEN, {
        groupName: data.group.name,
        password: data.group.password ? data.group.password : "",
      });
    }
    setCheckingGroupName(false);
    if (!isUnmounting && canShowOnQrScreen.current) {
      tackleProblem(problem, data, setInfoAlert);
    }
  };

  const handleShowMyGroupsModal = () => {
    setShowMyGroupsModal(true);
  };

  const handleOpenMyGroup = (group) => {
    if (showMyGroupsModal) {
      setShowMyGroupsModal(false);
    } else if (showExplore) {
      setShowExplore(false);
    }
    enterGroup(group.name, group.password);
  };

  const handleAddEchoPress = (user) => {
    if (showMyGroupsModal) {
      setShowMyGroupsModal(false);
    } else if (showExplore) {
      setShowExplore(false);
    }
    navigation.navigate(NavigationConstants.ADD_ECHO_SCREEN, {
      recipient: user,
    });
  };

  const handleSendThoughtsPress = (user) => {
    if (showMyGroupsModal) {
      setShowMyGroupsModal(false);
    } else if (showExplore) {
      setShowExplore(false);
    }
    navigation.navigate(NavigationConstants.SEND_THOUGHT_SCREEN, {
      recipient: user,
    });
  };

  const removeFromGroupHistory = async (h) => {
    if (!isUnmounting) {
      setDeletingGroupFromHistory(h._id);
    }

    const { ok, data, problem } = await usersApi.removeGroupFromHistory(h._id);
    if (ok && !isUnmounting) {
      await storeDetails(data.user);
      setUser(data.user);
      return setDeletingGroupFromHistory("");
    }

    setDeletingGroupFromHistory("");
    if (!isUnmounting && canShowOnQrScreen.current) {
      tackleProblem(problem, data, setInfoAlert);
    }
  };

  const handleExplorePress = () => setShowExplore(true);

  return (
    <>
      <Screen>
        <AppHeader
          title="Select Group"
          leftIcon="arrow-back"
          onPressLeft={handleBackPress}
          rightIcon="group-add"
          onPressRight={() => setShowCreateGroupModal(true)}
        />
        <ScannerTopContent
          onSelectGroupFromHistory={enterGroup}
          checkingGroupName={checkingGroupName}
          onEnterGroupButtonPress={enterGroup}
          deletingGroupFromHistory={deletingGroupFromHistory}
          onDeleteFromGroupHistoryPress={removeFromGroupHistory}
          user={user}
        />
        <ScreenSub style={styles.screenSub}>
          {permitted ? (
            <QRCodeScanner
              cameraStyle={styles.cameraStyle}
              topViewStyle={{ height: 0 }}
              bottomViewStyle={{ height: 0 }}
              reactivateTimeout={3000}
              fadeIn={false}
              cameraType={front ? "front" : "back"}
              onRead={onSuccess}
              showMarker={true}
              markerStyle={{ borderRadius: 10 }}
              reactivate={true}
              flashMode={
                flash
                  ? RNCamera.Constants.FlashMode.torch
                  : RNCamera.Constants.FlashMode.off
              }
              ref={cameraRef}
              cameraProps={{
                notAuthorizedView: (
                  <View style={styles.notAuthorizedViewContainer}>
                    <AppText
                      onPress={() => setCameraAccessDeniedAlertVisibility(true)}
                      style={styles.notAuthorizedInfo}
                    >
                      Please give camera permission to scan.
                    </AppText>
                  </View>
                ),
              }}
            />
          ) : (
            <View style={styles.notAuthorizedViewContainer}>
              <AppText
                onPress={() => setCameraAccessDeniedAlertVisibility(true)}
                style={styles.notAuthorizedInfo}
              >
                Please give camera permission to scan.
              </AppText>
            </View>
          )}
        </ScreenSub>
        <ScannerBottomContent
          onMyGroupsButtonPress={handleShowMyGroupsModal}
          onExplorePress={handleExplorePress}
          permitted={permitted}
          front={front}
          flash={flash}
          handleCameraChange={handleCameraChange}
          handleFlashmode={handleFlashmode}
        />
      </Screen>
      <Alert
        visible={cameraAccessDeniedAlertVisibility}
        title="Camera Access Denied"
        description="Please give access to your camera to scan and enter group.."
        onRequestClose={handleCameraAccessDeniedAlertVisibility}
        leftOption="Cancel"
        rightOption="Ok"
        leftPress={handleCameraAccessDeniedAlertVisibility}
        rightPress={openPermissionSettings}
      />
      <LoadingIndicator visible={checkingGroupName} />
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
      <CreateGroupModal
        visible={showCreateGroupModal}
        onRequestClose={() => setShowCreateGroupModal(false)}
        onCreate={handleVisitGroup}
      />
      <MyGroupsModal
        isFocused={isFocused}
        onAddEchoPress={handleAddEchoPress}
        onSendThoughtsPress={handleSendThoughtsPress}
        visible={showMyGroupsModal}
        onGroupSelection={handleOpenMyGroup}
        setVisible={setShowMyGroupsModal}
      />
      <ExploreGroupsModal
        isFocused={isFocused}
        visible={showExplore}
        handleCloseModal={handleCloseExploreModal}
        onAddEchoPress={handleAddEchoPress}
        onGroupSelection={handleOpenMyGroup}
        onSendThoughtsPress={handleSendThoughtsPress}
      />
    </>
  );
}
const styles = ScaledSheet.create({
  cameraStyle: {
    height: "100%",
    flexShrink: 1,
  },
  notAuthorizedViewContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "100%",
  },
  notAuthorizedInfo: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "5@s",
    color: defaultStyles.colors.dark,
    padding: "10@s",
  },
  screenSub: {
    backgroundColor: defaultStyles.colors.primary,
    borderRadius: 0,
    paddingTop: "10@s",
  },
  scannerViews: {
    position: "absolute",
    top: -1500,
    backgroundColor: "white",
  },
});

export default QrScannerScreen;

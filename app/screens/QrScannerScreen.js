import React, { useState, useCallback, useEffect, useRef } from "react";
import { Linking, View, PermissionsAndroid, Platform } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";

import Alert from "../components/Alert";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import CreateGroupModal from "../components/CreateGroupModal";
import InfoAlert from "../components/InfoAlert";
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
import MyGroupsModal from "../components/MyGroupsModal";

function QrScannerScreen({ navigation }) {
  const isFocused = useIsFocused();
  const cameraRef = useRef(null);
  const { tackleProblem } = apiActivity;
  const { user } = useAuth();

  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  let svg = useRef();

  const [permitted, setPermitted] = useState(false);
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

  const onSuccess = async (e) => {
    await enterGroup(e.data);
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

  const handleVisitGroup = (name) => {
    setShowCreateGroupModal(false);
    navigation.navigate(NavigationConstants.GROUP_INFO_SCREEN, {
      groupName: name,
    });
  };

  const enterGroup = async (name) => {
    setCheckingGroupName(true);
    const { ok, data, problem } = await groupsApi.getGroupByName(name);
    if (ok) {
      setCheckingGroupName(false);
      return navigation.navigate(NavigationConstants.GROUP_INFO_SCREEN, {
        groupName: data.group.name,
      });
    }
    setCheckingGroupName(false);
    tackleProblem(problem, data, setInfoAlert);
  };

  const handleShowMyGroupsModal = () => {
    setShowMyGroupsModal(true);
  };

  const handleOpenMyGroup = (group) => {
    setShowMyGroupsModal(false);
    enterGroup(group);
  };

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
          onMyGroupsButtonPress={handleShowMyGroupsModal}
          user={user}
        />
        <ScreenSub style={styles.screenSub}>
          {permitted ? (
            <QRCodeScanner
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
          {permitted ? (
            <ScannerBottomContent
              front={front}
              flash={flash}
              handleCameraChange={handleCameraChange}
              handleFlashmode={handleFlashmode}
            />
          ) : null}
        </ScreenSub>
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
        visible={showMyGroupsModal}
        onGroupSelection={handleOpenMyGroup}
        setVisible={setShowMyGroupsModal}
      />
    </>
  );
}
const styles = ScaledSheet.create({
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
  screenSub: { backgroundColor: defaultStyles.colors.primary, borderRadius: 0 },
  scannerViews: {
    position: "absolute",
    top: -1500,
    backgroundColor: "white",
  },
});

export default QrScannerScreen;

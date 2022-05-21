import React, { useState, useCallback, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";

import AppText from "./AppText";
import ActiveUsersList from "./ActiveUsersList";

import defaultStyles from "../config/styles";
import AppModal from "./AppModal";
import AppHeader from "./AppHeader";
import EchoMessageModal from "./EchoMessageModal";

import defaultProps from "../utilities/defaultProps";

import usersApi from "../api/users";
import echosApi from "../api/echos";
import useAuth from "../auth/useAuth";

let defaultEchoState = {
  visible: false,
  recipient: defaultProps.defaultEchoMessageRecipient,
  echoMessage: { message: "" },
};

function TotalActiveUsers({
  totalActiveUsers,
  containerStyle,
  onSendThoughtsPress,
  onAddEchoPress,
  isFocused,
}) {
  const [showList, setShowList] = useState(false);
  const { user } = useAuth();

  let isUnmounting = false;

  useEffect(() => {
    return () => (isUnmounting = true);
  }, []);

  useEffect(() => {
    if (!isUnmounting && !isFocused && showList) {
      setShowList(false);
    }
    if (!isUnmounting && !isFocused && echoState.visible) {
      setEchoState(defaultEchoState);
    }
  }, [isFocused]);

  const handleListHeaderLeftPress = () => setShowList(false);
  const handleOpenList = () => setShowList(true);

  const [echoState, setEchoState] = useState(defaultEchoState);
  let showEchoMessage = false;

  const handleCloseEchoModal = useCallback(() => {
    showEchoMessage = false;
    setEchoState({ ...defaultEchoState, visible: false });
  });

  const handleEchoPress = (user) => {
    setShowList(false);
    onAddEchoPress(user);
  };
  const handleSendThoughtsPress = (user) => {
    setShowList(false);
    onSendThoughtsPress(user);
  };

  const getEchoMessage = useCallback(
    async (recipient) => {
      showEchoMessage = true;
      if (user._id != recipient._id) {
        usersApi.updatePhotoTapsCount(recipient._id);
      }
      setEchoState({ ...defaultEchoState, visible: true, recipient });
      const { data, problem, ok } = await echosApi.getEcho(recipient._id);
      if (ok && showEchoMessage === true) {
        setEchoState({ recipient, visible: true, echoMessage: data });
      }
    },
    [echoState]
  );

  return (
    <>
      <TouchableOpacity
        onPress={handleOpenList}
        activeOpacity={0.7}
        style={[styles.totalActivePeople, containerStyle]}
      >
        <AppText style={styles.totalActivePeopleCount}>
          {totalActiveUsers.length}
        </AppText>
        <MaterialIcons
          name="person-pin-circle"
          size={scale(16)}
          color={defaultStyles.colors.yellow_Variant}
        />
      </TouchableOpacity>
      <AppModal
        style={{ backgroundColor: defaultStyles.colors.white }}
        visible={showList}
        onRequestClose={() => setShowList(false)}
        animationType="slide"
      >
        <AppHeader
          leftIcon="arrow-back"
          title="Active Users"
          onPressLeft={handleListHeaderLeftPress}
        />
        <ActiveUsersList
          onAddEchoPress={handleEchoPress}
          onSendThoughtsPress={handleSendThoughtsPress}
          users={totalActiveUsers}
          onImagePress={getEchoMessage}
        />
        <EchoMessageModal
          handleCloseModal={handleCloseEchoModal}
          state={echoState}
        />
      </AppModal>
    </>
  );
}
const styles = ScaledSheet.create({
  totalActivePeople: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    borderColor: defaultStyles.colors.white,
    borderRadius: "5@s",
    borderWidth: 1,
    flexDirection: "row",
    height: "30@s",
    justifyContent: "center",
    paddingHorizontal: "5@s",
  },
  totalActivePeopleCount: {
    color: defaultStyles.colors.white,
  },
});

export default TotalActiveUsers;

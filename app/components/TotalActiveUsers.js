import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";

import AppText from "./AppText";
import ActiveUsersList from "./ActiveUsersList";

import defaultStyles from "../config/styles";
import AppModal from "./AppModal";
import AppHeader from "./AppHeader";

function TotalActiveUsers({
  totalActiveUsers,
  conatinerStyle,
  onSendThoughtsPress,
  onAddEchoPress,
}) {
  const [showList, setShowList] = useState(false);

  const handleListHeaderLeftPress = () => setShowList(false);
  const handleOpenList = () => setShowList(true);

  const handleEchoPress = (user) => {
    setShowList(false);
    onAddEchoPress(user);
  };
  const handleSendThoughtsPress = (user) => {
    setShowList(false);
    onSendThoughtsPress(user);
  };
  return (
    <>
      <TouchableOpacity
        onPress={handleOpenList}
        activeOpacity={0.7}
        style={[styles.totalActivePeople, conatinerStyle]}
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
        />
      </AppModal>
    </>
  );
}
const styles = ScaledSheet.create({
  totalActivePeople: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.dark_Variant,
    borderRadius: "5@s",
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

import React, { memo, useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import QRCode from "react-native-qrcode-svg";

import AppText from "./AppText";

import { SocketContext } from "../api/socketClient";

import defaultStyles from "../config/styles";
import TotalActiveUsers from "./TotalActiveUsers";

function MyGroupCard({ onPress, group }) {
  const socket = useContext(SocketContext);

  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    const listener = (data) => {
      setActiveUsers(data.activeUsers);
    };
    socket.on(group._id, listener);

    return () => {
      socket.off(group._id, listener);
    };
  }, [activeUsers, group._id]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <QRCode
        quietZone={10}
        enableLinearGradient={true}
        value={group.name}
        size={scale(80)}
      />
      <AppText style={styles.groupName}>{group.name}</AppText>
      <TotalActiveUsers
        conatinerStyle={styles.totalActiveCount}
        totalActiveUsers={activeUsers}
      />
    </TouchableOpacity>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "10@s",
    flex: 1,
    justifyContent: "center",
    marginHorizontal: "5@s",
    marginVertical: "5@s",
    padding: "10@s",
  },
  groupName: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "5@s",
    marginTop: "5@s",
    maxWidth: "100@s",
    paddingHorizontal: "6@s",
    textAlign: "center",
  },
  totalActiveCount: {
    marginTop: "3@s",
  },
});

export default memo(MyGroupCard);

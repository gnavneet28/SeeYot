import React, { memo, useContext, useEffect, useState } from "react";
import { ImageBackground, View } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";
import LottieView from "lottie-react-native";

import AppText from "./AppText";

import { SocketContext } from "../api/socketClient";

import defaultStyles from "../config/styles";
import TotalActiveUsers from "./TotalActiveUsers";

function MyGroupCard({
  onPress,
  group,
  onAddEchoPress,
  onSendThoughtsPress,
  user = { _id: "" },
}) {
  const socket = useContext(SocketContext);

  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    const listener = (data) => {
      if (activeUsers.filter((u) => u._id == data.activeUser._id).length < 1) {
        setActiveUsers([...activeUsers, data.activeUser]);
      }
    };

    socket.on(`addActive${group._id}`, listener);

    return () => {
      socket.off(`addActive${group._id}`, listener);
    };
  }, [activeUsers, group._id]);

  if (!group.name)
    return (
      <View style={styles.emptyData}>
        <LottieView
          autoPlay
          loop={false}
          source={"noresults.json"}
          style={{ width: 100, height: 100 }}
        />
      </View>
    );

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.imageBackground}
        blurRadius={4}
        resizeMode={group.picture ? "cover" : "contain"}
        source={{ uri: group.picture ? group.picture : "defaultgroupdp" }}
      >
        <View style={styles.groupHeader}>
          <View style={styles.groupIconType}>
            <MaterialIcons
              size={scale(15)}
              name={group.type == "Private" ? "person" : "public"}
              color={defaultStyles.colors.dark}
            />
          </View>
          <AppText style={styles.groupName}>{group.name}</AppText>
          <TotalActiveUsers
            onAddEchoPress={onAddEchoPress}
            onSendThoughtsPress={onSendThoughtsPress}
            conatinerStyle={styles.totalActiveCount}
            totalActiveUsers={activeUsers}
          />
        </View>
        <View style={styles.categoryContainer}>
          <AppText style={styles.categoryText}>{group.category}</AppText>
          <AppText style={styles.categoryText}>{group.subCategory}</AppText>
        </View>

        <View style={styles.groupFooter}>
          {group.createdBy._id == user._id ? (
            <AppText style={styles.blocked}>Blocked</AppText>
          ) : null}
          <AppText onPress={onPress} style={styles.visitGroupButton}>
            Visit
          </AppText>
        </View>
      </ImageBackground>
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "10@s",
    height: "135@s",
    marginBottom: "5@s",
    width: "95%",
    overflow: "hidden",
    elevation: 5,
  },
  groupName: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "5@s",
    maxWidth: "80%",
    paddingHorizontal: "6@s",
    textAlign: "center",
    fontSize: "13@s",
  },
  totalActiveCount: {
    position: "absolute",
    right: "5@s",
    top: "5@s",
  },
  groupHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    paddingHorizontal: "5@s",
    paddingTop: "5@s",
  },
  groupIconType: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "5@s",
    height: "20@s",
    justifyContent: "center",
    marginRight: "5@s",
    width: "20@s",
  },
  categoryContainer: {
    alignItems: "flex-start",
    marginTop: "10@s",
    paddingHorizontal: "5@s",
  },
  categoryText: {
    backgroundColor: defaultStyles.colors.secondary_Variant,
    borderRadius: "5@s",
    color: defaultStyles.colors.white,
    fontSize: "12@s",
    marginBottom: "2@s",
    paddingHorizontal: "5@s",
  },
  groupFooter: {
    alignItems: "center",
    flexDirection: "row",
    height: "35@s",
    justifyContent: "flex-start",
    marginTop: "10@s",
    paddingHorizontal: "5@s",
  },
  visitGroupButton: {
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.green,
    borderBottomLeftRadius: "10@s",
    borderTopLeftRadius: "10@s",
    color: defaultStyles.colors.white,
    paddingHorizontal: "20@s",
    paddingVertical: "8@s",
    position: "absolute",
    right: 0,
  },
  blocked: {
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: "5@s",
    color: defaultStyles.colors.white,
    fontSize: "13@s",
    paddingHorizontal: "10@s",
    paddingVertical: "5@s",
  },
  emptyData: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "5@s",
    height: "150@s",
    justifyContent: "center",
    width: "95%",
  },
  imageBackground: {
    backgroundColor: defaultStyles.colors.dark,
    height: "100%",
    width: "100%",
  },
});

export default memo(MyGroupCard);

import React, { memo, useContext, useEffect, useState } from "react";
import { ImageBackground, View, TouchableWithoutFeedback } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";
import LottieView from "lottie-react-native";

import AppText from "./AppText";

import { SocketContext } from "../api/socketClient";
import GroupContext from "../utilities/groupContext";

import defaultStyles from "../config/styles";
import TotalActiveUsers from "./TotalActiveUsers";
import GroupBlockedUsersModal from "./GroupBlockedUsersModal";
import ImageLoadingComponent from "./ImageLoadingComponent";

function MyGroupCard({
  onPress,
  groupItem,
  onAddEchoPress,
  onSendThoughtsPress,
  user = { _id: "" },
  showBlocked = false,
  isFocused,
}) {
  const socket = useContext(SocketContext);

  const [activeUsers, setActiveUsers] = useState([]);
  const [group, setGroup] = useState(groupItem);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [loaded, setLoaded] = useState(1);

  let isUnmounting = false;

  useEffect(() => {
    return () => (isUnmounting = true);
  }, []);

  useEffect(() => {
    if (!isUnmounting && !isFocused && showBlockedModal) {
      setShowBlockedModal(false);
    }
  }, [isFocused]);

  const handleLoadComplete = () => setLoaded(1);

  const handleCloseBlockedModal = () => {
    setShowBlockedModal(false);
  };

  const handleOnBlockedButtonPress = () => setShowBlockedModal(true);

  const handleOnPress = () => {
    onPress(group);
  };

  useEffect(() => {
    const listener = (data) => {
      if (activeUsers.filter((u) => u._id == data.activeUser._id).length < 1) {
        if (!isUnmounting) {
          setActiveUsers([...activeUsers, data.activeUser]);
        }
      }
    };

    socket.on(`addActive${group._id}`, listener);

    const listener2 = (data) => {
      let newActiveUsers = activeUsers.filter(
        (u) => u._id != data.activeUser._id
      );
      if (!isUnmounting) {
        setActiveUsers(newActiveUsers);
      }
    };

    socket.on(`removeActive${group._id}`, listener2);

    return () => {
      socket.off(`addActive${group._id}`, listener);
      socket.off(`removeActive${group._id}`, listener2);
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
    <GroupContext.Provider value={{ group, setGroup }}>
      <>
        <TouchableWithoutFeedback onPress={handleOnPress}>
          <View style={styles.container}>
            <ImageBackground
              onLoad={handleLoadComplete}
              onProgress={(e) =>
                setLoaded(e.nativeEvent.loaded / e.nativeEvent.total)
              }
              style={styles.imageBackground}
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
                  isFocused={isFocused}
                  onAddEchoPress={onAddEchoPress}
                  onSendThoughtsPress={onSendThoughtsPress}
                  containerStyle={styles.totalActiveCount}
                  totalActiveUsers={activeUsers}
                />
              </View>
              <View style={styles.categoryContainer}>
                <AppText style={styles.categoryText}>{group.category}</AppText>
                <AppText style={styles.categoryText}>
                  {group.subCategory}
                </AppText>
              </View>

              {showBlocked ? (
                <View style={styles.groupFooter}>
                  {group.createdBy._id == user._id ? (
                    <AppText
                      onPress={handleOnBlockedButtonPress}
                      style={styles.blocked}
                    >
                      {group.blocked ? group.blocked.length : 0} Blocked
                    </AppText>
                  ) : null}
                </View>
              ) : null}
            </ImageBackground>
            <ImageLoadingComponent
              progress={loaded}
              image={"defaultgroupdp"}
              defaultImage={"defaultgroupdp"}
            />
          </View>
        </TouchableWithoutFeedback>
        {group.blocked ? (
          <GroupBlockedUsersModal
            isVisible={showBlockedModal}
            handleCloseModal={handleCloseBlockedModal}
          />
        ) : null}
      </>
    </GroupContext.Provider>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "5@s",
    elevation: 5,
    height: "135@s",
    marginBottom: "3@s",
    overflow: "hidden",
    width: "95%",
  },
  groupName: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "5@s",
    color: defaultStyles.colors.dark,
    fontSize: "13@s",
    maxWidth: "80%",
    paddingHorizontal: "6@s",
    textAlign: "center",
  },
  totalActiveCount: {
    backgroundColor: "rgba(0,0,0,0.8)",
    borderColor: defaultStyles.colors.white,
    borderWidth: 1,
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
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.secondary,
    borderRadius: "5@s",
    borderWidth: 1,
    color: defaultStyles.colors.dark,
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
    backgroundColor: "rgba(0,0,0,0.8)",
    borderColor: defaultStyles.colors.white,
    borderRadius: "5@s",
    borderWidth: 1,
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

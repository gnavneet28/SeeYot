import React, { useState } from "react";
import { View, TextInput, ScrollView } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import ApiProcessingContainer from "./ApiProcessingContainer";
import AppButton from "./AppButton";

import defaultStyles from "../config/styles";
import GroupHistoryCard from "./GroupHistoryCard";

function ScannerTopContent({
  onEnterGroupButtonPress,
  style,
  checkingGroupName,
  user,
  onSelectGroupFromHistory,
  onMyGroupsButtonPress,
  onDeleteFromGroupHistoryPress,
  deletingGroupFromHistory,
}) {
  const [searchText, setSearchText] = useState("");

  return (
    <View style={[styles.topContentContainer, style]}>
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Enter group name or scan..."
          style={styles.inputBox}
          value={searchText}
          onChangeText={setSearchText}
          maxLength={100}
        />
        <ApiProcessingContainer
          processing={checkingGroupName}
          style={styles.buttonContainer}
        >
          <AppButton
            title="Enter"
            disabled={
              !checkingGroupName && searchText.replace(/\s/g, "").length >= 3
                ? false
                : true
            }
            onPress={
              searchText.replace(/\s/g, "").length >= 3
                ? () => onEnterGroupButtonPress(searchText)
                : null
            }
            style={styles.button}
            subStyle={styles.buttonSub}
          />
        </ApiProcessingContainer>
      </View>

      <View style={styles.groupsContainer}>
        {user.groupHistory.length ? (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.groupsInHistoryContainer}
          >
            {user.groupHistory.map((h, index) => (
              <GroupHistoryCard
                deletingGroup={deletingGroupFromHistory}
                onDeletePress={() => onDeleteFromGroupHistoryPress(h)}
                key={h._id}
                group={h}
                onPress={() => onSelectGroupFromHistory(h.name)}
              />
            ))}
          </ScrollView>
        ) : null}
      </View>
    </View>
  );
}
const styles = ScaledSheet.create({
  buttonContainer: {
    backgroundColor: defaultStyles.colors.light,
    borderBottomRightRadius: "20@s",
    borderTopRightRadius: "20@s",
    height: "35@s",
    overflow: "hidden",
    width: "60@s",
  },
  button: {
    backgroundColor: defaultStyles.colors.light,
    borderBottomRightRadius: "20@s",
    borderTopRightRadius: "20@s",
    height: "35@s",
    width: "100%",
  },
  buttonSub: {
    color: defaultStyles.colors.dark,
  },
  groupsInHistoryContainer: {
    alignItems: "center",
    flexGrow: 1,
    height: "40@s",
    paddingHorizontal: "5@s",
  },
  groupsContainer: {
    alignItems: "center",
    width: "100%",
  },
  inputBox: {
    backgroundColor: defaultStyles.colors.white,
    borderTopLeftRadius: "20@s",
    borderBottomLeftRadius: "20@s",
    flexShrink: 1,
    fontFamily: "ComicNeue-Bold",
    fontSize: "13@s",
    fontStyle: "normal",
    fontWeight: "normal",
    height: "35@s",
    marginRight: "5@s",
    paddingLeft: "15@s",
    width: "100%",
  },
  searchBox: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: "5@s",
    paddingVertical: "5@s",
    width: "100%",
  },
  topContentContainer: {
    backgroundColor: defaultStyles.colors.primary,
    flexShrink: 1,
    width: "100%",
  },
});

export default ScannerTopContent;

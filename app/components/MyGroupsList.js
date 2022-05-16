import React, { useCallback } from "react";
import { View, FlatList } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import MyGroupCard from "./MyGroupCard";

import defaultStyles from "../config/styles";

function MyGroupsList({
  groups,
  onPress,
  onAddEchoPress,
  onSendThoughtsPress,
}) {
  const keyExtractor = useCallback((item) => item._id.toString(), []);

  const renderItem = useCallback(
    ({ item }) => (
      <MyGroupCard
        onAddEchoPress={onAddEchoPress}
        onSendThoughtsPress={onSendThoughtsPress}
        onPress={onPress}
        group={item}
      />
    ),
    []
  );
  return (
    <View style={[styles.container]}>
      <FlatList
        keyboardShouldPersistTaps="handled"
        data={groups}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={15}
        windowSize={5}
        contentContainerStyle={styles.contentContainerStyle}
      />
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
  },
  contentContainerStyle: {
    width: defaultStyles.width,
    flexGrow: 1,
  },
});

export default MyGroupsList;

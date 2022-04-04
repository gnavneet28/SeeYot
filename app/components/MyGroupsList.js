import React, { useCallback } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

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
        onPress={() => onPress(item.name)}
        group={item}
      />
    ),
    []
  );
  return (
    <View style={[styles.container]}>
      <FlatList
        //ListEmptyComponent={ListEmptyComponent}
        keyboardShouldPersistTaps="handled"
        data={groups}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={15}
        windowSize={10}
        numColumns={2}
        contentContainerStyle={{
          width: defaultStyles.width,
          //backgroundColor: "tomato",
          flexGrow: 1,
        }}
      />
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
    // alignItems: "center",
  },
});

export default MyGroupsList;

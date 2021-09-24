import React, { useCallback, memo } from "react";
import { View, StyleSheet, FlatList } from "react-native";

import VipThoughtCard from "./VipThoughtCard";

function VipThoughtCardList({
  onThoughtCardPress = () => null,
  style,
  users = [],
}) {
  const renderItem = useCallback(
    ({ item }) => {
      return <VipThoughtCard onPress={onThoughtCardPress} user={item} />;
    },
    [users]
  );

  const keyExtractor = useCallback((item) => item._id);

  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={users}
        horizontal={true}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    height: 100,
  },
});

export default memo(VipThoughtCardList);

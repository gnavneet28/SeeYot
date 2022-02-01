import React, { useCallback, memo } from "react";
import { View, FlatList } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

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

  const getItemLayout = useCallback(
    (data, index) => ({
      length: scale(78),
      offset: scale(78) * index,
      index,
    }),
    []
  );

  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={users}
        getItemLayout={getItemLayout}
        horizontal={true}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    height: "80@s",
  },
});

export default memo(VipThoughtCardList);

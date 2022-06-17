import React, { useCallback, memo } from "react";
import { View, FlatList } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import FavoritePostReplyCard from "./FavoritePostReplyCard";

function FavoritePostReplyList({ replies = [], onReactIconPress }) {
  const keyExtractor = useCallback((item) => item._id.toString(), []);

  const renderItem = useCallback(
    ({ item }) => (
      <FavoritePostReplyCard reply={item} onReactIconPress={onReactIconPress} />
    ),
    []
  );

  return (
    <View style={[styles.container]}>
      <FlatList
        bounces={false}
        keyboardShouldPersistTaps="handled"
        data={replies}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        maxToRenderPerBatch={15}
        windowSize={7}
        decelerationRate={0.78}
        maintainVisibleContentPosition={{
          autoscrollToTopThreshold: 10,
          minIndexForVisible: 1,
        }}
      />
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    flex: 1,
    marginTop: "10@s",
    width: "100%",
  },
});

export default memo(FavoritePostReplyList);

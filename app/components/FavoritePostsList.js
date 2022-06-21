import React, { useCallback, memo } from "react";
import { View, FlatList } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import FavoritePostCard from "./FavoritePostCard";

function FavoritePostsList({
  posts = [],
  onReplyPress = () => {},
  refreshing,
  onRefresh,
  onMoreOptionsPress,
  showActionButton,
  showMoreOptions,
  showReplyOption,
  deleting,
  onDeletePress,
  showDeleteOption,
}) {
  const keyExtractor = useCallback((item) => item._id.toString(), []);

  const renderItem = useCallback(
    ({ item }) => (
      <FavoritePostCard
        onMoreOptionsPress={onMoreOptionsPress}
        post={item}
        onPress={onReplyPress}
        showMoreOptions={showMoreOptions}
        showActionButton={showActionButton}
        showReplyOption={showReplyOption}
        deleting={deleting}
        onDelete={onDeletePress}
        showDeleteOption={showDeleteOption}
      />
    ),
    []
  );

  return (
    <View style={[styles.container]}>
      <FlatList
        bounces={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        keyboardShouldPersistTaps="handled"
        data={posts}
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

export default memo(FavoritePostsList);

import React, { useCallback, memo, useMemo } from "react";
import { View, FlatList } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import GroupChatBubble from "./GroupChatBubble";
import useAuth from "../auth/useAuth";

function GroupMessagesList({
  groupMessages = [],
  group,
  onSelectReply,
  listRef,
  onImagePress,
  onImageLongPress,
}) {
  const { user } = useAuth();

  const keyExtractor = useCallback((item) => item._id.toString(), []);

  const renderItem = useCallback(
    ({ item }) => (
      <GroupChatBubble
        onImageLongPress={onImageLongPress}
        groupMessage={item}
        user={user}
        group={group}
        onImagePress={onImagePress}
        onSelectReply={onSelectReply}
      />
    ),
    [group._id]
  );

  return (
    <View style={[styles.container]}>
      <FlatList
        ref={listRef}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        data={[...groupMessages].reverse()}
        keyExtractor={keyExtractor}
        inverted={true}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        // removeClippedSubviews={true}
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
    paddingTop: "5@s",
    width: "100%",
  },
});

export default memo(GroupMessagesList);

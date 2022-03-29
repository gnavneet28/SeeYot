import React, { useCallback, memo } from "react";
import { View, FlatList } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import GroupChatBubble from "./GroupChatBubble";
import useAuth from "../auth/useAuth";

function GroupMessagesList({
  groupMessages = [],
  group,
  onLongPress = () => null,
  onSelectReply,
  listRef,
  onImagePress,
}) {
  const { user } = useAuth();

  const keyExtractor = useCallback((item) => item._id.toString(), []);

  const renderItem = useCallback(
    ({ item }) => (
      <GroupChatBubble
        mine={item.createdBy._id == user._id ? true : false}
        groupMessage={item}
        user={user}
        onImagePress={() => onImagePress(item.createdBy)}
      />
    ),
    [group._id]
  );

  return (
    <View style={[styles.container]}>
      <FlatList
        ref={listRef}
        bounces={false}
        keyboardShouldPersistTaps="never"
        data={[...groupMessages].reverse()}
        keyExtractor={keyExtractor}
        inverted={true}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={15}
        windowSize={7}
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

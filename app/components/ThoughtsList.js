import React, { useCallback, memo } from "react";
import { View, FlatList } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import ActiveChatBubble from "./ActiveChatBubble";

import useAuth from "../auth/useAuth";
import ThoughtBubble from "./ThoughtBubble";

function ThoughtsList({
  thoughts = [],
  recipient,
  activeChat,
  onLongPress = () => null,
  onSelectReply,
  listRef,
}) {
  const { user } = useAuth();

  const keyExtractor = useCallback((item) => item._id.toString(), []);

  const renderItem = useCallback(
    ({ item }) =>
      activeChat ? (
        <ActiveChatBubble
          recipient={recipient}
          user={user}
          activeChat={activeChat}
          thought={item}
          onSelectReply={onSelectReply}
        />
      ) : (
        <ThoughtBubble
          recipient={recipient}
          activeChat={activeChat}
          onLongPress={onLongPress}
          user={user}
          thought={item}
        />
      ),
    [activeChat, recipient._id]
  );

  return (
    <View style={[styles.container]}>
      <FlatList
        ref={listRef}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        data={[...thoughts].reverse()}
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

export default memo(ThoughtsList);

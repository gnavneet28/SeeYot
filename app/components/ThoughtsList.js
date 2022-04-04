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
          mine={item.createdBy == user._id ? true : false}
          thought={item}
          onSelectReply={() =>
            onSelectReply({
              message: item.message ? item.message : "",
              media: item.media ? item.media : "",
              createdBy: item.createdBy,
            })
          }
        />
      ) : (
        <ThoughtBubble
          recipient={recipient}
          activeChat={activeChat}
          onLongPress={() => onLongPress(item)}
          mine={item.createdBy == user._id ? true : false}
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

export default memo(ThoughtsList);

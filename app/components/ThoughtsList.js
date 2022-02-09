import React, { useCallback, memo } from "react";
import { View, FlatList } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import ChatListHeader from "./ChatListHeader";
import ChatBubble from "./ChatBubble";
import defaultStyles from "../config/styles";
import ActiveChatBubble from "./ActiveChatBubble";

import useAuth from "../auth/useAuth";

function ThoughtsList({
  thoughts = [],
  recipient,
  activeChat,
  onLongPress = () => null,
}) {
  const { user } = useAuth();

  const keyExtractor = useCallback((item) => item._id.toString(), []);

  const renderItem = useCallback(
    ({ item }) => (
      <ActiveChatBubble
        recipient={recipient}
        activeChat={activeChat}
        onLongPress={() => onLongPress(item)}
        mine={item.createdBy == user._id ? true : false}
        thought={item}
      />
    ),
    [activeChat, recipient._id]
  );

  const renderListFooter = useCallback(() => {
    return <ChatListHeader activeChat={activeChat} user={recipient} />;
  }, [recipient, user.contacts, activeChat]);

  return (
    <View style={[styles.container]}>
      <FlatList
        bounces={false}
        keyboardShouldPersistTaps="handled"
        data={[...thoughts].reverse()}
        keyExtractor={keyExtractor}
        ListFooterComponent={renderListFooter}
        inverted={-1}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={15}
        windowSize={10}
      />
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    flexShrink: 1,
    width: "100%",
  },
  typing: {
    backgroundColor: defaultStyles.colors.primary,
    paddingHorizontal: "10@s",
    paddingVertical: "5@s",
  },
});

export default memo(ThoughtsList);

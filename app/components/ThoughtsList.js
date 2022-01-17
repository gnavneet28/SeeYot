import React, { useCallback, memo } from "react";
import { View, StyleSheet, FlatList } from "react-native";

import ChatListHeader from "./ChatListHeader";
import ItemSeperatorComponent from "./ItemSeperatorComponent";
import ChatBubble from "./ChatBubble";

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
      <ChatBubble
        activeChat={activeChat}
        onLongPress={() => onLongPress(item)}
        mine={item.createdBy == user._id ? true : false}
        thought={item}
      />
    ),
    [activeChat]
  );

  const renderListHeader = useCallback(() => {
    return <ChatListHeader activeChat={activeChat} user={recipient} />;
  }, [recipient, user.contacts, activeChat]);

  return (
    <View style={[styles.container]}>
      <FlatList
        keyboardShouldPersistTaps="always"
        data={[...thoughts].reverse()}
        ItemSeperatorComponent={ItemSeperatorComponent}
        keyExtractor={keyExtractor}
        ListFooterComponent={renderListHeader}
        inverted={-1}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={15}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
    width: "100%",
  },
});

export default memo(ThoughtsList);

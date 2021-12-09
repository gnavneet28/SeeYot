import React, { useCallback, memo } from "react";
import { View, StyleSheet, FlatList } from "react-native";

import ChatListHeader from "./ChatListHeader";
import ItemSeperatorComponent from "./ItemSeperatorComponent";
import ThoughtCard from "./ThoughtCard";

import useAuth from "../auth/useAuth";

function ThoughtsList({ thoughts = [], recipient, activeChat }) {
  const { user } = useAuth();

  const keyExtractor = useCallback(
    (item, index) => item._id.toString(),
    [thoughts]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <ThoughtCard
        mine={item.createdBy == user._id ? true : false}
        thought={item}
      />
    ),
    []
  );

  const renderListHeader = useCallback(() => {
    return <ChatListHeader activeChat={activeChat} user={recipient} />;
  }, [recipient, user.contacts, activeChat]);

  return (
    <View style={[styles.container]}>
      <FlatList
        data={[...thoughts].reverse()}
        ItemSeperatorComponent={ItemSeperatorComponent}
        keyExtractor={keyExtractor}
        //ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListHeader}
        inverted={-1}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
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

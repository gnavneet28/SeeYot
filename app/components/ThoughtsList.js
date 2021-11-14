import React, { useCallback, memo } from "react";
import { View, StyleSheet, FlatList } from "react-native";

import ChatListHeader from "./ChatListHeader";
import ItemSeperatorComponent from "./ItemSeperatorComponent";
import ThoughtCard from "./ThoughtCard";

import useAuth from "../auth/useAuth";

function ThoughtsList({ thoughts = [], recipient }) {
  const { user } = useAuth();

  const keyExtractor = useCallback((item) => item._id.toString(), []);

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
    return <ChatListHeader user={recipient} />;
  }, [recipient, user.contacts]);

  return (
    <View style={[styles.container]}>
      <FlatList
        data={thoughts}
        ItemSeperatorComponent={ItemSeperatorComponent}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderListHeader}
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

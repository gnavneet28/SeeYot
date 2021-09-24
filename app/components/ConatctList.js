import React, { useCallback, memo } from "react";
import { View, StyleSheet, Animated } from "react-native";

import AppButton from "./AppButton";
import AppText from "./AppText";
import ContactCard from "./ContactCard";
import ItemSeperatorComponent from "./ItemSeperatorComponent";

import defaultStyles from "../config/styles";

function ContactList({
  users = [],
  style,
  onAddEchoPress,
  onSendThoughtsPress,
  refreshing,
  onAddFriendPress,
  onRefresh,
}) {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const getItemLayout = useCallback(
    (data, index) => ({
      length: 81,
      offset: 81 * index,
      index,
    }),
    []
  );

  const keyExtracter = useCallback((item) => item._id, []);

  const renderItem = useCallback(({ item, index }) => {
    const inputRange = [-1, 0, 81 * index, 81 * (index + 2)];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0],
    });
    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <ContactCard
          onAddEchoPress={onAddEchoPress}
          onSendThoughtsPress={onSendThoughtsPress}
          user={item}
        />
      </Animated.View>
    );
  }, []);

  const _itemSeperatorComponent = useCallback(
    () => <ItemSeperatorComponent style={styles.itemSeperatorCompnent} />,
    []
  );

  return (
    <View style={[styles.container, style]}>
      {users && users.length ? null : (
        <View style={styles.addFriendInfoContainer}>
          <AppText style={styles.emptyContacts}>
            No friends available. Add friends from your contacts and let them
            know you are thinking of them!
          </AppText>
          <AppButton
            onPress={onAddFriendPress}
            style={styles.addButton}
            subStyle={styles.addButtonSub}
            title="Add friends"
          />
        </View>
      )}
      <Animated.FlatList
        data={users}
        getItemLayout={getItemLayout}
        initialNumToRender={13}
        ItemSeparatorComponent={_itemSeperatorComponent}
        keyExtractor={keyExtracter}
        maxToRenderPerBatch={10}
        onRefresh={onRefresh}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        refreshing={refreshing}
        removeClippedSubviews={true}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        updateCellsBatchingPeriod={3000}
        windowSize={10}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  addButton: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: 25,
    height: 50,
    width: 150,
  },
  addButtonSub: {
    color: defaultStyles.colors.dark,
  },
  addFriendInfoContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  container: {
    flex: 1,
    width: "100%",
  },
  emptyContacts: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    width: "80%",
  },
  itemSeperatorCompnent: {
    backgroundColor: defaultStyles.colors.light,
    height: 1,
  },
});

export default memo(ContactList);

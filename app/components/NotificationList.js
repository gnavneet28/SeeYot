import React, { useCallback, memo } from "react";
import { View, StyleSheet, Animated } from "react-native";

import AppText from "./AppText";
import ItemSeperatorComponent from "./ItemSeperatorComponent";
import NotificationCard from "./NotificationCard";

import defaultStyles from "../config/styles";

function NotificationList({
  notifications = [],
  onDeleteIconPress,
  onRefresh,
  onTapToSeePress,
  refreshing = false,
}) {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const getItemLayout = useCallback(
    (data, index) => ({
      length: 71,
      offset: 71 * index,
      index,
    }),
    []
  );

  const keyExtracter = useCallback((item) => item._id, []);

  const renderItem = ({ item, index }) => {
    const inputRange = [-1, 0, 71 * index, 71 * (index + 2)];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0],
    });

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <NotificationCard
          onTapToSeePress={() => onTapToSeePress(item)}
          notification={item}
          onDeleteIconPress={() => onDeleteIconPress(item)}
        />
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {notifications && notifications.length >= 1 ? null : (
        <AppText style={styles.emptyNotificationInfo}>
          No notifications available.
        </AppText>
      )}
      <Animated.FlatList
        data={notifications}
        getItemLayout={getItemLayout}
        initialNumToRender={13}
        ItemSeparatorComponent={() => (
          <ItemSeperatorComponent style={styles.itemSeperatorComponent} />
        )}
        keyExtractor={keyExtracter}
        maxToRenderPerBatch={20}
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
        windowSize={5}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  emptyNotificationInfo: {
    fontSize: 18,
    textAlign: "center",
  },
  itemSeperatorComponent: {
    backgroundColor: defaultStyles.colors.light,
    height: 1,
  },
});

export default memo(NotificationList);

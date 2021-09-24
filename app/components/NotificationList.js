import React, { useCallback, memo } from "react";
import { View, StyleSheet, Animated } from "react-native";

import AppText from "./AppText";
import ItemSeperatorComponent from "./ItemSeperatorComponent";
import NotificationCard from "./NotificationCard";

import defaultStyles from "../config/styles";

function NotificationList({
  onDeleteIconPress,
  notifications = [],
  onRefresh,
  refreshing = false,
}) {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const getItemLayout = useCallback(
    (data, index) => ({
      length: 70,
      offset: 70 * index,
      index,
    }),
    []
  );

  const keyExtracter = useCallback((item) => item._id, []);

  const renderItem = ({ item, index }) => {
    const inputRange = [-1, 0, 70 * index, 70 * (index + 2)];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0],
    });

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <NotificationCard
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
          <ItemSeperatorComponent
            style={{ backgroundColor: defaultStyles.colors.light, height: 1 }}
          />
        )}
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
  container: {
    flex: 1,
    width: "100%",
  },
  emptyNotificationInfo: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default memo(NotificationList);

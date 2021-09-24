import React, { useCallback, memo } from "react";
import { View, StyleSheet, Animated, ActivityIndicator } from "react-native";

import ItemSeperatorComponent from "./ItemSeperatorComponent";
import ContactCard from "./ContactCard";

import defaultStyles from "../config/styles";

function VipSearchedUserList({
  isLoading = false,
  onAddEchoPress = () => null,
  onSendThoughtsPress = () => null,
  style,
  users = [],
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
          user={item}
          onAddEchoPress={onAddEchoPress}
          onSendThoughtsPress={onSendThoughtsPress}
        />
      </Animated.View>
    );
  }, []);

  return (
    <View style={[styles.container, style]}>
      <Animated.FlatList
        data={users}
        getItemLayout={getItemLayout}
        initialNumToRender={13}
        ItemSeparatorComponent={() => (
          <ItemSeperatorComponent style={styles.itemSeperatorComponent} />
        )}
        keyExtractor={keyExtracter}
        maxToRenderPerBatch={10}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        removeClippedSubviews={true}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        updateCellsBatchingPeriod={3000}
        windowSize={10}
      />
      <ActivityIndicator
        animating={isLoading}
        color={defaultStyles.colors.secondary}
        size={30}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
    width: "100%",
  },
  itemSeperatorComponent: {
    height: 1,
    backgroundColor: defaultStyles.colors.light,
  },
});

export default memo(VipSearchedUserList);

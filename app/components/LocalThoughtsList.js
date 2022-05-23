import React, { useCallback, memo } from "react";
import { View, FlatList } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import LocalThoughtCard from "./LocalThoughtCard";

import defaultStyles from "../config/styles";
import AppText from "./AppText";

const ListEmptyComponent = () => {
  return (
    <View style={styles.emptyComponentContainer}>
      <AppText style={styles.emptyThoughtsInfo}>Thoughts Empty</AppText>
    </View>
  );
};

function LocalThoughtsList({
  thoughts = [],
  onPress = () => null,
  onDeletePress = () => null,
}) {
  const keyExtractor = useCallback((item) => item._id.toString(), []);

  const renderItem = useCallback(
    ({ item }) => (
      <LocalThoughtCard
        onPress={onPress}
        thought={item}
        onDeletePress={onDeletePress}
      />
    ),
    []
  );

  return (
    <View style={[styles.container]}>
      <FlatList
        ListEmptyComponent={ListEmptyComponent}
        keyboardShouldPersistTaps="handled"
        data={[...thoughts].reverse()}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        // removeClippedSubviews={true}
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
  emptyComponentContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    height: "50@s",
    justifyContent: "center",
    width: "100%",
  },
  emptyThoughtsInfo: {
    textAlign: "center",
    color: defaultStyles.colors.placeholder,
    fontSize: "15@s",
  },
});

export default memo(LocalThoughtsList);

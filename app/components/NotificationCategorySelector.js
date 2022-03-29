import React, { useCallback, useRef } from "react";
import { View, FlatList } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import AppText from "./AppText";

import defaultProps from "../utilities/defaultProps";
import defaultStyles from "../config/styles";

function NotificationCategorySelector({ onPress, selected, style }) {
  const listRef = useRef(null);
  const keyExtractor = useCallback((item) => item.type, []);

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <AppText
          style={[
            styles.item,
            {
              backgroundColor:
                selected == item.alias
                  ? defaultStyles.colors.yellow_Variant
                  : defaultStyles.colors.light,
              color: defaultStyles.colors.dark,
            },
          ]}
          key={item.type}
          onPress={() => {
            if (item.alias == "Replies" || item.alias == "Matched Thoughts") {
              listRef.current.scrollToEnd({ animated: true });
            }
            if (item.alias == "Active Chat" || item.alias == "Add") {
              listRef.current.scrollToIndex({ index: 0, animated: true });
            }
            onPress(item);
          }}
        >
          {item.alias}
        </AppText>
      );
    },
    [selected]
  );
  return (
    <View style={[styles.container, style]}>
      <FlatList
        ref={listRef}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={defaultProps.notificationType.sort((a, b) => a.type > b.type)}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    justifyContent: "center",
    marginVertical: "8@s",
    paddingLeft: "5@s",
    width: "100%",
  },
  item: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "10@s",
    marginHorizontal: "5@s",
    paddingHorizontal: "10@s",
    paddingVertical: "10@s",
  },
});

export default NotificationCategorySelector;

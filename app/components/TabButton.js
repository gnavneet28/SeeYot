import React from "react";
import { TouchableHighlight } from "react-native";
import * as Animatable from "react-native-animatable";
import { ScaledSheet } from "react-native-size-matters";

import defaultstyles from "../config/styles";

const TabButton = (props) => {
  const {
    onPress,
    accessibilityState,
    children,
    animation,
    iterationCount = 1,
  } = props;
  const focused = accessibilityState.selected;

  return (
    <TouchableHighlight
      underlayColor={defaultstyles.colors.primary}
      onPress={onPress}
      style={styles.tabButton}
    >
      <Animatable.View
        iterationCount={iterationCount}
        animation={focused ? animation : ""}
        useNativeDriver={true}
        duration={800}
        style={styles.tabButton}
      >
        {children}
      </Animatable.View>
    </TouchableHighlight>
  );
};

const styles = ScaledSheet.create({
  tabButton: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});

export default TabButton;

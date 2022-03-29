import React from "react";
import { TouchableHighlight, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { ScaledSheet } from "react-native-size-matters";

import defaultstyles from "../config/styles";

const FavoriteTabButton = (props) => {
  const { onPress, accessibilityState, animation, children } = props;
  const focused = accessibilityState.selected;

  return (
    <View style={styles.buttonContainer}>
      <TouchableHighlight
        underlayColor={defaultstyles.colors.yellow_Variant}
        onPress={onPress}
        style={styles.tabButton}
      >
        <Animatable.View
          animation={focused ? animation : ""}
          useNativeDriver={true}
          duration={800}
        >
          {children}
        </Animatable.View>
      </TouchableHighlight>
    </View>
  );
};

const styles = ScaledSheet.create({
  buttonContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  tabButton: {
    alignItems: "center",
    backgroundColor: defaultstyles.colors.yellow_Variant,
    borderRadius: "10@s",
    bottom: "10@s",
    elevation: 10,
    flex: 1,
    justifyContent: "center",
    width: "75%",
  },
});

export default FavoriteTabButton;

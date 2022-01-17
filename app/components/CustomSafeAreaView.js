import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function CustomSafeAreaView({ children, style }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[{ flex: 1, paddingTop: insets.top }, style]}>{children}</View>
  );
}

export default CustomSafeAreaView;

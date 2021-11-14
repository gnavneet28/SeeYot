import React, { useState } from "react";
import { View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LottieView from "lottie-react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppTextInput from "./AppTextInput";

import defaultStyles from "../config/styles";

function SearchBox({
  loading = false,
  list = [],
  onChange = () => null,
  placeholder = "Search contacts...",
  style,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (text) => {
    setSearchTerm(text);
    onChange(text);
  };
  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputBoxContainer}>
        <Ionicons
          color={defaultStyles.colors.yellow_Variant}
          name="search-sharp"
          size={scale(22)}
        />
        <AppTextInput
          maxLength={50}
          onChangeText={(text) => handleChange(text)}
          placeholder={placeholder}
          style={styles.inputBox}
        />
      </View>
      {list.length < 1 && searchTerm.length >= 3 && !loading ? (
        <View style={styles.emptyData}>
          <LottieView
            autoPlay
            loop
            source={require("../assets/animations/noresults.json")}
            style={{ flex: 1 }}
          />
        </View>
      ) : null}
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.lightGrey,
    borderRadius: "25@s",
    borderWidth: 1,
    elevation: 2,
    marginVertical: "8@s",
    overflow: "hidden",
    width: "95%",
  },
  emptyData: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "5@s",
    height: "70@s",
    justifyContent: "center",
    width: "95%",
  },
  inputBoxContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    flexDirection: "row",
    height: "38@s",
    justifyContent: "space-between",
    paddingHorizontal: "10@s",
    width: "100%",
  },
  inputBox: {
    borderRadius: "20@s",
    flexShrink: 1,
    height: "36@s",
    marginHorizontal: "5@s",
    paddingHorizontal: "10@s",
    width: "100%",
  },
});

export default SearchBox;

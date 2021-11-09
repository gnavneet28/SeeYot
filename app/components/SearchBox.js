import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LottieView from "lottie-react-native";

import AppText from "./AppText";
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
          size={25}
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
const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.lightGrey,
    borderRadius: 25,
    borderWidth: 1,
    elevation: 2,
    marginVertical: 8,
    overflow: "hidden",
    width: "95%",
  },
  emptyData: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 5,
    height: 70,
    justifyContent: "center",
    width: "95%",
  },
  inputBoxContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    flexDirection: "row",
    height: 42,
    justifyContent: "space-between",
    paddingHorizontal: 10,
    width: "100%",
  },
  inputBox: {
    borderRadius: 20,
    flexShrink: 1,
    height: 40,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    width: "100%",
  },
});

export default SearchBox;

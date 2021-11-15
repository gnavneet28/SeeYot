import React from "react";
import { View, Modal, FlatList } from "react-native";
import countryCodes from "../assets/countryCodes";
import { ScaledSheet } from "react-native-size-matters";

import CountrySelectionCard from "./CountrySelectionCard";

import defaultStyles from "../config/styles";

function CountryPicker({ visible, setVisible, onPress }) {
  const keyExtractor = (item) => item.name.toString();

  const renderItem = ({ item, index }) => (
    <CountrySelectionCard country={item} onPress={() => onPress(item)} />
  );
  return (
    <Modal
      animationType="slide"
      onRequestClose={() => setVisible(false)}
      transparent
      visible={visible}
    >
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <FlatList
            data={countryCodes.sort((a, b) => a.name > b.name)}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
}
const styles = ScaledSheet.create({
  mainContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0)",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "10@s",
    height: "70%",
    justifyContent: "center",
    overflow: "hidden",
    width: "80%",
  },
});

export default CountryPicker;

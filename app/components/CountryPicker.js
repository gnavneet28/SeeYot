import React, { useCallback } from "react";
import { View, StyleSheet, Modal, FlatList } from "react-native";
import countryCodes from "../assets/countryCodes";

import CountrySelectionCard from "./CountrySelectionCard";

import defaultStyles from "../config/styles";

function CountryPicker({ visible, setVisible, onPress }) {
  const keyExtractor = (item) => item.name.toString();

  const renderItem = ({ item, index }) => (
    <CountrySelectionCard country={item} onPress={() => onPress(item)} />
  );
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => setVisible(false)}
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
const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    justifyContent: "center",
    width: "80%",
    overflow: "hidden",
    height: "70%",
    borderRadius: 10,
  },
});

export default CountryPicker;

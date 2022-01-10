import React from "react";
import { View, Modal, FlatList } from "react-native";
import countryCodes from "../assets/countryCodes";
import { ScaledSheet } from "react-native-size-matters";

import CountrySelectionCard from "./CountrySelectionCard";

import defaultStyles from "../config/styles";
import AppText from "./AppText";

const ListHeaderComponent = () => {
  return (
    <View style={styles.listHeaderComponentContainer}>
      <AppText style={styles.listHeaderComponentContainerTitle}>
        Select your Country Code
      </AppText>
    </View>
  );
};

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
          <ListHeaderComponent />
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
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.yellow_Variant,
    borderRadius: "20@s",
    borderWidth: "2@s",
    elevation: 15,
    height: "70%",
    justifyContent: "center",
    overflow: "hidden",
    width: "82%",
  },
  listHeaderComponentContainer: {
    backgroundColor: defaultStyles.colors.secondary,
    height: "40@s",
    width: "100%",
  },
  listHeaderComponentContainerTitle: {
    color: defaultStyles.colors.yellow_Variant,
    height: "38@s",
    textAlign: "center",
    textAlignVertical: "center",
    width: "100%",
  },
  mainContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0)",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
});

export default CountryPicker;

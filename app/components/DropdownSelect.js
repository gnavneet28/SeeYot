import React, { useState } from "react";
import { FlatList, View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import AppText from "./AppText";
import AppModal from "./AppModal";
import Option from "./Option";

import defaultStyles from "../config/styles";

const DropdownSelect = ({
  selected,
  defaultPlaceholder = "Select Category",
  data,
  onOptionSelection,
  containerStyle,
}) => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const renderItem = ({ item }) => (
    <Option
      title={item}
      onPress={() => {
        onOptionSelection(item);
        setOpenModal(false);
      }}
    />
  );

  const keyExtractor = (item, index) => item + index.toString();
  return (
    <>
      <AppText
        onPress={handleOpenModal}
        style={[styles.container, containerStyle]}
      >
        {selected ? selected : defaultPlaceholder}
      </AppText>
      <AppModal visible={openModal} onRequestClose={handleCloseModal}>
        <View style={styles.listContainer}>
          <Option
            onPress={handleCloseModal}
            title="Close"
            titleStyle={styles.optionClose}
          />
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
          />
        </View>
      </AppModal>
    </>
  );
};

const styles = ScaledSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.lightGrey,
    borderRadius: "5@s",
    borderWidth: 1,
    flexShrink: 1,
    fontSize: "12@s",
    paddingVertical: "8@s",
    textAlign: "center",
    width: "100%",
  },
  listContainer: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "10@s",
    maxHeight: "60%",
    overflow: "hidden",
    width: "60%",
  },
  optionClose: {
    backgroundColor: defaultStyles.colors.dark_Variant,
    borderColor: defaultStyles.colors.white,
    borderTopLeftRadius: "10@s",
    borderTopRightRadius: "10@s",
    borderWidth: 1,
    color: defaultStyles.colors.white,
    opacity: 1,
  },
});

export default DropdownSelect;

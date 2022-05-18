import React, { useState } from "react";
import { FlatList, View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

import AppText from "./AppText";
import AppModal from "./AppModal";
import Option from "./Option";

import defaultStyles from "../config/styles";
import ModalBackDrop from "./ModalBackDrop";

const optionsVibrate = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
};

const DropdownAlbumSelect = ({
  selected,
  defaultPlaceholder = "Select Category",
  data = [],
  onOptionSelection,
  containerStyle,
}) => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const renderItem = ({ item }) => (
    <Option
      titleStyle={{
        color:
          selected == item.title
            ? defaultStyles.colors.blue
            : defaultStyles.colors.dark,
      }}
      title={item.title}
      onPress={() => {
        ReactNativeHapticFeedback.trigger("impactMedium", optionsVibrate);
        onOptionSelection(item);
        setOpenModal(false);
      }}
    />
  );

  const doNull = () => {};

  const keyExtractor = (item, index) => item + index.toString();
  return (
    <>
      <AppText
        style={[styles.container, containerStyle]}
        onPress={data.length ? handleOpenModal : doNull}
      >
        {selected ? selected : defaultPlaceholder}
      </AppText>
      <AppModal visible={openModal} onRequestClose={handleCloseModal}>
        <ModalBackDrop onPress={handleCloseModal}>
          <View style={styles.modalContentContainer}>
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
          </View>
        </ModalBackDrop>
      </AppModal>
    </>
  );
};

const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.lightGrey,
    borderRadius: "5@s",
    borderWidth: 1,
    color: defaultStyles.colors.secondary,
    flexDirection: "row",
    flexShrink: 1,
    fontSize: "14@s",
    justifyContent: "space-between",
    paddingVertical: "8@s",
    textAlign: "center",
    textAlignVertical: "center",
    width: "100%",
  },
  listContainer: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "15@s",
    maxHeight: "60%",
    overflow: "hidden",
    width: "60%",
  },
  modalContentContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  optionClose: {
    backgroundColor: defaultStyles.colors.dark_Variant,
    borderColor: defaultStyles.colors.white,
    borderTopLeftRadius: "15@s",
    borderTopRightRadius: "15@s",
    borderWidth: 1,
    color: defaultStyles.colors.white,
    opacity: 1,
  },
});

export default DropdownAlbumSelect;

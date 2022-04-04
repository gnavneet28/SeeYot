import React from "react";
import { View, FlatList } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import GalleryImage from "./GalleryImage";

import defaultStyles from "../config/styles";

function GalleryImages({ data, onImageSelection, selectedImage }) {
  const renderItem = ({ item }) => (
    <GalleryImage
      selected={selectedImage}
      onPress={() => onImageSelection(item)}
      uri={item}
    />
  );
  const keyExtractor = (item, index) => item.toString();
  return (
    <>
      <View style={styles.container}>
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={data}
          renderItem={renderItem}
          numColumns={3}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={20}
          windowSize={10}
        />
      </View>
    </>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.primary,
    borderTopLeftRadius: "10@s",
    borderTopRightRadius: "10@s",
    flex: 1,
    overflow: "hidden",
    width: "100%",
  },
});

export default GalleryImages;

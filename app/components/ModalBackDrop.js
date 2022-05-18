import React from "react";
import { TouchableWithoutFeedback } from "react-native";

const ModalBackDrop = ({ children, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default ModalBackDrop;

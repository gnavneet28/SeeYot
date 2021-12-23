import colors from "./colors";
import { Platform, Dimensions } from "react-native";
import { scale } from "react-native-size-matters";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const dimensionConstants = {
  height: 45,
  borderRadius: 5,
};

export default {
  width,
  height,
  colors,
  dimensionConstants,
  text: {
    color: colors.dark,
    fontSize: scale(14),
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
  },
};

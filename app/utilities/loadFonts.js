import cache from "./cache";
import { Asset } from "expo-asset";

const requiredFonts = [
  { name: "Comic-Bold", value: require("../assets/fonts/ComicNeue-Bold.ttf") },
];

const loadFont = (fontName) => {
  return cache.get(fontName);
};

function cacheFonts() {
  return requiredFonts.map((font) => {
    return Asset.fromModule(font.value)
      .downloadAsync()
      .then(async (asset) => await cache.store(font.name, asset.localUri))
      .catch((err) => console.log(err));
  });
}

export default {
  cacheFonts,
  loadFont,
};

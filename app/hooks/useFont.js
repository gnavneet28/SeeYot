import * as Font from "expo-font";
import { useState } from "react";

export default function useFont() {
  console.log("FontLoad rendering");
  const [fontLoaded, setFontLoaded] = useState(false);

  const loadFont = async () => {
    await Font.loadAsync({
      "Comic-Bold": require("../assets/fonts/ComicNeue-Bold.ttf"),
      "Comic-BoldItalic": require("../assets/fonts/ComicNeue-BoldItalic.ttf"),
      // "Comic-Italic": require("../assets/fonts/ComicNeue-Italic.ttf"),
      // "Comic-Light": require("../assets/fonts/ComicNeue-Light.ttf"),
      //"Comic-LightItalic": require("../assets/fonts/ComicNeue-LightItalic.ttf"),
      // "Comic-Regular": require("../assets/fonts/ComicNeue-Regular.ttf"),
      // "Fat-Face": require("../assets/fonts/AbrilFatface-Regular.ttf"),
    }).then(() => setFontLoaded(true));
  };

  return {
    fontLoaded,
    loadFont,
    setFontLoaded,
  };
}

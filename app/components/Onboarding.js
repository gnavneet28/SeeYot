import React, { useState, useRef, useContext } from "react";
import { View, StyleSheet, FlatList, Animated } from "react-native";

import OnboardingItem from "./OnboardingItem";
import Paginator from "../components/Paginator";
import NextButton from "./NextButton";

import defaultStyles from "../config/styles";

import Data from "../config/data";

import cache from "../utilities/cache";
import OnboardingContext from "../utilities/onboardingContext";

function Onboarding(props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const { setOnboarded } = useContext(OnboardingContext);

  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = async () => {
    if (currentIndex < Data.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await cache.store("onboarded", "true");
      return setOnboarded(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={Data}
          renderItem={({ item }) => <OnboardingItem item={item} />}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item._id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: false,
            }
          )}
          scrollEventThrottle={32}
          viewabilityConfig={viewConfig}
          onViewableItemsChanged={viewableItemsChanged}
          ref={slidesRef}
        />
      </View>
      <Paginator data={Data} scrollX={scrollX} />
      <NextButton
        scrollTo={scrollTo}
        percentage={(currentIndex + 1) * (100 / Data.length)}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    flex: 1,
    justifyContent: "center",
  },
  listContainer: {
    backgroundColor: defaultStyles.colors.white,
    flex: 3,
  },
});

export default Onboarding;

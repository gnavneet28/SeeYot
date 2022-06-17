import React, { useCallback } from "react";
import { ScaledSheet } from "react-native-size-matters";

import Screen from "../components/Screen";
import ScreenSub from "../components/ScreenSub";
import AppHeader from "../components/AppHeader";

import debounce from "../utilities/debounce";
import FavoritePostCard from "../components/FavoritePostCard";
import FavoritePostReplyCard from "../components/FavoritePostReplyCard";

const ReactionDetailsScreen = ({ navigation, route }) => {
  const { post, reaction } = route.params;

  // HEADER ACTIONS
  const handleBack = useCallback(
    debounce(
      () => {
        navigation.goBack();
      },
      500,
      true
    ),
    []
  );
  return (
    <Screen>
      <AppHeader
        leftIcon="arrow-back"
        onPressLeft={handleBack}
        title="Reactions"
        iconLeftCategory="MaterialIcons"
      />

      <ScreenSub style={styles.container}>
        <FavoritePostCard post={post} showActionButton={false} />
        <FavoritePostReplyCard reply={reaction} showReactionOptions={false} />
      </ScreenSub>
    </Screen>
  );
};

const styles = ScaledSheet.create({
  container: {
    paddingTop: "15@s",
  },
});

export default ReactionDetailsScreen;

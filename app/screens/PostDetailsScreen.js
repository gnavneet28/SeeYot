import React, { useState, useEffect, useCallback, useRef } from "react";
import { ScaledSheet, scale } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";

import Screen from "../components/Screen";
import ScreenSub from "../components/ScreenSub";
import AppHeader from "../components/AppHeader";
import InfoAlert from "../components/InfoAlert";
import AppActivityIndicator from "../components/ActivityIndicator";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

import debounce from "../utilities/debounce";
import defaultStyles from "../config/styles";
import FavoritePostCard from "../components/FavoritePostCard";

import apiActivity from "../utilities/apiActivity";

import favoritePostsApi from "../api/favoritePosts";
import AppText from "../components/AppText";
import FavoritePostReplyList from "../components/FavoritePostReplyList";
import FavoritePostOptionsModal from "../components/FavoritePostOptionsModal";

import defaultProps from "../utilities/defaultProps";

const optionsVibrate = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
};

const PostDetailsScreen = ({ navigation, route }) => {
  const { tackleProblem } = apiActivity;

  let id = route.params ? route.params.id : "";

  let isUnmounting = false;
  let canShowOnPostDetailsScreen = useRef(true);

  const isFocused = useIsFocused();

  const [isReady, setIsReady] = useState(false);
  const [post, setPost] = useState(defaultProps.favoritePost);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });
  const [showOptions, setShowOptions] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [disabling, setDisabling] = useState(false);

  // OnUnmount
  useEffect(() => {
    return () => (isUnmounting = true);
  }, []);

  useEffect(() => {
    if (isFocused && !isUnmounting && !canShowOnPostDetailsScreen.current) {
      canShowOnPostDetailsScreen.current = true;
    } else if (!isFocused && !isUnmounting) {
      canShowOnPostDetailsScreen.current = false;
    }
  }, [isFocused]);

  const getDetails = async () => {
    setIsReady(false);
    const { ok, data, problem } = await favoritePostsApi.getPostDetails(id);
    if (ok && !isUnmounting) {
      setPost(data);
      return setIsReady(true);
    }

    if (!isUnmounting) {
      setIsReady(true);
    }
    if (canShowOnPostDetailsScreen.current) {
      tackleProblem(problem, data, setInfoAlert);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getDetails();
    } else if (!isFocused) {
      setPost(defaultProps.favoritePost);
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && infoAlert.showInfoAlert && !isUnmounting) {
      setInfoAlert({ showInfoAlert: false, infoAlertMessage: "" });
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && showOptions && !isUnmounting) {
      setShowOptions(false);
    }
  }, [isFocused]);

  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

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

  // TODO: Simulate slow network.
  const handleReactIconPress = useCallback(
    async (reply, type) => {
      ReactNativeHapticFeedback.trigger("impactMedium", optionsVibrate);
      let initialPost = { ...post };
      const { ok, data, problem } = await favoritePostsApi.addReaction(
        id,
        reply._id,
        type
      );
      if (ok && !isUnmounting) {
        return setPost(data);
      }

      if (!isUnmounting) {
        setPost(initialPost);
      }
      if (canShowOnPostDetailsScreen.current) {
        tackleProblem(problem, data, setInfoAlert);
      }
    },
    [post]
  );

  const handleShowOptions = useCallback(() => {
    setShowOptions(true);
  }, []);

  const handleCloseOptions = useCallback(() => {
    setShowOptions(false);
  }, []);

  const handleDisableReplies = useCallback(async () => {
    setDisabling(true);
    const { ok, data, problem } = await favoritePostsApi.disableReplies(
      post._id
    );
    if (ok && !isUnmounting) {
      setPost(data);
      return setDisabling(false);
    }

    if (!isUnmounting) {
      setDisabling(false);
    }
    if (canShowOnPostDetailsScreen.current) {
      tackleProblem(problem, data, setInfoAlert);
    }
  }, [post]);

  const handleEnableReplies = useCallback(async () => {
    setDisabling(true);
    const { ok, data, problem } = await favoritePostsApi.enableReplies(
      post._id
    );
    if (ok && !isUnmounting) {
      setPost(data);
      return setDisabling(false);
    }

    if (!isUnmounting) {
      setDisabling(false);
    }
    if (canShowOnPostDetailsScreen.current) {
      tackleProblem(problem, data, setInfoAlert);
    }
  }, [post]);

  const handleDeletePress = useCallback(async () => {
    setDeleting(true);
    const { ok, problem, data } = await favoritePostsApi.deletePost(post._id);
    if (ok && !isUnmounting) {
      setDeleting(false);
      setPost(defaultProps.favoritePost);
      return navigation.goBack();
    }
    if (!isUnmounting) {
      setDeleting(false);
    }
    if (canShowOnPostDetailsScreen.current) {
      tackleProblem(problem, data, setInfoAlert);
    }
  }, [post]);

  return (
    <>
      <Screen>
        <AppHeader
          leftIcon="arrow-back"
          onPressLeft={handleBack}
          title="Replies"
          iconLeftCategory="MaterialIcons"
        />
        <ScreenSub style={styles.container}>
          {!isReady ? (
            <AppActivityIndicator size={scale(30)} />
          ) : (
            <>
              {post._id ? (
                <>
                  <FavoritePostCard
                    onMoreOptionsPress={handleShowOptions}
                    post={post}
                    showActionButton={false}
                    showMoreOptions={true}
                  />
                  <AppText style={styles.replyTitle}>Replies</AppText>
                  <FavoritePostReplyList
                    onReactIconPress={handleReactIconPress}
                    replies={post.suggestions.sort(
                      (a, b) => a.createdAt < b.createdAt
                    )}
                  />
                </>
              ) : (
                <AppText style={styles.noPostInfo}>
                  The post is not available!
                </AppText>
              )}
            </>
          )}
        </ScreenSub>
      </Screen>
      <FavoritePostOptionsModal
        isVisible={showOptions}
        deleting={deleting}
        disabling={disabling}
        handleCloseModal={handleCloseOptions}
        onDeletePress={handleDeletePress}
        onDisablePress={handleDisableReplies}
        onEnableReplyPress={handleEnableReplies}
        post={post}
      />
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
    </>
  );
};

const styles = ScaledSheet.create({
  container: {
    paddingTop: "10@s",
  },
  noPostInfo: {
    alignSelf: "center",
    color: defaultStyles.colors.dark_Variant,
    marginTop: "100@s",
    textAlign: "center",
    width: "60%",
  },
  replyTitle: {
    alignSelf: "center",
    borderBottomColor: defaultStyles.colors.light,
    borderBottomWidth: "1@s",
    marginBottom: "10@s",
    paddingVertical: "10@s",
    textAlign: "center",
    width: "95%",
  },
});

export default PostDetailsScreen;

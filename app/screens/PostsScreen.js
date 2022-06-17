import React, { useCallback, useEffect, useState, useRef } from "react";
import { ScaledSheet, scale } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";

import Screen from "../components/Screen";
import ScreenSub from "../components/ScreenSub";
import AppHeader from "../components/AppHeader";
import InfoAlert from "../components/InfoAlert";
import FavoritePostsList from "../components/FavoritePostsList";
import AppText from "../components/AppText";
import AppActivityIndicator from "../components/ActivityIndicator";
import CreateFavoritePostModal from "../components/CreateFavoritePostModal";
import FavoritePostReplyModal from "../components/FavoritePostReplyModal";
import { showMessage } from "react-native-flash-message";

import debounce from "../utilities/debounce";
import defaultStyles from "../config/styles";

import favoritePostsApi from "../api/favoritePosts";

import apiActivity from "../utilities/apiActivity";
import defaultProps from "../utilities/defaultProps";

let defaultPost = {
  _id: "",
  text: "",
};

const PostsScreen = ({ navigation }) => {
  const { tackleProblem } = apiActivity;

  let isUnmounting = false;
  let canShowOnPostScreen = useRef(true);
  const isFocused = useIsFocused();

  const [isReady, setIsReady] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const [reply, setReply] = useState("");
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [interestedPost, setInterestedPost] = useState(defaultPost);

  // OnUnmount
  useEffect(() => {
    return () => (isUnmounting = true);
  }, []);

  useEffect(() => {
    if (isFocused && !isUnmounting && !canShowOnPostScreen.current) {
      canShowOnPostScreen.current = true;
    } else if (!isFocused && !isUnmounting) {
      canShowOnPostScreen.current = false;
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && showCreatePostModal && !isUnmounting) {
      setShowCreatePostModal(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && showReplyModal && !isUnmounting) {
      setShowReplyModal(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && infoAlert.showInfoAlert && !isUnmounting) {
      setInfoAlert({ showInfoAlert: false, infoAlertMessage: "" });
    }
  }, [isFocused]);

  const handleCloseReplyModal = () => {
    setShowReplyModal(false);
    setInterestedPost(defaultPost);
  };

  const handleCloseCreatePostModal = () => {
    setShowCreatePostModal(false);
  };

  const handleOnCreatePost = () => {
    setShowCreatePostModal(false);
    return showMessage({
      ...defaultProps.alertMessageConfig,
      message: "Your favorite post was successfully created!",
      type: "success",
    });
  };

  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

  const getAllPosts = async () => {
    const { ok, data, problem } = await favoritePostsApi.getPosts();
    if (ok && !isUnmounting) {
      let newList = [];
      data.forEach((p) => {
        if (!newList.filter((post) => post._id == p._id).length) {
          newList.push(p);
        }
      });
      setPosts(newList.sort((a, b) => a.createdAt < b.createdAt));
      return setIsReady(true);
    }
    if (!isUnmounting) {
      setIsReady(true);
    }
    if (canShowOnPostScreen.current) {
      tackleProblem(problem, data, setInfoAlert);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

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
  const handleHeaderRightPress = useCallback(() => {
    setShowCreatePostModal(true);
  }, []);

  const handleReplyPress = useCallback((post) => {
    setInterestedPost(post);
    setShowReplyModal(true);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await getAllPosts();
    setRefreshing(false);
  }, []);

  const handleMessageReply = async () => {
    setSendingReply(true);
    const { ok, data, problem } = await favoritePostsApi.postSuggestion(
      interestedPost._id,
      reply
    );
    if (ok && !isUnmounting) {
      setSendingReply(false);
      setReply("");
      setShowReplyModal(false);
      return showMessage({
        ...defaultProps.alertMessageConfig,
        message: "Reply Sent!",
        type: "success",
      });
    }

    if (!isUnmounting) {
      setSendingReply(false);
    }
    if (canShowOnPostScreen.current) {
      tackleProblem(problem, data, setInfoAlert);
    }
  };

  return (
    <>
      <Screen style={styles.container}>
        <AppHeader
          leftIcon="arrow-back"
          onPressLeft={handleBack}
          title="Posts"
          iconLeftCategory="MaterialIcons"
          iconRightCategory="MaterialIcons"
          rightIcon="post-add"
          onPressRight={handleHeaderRightPress}
        />
        <ScreenSub>
          {isReady ? (
            <>
              {posts.length ? null : (
                <AppText style={styles.noPostInfo}>
                  No posts to show. Be the first to share what is on your mind
                  with your favorite people anonymously.
                </AppText>
              )}
              <FavoritePostsList
                posts={posts}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                onReplyPress={handleReplyPress}
              />
            </>
          ) : (
            <AppActivityIndicator size={scale(30)} />
          )}
        </ScreenSub>
      </Screen>
      <CreateFavoritePostModal
        onCreate={handleOnCreatePost}
        onRequestClose={handleCloseCreatePostModal}
        visible={showCreatePostModal}
      />
      <FavoritePostReplyModal
        interestedPost={interestedPost}
        handleCloseMessage={handleCloseReplyModal}
        handleMessageReply={handleMessageReply}
        isVisible={showReplyModal}
        reply={reply}
        setReply={setReply}
        sendingReply={sendingReply}
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
  container: {},
  noPostInfo: {
    alignSelf: "center",
    color: defaultStyles.colors.dark_Variant,
    marginTop: "100@s",
    textAlign: "center",
    width: "60%",
  },
});

export default PostsScreen;

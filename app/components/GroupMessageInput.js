import React, {
  useState,
  useCallback,
  useEffect,
  memo,
  useContext,
} from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  PermissionsAndroid,
  Linking,
} from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import MaterialCommunityIcons from "../../node_modules/react-native-vector-icons/MaterialCommunityIcons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CameraRoll from "@react-native-community/cameraroll";
import Animated from "react-native-reanimated";

import Alert from "./Alert";
import Icon from "./Icon";

import debounce from "../utilities/debounce";

import useMountedRef from "../hooks/useMountedRef";
import useConnection from "../hooks/useConnection";
import useAuth from "../auth/useAuth";

import defaultStyles from "../config/styles";
import MediaGalleryModal from "./MediaGalleryModal";
import ApiContext from "../utilities/apiContext";
import ApiProcessingContainer from "./ApiProcessingContainer";
import GroupChatReplyBubble from "./GroupChatReplyBubble";

function GroupMessageInput({
  isFocused,
  onSendSelectedMedia,
  placeholder = "Send your thoughts...",
  setTyping = () => null,
  style,
  submit,
  reply,
  onRemoveReply,
  onLayout,
  rStyle,
  message,
  setMessage,
  onCameraImageSelection,
}) {
  dayjs.extend(relativeTime);
  const { user } = useAuth();
  let isUnmounting = false;

  useEffect(() => {
    return () => (isUnmounting = true);
  }, []);

  const { sendingMedia } = useContext(ApiContext);

  const isConnected = useConnection();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const [height, setHeight] = useState(0);
  const mounted = useMountedRef();

  // MEDIA ACTIVE CHAT
  const [activeMediaPermissionAlert, setActiveMediaPermissionAlert] =
    useState(false);
  const [mediaImagesModal, setMediaImagesModal] = useState({
    data: [],
    isVisible: false,
    albumName: "",
    totalAlbum: [],
  });

  const handlePress = debounce(
    () => {
      submit(message, "");
      setMessage("");
    },
    1000,
    true
  );

  // PERMISSION FOR EXTERNAL STORAGE
  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
  }

  const handleSendSelectedImage = (uri) => {
    onSendSelectedMedia(uri);
  };

  const setUpMediaModal = async () => {
    const albums = await CameraRoll.getAlbums({
      assetType: "Photos",
    });

    let firstAlbumData = albums[0];

    let totalImages = [];
    CameraRoll.getPhotos({
      first: firstAlbumData.count,
      groupTypes: "Album",
      groupName: firstAlbumData.title,
      assetType: "Photos",
    })
      .then(async (r) => {
        r.edges.forEach((e) => {
          if (typeof e.node.image.uri !== "undefined") {
            totalImages.push(e.node.image.uri);
          }
        });
        setMediaImagesModal({
          albumName: firstAlbumData.title,
          totalAlbum: albums,
          data: totalImages,
          isVisible: true,
        });
      })
      .catch((err) => {
        console.log(err);
        //Error Loading Images
      });
  };

  const handleAlbumChange = (data) => {
    let totalImages = [];
    CameraRoll.getPhotos({
      first: data.count,
      groupTypes: "Album",
      groupName: data.title,
      assetType: "Photos",
    })
      .then(async (r) => {
        r.edges.forEach((e) => {
          if (typeof e.node.image.uri !== "undefined") {
            totalImages.push(e.node.image.uri);
          }
        });
        setMediaImagesModal({
          ...mediaImagesModal,
          albumName: data.title,
          data: totalImages,
        });
      })
      .catch((err) => {
        console.log(err);
        //Error Loading Images
      });
  };

  const closeMediaPermissionAlert = useCallback(() => {
    setActiveMediaPermissionAlert(false);
  }, []);

  const openMediaPermissionSetting = useCallback(async () => {
    setActiveMediaPermissionAlert(false);
    await Linking.openSettings();
  }, []);

  const openMediaModal = async () => {
    if (!(await hasAndroidPermission()))
      return setActiveMediaPermissionAlert(true);
    setUpMediaModal();
  };

  useEffect(() => {
    if (!isFocused && mounted && isModalVisible) {
      setIsModalVisible(false);
    }
  }, [isFocused, mounted]);

  const handleOnChangeText = useCallback((text) => {
    setTyping();
    setMessage(text);
  }, []);

  const handleFocusInput = () => {
    setFocused(true);
  };

  return (
    <>
      <Animated.View style={[styles.animatedContainer, rStyle]}>
        <GroupChatReplyBubble
          onLayout={onLayout}
          style={styles.activeChatReplyContainer}
          messageContainerStyle={styles.groupChatReplyMessageContainerStyle}
          media={reply.media}
          message={reply.message}
          creator={
            reply.createdBy._id == user._id ? user.name : reply.createdBy.name
          }
          onClose={onRemoveReply}
        />
      </Animated.View>

      <View style={[styles.contentContainer, style]}>
        <TouchableOpacity onPress={openMediaModal} style={styles.addMedia}>
          <ApiProcessingContainer
            color={defaultStyles.colors.white}
            processing={sendingMedia}
          >
            <MaterialCommunityIcons
              color={defaultStyles.colors.white}
              name="image"
              size={scale(20)}
            />
          </ApiProcessingContainer>
        </TouchableOpacity>
        <View style={[styles.container]}>
          <TextInput
            onImageChange={
              focused
                ? (event) => submit("", event.nativeEvent.linkUri)
                : () => null
            }
            multiline={true}
            maxLength={250}
            onBlur={() => setFocused(false)}
            onFocus={handleFocusInput}
            onChangeText={handleOnChangeText}
            placeholder={placeholder}
            style={[
              styles.inputBox,
              {
                height: Math.min(100, Math.max(35, height)),
              },
            ]}
            value={message}
            onContentSizeChange={(event) =>
              setHeight(event.nativeEvent.contentSize.height)
            }
          />
          <TouchableOpacity
            disabled={
              message.replace(/\s/g, "").length >= 1 && isConnected
                ? false
                : true
            }
            onPress={handlePress}
            style={styles.send}
          >
            <Icon
              color={
                message.replace(/\s/g, "").length >= 1 && isConnected
                  ? defaultStyles.colors.secondary
                  : defaultStyles.colors.lightGrey
              }
              name="send"
              size={scale(28)}
              icon="MaterialIcons"
            />
          </TouchableOpacity>
        </View>
      </View>
      <Alert
        visible={activeMediaPermissionAlert}
        title="Permission"
        description="Please give gallery access to send photos while active chatting. Go to settings and enable permissions."
        onRequestClose={closeMediaPermissionAlert}
        leftOption="Cancel"
        rightOption="Yes"
        leftPress={closeMediaPermissionAlert}
        rightPress={openMediaPermissionSetting}
      />
      <MediaGalleryModal
        onRequestClose={() =>
          setMediaImagesModal({ ...mediaImagesModal, isVisible: false })
        }
        visible={mediaImagesModal.isVisible}
        images={mediaImagesModal.data}
        albums={mediaImagesModal.totalAlbum}
        handleAlbumChange={handleAlbumChange}
        albumName={mediaImagesModal.albumName}
        onSelectImageFromGallery={handleSendSelectedImage}
        onCameraImageSelection={onCameraImageSelection}
      />
    </>
  );
}

const styles = ScaledSheet.create({
  activeChatReplyContainer: {
    minHeight: "40@s",
    width: "90%",
  },
  addMedia: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.secondary,
    borderRadius: "18@s",
    height: "30@s",
    justifyContent: "center",
    marginRight: "5@s",
    overflow: "hidden",
    width: "30@s",
  },
  animatedContainer: {
    alignItems: "center",
    bottom: "50@s",
    justifyContent: "center",
    position: "absolute",
    width: "100%",
  },
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.light,
    flexDirection: "row",
    flexShrink: 1,
    justifyContent: "space-between",
    minHeight: "35@s",
    overflow: "hidden",
    width: "100%",
  },
  contentContainer: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.light,
    borderColor: defaultStyles.colors.light,
    borderRadius: "50@s",
    borderWidth: 2,
    flexDirection: "row",
    overflow: "hidden",
    paddingHorizontal: "5@s",
    width: "95%",
  },
  inputBox: {
    borderRadius: "30@s",
    flex: 1,
    fontFamily: "ComicNeue-Bold",
    fontSize: "14@s",
    fontWeight: "normal",
    height: "100%",
    marginRight: "5@s",
    paddingHorizontal: "10@s",
    width: "100%",
  },
  groupChatReplyMessageContainerStyle: {
    width: "100%",
  },
  mainContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderTopLeftRadius: "25@s",
    borderTopRightRadius: "25@s",
    flex: 1,
    overflow: "hidden",
    width: "100%",
  },
  send: {
    alignItems: "center",
    borderRadius: "20@s",
    height: "40@s",
    justifyContent: "center",
    overflow: "hidden",
    width: "40@s",
  },
});

export default memo(GroupMessageInput);

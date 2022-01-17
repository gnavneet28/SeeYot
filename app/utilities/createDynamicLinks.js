import dynamicLinks from "@react-native-firebase/dynamic-links";

const createShortInviteLink = () => {
  return dynamicLinks().buildShortLink({
    domainUriPrefix: "https://seeyot.page.link",
    android: {
      packageName: "com.seeyot",
      fallbackUrl: "http://www.seeyot.com",
    },
    social: {
      descriptionText:
        "Come on board and connect / re-connect with someone you think, you cannot find any other way to do so.",
      imageUrl:
        "https://seeyot-photos.s3.ap-south-1.amazonaws.com/link_logo.png",
      title: "SeeYot",
    },
    link: "http://www.seeyot.com",
    navigation: {
      forcedRedirectEnabled: false,
    },
  });
};

export default createShortInviteLink;

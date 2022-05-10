import { scale } from "react-native-size-matters";
import Constants from "expo-constants";
import { Platform } from "react-native";
import defaultStyles from "../config/styles";

export default {
  defaultMessage: {
    _id: "",
    message: "",
    createdAt: "",
    createdFor: {
      _id: "",
      name: "",
      picture: "",
    },
    reply: [
      {
        _id: "",
        message: "",
        createdAt: "",
        optionalAnswer: {
          _id: "",
          selected: true,
          answer: "",
        },
      },
    ],
    seen: true,
    mood: "",
    options: [],
  },
  defaultEchoMessage: {
    _id: "",
    messageFor: "",
    message: "",
    name: "",
    picture: "",
    audio: {
      file: "",
      duration: "",
    },
  },
  defaultBlockedUser: {
    _id: "",
    picture: "",
    name: "",
  },
  defaultUser: {
    _id: "",
    picture: "",
    name: "",
    phoneNumber: parseInt(""),
  },

  defaultEchoMessageRecipient: {
    name: "",
    picture: "",
    _id: "",
  },
  defaultMessageVisibleToCurrentUserWithoutReplying: {
    _id: "",
    message: "",
    createdAt: Date.now(),
    mood: "",
    seen: false,
    options: [],
    replies: [],
  },
  plans: [
    {
      _id: "seeyotvip_125_1m",
      planDuration: "1 Month",
      planName: "Lite",
      planRate: 125,
    },
    {
      _id: "seeyotvip_225_2m",
      planDuration: "2 Months",
      planName: "Ultra",
      planRate: 225,
    },
    {
      _id: "seeyotvip_325_3m",
      planDuration: "3 Months",
      planName: "Premium",
      planRate: 325,
    },
    {
      _id: "seeyotvip_525_6m",
      planDuration: "6 Months",
      planName: "Pro",
      planRate: 525,
    },
  ],
  defaultEchoMessageOption: {
    _id: "",
    message: "",
    messageFor: "",
    name: "",
    picture: "",
  },
  alertMessageConfig: {
    duration: 3000,
    backgroundColor: defaultStyles.colors.green,
    animated: true,
    autoHide: true,
    statusBarHeight:
      Platform.OS == "android" ? Constants.statusBarHeight : null,
    style: {
      alignItems: "center",
      justifyContent: "center",
      borderBottomRightRadius: scale(15),
      borderBottomLeftRadius: scale(15),
    },
    textProps: {
      style: {
        fontFamily: "ComicNeue-Bold",
        fontSize: scale(15),
        color: defaultStyles.colors.white,
        textAlign: "center",
      },
    },
  },

  defaultChartConfig: {
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    color: (opacity = 0.5) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 5,
    },
  },
  defaultStylesForData: {
    legendFontColor: defaultStyles.colors.light,
    legendFontSize: scale(12),
    legendFontFamily: "ComicNeue-Bold",
  },

  notificationType: [
    { type: "Add", alias: "Add" },
    { type: "ActiveChat", alias: "Active Chat" },
    { type: "Replied", alias: "Replies" },
    { type: "Matched", alias: "Matched Thoughts" },
    { type: "All", alias: "All" },
  ],
  defaultGroup: {
    _id: "",
    name: "",
    qrCodeLink: "",
    canInvite: false,
    picture: "",
    blocked: [
      {
        _id: "",
        name: "",
        picture: "",
      },
    ],
    createdBy: {
      _id: "",
      name: "",
      picture: "",
    },
    createdAt: "",
    type: "",
    information: "",
    recyclePeriod: "",
    posts: [],
    messages: [],
    stats: {
      totalCoinsDistributed: parseInt(""),
      totalCoinsOffered: parseInt(""),
      totalActiveUsers: [],
    },
    password: "",
  },
  defaultGroupChatMessage: {
    _id: "",
    message: "",
    createdBy: {
      _id: "",
      name: "",
      picture: "",
    },
    createdAt: "",
    media: "",
    reply: {
      createdBy: {
        _id: "",
        name: "",
        picture: "",
      },
      message: "",
      media: "",
    },
  },

  categoriesData: {
    categories: [
      "Art",
      "Entertainment",
      "Relationship",
      "Food",
      "Wellness and Care",
      "Jobs",
    ],
    artCategory: ["Poetry", "Drama", "Story", "Painting", "Drawing", "Others"],
    entertainmentCategory: [
      "Online Games",
      "Sports",
      "Movies",
      "Night Life",
      "Social",
      "Tv Series",
      "Others",
    ],
    relationShipCategory: [
      "Dating",
      "Family",
      "Friends",
      "Romance",
      "Marriage",
      "Others",
    ],
    foodCategory: [
      "Fast Food",
      "Healty Food",
      "Vegetarian",
      "Non-Vegetarian",
      "Others",
    ],
    wellnessCategory: [
      "Health And Fitness",
      "Hospitals",
      "Spa and Massage",
      "Others",
    ],
    jobsCategory: ["Online", "Offline", "Others"],
  },
};

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
  },
  plans: [
    {
      _id: "seeyotvip_250_1m",
      planDuration: "1 Month",
      planName: "Plan A",
      planRate: 250,
    },
    {
      _id: "seeyotvip_450_2m",
      planDuration: "2 Months",
      planName: "Plan B",
      planRate: 450,
    },
    {
      _id: "seeyotvip_700_3m",
      planDuration: "3 Months",
      planName: "Plan C",
      planRate: 700,
    },
    {
      _id: "seeyotvip_1250_6m",
      planDuration: "6 Months",
      planName: "Plan D",
      planRate: 1250,
    },
  ],
  defaultEchoMessageOption: {
    _id: "",
    message: "",
    messageFor: "",
    name: "",
    picture: "",
  },
};

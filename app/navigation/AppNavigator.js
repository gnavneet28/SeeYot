import React, { useEffect, useState, useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as IAP from "expo-in-app-purchases";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import * as Notifications from "expo-notifications";

import IndexNavigator from "./IndexNavigator";
import ProfileNavigator from "./ProfileNavigator";
import VipNavigator from "./VipNavigator";
import Constant from "./NavigationConstants";
import storeDetails from "../utilities/storeDetails";
import { showMessage } from "react-native-flash-message";
import cache from "../utilities/cache";

import { SocketContext } from "../api/socketClient";

import navigation from "./rootNavigation";

import SendThoughtsScreen from "../screens/SendThoughtsScreen";
import AddEchoScreen from "../screens/AddEchoScreen";

import useNotifications from "../hooks/useNotifications";

import useAuth from "../auth/useAuth";
import FavoritesNavigator from "./FavoritesNavigator";
import ActiveForContext from "../utilities/activeForContext";
import ActiveMessagesContext from "../utilities/activeMessagesContext";

import defaultProps from "../utilities/defaultProps";
import usersApi from "../api/users";
import debounce from "../utilities/debounce";
import useKeyboard from "../hooks/useKeyboard";
import PostsScreen from "../screens/PostsScreen";
import PostDetailsScreen from "../screens/PostDetailsScreen";
import ReactionDetailsScreen from "../screens/ReactionDetailsScreen";

const Tab = createBottomTabNavigator();

function AppNavigator(props) {
  const { user, setUser } = useAuth();
  const [activeFor, setActiveFor] = useState([]);
  const [activeMessages, setActiveMessages] = useState([]);
  const socket = useContext(SocketContext);
  const [disconnected, setDisconnected] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  let keyboradVisible = useKeyboard();

  const purchaseItem = debounce(
    async (id) => {
      if (purchaseSuccess) return;
      const { ok, data, problem } = await usersApi.vipSubscribe(id);
      if (ok) {
        await storeDetails(data.user);
        setUser(data.user);
        return showMessage({
          ...defaultProps.alertMessageConfig,
          message: data.message,
          type: "success",
        });
      }

      return showMessage({
        ...defaultProps.alertMessageConfig,
        message: data.message
          ? data.message
          : "Something went wrong! Please contact support if needed",
        type: "warning",
      });
    },
    5000,
    true
  );

  useEffect(() => {
    const subscription = IAP.setPurchaseListener(
      ({ responseCode, errorCode, results }) => {
        if (responseCode === IAP.IAPResponseCode.OK) {
          results.forEach(async (purchase) => {
            if (!purchase.acknowledged) {
              let purchaseObject = { ...purchase };
              if (purchaseObject.purchaseState === 1) {
                let expiryInDays;
                let productId = purchaseObject.productId;
                const plans = [
                  "seeyotvip_125_1m",
                  "seeyotvip_225_2m",
                  "seeyotvip_325_3m",
                  "seeyotvip_525_6m",
                ];

                if (productId == plans[0]) {
                  expiryInDays = 30;
                } else if (productId == plans[1]) {
                  expiryInDays = 60;
                } else if (productId == plans[2]) {
                  expiryInDays = 90;
                } else {
                  expiryInDays = 180;
                }
                await cache.storeWithExpiry(
                  "subscription",
                  purchaseObject,
                  expiryInDays
                );
                if (!purchaseSuccess) {
                  await purchaseItem(purchaseObject.productId);
                }
              }
              setPurchaseSuccess(true);
              // Then when you're done
              IAP.finishTransactionAsync(purchase, true);
            }
          });
        } else if (responseCode === IAP.IAPResponseCode.USER_CANCELED) {
          showMessage({
            ...defaultProps.alertMessageConfig,
            message: "The transaction was canceled!",
            type: "info",
          });
        } else if (responseCode === IAP.IAPResponseCode.DEFERRED) {
          showMessage({
            ...defaultProps.alertMessageConfig,
            message:
              "User does not have permissions to buy but requested parental approval (iOS only)",
            type: "info",
          });
        } else {
          showMessage({
            ...defaultProps.alertMessageConfig,
            message: `Something went wrong with the purchase. Received errorCode ${errorCode}`,
            type: "info",
          });
        }
      }
    );

    return () => {
      try {
        subscription.remove();
      } catch (error) {}
      if (!disconnected) {
        IAP.disconnectAsync()
          .then(() => {
            setDisconnected(true);
          })
          .catch((err) => {});
      }
    };
  }, [purchaseSuccess]);

  useEffect(() => {
    const listener1 = (data) => {
      if (data.user) {
        setUser(data.user);
        return storeDetails(data.user);
      }
      return;
    };
    socket.on(`newNotification${user._id}`, listener1);

    const listener2 = (data) => {
      let modifiedUser = { ...user };
      modifiedUser.thoughts = data.thoughts;
      return setUser(modifiedUser);
    };

    socket.on(`thoughtMatched${user._id}`, listener2);

    const listener3 = (data) => {
      let modifiedUser = { ...user };
      modifiedUser.messages = data.messages;
      return setUser(modifiedUser);
    };

    socket.on(`newMessage${user._id}`, listener3);

    const listener4 = (data) => {
      let modifiedUser = { ...user };
      modifiedUser.thoughts = data.thoughts;
      return setUser(modifiedUser);
    };

    socket.on(`deletedThought${user._id}`, listener4);

    const listener5 = (data) => {
      if (activeFor.filter((u) => u == data._id).length) return;
      setActiveFor([...activeFor, data._id]);
    };

    socket.on(`setActiveFor${user._id}`, listener5);

    const listener6 = (data) => {
      let newList = activeFor.filter((u) => u != data._id);
      setActiveFor(newList);
    };

    socket.on(`setInActiveFor${user._id}`, listener6);

    return () => {
      socket.off(`newNotification${user._id}`, listener1);
      socket.off(`thoughtMatched${user._id}`, listener2);
      socket.off(`newMessage${user._id}`, listener3);
      socket.off(`deletedThought${user._id}`, listener4);
      socket.off(`setActiveFor${user._id}`, listener5);
      socket.off(`setInActiveFor${user._id}`, listener6);
    };
  }, [user, activeFor]);

  const handleDynamicLink = (link) => {
    // Handle dynamic link inside your own application
    if (link) {
      if (
        link.url !== "https://play.google.com/store/apps/details?id=com.seeyot"
      ) {
        let name;
        let password;
        var regex = /[?&]([^=#]+)=([^&#]*)/g,
          params = {},
          match;
        while ((match = regex.exec(link.url))) {
          params[match[1]] = match[2];
        }

        for (let key in params) {
          if (key == "a") {
            name = params[key].replace(new RegExp("\\+", "g"), " ");
          } else if (key == "b") {
            password = params[key];
          }
        }

        return navigation.navigate(Constant.GROUP_NAVIGATOR, {
          screen: Constant.FIND_GROUP_SCREEN,
          params: {
            name,
            password: password ? password : "",
          },
        });
      }
    }
  };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        if (link) {
          if (
            link.url !==
            "https://play.google.com/store/apps/details?id=com.seeyot"
          ) {
            let name;
            let password;
            var regex = /[?&]([^=#]+)=([^&#]*)/g,
              params = {},
              match;
            while ((match = regex.exec(link.url))) {
              params[match[1]] = match[2];
            }

            for (let key in params) {
              if (key == "a") {
                name = params[key].replace(new RegExp("\\+", "g"), " ");
              } else if (key == "b") {
                password = params[key];
              }
            }
            return navigation.navigate(Constant.GROUP_NAVIGATOR, {
              screen: Constant.FIND_GROUP_SCREEN,
              params: {
                name,
                password: password ? password : "",
              },
            });
          }
        }
      });
  }, []);

  const getLastNotification = async () => {
    let result = await Notifications.getLastNotificationResponseAsync();
    if (result) {
      let notification = result.notification.request.content;
      // Echo Notification
      if (notification.title == "Echo") {
        return;
      }

      // Active Chat
      if (notification.title == "Active Chat") {
        return navigation.navigate(Constant.SEND_THOUGHT_SCREEN, {
          recipient: notification.data.recipient,
          from: Constant.NOTIFICATION_SCREEN,
        });
      }

      // Group Reply
      if (notification.title == "Group Reply") {
        return navigation.navigate(Constant.GROUP_NAVIGATOR, {
          screen: Constant.FIND_GROUP_SCREEN,
          params: {
            name: notification.data.groupName,
            password: notification.data.groupPassword,
          },
        });
      }

      // Group chat invite

      if (notification.title == "Group Chat Invite") {
        return navigation.navigate(Constant.GROUP_NAVIGATOR, {
          screen: Constant.FIND_GROUP_SCREEN,
          params: {
            name: notification.data.groupName,
            password: notification.data.groupPassword,
          },
        });
      }

      // Post Reply

      if (notification.title == "Post Reply") {
        return navigation.navigate(Constant.POST_DETAILS, {
          id: notification.data.id,
        });
      }

      // Reply Reation
      if (notification.title == "Reply Reaction") {
        return navigation.navigate(Constant.REACTION_DETAILS_SCREEN, {
          post: notification.data.post,
          reaction: notification.data.reaction,
        });
      }

      // Favorite message
      if (
        notification.data.message !==
        "One of your favorites sent you a message!"
      ) {
        return navigation.navigate(Constant.NOTIFICATION_NAVIGATOR);
      }

      navigation.navigate(Constant.INDEX_NAVIGATOR, {
        screen: Constant.HOME_NAVIGATOR,
      });
    }
  };

  useEffect(() => {
    getLastNotification();
  }, []);

  useNotifications((data) => {
    if (data.notification.request.content.title == "Echo") {
      return;
    }
    if (data.notification.request.content.title == "Active Chat") {
      return navigation.navigate(Constant.SEND_THOUGHT_SCREEN, {
        recipient: data.notification.request.content.data.recipient,
        from: Constant.NOTIFICATION_SCREEN,
      });
    }
    if (data.notification.request.content.title == "Group Reply") {
      return navigation.navigate(Constant.GROUP_NAVIGATOR, {
        screen: Constant.FIND_GROUP_SCREEN,
        params: {
          name: data.notification.request.content.data.groupName,
          password: data.notification.request.content.data.groupPassword,
        },
      });
    }
    if (data.notification.request.content.title == "Group Chat Invite") {
      return navigation.navigate(Constant.GROUP_NAVIGATOR, {
        screen: Constant.FIND_GROUP_SCREEN,
        params: {
          name: data.notification.request.content.data.groupName,
          password: data.notification.request.content.data.groupPassword,
        },
      });
    }
    if (data.notification.request.content.title == "Post Reply") {
      return navigation.navigate(Constant.POST_DETAILS, {
        id: data.notification.request.content.data.id,
      });
    }
    if (data.notification.request.content.title == "Reply Reaction") {
      return navigation.navigate(Constant.REACTION_DETAILS_SCREEN, {
        post: data.notification.request.content.data.post,
        reaction: data.notification.request.content.data.reaction,
      });
    }
    if (
      data.notification.request.content.data.message !==
      "One of your favorites sent you a message!"
    ) {
      return navigation.navigate(Constant.NOTIFICATION_NAVIGATOR);
    }

    navigation.navigate(Constant.INDEX_NAVIGATOR, {
      screen: Constant.HOME_NAVIGATOR,
    });
  });

  return (
    <ActiveForContext.Provider value={{ activeFor, setActiveFor }}>
      <ActiveMessagesContext.Provider
        value={{ activeMessages, setActiveMessages }}
      >
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: "none" },
          }}
        >
          <Tab.Screen
            name={Constant.INDEX_NAVIGATOR}
            component={IndexNavigator}
          />
          <Tab.Screen name={Constant.VIP_NAVIGATOR} component={VipNavigator} />
          <Tab.Screen
            name={Constant.PROFILE_NAVIGATOR}
            component={ProfileNavigator}
          />
          <Tab.Screen
            name={Constant.SEND_THOUGHT_SCREEN}
            component={SendThoughtsScreen}
          />
          <Tab.Screen
            name={Constant.ADD_ECHO_SCREEN}
            component={AddEchoScreen}
          />
          <Tab.Screen
            name={Constant.FAVORITES_NAVIGATOR}
            component={FavoritesNavigator}
          />
          <Tab.Screen name={Constant.POST_SCREEN} component={PostsScreen} />
          <Tab.Screen
            name={Constant.POST_DETAILS}
            component={PostDetailsScreen}
          />
          <Tab.Screen
            name={Constant.REACTION_DETAILS_SCREEN}
            component={ReactionDetailsScreen}
          />
        </Tab.Navigator>
      </ActiveMessagesContext.Provider>
    </ActiveForContext.Provider>
  );
}

export default AppNavigator;

import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as IAP from "expo-in-app-purchases";

import IndexNavigator from "./IndexNavigator";
import ProfileNavigator from "./ProfileNavigator";
import VipNavigator from "./VipNavigator";
import Constant from "./NavigationConstants";
import storeDetails from "../utilities/storeDetails";
import { showMessage } from "react-native-flash-message";
import cache from "../utilities/cache";

import socket from "../api/socketClient";

import navigation from "./rootNavigation";

import SendThoughtsScreen from "../screens/SendThoughtsScreen";
import AddEchoScreen from "../screens/AddEchoScreen";

import useNotifications from "../hooks/useNotifications";

import useAuth from "../auth/useAuth";
import FavoritesNavigator from "./FavoritesNavigator";
import ActiveForContext from "../utilities/activeForContext";
import ActiveMessagesContext from "../utilities/activeMessagesContext";
import TypingContext from "../utilities/typingContext";

import defaultProps from "../utilities/defaultProps";
import usersApi from "../api/users";

const Tab = createBottomTabNavigator();

let timeOut;
let TIMER_LENGTH = 2000;

function AppNavigator(props) {
  const { user, setUser } = useAuth();
  const [activeFor, setActiveFor] = useState([]);
  const [activeMessages, setActiveMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  const purchaseItem = async (id) => {
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
  };

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
                await purchaseItem(purchaseObject.productId);
              }
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
      try {
        IAP.disconnectAsync();
      } catch (error) {}
    };
  }, []);

  useEffect(() => {
    const subscription1 = socket.on(`newNotification${user._id}`, (data) => {
      if (data.user) {
        setUser(data.user);
        return storeDetails(data.user);
      }
      return;
    });

    const subscription2 = socket.on(`thoughtMatched${user._id}`, (data) => {
      let modifiedUser = { ...user };
      modifiedUser.thoughts = data.thoughts;
      return setUser(modifiedUser);
    });

    const subscription3 = socket.on(`newMessage${user._id}`, (data) => {
      let modifiedUser = { ...user };
      modifiedUser.messages = data.messages;
      return setUser(modifiedUser);
    });

    const subscription4 = socket.on(`deletedThought${user._id}`, (data) => {
      let modifiedUser = { ...user };
      modifiedUser.thoughts = data.thoughts;
      return setUser(modifiedUser);
    });

    const subscription5 = socket.on(`newActiveMessage${user._id}`, (data) => {
      activeMessages.push(data.newMessage);
      return setActiveMessages([...activeMessages]);
    });

    const subscription6 = socket.on(`setActiveFor${user._id}`, (data) => {
      if (activeFor.filter((u) => u == data._id)[0]) return;
      setActiveFor([...activeFor, data._id]);
    });

    const subscription7 = socket.on(`setInActiveFor${user._id}`, (data) => {
      let newList = activeFor.filter((u) => u != data._id);
      setActiveFor(newList);
    });

    const subscription8 = socket.on(`typing${user._id}`, (data) => {
      if (!typing) {
        setTyping(true);
      } else {
        clearTimeout(timeOut);
      }
      let lastTypingTime = new Date().getTime();
      timeOut = setTimeout(() => {
        let typingTimer = new Date().getTime();
        let timeDiff = typingTimer - lastTypingTime;

        if (timeDiff >= TIMER_LENGTH && typing) {
          setTyping(false);
        }
      }, TIMER_LENGTH);
    });

    const subscription9 = socket.on(`stopTyping${user._id}`, (data) => {
      if (typing) setTyping(false);
    });

    return () => {
      subscription1.off();
      subscription2.off();
      subscription3.off();
      subscription4.off();
      subscription5.off();
      subscription6.off();
      subscription7.off();
      subscription8.off();
      subscription9.off();
    };
  }, [user, activeMessages, activeFor, typing]);

  useNotifications((data) => {
    //console.log(data.notification.request.content.data.message);
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
        <TypingContext.Provider value={{ typing, setTyping }}>
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
            <Tab.Screen
              name={Constant.VIP_NAVIGATOR}
              component={VipNavigator}
            />
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
          </Tab.Navigator>
        </TypingContext.Provider>
      </ActiveMessagesContext.Provider>
    </ActiveForContext.Provider>
  );
}

export default AppNavigator;

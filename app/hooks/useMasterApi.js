import React, { useState, useContext } from "react";
import useAuth from "../auth/useAuth";

import storeDetails from "../utilities/storeDetails";
import usersApi from "../api/users";

import ApiContext from "../utilities/apiContext";

export default useMasterApi = ({ mainFunc, ...args }) => {
  const { apiProcessing, setApiProcessing } = useContext(ApiContext);
  const { user, setUser } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });

  const apiFunction = async (...args) => {
    setApiProcessing(true);
    setProcessing(true);

    const { ok, data, problem } = await mainFunc(...args);

    if (ok) {
      const res = await usersApi.getCurrentUser();
      if (res.ok && res.data) {
        if (res.data.__v > data.user.__v) {
          await storeDetails(res.data);
          setUser(res.data);
          setProcessing(false);
          return setApiProcessing(false);
        }
      }
      await storeDetails(data.user);
      setUser(data);
      setApiProcessing(false);
      return setProcessing(false);
    }
    if (problem) {
      if (data) {
        setProcessing(false);
        setApiProcessing(false);
        return setInfoAlert({
          infoAlertMessage: data.message,
          showInfoAlert: true,
        });
      }
      setProcessing(false);
      setApiProcessing(false);
      return setInfoAlert({
        infoAlertMessage: "Something went wrong! Please try again.",
        showInfoAlert: true,
      });
    }
  };

  return {
    apiProcessing,
    processing,
    user,
    infoAlert,
    setInfoAlert,
    setApiProcessing,
    setProcessing,
    apiFunction,
  };
};

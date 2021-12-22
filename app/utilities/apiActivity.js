const tackleProblem = (problem, data, setInfoAlert) => {
  if (problem) {
    if (data) {
      return setInfoAlert({
        infoAlertMessage: data.message,
        showInfoAlert: true,
      });
    }

    return setInfoAlert({
      infoAlertMessage: "Something went wrong! Please try again.",
      showInfoAlert: true,
    });
  }
};

const showSucessMessage = (setSuccess, message, timeOut = 4000) => {
  setSuccess({
    message: message,
    show: true,
  });
  setTimeout(() => {
    setSuccess({
      message: "",
      show: false,
    });
  }, timeOut);
};

export default {
  tackleProblem,
  showSucessMessage,
};

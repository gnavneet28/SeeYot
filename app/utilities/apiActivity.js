const tackleProblem = (problem, data, setInfoAlert) => {
  if (problem) {
    if (data) {
      return setInfoAlert({
        infoAlertMessage: data.message ? data.message : "Something failed!",
        showInfoAlert: true,
      });
    }

    return setInfoAlert({
      infoAlertMessage: problem
        ? problem
        : "Something failed! Please try again.",
      showInfoAlert: true,
    });
  }
};

const showSucessMessage = (setSuccess, message, timeOut = 2500) => {
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
};

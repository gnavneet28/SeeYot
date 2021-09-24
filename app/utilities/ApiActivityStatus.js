const apiActivityStatus = (response, setApiActivity) => {
  const { ok, data, problem } = response;
  if (ok) {
    return setApiActivity({
      processing: false,
      message: data.message ? data.message : "It's done!",
      visible: true,
      success: true,
    });
  }
  if (problem) {
    if (data) {
      return setApiActivity({
        processing: false,
        message: data.message,
        visible: true,
        success: false,
      });
    }

    return setApiActivity({
      processing: false,
      message: "Something went wrong! Please try again.",
      visible: true,
      success: false,
    });
  }
};

const initialApiActivity = (setApiActivity, initialMessage) => {
  return setApiActivity({
    processing: true,
    message: initialMessage,
    visible: true,
    success: false,
  });
};

export default {
  apiActivityStatus,
  initialApiActivity,
};

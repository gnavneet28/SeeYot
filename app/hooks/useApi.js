const ApiActivityStatus = (status, initialMessage, setApiActivity) => {
  if (status == processing)
    return setApiActivity({
      processing: true,
      message: initialMessage,
      visible: true,
      success: false,
    });

  if (status == "success")
    return setApiActivity({
      processing: false,
      message: data.message,
      visible: true,
      success: true,
    });
  else if (status == "failure")
    return setApiActivity({
      processing: false,
      message: data.message,
      visible: true,
      success: false,
    });

  return setApiActivity({
    processing: false,
    message: "Something went wrong! Please try again after sometime.",
    visible: true,
    success: false,
  });
};

export default ApiActivityStatus;

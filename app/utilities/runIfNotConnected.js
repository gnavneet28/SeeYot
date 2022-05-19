export default runIfNotConnected = (
  isConnected,
  setInfoAlert,
  isUnmounting = false
) => {
  if (!isConnected && !isUnmounting)
    return setInfoAlert({
      infoAlertMessage: "Internet connection not available",
      showInfoAlert: true,
    });
};

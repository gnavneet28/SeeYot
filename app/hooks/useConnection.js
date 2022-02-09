import { useNetInfo } from "@react-native-community/netinfo";

const useConnection = () => {
  const netInfo = useNetInfo();

  if (
    (netInfo.type !== "unknown" && netInfo.isInternetReachable === false) ||
    netInfo.isConnected === false ||
    netInfo.type === "none"
  )
    return false;

  return true;
};

export default useConnection;

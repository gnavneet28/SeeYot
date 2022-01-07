import { useNetInfo } from "@react-native-community/netinfo";

const useConnection = () => {
  const netInfo = useNetInfo();

  if (netInfo.type !== "unknown" && netInfo.isInternetReachable === false)
    return false;

  return true;
};

export default useConnection;

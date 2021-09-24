import { useNetInfo } from "@react-native-community/netinfo";

const useConnection = () => {
  const netInfo = useNetInfo();

  if (netInfo.type !== "unknown" && netInfo.isInternetReachable === false)
    return true;

  return false;
};

export default useConnection;

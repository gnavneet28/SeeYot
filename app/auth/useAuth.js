import { useContext } from "react";

import AuthContext from "./context";
import authStorage from "./storage";

export default useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const logOut = () => {
    authStorage.removeToken();
    setUser(null);
  };

  const logIn = (user) => {
    setUser(user);
  };

  return {
    user,
    setUser,
    logOut,
    logIn,
  };
};

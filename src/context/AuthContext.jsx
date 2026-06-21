import { createContext, useMemo } from "react";

//=>>> Utilities
import { GetCookie } from "../assets/js/GetCookie";
import { Decryption } from "../assets/js/Encryption";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const secretKey = import.meta.env.VITE_SECRET_KEY;

  //=>>> Retrieve cookies
  const authToken = GetCookie("_Auth_AJS+c0mPanY-07@12#31_token") || "";
  const userRoleCookie = GetCookie("_Role_AJS+c0mPanY-07@12#31_user") || "";
  const userDesigSlug = GetCookie("_Des_AJS+c0mPanY-07@12#31_slg") || "";

  //=>>> Memoize decrypted values
  const userRole = useMemo(() => {
    return userRoleCookie
      ? Decryption(userRoleCookie, secretKey).split(",")
      : [];
  }, [userRoleCookie, secretKey]);

  const headers = useMemo(() => {
    return {
      Authorization: `Bearer ${Decryption(authToken, secretKey)}`,
    };
  }, [authToken, secretKey]);

  const uid = useMemo(() => {
    return GetCookie("_UID_AJS+c0mPanY-07@12#31_user") || null;
  }, [authToken, secretKey]);

  const employeeID = useMemo(() => {
    return GetCookie("_EMPID_AJS+c0mPanY-07@12#31_user") || null;
  }, [authToken, secretKey]);

  const userDesignationSlug = useMemo(() => {
    return userRoleCookie
      ? Decryption(userDesigSlug, secretKey).split(",")
      : [];
  }, [userDesigSlug, secretKey]);

  return (
    <AuthContext.Provider
      value={{ headers, uid, employeeID, userRole, userDesignationSlug }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

import { useEffect, useState } from "react";
import Cookies from "amiga-core/application/cookies.js";

/**
 * Custom hook to persist filters with cookies
 * @param {string} cookieKey
 */
const useStateWithCookie = (cookieKey, initialValue = null) => {
  const [value, setValue] = useState(Cookies.get(cookieKey) || initialValue);

  useEffect(() => {
    Cookies.set(cookieKey, value);
  }, [value]);

  return [value, setValue];
};

export default useStateWithCookie;

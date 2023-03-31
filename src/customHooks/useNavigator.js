import { useState, useEffect } from "react";

const useNavigator = () => {
  const [navigator, setNavigator] = useState("unknown");

  useEffect(() => {
    setNavigator(getNavigator());
  }, []);

  return navigator;
};

const getNavigator = () => {
  // Opera 8.0+
  var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0;

  // Firefox 1.0+
  var isFirefox = typeof InstallTrigger !== "undefined";

  // Safari 3.0+ "[object HTMLElementConstructor]"
  var isSafari =
    /constructor/i.test(window.HTMLElement) ||
    (function(p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(!window["safari"] || (typeof safari !== "undefined" && window["safari"].pushNotification));

  // Internet Explorer 6-11
  var isIE = /*@cc_on!@*/ false || !!document.documentMode;

  // Edge 20+
  var isEdge = !isIE && !!window.StyleMedia;

  // Chrome 1 - 79
  var isChrome = !!window.chrome;

  // Edge (based on chromium) detection
  var isEdgeChromium = isChrome && navigator.userAgent.indexOf("Edg") != -1;

  // Blink engine detection
  var isBlink = (isChrome || isOpera) && !!window.CSS;

  // console.log(navigator.userAgent);

  if (isOpera) {
    return "opera";
  } else if (isFirefox) {
    return "firefox";
  } else if (isChrome || isEdgeChromium) {
    return "chrome";
  } else if (isEdge) {
    return "edge";
  } else if (isSafari) {
    return "safari";
  } else if (isBlink) {
    return "blink";
  } else {
    return "unknown";
  }
};

export default useNavigator;

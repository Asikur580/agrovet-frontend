import { useState, useEffect } from "react";

// Custom hook for OS detection
function useOSDetection() {
  const [os, setOs] = useState("Unknown");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const detectOS = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const platform = navigator.platform;

      // Mobile detection
      const mobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent
        );
      setIsMobile(mobile);

      // OS detection
      if (/windows phone/i.test(userAgent)) return "Windows Phone";
      if (/android/i.test(userAgent)) return "Android";
      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return "iOS";
      if (/win/i.test(platform)) return "Windows";
      if (/mac/i.test(platform)) return "macOS";
      if (/linux/i.test(platform)) return "Linux";

      return "Unknown OS";
    };

    setOs(detectOS());
  }, []);

  return { os, isMobile };
}
export default useOSDetection;

import React, { useEffect, useState } from "react";
import icon from "../assets/images/favicon.ico";

const useDeviceNotification = () => {
  const [deviceNotifyData, setDeviceNotifyData] = useState();
  useEffect(() => {
    if (deviceNotifyData) {
      const url = deviceNotifyData.data.order_id
        ? `/orders?id=${deviceNotifyData.data.order_id}`
        : deviceNotifyData.data.invoice_id
        ? `/sales?id=${deviceNotifyData.data.invoice_id}`
        : "/";

      const notification = new Notification("Hello!", {
        body: deviceNotifyData.data.message,
        icon: icon, // Optional: URL to an icon
        image: icon, // Optional: URL to an image
        tag: "unique-tag", // Optional: Tag to group notifications
        data: { url: url }, // Optional: Custom data
      });

      // Handle click event
      notification.onclick = function (event) {
        event.preventDefault(); // Prevent default behavior
        window.open(event.target.data.url, "_blank"); // Open a URL
      };
    }
  }, [deviceNotifyData]);
  return [deviceNotifyData, setDeviceNotifyData];
};

export default useDeviceNotification;

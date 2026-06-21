import React, { useEffect } from "react";
import { toast } from "react-toastify";
import icon from "../../assets/images/favicon.ico";

const Test = () => {
  useEffect(() => {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
      toast.error("This browser does not support notifications.");
    } else {
      // Request permission
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          toast.success("Notification permission granted.");
        } else {
          toast.error("Notification permission denied.");
        }
      });
    }
  }, []);

  const SendNotification = () => {
    const notification = new Notification("Hello!", {
      body: "This is a web notification for testing.",
      icon: icon, // Optional: URL to an icon
      image: icon, // Optional: URL to an image
      tag: "unique-tag", // Optional: Tag to group notifications
      data: { url: "http://localhost:3000/profile" }, // Optional: Custom data
    });

    // Handle click event
    notification.onclick = function (event) {
      event.preventDefault(); // Prevent default behavior
      window.open(event.target.data.url, "_blank"); // Open a URL
    };
  };

  return (
    <>
      <h1 className="my-5">
        Currently this page has been using for experiment
      </h1>

      <button className="button" onClick={SendNotification}>
        Send notification
      </button>
    </>
  );
};

export default Test;

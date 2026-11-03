import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Badge } from "antd";
import { toast } from "react-toastify";
// import Skeleton from "@mui/material/Skeleton";

//=>>> Icons
import { HiBars3BottomLeft } from "react-icons/hi2";
import { IoNotificationsSharp, IoSearch } from "react-icons/io5";
import { FaAngleDown, FaUserAlt } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
// import { FaGear } from "react-icons/fa6";

//=>>> Css
import "./Header.css";

//=>>> Utility
import ApiConfig, { imgUrl } from "../../assets/js/ApiConfig";
import { AuthContext } from "../../context/AuthContext";
import { GetCookie } from "../../assets/js/GetCookie";
import { Decryption } from "../../assets/js/Encryption";
import { DateFormater } from "../../assets/js/DateFormater";
import useDeviceNotification from "../../hooks/useDeviceNotification";
import useEscapeKey from "../../hooks/useEscapeKey";
import DummyImg from "../../assets/images/profile.png";
import Logout from "../../assets/js/Logout";
import notifySound from "../../assets/sounds/s-1.mp3";

//=>>> Components
// const SearchModal = dynamic(
//   () => import("@/app/Components/Modal/SearchModal"),
//   {
//     loading: () => "",
//   }
// );
// const ThemeTogglerSwitch = dynamic(
//   () => import("@/app/Components/Switch/ThemeTogglerSwitch"),
//   {
//     loading: () => "",
//   }
// );

const Header = (props) => {
  const { setToggleSideNav } = props;
  const { headers } = useContext(AuthContext);
  const [deviceNotifyData, setDeviceNotifyData] = useDeviceNotification();

  // const [userRole, setUserRole] = useState(
  //   Decryption(GetCookie("_Role_AJS+c0mPanY-07@12#31_user"), import.meta.env.VITE_SECRET_KEY)
  // );
  const [userName, setUserName] = useState();
  const [profilePic, setProfilePic] = useState();
  const [notifyDropVal, setNotifyDropVal] = useState(false);
  const [searchDropVal, setSearchDropVal] = useState(false);

  //=>>> Profile dropdown
  const [profileVal, setProfileVal] = useState(false);
  const handleProfileDrpDown = () => {
    setProfileVal((prev) => !prev);
    // setSearchDropVal((prev) => (prev = false));
    setNotifyDropVal((prev) => (prev = false));
  };

  //=>>> Close dropdown when press esc btn
  useEscapeKey(() => setSearchDropVal((prev) => (prev = false)));
  useEscapeKey(() => setNotifyDropVal((prev) => (prev = false)));
  useEscapeKey(() => setProfileVal((prev) => (prev = false)));

  useEffect(() => {
    // Get user name from cookie
    setUserName(
      Decryption(
        GetCookie("_Unme_AJS+c0mPanY-07@12#31_user") || "",
        import.meta.env.VITE_SECRET_KEY
      ) || ""
    );

    // Get profile pic from cookie
    setProfilePic(
      Decryption(
        GetCookie("_Uimg_AJS+c0mPanY-07@12#31_user") || "",
        import.meta.env.VITE_SECRET_KEY
      ) || ""
    );
  }, []);

  //=>>> Notification system start
  const [notifications, setNotifications] = useState([]);
  const [notifiSliceCount, setNotifiSliceCount] = useState(5);
  const [unReadNotifications, setUnReadNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const slicedNotifications = unReadNotifications.slice(0, notifiSliceCount);
  const prevDataRef = useRef(null);

  // Notification sound preload
  const notificationSound = useRef(new Audio(notifySound));

  const playNotificationSound = useCallback(() => {
    const sound = notificationSound.current;
    sound.currentTime = 0; // rewind to start
    sound.play().catch((err) => {
      console.warn("Autoplay blocked or sound not found:", err);
    });
  }, []);

  const GetNotification = useCallback(async () => {
    try {
      const response = await ApiConfig.get("/notifications?unread=1", { headers });
      const newData = response.data?.data || [];
      const totalUnread =
        response.data?.unread_count !== undefined
          ? response.data.unread_count
          : newData.filter((item) => item.read_at == null).length;

      // compare with previous data
      if (JSON.stringify(newData) !== JSON.stringify(prevDataRef.current)) {
        // Play sound only if new notification added
        if (
          prevDataRef.current &&
          newData.length > prevDataRef.current.length
        ) {
          playNotificationSound();
          setTimeout(() => {
            setDeviceNotifyData(newData[0]);
          }, 5000);
        }

        setUnreadCount(totalUnread);
        setNotifications(newData);
        setUnReadNotifications(newData.filter((item) => item.read_at == null));
        localStorage.setItem("Notifications", JSON.stringify(newData));
        prevDataRef.current = newData;
      }
    } catch (error) {
      console.error("Notification fetch error:", error);
      const cachedData = localStorage.getItem("Notifications");
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setNotifications(parsedData);
        setUnReadNotifications(
          parsedData.filter((item) => item.read_at == null)
        );
      }
    }
  }, [headers, playNotificationSound]);

  useEffect(() => {
    GetNotification(); // first run

    const interval = setInterval(() => {
      GetNotification(); // call every 1 minute
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [GetNotification]);

  const ClickNotification = (notificationId) => {
    // Immediately remove from unread notifications
    setNotifications((prev) => prev.filter((item) => item.id !== notificationId));
    setUnReadNotifications((prev) =>
      prev.filter((item) => item.id !== notificationId)
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    ApiConfig.post(`notifications/${notificationId}/read`, {}, { headers })
      .catch((err) => {
        console.error("Mark notification read error:", err);
      });
    setNotifyDropVal(false);
  };

  const handleMarkAllAsRead = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setUnreadCount(0);
    setNotifications([]);
    setUnReadNotifications([]);
    localStorage.removeItem("Notifications");
    toast.success("All notifications marked as read");

    try {
      await ApiConfig.post("/notifications/read-all", {}, { headers });
    } catch (err) {
      console.error("Mark all as read error:", err);
      toast.error(err?.response?.data?.message || "Failed to mark all as read");
      GetNotification();
    }
  };
  //=>>> Notification system end

  return (
    <header className={`header`}>
      <div className="left">
        <div
          className="toggler"
          id="openSideNav"
          onClick={() => {
            setToggleSideNav((prev) => !prev);
          }}
        >
          <HiBars3BottomLeft />
        </div>
      </div>
      <ul className="right">
        {/* <!-- ThemeToggler start --> */}
        {/* <li className="search">
          <ThemeTogglerSwitch
            onClick={() => {
              localStorage.setItem("Theme", true);
            }}
          />
        </li> */}
        {/* ThemeToggler end */}

        {/* Search start */}
        {/* <li className="search">
          <SearchModal
            ModalOpenBtnTitle={
              <IoSearch
                className="search-icon"
                size={25}
                onClick={() => {
                  setSearchDropVal((prev) => !prev);
                  setNotifyDropVal((prev) => (prev = false));
                  setProfileVal((prev) => (prev = false));
                }}
              />
            }
            slug="# Search"
          />
        </li> */}
        {/* Search end */}

        {/* Notification start */}
        <li
          className={`notification ${
            notifyDropVal == true ? "activeNotification" : ""
          }`}
        >
          <Badge count={unreadCount || unReadNotifications.length} overflowCount={999}>
            <IoNotificationsSharp
              className="notification_icon"
              onClick={() => {
                setNotifyDropVal((prev) => !prev);
                // setSearchDropVal((prev) => (prev = false));
                setProfileVal((prev) => (prev = false));
              }}
            />
          </Badge>
          <ul className="header_dropdown">
            <div className="corner"></div>
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700 bg-gray-900 text-white rounded-t">
              <span className="font-semibold text-xs tracking-wide">
                Unread Notifications {(unreadCount || unReadNotifications.length) > 0 && `(${unreadCount || unReadNotifications.length})`}
              </span>
              {(unreadCount > 0 || unReadNotifications.length > 0) && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold hover:underline bg-transparent border-0 cursor-pointer p-0"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="header_dropdown_content">
              {unReadNotifications.length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-400">
                  No unread notifications
                </div>
              ) : (
                slicedNotifications.map((item, index) => {
                  return (
                    <li key={item.id || index} onClick={() => ClickNotification(item.id)}>
                      <Link
                        to={
                          item.data.order_id
                            ? `/orders?id=${item.data.order_id}`
                            : item.data.invoice_id
                            ? `/sales?id=${item.data.invoice_id}`
                            : "/"
                        }
                      >
                        <div>
                          <div className="flex items-center gap-3">
                            <p>{item.data.message}</p>
                            <span className="marker visible"></span>
                          </div>
                          <p className="text-end text-[0.75rem] mt-3">
                            {item.data.order_id
                              ? item.data.order_id
                              : item.data.invoice_id
                              ? item.data.invoice_id
                              : "/"}
                            -{DateFormater(item.created_at)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })
              )}
              {unReadNotifications.length > slicedNotifications.length && (
                <div className="seeMoreNotifi">
                  <button
                    onClick={() => {
                      setNotifiSliceCount((prev) => prev * 2);
                    }}
                  >
                    See more notifications
                  </button>
                </div>
              )}
            </div>
          </ul>
        </li>
        {/* Notification end */}
        {/* Profile start */}
        <li
          onClick={handleProfileDrpDown}
          className={`profile ${profileVal == true ? "activeProfile" : ""}`}
        >
          <div>
            {profilePic != "null" ? (
              <img src={`${imgUrl}${profilePic}`} alt="profile pic" />
            ) : (
              <img src={DummyImg} alt="profile pic" />
              // <Skeleton
              //   variant="circular"
              //   animation="wave"
              //   width={40}
              //   height={40}
              //   sx={{ bgcolor: "#0d0d0d21" }}
              // />
            )}
            <p className="user_name">{userName}</p>
          </div>
          <FaAngleDown className="profile_right_icon" />
          <ul className="header_dropdown">
            <div className="corner"></div>
            <li>
              <Link to="/profile" onClick={handleProfileDrpDown}>
                <FaUserAlt size={15} />
                Profile
              </Link>
            </li>
            {/* <li>
              <Link to="/settings" onClick={handleProfileDrpDown}>
                <FaGear /> Settings
              </Link>
            </li> */}
            <li>
              <a onClick={() => Logout(headers)}>
                <LuLogOut />
                Logout
                {/* <LogoutBtn headers={headers} /> */}
              </a>
            </li>
          </ul>
        </li>
        {/* Profile end */}
      </ul>
    </header>
  );
};

export default Header;

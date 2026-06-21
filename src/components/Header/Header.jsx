import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Badge } from "antd";
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
  const slicedNotifications = notifications.slice(0, notifiSliceCount);
  const [unReadNotifications, setUnReadNotifications] = useState([]);
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
      const response = await ApiConfig.get("/notifications", { headers });
      const newData = response.data?.data || [];

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
    ApiConfig.post(`notifications/${notificationId}/read`, {}, { headers })
      .then((response) => {
        // console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
    setNotifyDropVal((prev) => !prev);
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
          <Badge count={unReadNotifications.length} overflowCount={999}>
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
            <div className="header_dropdown_content">
              {Array.isArray(slicedNotifications) &&
                slicedNotifications.map((item, index) => {
                  return (
                    <li key={index} onClick={() => ClickNotification(item.id)}>
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
                            <span
                              className={`marker ${
                                item.read_at == null ? "visible" : "invisible"
                              }`}
                            ></span>
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
                })}
              <div className="seeMoreNotifi">
                <button
                  onClick={() => {
                    setNotifiSliceCount((prev) => prev * 2);
                  }}
                >
                  See more notifications
                </button>
              </div>
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

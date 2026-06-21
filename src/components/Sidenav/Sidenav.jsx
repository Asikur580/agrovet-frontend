import { useContext, useEffect, useState, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";

//=>>> Icons
import { IoClose, IoAccessibility } from "react-icons/io5";
import {
  FaHouse,
  FaGear,
  FaListUl,
  FaTag,
  FaBoxOpen,
  FaAngleDown,
  FaSackDollar,
  FaPeopleGroup,
  FaUserGraduate,
} from "react-icons/fa6";
import { FaUserAlt, FaTools, FaUsers, FaHandPointRight } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { PiUserSwitchBold } from "react-icons/pi";
import { BiSolidSend } from "react-icons/bi";
import { SiPrivateinternetaccess } from "react-icons/si";
import { TbCoinTakaFilled } from "react-icons/tb";
import { IoIosSend } from "react-icons/io";

//=>>> Css
import "./sidenav.css";

//=>>> Components
import LogoutBtn from "./LogoutBtn";

//=>>> Additional utility
import { AuthContext } from "../../context/AuthContext";
import useEscapeKey from "../../hooks/useEscapeKey";

const sidenav = (props) => {
  const { toggleSideNav, setToggleSideNav } = props;
  const { headers, userRole } = useContext(AuthContext);
  const location = useLocation();

  const CloseSideNav = () => {
    setToggleSideNav(false);
  };
  useEscapeKey(() => setToggleSideNav(false));

  // useEffect(() => {
  //   console.log(userRole);
  // }, []);

  //=>>> Dropdown section
  const [dropdown, setDropdown] = useState({
    sms: false,
    product_settings: false,
  });
  useEffect(() => {
    if (
      dropdown.product_settings == true ||
      location.pathname == "/orders" ||
      location.pathname == "/order-create" ||
      location.pathname == "/sales" ||
      location.pathname == "/sales-create" ||
      (Array.isArray(location.pathname.match("/invoice/")) &&
        location.pathname.match("/invoice/")[0] == "/invoice/")
    ) {
      setDropdown({ ...dropdown, product_settings: true });
    } else if (
      dropdown.sms == true ||
      location.pathname == "/send-sms-anyone" ||
      location.pathname == "/send-sms-everyone" ||
      location.pathname == "/sms-template"
    ) {
      setDropdown({ ...dropdown, sms: true });
    } else {
      setDropdown({ sms: false, product_settings: false });
    }
  }, [
    //==> Sms
    location.pathname == "/send-sms-anyone" ||
      location.pathname == "/send-sms-everyone" ||
      location.pathname == "/sms-template" ||
      //==> Product settings
      location.pathname == "/orders" ||
      location.pathname == "/order-create" ||
      location.pathname == "/sales" ||
      location.pathname == "/sales-create" ||
      (Array.isArray(location.pathname.match("/invoice/")) &&
        location.pathname.match("/invoice/")[0] == "/invoice/"),
  ]);

  //=>>> Manage Permissions
  const dashboard = useMemo(
    () =>
      ["Developer", "Dashboard-page"].some((item) => userRole.includes(item)),
    [userRole]
  );
  const profile = useMemo(
    () => ["Developer", "Profile-page"].some((item) => userRole.includes(item)),
    [userRole]
  );
  const permissions = useMemo(
    () =>
      ["Developer", "Permission-page"].some((item) => userRole.includes(item)),
    [userRole]
  );
  const sms = useMemo(
    () => ["Developer", "Sms"].some((item) => userRole.includes(item)),
    [userRole]
  );
  const send_sms_anyone = useMemo(
    () =>
      ["Developer", "Sms-send-anyone-page"].some((item) =>
        userRole.includes(item)
      ),
    [userRole]
  );
  const send_sms_everyone = useMemo(
    () =>
      ["Developer", "Sms-send-everyone-page"].some((item) =>
        userRole.includes(item)
      ),
    [userRole]
  );
  const sms_template = useMemo(
    () =>
      ["Developer", "Sms-template-page"].some((item) =>
        userRole.includes(item)
      ),
    [userRole]
  );
  const designation = useMemo(
    () =>
      ["Developer", "Designation-page"].some((item) => userRole.includes(item)),
    [userRole]
  );
  const employees = useMemo(
    () =>
      ["Developer", "Employee-page"].some((item) => userRole.includes(item)),
    [userRole]
  );
  const users = useMemo(
    () => ["Developer", "User-page"].some((item) => userRole.includes(item)),
    [userRole]
  );
  const suppliers = useMemo(
    () =>
      ["Developer", "Supplier-page"].some((item) => userRole.includes(item)),
    [userRole]
  );
  const brands = useMemo(
    () => ["Developer", "Brand-page"].some((item) => userRole.includes(item)),
    [userRole]
  );
  const categories = useMemo(
    () =>
      ["Developer", "Category-page"].some((item) => userRole.includes(item)),
    [userRole]
  );
  const products = useMemo(
    () => ["Developer", "Product-page"].some((item) => userRole.includes(item)),
    [userRole]
  );
  const customers = useMemo(
    () =>
      ["Developer", "Customer-page"].some((item) => userRole.includes(item)),
    [userRole]
  );
  const orders = useMemo(
    () => ["Developer", "Order-page"].some((item) => userRole.includes(item)),
    [userRole]
  );
  const order_create = useMemo(
    () =>
      ["Developer", "Order-create-page"].some((item) =>
        userRole.includes(item)
      ),
    [userRole]
  );
  const sales = useMemo(
    () => ["Developer", "Sale-page"].some((item) => userRole.includes(item)),
    [userRole]
  );
  const sales_create = useMemo(
    () =>
      ["Developer", "Sale-create-page"].some((item) => userRole.includes(item)),
    [userRole]
  );
  const cost_categories = useMemo(
    () =>
      ["Developer", "Cost-categories-page"].some((item) =>
        userRole.includes(item)
      ),
    [userRole]
  );
  const emp_cost_categories = useMemo(
    () =>
      ["Developer", "Employee-cost-category-page"].some((item) =>
        userRole.includes(item)
      ),
    [userRole]
  );
  const office_cost = useMemo(
    () =>
      ["Developer", "Office-cost-page"].some((item) => userRole.includes(item)),
    [userRole]
  );
  // console.log(dashboard);

  return (
    <div className={`side-nav ${toggleSideNav == true ? "active" : ""}`}>
      <div className="brand">
        <h2>Radiant agrovet</h2>
        <div
          className={`toggler ${toggleSideNav == true ? "show" : ""}`}
          onClick={CloseSideNav}
        >
          <IoClose />
        </div>
      </div>
      <ul className="side-menu">
        {dashboard == true && (
          <li>
            <NavLink to="/" onClick={CloseSideNav}>
              <div className="d-flex">
                <FaHouse className="icon" size={18} />
                <p>Dashboard</p>
              </div>
            </NavLink>
          </li>
        )}

        {/* {profile || permissions ? (
          <p className="indicate-section">Accessibility</p>
        ) : (
          ""
        )}
        {profile == true && (
          <li>
            <NavLink to="/profile" onClick={CloseSideNav}>
              <div className="d-flex">
                <FaUserAlt className="icon" size={15} />
                <p>Profile</p>
              </div>
            </NavLink>
          </li>
        )}
        {permissions == true && (
          <li>
            <NavLink to="/permissions" onClick={CloseSideNav}>
              <div className="d-flex">
                <SiPrivateinternetaccess className="icon" size={19} />
                <p>Permissions</p>
              </div>
            </NavLink>
          </li>
        )} */}

        {/* Sms Dropdown menu */}
        {sms == true && (
          <li
            className={`side-nav-dropdown-parent ${
              dropdown.sms ? "active" : ""
            }`}
          >
            <span
              className={`drpLink ${dropdown.sms ? "active" : ""}`}
              onClick={(e) => {
                if (dropdown.sms == false) {
                  setDropdown({ ...dropdown, sms: true });
                } else {
                  setDropdown({ ...dropdown, sms: false });
                }
              }}
            >
              <div className="d-flex">
                <IoIosSend className="icon" size={24} />
                <p>SMS</p>
              </div>
              <FaAngleDown className="right-icon" />
            </span>
            <ul className="side-nav-dropdown">
              {send_sms_anyone == true && (
                <li>
                  <NavLink to="/send-sms-anyone" onClick={CloseSideNav}>
                    <FaHandPointRight className="icon" size={16} />
                    <p>Send anyone</p>
                  </NavLink>
                </li>
              )}
              {send_sms_everyone == true && (
                <li>
                  <NavLink to="/send-sms-everyone" onClick={CloseSideNav}>
                    <FaHandPointRight className="icon" size={16} />
                    <p>Send everyone</p>
                  </NavLink>
                </li>
              )}
              {sms_template == true && (
                <li>
                  <NavLink to="/sms-template" onClick={CloseSideNav}>
                    <FaHandPointRight className="icon" size={16} />
                    <p>Sms template</p>
                  </NavLink>
                </li>
              )}
            </ul>
          </li>
        )}

        {designation || employees || users || suppliers ? (
          <p className="indicate-section">User panel</p>
        ) : (
          ""
        )}
        {designation == true && (
          <li>
            <NavLink to="/designation" onClick={CloseSideNav}>
              <div className="d-flex">
                <FaUserGraduate className="icon" size={16} />
                <p>Designation</p>
              </div>
            </NavLink>
          </li>
        )}
        {employees == true && (
          <li>
            <NavLink to="/employees" onClick={CloseSideNav}>
              <div className="d-flex">
                <PiUserSwitchBold className="icon" size={20} />
                <p>Employees</p>
              </div>
            </NavLink>
          </li>
        )}
        {users == true && (
          <li>
            <NavLink to="/users" onClick={CloseSideNav}>
              <div className="d-flex">
                <FaUsers className="icon" size={20} />
                <p>Users</p>
              </div>
            </NavLink>
          </li>
        )}
        {suppliers == true && (
          <li>
            <NavLink to="/suppliers" onClick={CloseSideNav}>
              <div className="d-flex">
                <BiSolidSend className="icon" size={19} />
                <p>Suppliers</p>
              </div>
            </NavLink>
          </li>
        )}

        {brands ||
        categories ||
        products ||
        customers ||
        orders ||
        order_create ||
        sales ||
        sales_create ? (
          <p className="indicate-section">Products</p>
        ) : (
          ""
        )}
        {brands == true && (
          <li>
            <NavLink to="/brands" onClick={CloseSideNav}>
              <div className="d-flex">
                <FaTag className="icon" size={20} />
                <p>Brands</p>
              </div>
            </NavLink>
          </li>
        )}
        {categories == true && (
          <li>
            <NavLink to="/categories" onClick={CloseSideNav}>
              <div className="d-flex">
                <FaListUl className="icon" size={16} />
                <p>Categories</p>
              </div>
            </NavLink>
          </li>
        )}
        {products == true && (
          <li>
            <NavLink to="/products" onClick={CloseSideNav}>
              <div className="d-flex">
                <FaBoxOpen className="icon" size={19} />
                <p>Products</p>
              </div>
            </NavLink>
          </li>
        )}
        {customers == true && (
          <li>
            <NavLink to="/customers" onClick={CloseSideNav}>
              <div className="d-flex">
                <FaPeopleGroup className="icon" size={19} />
                <p>Customers</p>
              </div>
            </NavLink>
          </li>
        )}
        {/* Product settings Dropdown menu */}
        <li
          className={`side-nav-dropdown-parent ${
            dropdown.product_settings ? "active" : ""
          }`}
        >
          <span
            className={`drpLink ${dropdown.product_settings ? "active" : ""}`}
            onClick={() => {
              if (dropdown.product_settings == false) {
                setDropdown({ ...dropdown, product_settings: true });
              } else {
                setDropdown({ ...dropdown, product_settings: false });
              }
            }}
          >
            <div className="d-flex">
              <FaTools className="icon" size={16} />
              <p>Product settings</p>
            </div>
            <FaAngleDown className="right-icon" />
          </span>
          <ul className="side-nav-dropdown">
            {orders == true && (
              <li>
                <NavLink to="/orders" onClick={CloseSideNav}>
                  <FaHandPointRight className="icon" size={16} />
                  <p>Orders</p>
                </NavLink>
              </li>
            )}
            {order_create == true && (
              <li>
                <NavLink to="/order-create" onClick={CloseSideNav}>
                  <FaHandPointRight className="icon" size={16} />
                  <p>Order create</p>
                </NavLink>
              </li>
            )}
            {sales == true && (
              <li>
                <NavLink to="/sales" onClick={CloseSideNav}>
                  <FaHandPointRight className="icon" size={16} />
                  <p>Sales</p>
                </NavLink>
              </li>
            )}
            {sales_create == true && (
              <li>
                <NavLink to="/sales-create" onClick={CloseSideNav}>
                  <FaHandPointRight className="icon" size={16} />
                  <p>Sales create</p>
                </NavLink>
              </li>
            )}
          </ul>
        </li>

        {/* Dropdown menu */}
        {/* <li className={`side-nav-dropdown-parent ${navDrp_2 ? "active" : ""}`}>
          <span
            className={`drpLink ${navDrp_2 ? "active" : ""}`}
            onClick={() => {
              if (navDrp_2 == false) {
                setNavDrp_2(true);
                // setNavDrp_1(false);
              } else {
                setNavDrp_2(false);
              }
            }}
          >
            <div className="d-flex">
              <FaTools className="icon" size={16} />
              <p>Product settings 2</p>
            </div>
            <FaAngleDown className="right-icon" />
          </span>
          <ul className="side-nav-dropdown">
            <li>
              <NavLink to="/profile" onClick={CloseSideNav}>
                <div className="d-flex">
                  <FaUserAlt className="icon" size={15} />
                  <p>Profile</p>
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings" onClick={CloseSideNav}>
                <div className="d-flex">
                  <FaGear className="icon" size={17} />
                  <p>Settings</p>
                </div>
              </NavLink>
            </li>
          </ul>
        </li> */}

        {cost_categories || office_cost ? (
          <p className="indicate-section">Featured</p>
        ) : (
          ""
        )}
        {cost_categories == true && (
          <li>
            <NavLink to="/cost-categories" onClick={CloseSideNav}>
              <div className="d-flex">
                <TbCoinTakaFilled className="icon" size={20} />
                <p>Cost categories</p>
              </div>
            </NavLink>
          </li>
        )}
        {emp_cost_categories == true && (
          <li>
            <NavLink to="/employee-cost-category" onClick={CloseSideNav}>
              <div className="d-flex">
                <TbCoinTakaFilled className="icon" size={20} />
                <p>Emp cost category</p>
              </div>
            </NavLink>
          </li>
        )}
        {office_cost == true && (
          <li>
            <NavLink to="/office-cost" onClick={CloseSideNav}>
              <div className="d-flex">
                <FaSackDollar className="icon" size={16} />
                <p>Office Cost</p>
              </div>
            </NavLink>
          </li>
        )}
      </ul>

      <div className="bottom-box">
        <LogoutBtn headers={headers} />
      </div>
    </div>
  );
};

export default sidenav;

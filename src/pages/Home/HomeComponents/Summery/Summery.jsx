import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

//===> Icons
import { PiUserSwitchBold } from "react-icons/pi";
import { FaPeopleGroup } from "react-icons/fa6";
import { BiSolidSend } from "react-icons/bi";
import { FaTruckFast } from "react-icons/fa6";

//===> Css
import "./Summery.css";

//===> Utilities
import ApiConfig from "../../../../assets/js/ApiConfig";
import { AuthContext } from "../../../../context/AuthContext";

const Summery = () => {
  const { headers, userRole } = useContext(AuthContext);
  const [apiData, setApiData] = useState({});

  const getApiData = async () => {
    try {
      // setLoader(true);
      await ApiConfig.get("/dashboard-report", { headers }).then((response) => {
        setApiData(response.data.data);
        //==> For offline use
        localStorage.setItem(
          "DashboardReport",
          JSON.stringify(response.data.data)
        );
      });
    } catch (error) {
      console.log(error);
      //==> For offline use
      const cachedData = localStorage.getItem("DashboardReport");
      if (cachedData) {
        setApiData(JSON.parse(cachedData));
      }
    }
  };
  useEffect(() => {
    getApiData();
  }, []);

  return (
    <div className="Summery">
      <Link to="/customers" className="card">
        <FaPeopleGroup className="icon" />
        <div className="text-center">
          <h3 className="summeryTitle">Customers</h3>
          <p className="amount" style={{ color: "rgb(106 88 253)" }}>
            {apiData.total_customer}
          </p>
        </div>
      </Link>
      <Link to="/orders" className="card">
        <FaTruckFast className="icon" />
        <div className="text-center">
          <h3 className="summeryTitle">Orders</h3>
          <p className="amount" style={{ color: "rgb(248 142 56)" }}>
            {apiData.total_order}
          </p>
        </div>
      </Link>
      <Link to="/employees" className="card">
        <PiUserSwitchBold className="icon" />
        <div className="text-center">
          <h3 className="summeryTitle">Employees</h3>
          <p className="amount" style={{ color: "rgb(6 169 2)" }}>
            {apiData.total_employee}
          </p>
        </div>
      </Link>
      <Link to="/suppliers" className="card">
        <BiSolidSend className="icon" />
        <div className="text-center">
          <h3 className="summeryTitle">Suppliers</h3>
          <p className="amount" style={{ color: "rgb(253 88 246)" }}>
            {apiData.total_supplier}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default Summery;

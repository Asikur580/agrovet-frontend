import React, { useContext, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

// Icons
import {
  FaCalendarDay,
  FaChartLine,
  FaClockRotateLeft,
  FaTruckFast,
  FaTriangleExclamation,
  FaUsers,
  FaUserTie,
  FaBuilding,
  FaArrowRight,
} from "react-icons/fa6";

// Css
import "./Summery.css";

// Utilities
import ApiConfig from "../../../../assets/js/ApiConfig";
import { AuthContext } from "../../../../context/AuthContext";

const Summery = () => {
  const { headers } = useContext(AuthContext);
  const [apiData, setApiData] = useState({
    total_customer: 0,
    total_order: 0,
    total_employee: 0,
    total_supplier: 0,
    today_sales: 0,
    today_invoices: 0,
    month_sales: 0,
    total_due: 0,
    due_invoices_count: 0,
    low_stock_count: 0,
  });

  const getApiData = async () => {
    try {
      const response = await ApiConfig.get("/dashboard-report", { headers });
      if (response.data?.status && response.data?.data) {
        setApiData(response.data.data);
        localStorage.setItem("DashboardReport", JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.error("Dashboard report error:", error);
      const cachedData = localStorage.getItem("DashboardReport");
      if (cachedData) {
        setApiData(JSON.parse(cachedData));
      }
    }
  };

  useEffect(() => {
    getApiData();
  }, [headers]);

  const formatCurrency = (val) => {
    const num = Number(val || 0);
    return (
      "Tk " +
      num.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  const formatNumber = (val) => {
    return Number(val || 0).toLocaleString("en-IN");
  };

  const todayStr = dayjs().format("YYYY-MM-DD");
  const monthStartStr = dayjs().startOf("month").format("YYYY-MM-DD");
  const monthEndStr = dayjs().endOf("month").format("YYYY-MM-DD");

  return (
    <div className="SummeryWrapper">
      {/* Primary KPI Cards Grid */}
      <div className="SummeryGrid">
        {/* Today's Sales */}
        <Link
          to={`/sales?filter=today&startDate=${todayStr}&endDate=${todayStr}`}
          className="SummeryCard card-today"
          title="View today's sales and invoices"
        >
          <div className="SummeryCardHeader">
            <span className="SummeryLabel">Today's Sales</span>
            <div className="SummeryIconWrap icon-today">
              <FaCalendarDay size={18} />
            </div>
          </div>
          <div className="SummeryValue value-today">
            {formatCurrency(apiData.today_sales)}
          </div>
          <div className="SummeryFooter">
            <span>{formatNumber(apiData.today_invoices)} Invoices Today</span>
            <FaArrowRight size={10} className="arrow" />
          </div>
        </Link>

        {/* Month Sales */}
        <Link
          to={`/sales?filter=month&startDate=${monthStartStr}&endDate=${monthEndStr}`}
          className="SummeryCard card-month"
          title="View this month's sales"
        >
          <div className="SummeryCardHeader">
            <span className="SummeryLabel">This Month's Sales</span>
            <div className="SummeryIconWrap icon-month">
              <FaChartLine size={18} />
            </div>
          </div>
          <div className="SummeryValue value-month">
            {formatCurrency(apiData.month_sales)}
          </div>
          <div className="SummeryFooter">
            <span>Cumulative Month Total</span>
            <FaArrowRight size={10} className="arrow" />
          </div>
        </Link>

        {/* Market Due */}
        <Link
          to="/sales?filter=due"
          className="SummeryCard card-due"
          title="View due invoices"
        >
          <div className="SummeryCardHeader">
            <span className="SummeryLabel">Market Outstanding Due</span>
            <div className="SummeryIconWrap icon-due">
              <FaClockRotateLeft size={18} />
            </div>
          </div>
          <div className="SummeryValue value-due">
            {formatCurrency(apiData.total_due)}
          </div>
          <div className="SummeryFooter">
            <span>{formatNumber(apiData.due_invoices_count)} Due Invoices</span>
            <FaArrowRight size={10} className="arrow" />
          </div>
        </Link>

        {/* Active Orders */}
        <Link to="/orders" className="SummeryCard card-orders">
          <div className="SummeryCardHeader">
            <span className="SummeryLabel">Total Orders</span>
            <div className="SummeryIconWrap icon-orders">
              <FaTruckFast size={18} />
            </div>
          </div>
          <div className="SummeryValue value-orders">
            {formatNumber(apiData.total_order)}
          </div>
          <div className="SummeryFooter">
            <span>Customer Orders Placed</span>
            <FaArrowRight size={10} className="arrow" />
          </div>
        </Link>

        {/* Low Stock Alerts */}
        <Link
          to="/products?filter=low_stock"
          className="SummeryCard card-stock"
          title="View low stock products"
        >
          <div className="SummeryCardHeader">
            <span className="SummeryLabel">Low Stock Alert</span>
            <div className="SummeryIconWrap icon-stock">
              <FaTriangleExclamation size={18} />
            </div>
          </div>
          <div className="SummeryValue value-stock">
            {formatNumber(apiData.low_stock_count)} Items
          </div>
          <div className="SummeryFooter">
            <span>Stock &lt;= 10 Units</span>
            <FaArrowRight size={10} className="arrow" />
          </div>
        </Link>
      </div>

      {/* Secondary Entity Count Pills Bar */}
      <div className="SummeryPillsBar">
        <span className="SummeryPillsLabel">Quick Entity Summary:</span>

        <Link to="/customers" className="SummeryPill" title="View all customers">
          <FaUsers className="pill-icon text-indigo-600" size={13} />
          <span>Customers:</span>
          <strong>{formatNumber(apiData.total_customer)}</strong>
        </Link>

        <Link to="/employees" className="SummeryPill" title="View all employees">
          <FaUserTie className="pill-icon text-emerald-600" size={13} />
          <span>Employees:</span>
          <strong>{formatNumber(apiData.total_employee)}</strong>
        </Link>

        <Link to="/suppliers" className="SummeryPill" title="View all suppliers">
          <FaBuilding className="pill-icon text-amber-600" size={13} />
          <span>Suppliers:</span>
          <strong>{formatNumber(apiData.total_supplier)}</strong>
        </Link>
      </div>
    </div>
  );
};

export default React.memo(Summery);

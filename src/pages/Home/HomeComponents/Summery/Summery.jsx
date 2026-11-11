import React, { useContext, useEffect, useState } from "react";
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
import {
  formatNumber,
  formatCurrency,
  formatCompactCurrency,
  readCache,
} from "../../dashboardUtils";
import { StaleBadge } from "../WidgetStates";

// Big money values use compact format; full value stays in the tooltip
const Money = ({ value }) => (
  <span title={formatCurrency(value)}>{formatCompactCurrency(value)}</span>
);

// Card is a link only when the user may open the target page
const CardLink = ({ allowed, to, children, ...rest }) =>
  allowed ? (
    <Link to={to} {...rest}>
      {children}
    </Link>
  ) : (
    <div {...rest} style={{ cursor: "default" }}>
      {children}
    </div>
  );

const Summery = ({ canSeeSales = true, canSeeOrders = true, canSeeProducts = true, canSeeCustomers = true, canSeeEmployees = true, canSeeSuppliers = true }) => {
  const { headers } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);
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
      setLoading(true);
      const response = await ApiConfig.get("/dashboard-report", { headers });
      if (response.data?.status && response.data?.data) {
        setApiData(response.data.data);
        setIsStale(false);
        localStorage.setItem("DashboardReport", JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.error("Dashboard report error:", error);
      const cachedData = readCache("DashboardReport");
      if (cachedData) {
        setApiData(cachedData);
        setIsStale(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getApiData();
  }, [headers]);

  // Value placeholder while first load runs (avoid showing false zeros)
  const val = (node) =>
    loading ? <span className="SummerySkeleton" aria-label="Loading" /> : node;

  const todayStr = dayjs().format("YYYY-MM-DD");
  const monthStartStr = dayjs().startOf("month").format("YYYY-MM-DD");
  const monthEndStr = dayjs().endOf("month").format("YYYY-MM-DD");

  return (
    <div className="SummeryWrapper">
      {isStale && (
        <div className="flex justify-end">
          <StaleBadge show />
        </div>
      )}
      {/* Primary KPI Cards Grid */}
      <div className="SummeryGrid">
        {/* Today's Sales */}
        <CardLink
          allowed={canSeeSales}
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
            {val(<Money value={apiData.today_sales} />)}
          </div>
          <div className="SummeryFooter">
            <span>{formatNumber(apiData.today_invoices)} Invoices Today</span>
            <FaArrowRight size={10} className="arrow" />
          </div>
        </CardLink>

        {/* Month Sales */}
        <CardLink
          allowed={canSeeSales}
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
            {val(<Money value={apiData.month_sales} />)}
          </div>
          <div className="SummeryFooter">
            <span>Cumulative Month Total</span>
            <FaArrowRight size={10} className="arrow" />
          </div>
        </CardLink>

        {/* Market Due */}
        <CardLink
          allowed={canSeeSales}
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
            {val(<Money value={apiData.total_due} />)}
          </div>
          <div className="SummeryFooter">
            <span>{formatNumber(apiData.due_invoices_count)} Due Invoices</span>
            <FaArrowRight size={10} className="arrow" />
          </div>
        </CardLink>

        {/* Active Orders */}
        <CardLink allowed={canSeeOrders} to="/orders" className="SummeryCard card-orders">
          <div className="SummeryCardHeader">
            <span className="SummeryLabel">Total Orders</span>
            <div className="SummeryIconWrap icon-orders">
              <FaTruckFast size={18} />
            </div>
          </div>
          <div className="SummeryValue value-orders">
            {val(<>{formatNumber(apiData.total_order)}</>)}
          </div>
          <div className="SummeryFooter">
            <span>Customer Orders Placed</span>
            <FaArrowRight size={10} className="arrow" />
          </div>
        </CardLink>

        {/* Low Stock Alerts */}
        <CardLink
          allowed={canSeeProducts}
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
            {val(<>{formatNumber(apiData.low_stock_count)} Items</>)}
          </div>
          <div className="SummeryFooter">
            <span>Stock &lt;= 10 Units</span>
            <FaArrowRight size={10} className="arrow" />
          </div>
        </CardLink>
      </div>

      {/* Secondary Entity Count Pills Bar */}
      <div className="SummeryPillsBar">
        <span className="SummeryPillsLabel">Quick Entity Summary:</span>

        <CardLink allowed={canSeeCustomers} to="/customers" className="SummeryPill" title="View all customers">
          <FaUsers className="pill-icon text-indigo-600" size={13} />
          <span>Customers:</span>
          <strong>{formatNumber(apiData.total_customer)}</strong>
        </CardLink>

        <CardLink allowed={canSeeEmployees} to="/employees" className="SummeryPill" title="View all employees">
          <FaUserTie className="pill-icon text-emerald-600" size={13} />
          <span>Employees:</span>
          <strong>{formatNumber(apiData.total_employee)}</strong>
        </CardLink>

        <CardLink allowed={canSeeSuppliers} to="/suppliers" className="SummeryPill" title="View all suppliers">
          <FaBuilding className="pill-icon text-amber-600" size={13} />
          <span>Suppliers:</span>
          <strong>{formatNumber(apiData.total_supplier)}</strong>
        </CardLink>
      </div>
    </div>
  );
};

export default React.memo(Summery);

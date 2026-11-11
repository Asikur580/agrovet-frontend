import React, {
  useState,
  useEffect,
  lazy,
  Suspense,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { Link } from "react-router-dom";
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";
import { formatCurrency, readCache } from "../dashboardUtils";

//=>> Components
import { WidgetSkeleton, WidgetEmpty, StaleBadge } from "./WidgetStates";
const ModalTable = lazy(() =>
  import("../../../components/Modal/CommonModal/ModalTable")
);
const DueInvoiceDrpDown = lazy(() =>
  import("../../../components/Dropdown/DueInvoiceDrpDown")
);

const VISIBLE_LIMIT = 10;

//=>>> Aging bucket for collection priority
const agingClass = (days) => {
  const d = Number(days) || 0;
  if (d > 60) return "aging-danger";
  if (d > 30) return "aging-warn";
  return "aging-ok";
};

const DueInvoice = ({ onCount, canViewAll = true }) => {
  const { headers } = useContext(AuthContext);
  const [btnStatus, setBtnStatus] = useState({});
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);
  // Default: all dues (older dues matter most, so no date cut-off)
  const [dateRang, setDateRang] = useState(null);

  //=>>> Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ApiConfig.get("/dueInvoice", { headers });
      const datas = response.data.status ? Object.values(response.data.data || {}) : [];
      setApiData(datas);
      setIsStale(false);
      //==> For offline use
      localStorage.setItem("DueInvoice", JSON.stringify(datas));
    } catch (error) {
      console.error(error);
      //==> For offline use
      const cachedData = readCache("DueInvoice");
      if (cachedData) {
        setApiData(cachedData);
        setIsStale(true);
      }
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  //=>>> Optional date filter, then oldest (highest risk) first
  const filteredData = useMemo(() => {
    const list = apiData.filter((item) => {
      const saleDate = String(item.sale_date || "").slice(0, 10);
      if (dateRang?.startDate && saleDate < dateRang.startDate) return false;
      if (dateRang?.endDate && saleDate > dateRang.endDate) return false;
      return true;
    });
    return [...list].sort(
      (a, b) =>
        (Number(b.days_since_sale) || 0) - (Number(a.days_since_sale) || 0) ||
        (Number(b.due) || 0) - (Number(a.due) || 0)
    );
  }, [apiData, dateRang]);

  //=>>> Print data + count for the hub tab badge
  useEffect(() => {
    sessionStorage.setItem("printDueInvoice", JSON.stringify(filteredData));
    onCount?.(filteredData.length);
  }, [filteredData, onCount]);

  const totalDue = useMemo(
    () => filteredData.reduce((sum, i) => sum + (Number(i.due) || 0), 0),
    [filteredData]
  );

  //==> Render individual invoice item
  const renderInvoiceItem = (item) => {
    const customerName = item.customer?.customer_name || "Unknown customer";
    const days = Number(item.days_since_sale) || 0;
    return (
      <div className="reportBoxMini" key={item.id}>
        <Suspense fallback={<div className="HomeSkeleton-row" />}>
          <ModalTable
            id={item.id}
            slug="Due invoice"
            inputFields={[]}
            ModalOpenBtnTitle={
              <div className="HomeRow">
                <div className="HomeRow-main">
                  <p className="HomeRow-title" title={customerName}>
                    {customerName}
                  </p>
                  <p className="HomeRow-sub">
                    #{item.invoiceId}
                    {item.employee?.name ? ` • ${item.employee.name}` : ""}
                  </p>
                </div>
                <div className="HomeRow-side">
                  <p className="HomeRow-amount text-red-600">{formatCurrency(item.due)}</p>
                  <span className={`HomeAging ${agingClass(days)}`}>
                    {days} days
                  </span>
                </div>
              </div>
            }
            className="modalTableOpenBtn"
            identifier="dueInvoice"
            data={[item]}
            btnStatus={btnStatus}
            setBtnStatus={setBtnStatus}
            width="100%"
            toolTip={``}
          />
        </Suspense>
      </div>
    );
  };

  return (
    <>
      <div className="HomeWidget-head is-sticky">
        <div className="HomeWidget-title-wrap">
          <h3 className="HomeWidget-title">
            Due Invoices <span className="HomeWidget-count">({filteredData.length})</span>
          </h3>
          <StaleBadge show={isStale} />
        </div>
        <div className="HomeWidget-actions">
          <span className="HomeWidget-total">{formatCurrency(totalDue)}</span>
          <Suspense fallback={null}>
            <DueInvoiceDrpDown
              dateRang={dateRang}
              setDateRang={setDateRang}
              printData={filteredData}
              spinnerLoader={loading}
            />
          </Suspense>
        </div>
      </div>

      <div className="HomeAging-legend">
        <span className="HomeAging aging-ok">0-30 days</span>
        <span className="HomeAging aging-warn">31-60 days</span>
        <span className="HomeAging aging-danger">60+ days</span>
      </div>

      {loading && apiData.length === 0 ? (
        <WidgetSkeleton rows={5} />
      ) : filteredData.length > 0 ? (
        <>
          {filteredData.slice(0, VISIBLE_LIMIT).map(renderInvoiceItem)}
          {filteredData.length > VISIBLE_LIMIT && canViewAll && (
            <Link to="/sales?filter=due" className="HomeWidget-viewall">
              View all {filteredData.length} due invoices &rarr;
            </Link>
          )}
        </>
      ) : (
        <WidgetEmpty title="No due invoices" hint="All customer invoices are paid." />
      )}
    </>
  );
};

export default React.memo(DueInvoice);

import React, {
  useState,
  useEffect,
  lazy,
  Suspense,
  useContext,
  useCallback,
  useMemo,
} from "react";

//=>> Utility
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";
import { daysPrevToToday, DateFormater } from "../../../assets/js/DateFormater";
import { formatCurrency, readCache } from "../dashboardUtils";

//=>> Components
import { WidgetSkeleton, WidgetEmpty, StaleBadge } from "./WidgetStates";
const ModalTable = lazy(() =>
  import("../../../components/Modal/CommonModal/ModalTable")
);
const SalesSumrDrpDown = lazy(() =>
  import("../../../components/Dropdown/SalesSumrDrpDown")
);

// Usage % at which an officer is flagged
const WARN_PCT = 75;
const DANGER_PCT = 90;

const usagePct = (item) => {
  const limit = Number(item.credit_limit) || 0;
  const used = Number(item.credit_use) || 0;
  if (limit <= 0) return used > 0 ? 100 : 0;
  return (used / limit) * 100;
};

const usageClass = (pct) =>
  pct >= DANGER_PCT ? "usage-danger" : pct >= WARN_PCT ? "usage-warn" : "usage-ok";

const CreditLimitList = ({ onCount }) => {
  const { headers } = useContext(AuthContext);
  const [btnStatus, setBtnStatus] = useState({});
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);
  const countedDays = 30;
  // Fix: dropdown sets { startDate, endDate }, so keep an object here
  // (a plain string previously produced "from_date=[object Object]")
  const [dateRang, setDateRang] = useState({
    startDate: daysPrevToToday(countedDays),
    endDate: DateFormater(new Date()),
  });

  //=>>> Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const from = dateRang?.startDate || daysPrevToToday(countedDays);
      const to = dateRang?.endDate || DateFormater(new Date());
      const api = `/employees/credit-report?from_date=${from}&to_date=${to}`;
      const response = await ApiConfig.get(api, { headers });
      const datas = response.data.status ? Object.values(response.data.data || {}) : [];
      setApiData(datas);
      setIsStale(false);
      //=>>> For Print
      sessionStorage.setItem("printCreditLimitList", JSON.stringify(datas));
      //==> For offline use
      localStorage.setItem("CreditLimitList", JSON.stringify(datas));
    } catch (error) {
      console.error(error);
      //==> For offline use
      const cachedData = readCache("CreditLimitList");
      if (cachedData) {
        setApiData(cachedData);
        setIsStale(true);
      }
    } finally {
      setLoading(false);
    }
  }, [headers, dateRang]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  //=>>> Highest usage first
  const sortedData = useMemo(
    () => [...apiData].sort((a, b) => usagePct(b) - usagePct(a)),
    [apiData]
  );

  // Hub tab badge counts only officers at or above the warning level
  const warningCount = useMemo(
    () => sortedData.filter((i) => usagePct(i) >= WARN_PCT).length,
    [sortedData]
  );

  useEffect(() => {
    onCount?.(warningCount);
  }, [warningCount, onCount]);

  //=>>> For print modal
  const tableHead = [
    "Sl",
    "Employee name",
    "Credit limit",
    "Total purchase",
    "Total payment",
    "Total due",
    "Credit use",
    "Credit due",
  ];

  //==> Render individual officer row
  const renderItem = (item) => {
    const pct = usagePct(item);
    const name = item.employee_name || "-";
    return (
      <div className="reportBoxMini" key={item.id}>
        <Suspense fallback={<div className="HomeSkeleton-row" />}>
          <ModalTable
            id={item.id}
            slug="Credit limit list"
            inputFields={[]}
            ModalOpenBtnTitle={
              <div className="HomeRow is-stacked">
                <div className="HomeRow-line">
                  <p className="HomeRow-title" title={name}>
                    {name}
                  </p>
                  <p className={`HomeRow-pct ${usageClass(pct)}`}>{pct.toFixed(0)}% used</p>
                </div>
                <div
                  className="HomeUsage"
                  role="progressbar"
                  aria-valuenow={Math.round(pct)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${name} credit usage`}
                >
                  <div
                    className={`HomeUsage-fill ${usageClass(pct)}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <p className="HomeRow-sub">
                  Used {formatCurrency(item.credit_use)} of {formatCurrency(item.credit_limit)}
                  {" • "}Remaining {formatCurrency(item.credit_due)}
                </p>
              </div>
            }
            className="modalTableOpenBtn"
            identifier="CreditLimitList"
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
            Officer Credit Usage <span className="HomeWidget-count">({apiData.length})</span>
          </h3>
          <StaleBadge show={isStale} />
        </div>
        <div className="HomeWidget-actions">
          <Suspense fallback={null}>
            <SalesSumrDrpDown
              range={dateRang}
              setDateRang={setDateRang}
              printData={sortedData}
              spinnerLoader={loading}
              tableHead={tableHead}
              slug="Credit limit list"
              identifierForPrintModal="printCreditLimitList"
            />
          </Suspense>
        </div>
      </div>

      {loading && apiData.length === 0 ? (
        <WidgetSkeleton rows={5} />
      ) : sortedData.length > 0 ? (
        sortedData.map(renderItem)
      ) : (
        <WidgetEmpty title="No credit data" hint="No officers have a credit limit set." />
      )}
    </>
  );
};

export default React.memo(CreditLimitList);

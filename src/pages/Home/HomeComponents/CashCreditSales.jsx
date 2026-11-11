import React, {
  useState,
  useEffect,
  lazy,
  Suspense,
  useContext,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";

//=>> Utility
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";
import {
  getPresetRange,
  DEFAULT_PRESET,
  formatCurrency,
  formatCompactCurrency,
  readCache,
} from "../dashboardUtils";

//=>> Components
import { WidgetSkeleton, WidgetEmpty, StaleBadge } from "./WidgetStates";
const SalesSumrDrpDown = lazy(() =>
  import("../../../components/Dropdown/SalesSumrDrpDown")
);

const CashCreditSales = ({ dateRange, canOpenReport = true }) => {
  const { headers } = useContext(AuthContext);
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);
  const [printData, setPrintData] = useState({});
  const [dateRang, setDateRang] = useState(
    dateRange || getPresetRange(DEFAULT_PRESET)
  );

  //=>>> Follow the dashboard global date filter
  useEffect(() => {
    if (dateRange) setDateRang(dateRange);
  }, [dateRange]);

  //=>>> Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { startDate, endDate } = dateRang;
      const api = `/cashCreditSale?from_date=${startDate}&to_date=${endDate}`;
      const response = await ApiConfig.get(api, { headers });
      if (response.data.status) {
        const datas = Object.values(response.data.data || {});
        setApiData(datas);
        setIsStale(false);
        //=>>> For Print
        sessionStorage.setItem("printCashCreditSales", JSON.stringify(datas));
        setPrintData(datas);
        //==> For offline use
        localStorage.setItem("CashCreditSales", JSON.stringify(datas));
      } else {
        setApiData([]);
      }
    } catch (error) {
      console.error(error);
      //==> For offline use
      const cachedData = readCache("CashCreditSales");
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

  //=>>> Guard against missing values (previously rendered "NaN/-")
  const cash = Number(apiData[0]) || 0;
  const credit = Number(apiData[1]) || 0;
  const total = cash + credit;
  const cashPct = total > 0 ? (cash / total) * 100 : 0;
  const creditPct = total > 0 ? 100 - cashPct : 0;

  return (
    <>
      <div className="HomeWidget-head">
        <div className="HomeWidget-title-wrap">
          <h3 className="HomeWidget-title">Cash vs Credit Sales</h3>
          <StaleBadge show={isStale} />
        </div>
        <div className="HomeWidget-actions">
          <Suspense fallback={null}>
            <SalesSumrDrpDown
              range={dateRang}
              setDateRang={setDateRang}
              printData={printData}
              spinnerLoader={loading}
              tableHead={[]}
              slug="Cash/Credit wise sales"
              identifierForPrintModal="printCashCreditSales"
            />
          </Suspense>
          {canOpenReport && (
            <Link
              to="/cash-credit-sales-report"
              className="HomeWidget-link"
              title="View full cash & credit sales report"
            >
              <span>Full Report</span>
              <FaArrowRight size={10} />
            </Link>
          )}
        </div>
      </div>
      <p className="HomeWidget-range">
        {dateRang.startDate} &rarr; {dateRang.endDate}
      </p>

      {loading && total === 0 ? (
        <WidgetSkeleton rows={4} />
      ) : total === 0 ? (
        <WidgetEmpty
          title="No sales in this period"
          hint="Try a wider date range."
          onRetry={fetchData}
        />
      ) : (
        <div className="CashCredit">
          <div className="CashCredit-total">
            <span className="CashCredit-total-label">Total sales</span>
            <span className="CashCredit-total-value" title={formatCurrency(total)}>
              {formatCompactCurrency(total)}
            </span>
          </div>

          {/* Split bar: easier to compare than a 2-slice pie */}
          <div
            className="CashCredit-bar"
            role="img"
            aria-label={`Cash ${cashPct.toFixed(1)} percent, credit ${creditPct.toFixed(1)} percent`}
          >
            <div className="CashCredit-bar-cash" style={{ width: `${cashPct}%` }} />
            <div className="CashCredit-bar-credit" style={{ width: `${creditPct}%` }} />
          </div>

          <div className="CashCredit-stats">
            <div className="CashCredit-stat">
              <span className="CashCredit-dot dot-cash" />
              <div>
                <p className="CashCredit-stat-label">Cash</p>
                <p className="CashCredit-stat-value" title={formatCurrency(cash)}>
                  {formatCompactCurrency(cash)}
                </p>
                <p className="CashCredit-stat-pct">{cashPct.toFixed(1)}%</p>
              </div>
            </div>
            <div className="CashCredit-stat">
              <span className="CashCredit-dot dot-credit" />
              <div>
                <p className="CashCredit-stat-label">Credit</p>
                <p className="CashCredit-stat-value" title={formatCurrency(credit)}>
                  {formatCompactCurrency(credit)}
                </p>
                <p className="CashCredit-stat-pct">{creditPct.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(CashCreditSales);

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
import {
  getPresetRange,
  DEFAULT_PRESET,
  formatCurrency,
  formatCompactCurrency,
  readCache,
} from "../dashboardUtils";

//=>> Components
import { WidgetSkeleton, WidgetEmpty, StaleBadge } from "./WidgetStates";
const ModalTable = lazy(() =>
  import("../../../components/Modal/CommonModal/ModalTable")
);
const SalesSumrDrpDown = lazy(() =>
  import("../../../components/Dropdown/SalesSumrDrpDown")
);

/**
 * Shared list for customer / product / category wise sales.
 * Shows each row's sales amount with a share-of-total bar, highest first.
 */
const SalesShareList = ({
  dateRange,
  title,
  endpoint,
  cacheKey,
  printKey,
  slug,
  modalIdentifier,
  tableHead,
  getId,
  getName,
  getValue,
  getSub,
}) => {
  const { headers } = useContext(AuthContext);
  const [btnStatus, setBtnStatus] = useState({});
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);
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
      const api = `${endpoint}?from_date=${startDate}&to_date=${endDate}`;
      const response = await ApiConfig.get(api, { headers });
      const datas = response.data.status ? Object.values(response.data.data || {}) : [];
      setApiData(datas);
      setIsStale(false);
      //=>>> For Print
      sessionStorage.setItem(printKey, JSON.stringify(datas));
      //==> For offline use
      localStorage.setItem(cacheKey, JSON.stringify(datas));
    } catch (error) {
      console.error(error);
      const cachedData = readCache(cacheKey);
      if (cachedData) {
        setApiData(cachedData);
        setIsStale(true);
      }
    } finally {
      setLoading(false);
    }
  }, [headers, dateRang, endpoint, cacheKey, printKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  //=>>> Highest sales first, with share of total
  const { rows, total } = useMemo(() => {
    const sorted = [...apiData].sort((a, b) => getValue(b) - getValue(a));
    const sum = sorted.reduce((s, i) => s + getValue(i), 0);
    return { rows: sorted, total: sum };
  }, [apiData, getValue]);

  const renderItem = (item, index) => {
    const value = getValue(item);
    const pct = total > 0 ? (value / total) * 100 : 0;
    const name = getName(item) || "-";
    return (
      <div className="reportBoxMini" key={getId(item) ?? index}>
        <Suspense fallback={<div className="HomeSkeleton-row" />}>
          <ModalTable
            id={getId(item)}
            slug={slug}
            inputFields={[]}
            ModalOpenBtnTitle={
              <div className="HomeRow is-stacked">
                <div className="HomeRow-line">
                  <p className="HomeRow-title" title={name}>
                    <span className="HomeRow-rank">{index + 1}.</span> {name}
                  </p>
                  <p className="HomeRow-amount" title={formatCurrency(value)}>
                    {formatCompactCurrency(value)}
                  </p>
                </div>
                <div className="HomeUsage" aria-hidden="true">
                  <div className="HomeUsage-fill usage-share" style={{ width: `${pct}%` }} />
                </div>
                <p className="HomeRow-sub">
                  {pct.toFixed(1)}% of sales • {getSub(item)}
                </p>
              </div>
            }
            className="modalTableOpenBtn"
            identifier={modalIdentifier}
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
            {title} <span className="HomeWidget-count">({rows.length})</span>
          </h3>
          <StaleBadge show={isStale} />
        </div>
        <div className="HomeWidget-actions">
          <span className="HomeWidget-total" title={formatCurrency(total)}>
            {formatCompactCurrency(total)}
          </span>
          <Suspense fallback={null}>
            <SalesSumrDrpDown
              range={dateRang}
              setDateRang={setDateRang}
              printData={rows}
              spinnerLoader={loading}
              tableHead={tableHead}
              slug={slug}
              identifierForPrintModal={printKey}
            />
          </Suspense>
        </div>
      </div>
      <p className="HomeWidget-range">
        {dateRang.startDate} &rarr; {dateRang.endDate}
      </p>

      {loading && apiData.length === 0 ? (
        <WidgetSkeleton rows={5} />
      ) : rows.length > 0 ? (
        <div className="HomeShareGrid">{rows.map(renderItem)}</div>
      ) : (
        <WidgetEmpty
          title="No sales in this period"
          hint="Try a wider date range."
          onRetry={fetchData}
        />
      )}
    </>
  );
};

export default React.memo(SalesShareList);

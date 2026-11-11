import React, {
  useState,
  useEffect,
  lazy,
  Suspense,
  useContext,
  useCallback,
} from "react";

//=>> Utility
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";
import { getPresetRange, DEFAULT_PRESET, readCache } from "../dashboardUtils";

//=>> Components
import BarChart from "../../../components/Charts/BarChart";
import { WidgetSkeleton, WidgetEmpty, StaleBadge } from "./WidgetStates";
const SalesSumrDrpDown = lazy(() =>
  import("../../../components/Dropdown/SalesSumrDrpDown")
);

const ProfitLoss = ({ dateRange }) => {
  const { headers } = useContext(AuthContext);
  const [apiData, setApiData] = useState({});
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
      const api = `/profit-loss-report?from_date=${startDate}&to_date=${endDate}`;
      const response = await ApiConfig.get(api, { headers });
      if (response.status == 200) {
        const datas = response.data || {};
        setApiData(datas);
        setIsStale(false);
        //=>>> For Print
        sessionStorage.setItem("printProfitLoss", JSON.stringify(datas));
        setPrintData(datas);
        //==> For offline use
        localStorage.setItem("ProfitLoss", JSON.stringify(datas));
      }
    } catch (error) {
      console.error(error);
      //==> For offline use
      const cachedData = readCache("ProfitLoss");
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

  const hasData = apiData && Object.keys(apiData).length > 0;

  return (
    <>
      <div className="HomeWidget-head">
        <div className="HomeWidget-title-wrap">
          <h3 className="HomeWidget-title">Profit / Loss</h3>
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
              slug="Profit / Loss Report"
              identifierForPrintModal="printProfitLoss"
            />
          </Suspense>
        </div>
      </div>
      <p className="HomeWidget-range">
        {dateRang.startDate} &rarr; {dateRang.endDate}
      </p>

      {loading && !hasData ? (
        <WidgetSkeleton rows={6} />
      ) : hasData ? (
        <BarChart data={apiData} identifier="profit-loss report" />
      ) : (
        <WidgetEmpty
          title="No profit / loss data for this period"
          hint="Try a wider date range."
          onRetry={fetchData}
        />
      )}
    </>
  );
};

export default React.memo(ProfitLoss);

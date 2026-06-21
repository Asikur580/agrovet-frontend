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
import { daysPrevToToday } from "../../../assets/js/DateFormater";
import { DateFormater } from "../../../assets/js/DateFormater";

//=>> Components
import BarChart from "../../../components/Charts/BarChart";
const SalesSumrDrpDown = lazy(() =>
  import("../../../components/Dropdown/SalesSumrDrpDown")
);

const ProfitLoss = () => {
  const { headers } = useContext(AuthContext);
  const [apiData, setApiData] = useState([]);
  const [msg, setMsg] = useState("");
  const [spinnerLoader, setSpinnerLoader] = useState(false);
  const [printData, setPrintData] = useState({});
  const countedDays = 365;
  const [dateRang, setDateRang] = useState(daysPrevToToday(countedDays));

  //=>>> Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      setSpinnerLoader(true);
      const api = `/profit-loss-report?from_date=${dateRang}&to_date=${DateFormater(
        new Date()
      )}`;
      const response = await ApiConfig.get(api, { headers });
      if (response.status == 200) {
        const datas = response.data;
        if (dateRang != 0) {
          setApiData(datas);
          sessionStorage.setItem("ProfitLoss", JSON.stringify(datas));
          //=>>> For Print
          sessionStorage.setItem("printProfitLoss", JSON.stringify(datas));
          setPrintData(datas);
        } else {
          setApiData([]);
          //=>>> For Print
          sessionStorage.setItem("printProfitLoss", JSON.stringify([]));
          setPrintData([]);
          setMsg("Opps! Data not found.");
        }

        //==> For offline use
        localStorage.setItem("ProfitLoss", JSON.stringify(datas));
      }
    } catch (error) {
      console.error(error);
      setMsg(error.message);
      //==> For offline use
      const cachedData = localStorage.getItem("ProfitLoss");
      if (cachedData) {
        setApiData(JSON.parse(cachedData));
      }
    } finally {
      setSpinnerLoader(false);
    }
  }, [headers, dateRang]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  //=>>> For print modal
  const tableHead = [];

  return (
    <>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: "10",
          background: "var(--light-1)",
          borderBottom: "var(--border)",
        }}
      >
        <div className="flex items-center justify-center gap-2 py-1">
          <h1>Profit / Loss Report</h1>
          <SalesSumrDrpDown
            countedDays={countedDays}
            setDateRang={setDateRang}
            printData={printData}
            spinnerLoader={spinnerLoader}
            tableHead={tableHead}
            slug="Profit / Loss Report"
            identifierForPrintModal="printProfitLoss"
          />
        </div>
      </div>

      {apiData ? (
        <BarChart data={apiData} identifier="profit-loss report" />
      ) : (
        <p className="message">{msg}</p>
      )}

      {/* <div className="flex items-center justify-end gap-5 mt-10 sm:gap-16 flex-col sm:flex-row">
        <p>
          Net profit : <span>{Number(apiData.net_profit).toFixed(2)}/-</span>
        </p>
        <p>
          Costs : <span>{Number(apiData.costs).toFixed(2)}/-</span>
        </p>
        <p>
          Sales : <span>{Number(apiData.sales).toFixed(2)}/-</span>
        </p>
        <p>
          Dues : <span>{Number(apiData.dues).toFixed(2)}/-</span>
        </p>
      </div> */}
    </>
  );
};

export default React.memo(ProfitLoss);

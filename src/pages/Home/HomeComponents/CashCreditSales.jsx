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
import PieChart from "../../../components/Charts/PieChart";
const SalesSumrDrpDown = lazy(() =>
  import("../../../components/Dropdown/SalesSumrDrpDown")
);

const CashCreditSales = () => {
  const { headers } = useContext(AuthContext);
  const [apiData, setApiData] = useState([]);
  const [msg, setMsg] = useState("");
  const [spinnerLoader, setSpinnerLoader] = useState(false);
  const [printData, setPrintData] = useState({});
  const countedDays = 365;
  const [dateRang, setDateRang] = useState({
    startDate: daysPrevToToday(countedDays),
    endDate: DateFormater(new Date()),
  });

  //=>>> Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      setSpinnerLoader(true);
      const fromDate = dateRang?.startDate || daysPrevToToday(countedDays);
      const toDate = dateRang?.endDate || DateFormater(new Date());
      const api = `/cashCreditSale?from_date=${fromDate}&to_date=${toDate}`;
      const response = await ApiConfig.get(api, { headers });
      if (response.data.status) {
        const datas = Object.values(response.data.data);
        if (dateRang !== "0" && dateRang !== 0) {
          setApiData(datas);
          sessionStorage.setItem("Cash/credit sales", JSON.stringify(datas));
          //=>>> For Print
          sessionStorage.setItem("printCashCreditSales", JSON.stringify(datas));
          setPrintData(datas);
        } else {
          setApiData([]);
          //=>>> For Print
          sessionStorage.setItem("printCashCreditSales", JSON.stringify([]));
          setPrintData([]);
          setMsg("Opps! Data not found.");
        }

        //==> For offline use
        localStorage.setItem("CashCreditSales", JSON.stringify(datas));
      }
    } catch (error) {
      console.error(error);
      setMsg(error.message);
      //==> For offline use
      const cachedData = localStorage.getItem("CashCreditSales");
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
  // const tableHead = ["Sl", "Cash", "Credit"];

  //=>>> For chart start
  const data = {
    labels: ["Cash", "Credit"],
    datasets: [
      {
        label: "# of Amount",
        data: [apiData[0], apiData[1]], // The values for each slice
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Cash/Credit wise sales",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = Number(context.raw).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            return ` ${context.label}: ${value} /-`;
          },
        },
      },
      datalabels: {
        formatter: (value) => {
          return Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },
        color: "#333",
        font: {
          weight: "bold",
          size: 12,
        },
      },
    },
  };
  //=>>> For chart end

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
          <h1>Cash/Credit wise sales</h1>
          <SalesSumrDrpDown
            countedDays={countedDays}
            setDateRang={setDateRang}
            printData={printData}
            spinnerLoader={spinnerLoader}
            tableHead={tableHead}
            slug="Cash/Credit wise sales"
            identifierForPrintModal="printCashCreditSales"
          />
        </div>
      </div>

      {apiData.length > 0 ? (
        <PieChart chartData={data} chartOptions={options} />
      ) : (
        <p className="message">{msg}</p>
      )}

      <div className="flex items-center justify-end gap-5 sm:gap-16 flex-col sm:flex-row">
        <p>
          Cash :{" "}
          <span style={{ color: "rgba(7, 155, 253, 1)" }}>
            {Number(apiData[0]).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/-
          </span>
        </p>
        <p>
          Credit :{" "}
          <span style={{ color: "rgba(247, 132, 0, 1)" }}>
            {Number(apiData[1]).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/-
          </span>
        </p>
      </div>
    </>
  );
};

export default React.memo(CashCreditSales);

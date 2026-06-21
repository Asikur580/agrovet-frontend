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
const ModalTable = lazy(() =>
  import("../../../components/Modal/CommonModal/ModalTable")
);
const SalesSumrDrpDown = lazy(() =>
  import("../../../components/Dropdown/SalesSumrDrpDown")
);

const CreditLimitList = () => {
  const { headers } = useContext(AuthContext);
  const [btnStatus, setBtnStatus] = useState({});
  const [apiData, setApiData] = useState([]);
  const [msg, setMsg] = useState("");
  const [spinnerLoader, setSpinnerLoader] = useState(false);
  const [printData, setPrintData] = useState({});
  const countedDays = 30;
  const [dateRang, setDateRang] = useState(daysPrevToToday(countedDays));

  //=>>> Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      setSpinnerLoader(true);
      const api = `/employees/credit-report?from_date=${dateRang}&to_date=${DateFormater(
        new Date()
      )}`;
      const response = await ApiConfig.get(api, { headers });
      if (response.data.status) {
        const datas = Object.values(response.data.data);

        if (dateRang != 0) {
          setApiData(datas);
          //=>>> For Print
          sessionStorage.setItem("printCreditLimitList", JSON.stringify(datas));
          setPrintData(datas);
        } else {
          setApiData([]);
          //=>>> For Print
          sessionStorage.setItem("printCreditLimitList", JSON.stringify([]));
          setPrintData([]);
          setMsg("Opps! Data not found.");
        }

        //==> For offline use
        localStorage.setItem("CreditLimitList", JSON.stringify(datas));
      }
    } catch (error) {
      console.error(error);
      setMsg(error.message);
      //==> For offline use
      const cachedData = localStorage.getItem("CreditLimitList");
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

  //==> Render individual invoice item
  const renderInvoiceItem = (item, index) => (
    <div className="reportBoxMini" key={item.id}>
      <Suspense fallback="...">
        <ModalTable
          id={item.id}
          slug="Credit limit list"
          inputFields={[]}
          ModalOpenBtnTitle={
            <div className="w-full d-flex items-center justify-between text-dark_3">
              <p>
                <span>{index + 1}</span>.{" "}
                {item.employee_name.length >= 20
                  ? item.employee_name.slice(0, 20) + "..."
                  : item.employee_name}
              </p>
              <p className="text-red-500">Credit due : {item.credit_due}</p>
            </div>
          }
          className="modalTableOpenBtn"
          identifier="CreditLimitList"
          data={apiData.filter((filter) => filter.id === item.id)}
          btnStatus={btnStatus}
          setBtnStatus={setBtnStatus}
          width="100%"
          toolTip={``}
        />
      </Suspense>
    </div>
  );

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
          <h1 className="">
            Credit limit list <span>({apiData.length})</span>
          </h1>
          <SalesSumrDrpDown
            countedDays={countedDays}
            setDateRang={setDateRang}
            printData={printData}
            spinnerLoader={spinnerLoader}
            tableHead={tableHead}
            slug="Credit limit list"
            identifierForPrintModal="printCreditLimitList"
          />
        </div>
      </div>

      {apiData.length > 0 ? (
        apiData.map(renderInvoiceItem)
      ) : (
        <p className="message text-center">{msg}</p>
      )}
    </>
  );
};

export default React.memo(CreditLimitList);

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

const CustomerWiseSales = () => {
  const { headers } = useContext(AuthContext);
  const [btnStatus, setBtnStatus] = useState({});
  const [apiData, setApiData] = useState([]);
  const [msg, setMsg] = useState("");
  const [spinnerLoader, setSpinnerLoader] = useState(false);
  const [printData, setPrintData] = useState({});
  const countedDays = 30;
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
      const api = `/customerWiseSalesReport?from_date=${fromDate}&to_date=${toDate}`;
      const response = await ApiConfig.get(api, { headers });
      if (response.data.status) {
        const datas = Object.values(response.data.data);
        if (dateRang !== "0" && dateRang !== 0) {
          setApiData(datas);
          //=>>> For Print
          sessionStorage.setItem(
            "printCustomerWiseSales",
            JSON.stringify(datas)
          );
          setPrintData(datas);
        } else {
          setApiData([]);
          //=>>> For Print
          sessionStorage.setItem("printCustomerWiseSales", JSON.stringify([]));
          setPrintData([]);
          setMsg("Opps! Data not found.");
        }

        //==> For offline use
        localStorage.setItem("CustomerWiseSales", JSON.stringify(datas));
      }
    } catch (error) {
      console.error(error);
      setMsg(error.message);
      //==> For offline use
      const cachedData = localStorage.getItem("CustomerWiseSales");
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
    "Customer name",
    "phone",
    "Invoices",
    "Old due",
    "Purchases",
    "Payments",
    "Due",
  ];

  //==> Render individual invoice item
  const renderInvoiceItem = (item, index) => (
    <div className="reportBoxMini" key={item.customer_id}>
      <Suspense fallback="...">
        <ModalTable
          id={item.customer_id}
          slug="Customer wise sales"
          inputFields={[]}
          ModalOpenBtnTitle={
            <div className="w-full d-flex items-center justify-between text-dark_3">
              <p>
                <span>{index + 1}</span>.{" "}
                {item.customer_name.length >= 15
                  ? item.customer_name.slice(0, 15) + "..."
                  : item.customer_name}
              </p>
              <p className="text-red-500">Due : {item.total_due}/-</p>
            </div>
          }
          className="modalTableOpenBtn"
          identifier="CustomerWiseSales"
          data={apiData.filter(
            (filter) => filter.customer_id === item.customer_id
          )}
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
            Customer wise sales <span>({apiData.length})</span>
          </h1>
          <SalesSumrDrpDown
            countedDays={countedDays}
            setDateRang={setDateRang}
            printData={printData}
            spinnerLoader={spinnerLoader}
            tableHead={tableHead}
            slug="Customer wise sales"
            identifierForPrintModal="printCustomerWiseSales"
          />
        </div>
      </div>

      {apiData.length > 0 ? (
        apiData.map(renderInvoiceItem)
      ) : (
        <p className="message">{msg}</p>
      )}
    </>
  );
};

export default React.memo(CustomerWiseSales);

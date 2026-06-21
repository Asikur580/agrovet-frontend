import React, {
  useState,
  useEffect,
  lazy,
  Suspense,
  useContext,
  useCallback,
  useMemo,
} from "react";
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";
import { daysPrevToToday } from "../../../assets/js/DateFormater";

//=>> Components
const ModalTable = lazy(() =>
  import("../../../components/Modal/CommonModal/ModalTable")
);
const DueInvoiceDrpDown = lazy(() =>
  import("../../../components/Dropdown/DueInvoiceDrpDown")
);

const DueInvoice = () => {
  const { headers } = useContext(AuthContext);
  const [btnStatus, setBtnStatus] = useState({});
  const [apiData, setApiData] = useState([]);
  const [filteredApiData, setFilteredApiData] = useState([]);
  const [msg, setMsg] = useState("");
  const [spinnerLoader, setSpinnerLoader] = useState(false);
  const [printData, setPrintData] = useState({});
  const [dateRang, setDateRang] = useState(daysPrevToToday(30));

  //=>>> Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      setSpinnerLoader(true);
      const response = await ApiConfig.get("/dueInvoice", { headers });
      if (response.data.status) {
        const datas = Object.values(response.data.data);
        setApiData(datas);
        const filtering = datas.filter((item) => dateRang <= item.sale_date);
        setFilteredApiData(filtering);
        //=>>> For Print
        sessionStorage.setItem("printDueInvoice", JSON.stringify(filtering));
        setPrintData(filtering);

        //==> For offline use
        localStorage.setItem("DueInvoice", JSON.stringify(datas));
      }
    } catch (error) {
      console.error(error);
      setMsg(error.message);
      //==> For offline use
      const cachedData = localStorage.getItem("DueInvoice");
      if (cachedData) {
        setApiData(JSON.parse(cachedData));
        // setFilteredApiData(JSON.parse(cachedData)); ***
      }
    } finally {
      setSpinnerLoader(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  //=>>> Filtering for day wise query start
  const filteringByDate = useMemo(() => {
    if (!dateRang || dateRang === 0) return [];
    return apiData.filter((item) => dateRang <= item.sale_date);
  }, [dateRang, apiData]);

  useEffect(() => {
    if (dateRang != 0) {
      setSpinnerLoader(true);
      setFilteredApiData(filteringByDate);
      setPrintData(filteringByDate);
      sessionStorage.setItem(
        "printDueInvoice",
        JSON.stringify(filteringByDate)
      );
      setTimeout(() => {
        setSpinnerLoader(false);
      }, [100]);
    } else {
      setFilteredApiData([]);
      setPrintData([]);
      sessionStorage.setItem("printDueInvoice", JSON.stringify([]));
      setMsg("Opps! Data not found.");
    }
  }, [filteringByDate]);
  //=>>> Filtering for day wise query end

  //==> Render individual invoice item
  const renderInvoiceItem = (item, index) => (
    <div className="reportBoxMini" key={item.id}>
      <Suspense fallback="...">
        <ModalTable
          id={item.id}
          slug="Due invoice"
          inputFields={[]}
          ModalOpenBtnTitle={
            <div className="w-full d-flex items-center justify-between text-dark_3">
              <p>
                <span>{index + 1}</span>. Id : {item.invoiceId}
              </p>
              <p className="text-red-500">Due : {item.due}/-</p>
            </div>
          }
          className="modalTableOpenBtn"
          identifier="dueInvoice"
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
            Due Invoices <span>({filteredApiData.length})</span>
          </h1>
          <DueInvoiceDrpDown
            dateRang={dateRang}
            setDateRang={setDateRang}
            printData={printData}
            spinnerLoader={spinnerLoader}
          />
        </div>
      </div>

      {/* {spinnerLoader && (
        <div className="flex justify-center items-center mt-7">
          <Spinner />
        </div>
      )} */}

      {filteredApiData.length > 0 ? (
        filteredApiData.map(renderInvoiceItem)
      ) : (
        <p className="message">{msg}</p>
      )}
    </>
  );
};

export default React.memo(DueInvoice);

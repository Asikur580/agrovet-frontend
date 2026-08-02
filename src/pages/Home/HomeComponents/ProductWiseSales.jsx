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

const ProductWiseSales = () => {
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
      const api = `/productWiseSalesReport?from_date=${fromDate}&to_date=${toDate}`;
      const response = await ApiConfig.get(api, { headers });
      if (response.data.status) {
        const datas = Object.values(response.data.data);
        if (dateRang !== "0" && dateRang !== 0) {
          setApiData(datas);
          //=>>> For Print
          sessionStorage.setItem(
            "printProductWiseSales",
            JSON.stringify(datas)
          );
          setPrintData(datas);
        } else {
          setApiData([]);
          //=>>> For Print
          sessionStorage.setItem("printProductWiseSales", JSON.stringify([]));
          setPrintData([]);
          setMsg("Opps! Data not found.");
        }

        //==> For offline use
        localStorage.setItem("ProductWiseSales", JSON.stringify(datas));
      }
    } catch (error) {
      console.error(error);
      setMsg(error.message);
      //==> For offline use
      const cachedData = localStorage.getItem("ProductWiseSales");
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
    "Product name",
    "Pack size",
    "Total invoice",
    "Total quantity",
    "Total amount",
  ];

  //==> Render individual invoice item
  const renderInvoiceItem = (item, index) => (
    <div className="reportBoxMini" key={item.id}>
      <Suspense fallback="...">
        <ModalTable
          id={item.id}
          slug="Product wise sales"
          inputFields={[]}
          ModalOpenBtnTitle={
            <div className="w-full d-flex items-center justify-between text-dark_3">
              <p>
                <span>{index + 1}</span>.{" "}
                {item.product_name.length >= 15
                  ? item.product_name.slice(0, 15) + "..."
                  : item.product_name}
              </p>
              <p className="text-red-500">Total Invoice : {item.total_invoice}</p>
            </div>
          }
          className="modalTableOpenBtn"
          identifier="ProductWiseSales"
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
            Product wise sales <span>({apiData.length})</span>
          </h1>
          <SalesSumrDrpDown
            countedDays={countedDays}
            setDateRang={setDateRang}
            printData={printData}
            spinnerLoader={spinnerLoader}
            tableHead={tableHead}
            slug="Product wise sales"
            identifierForPrintModal="printProductWiseSales"
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

export default React.memo(ProductWiseSales);

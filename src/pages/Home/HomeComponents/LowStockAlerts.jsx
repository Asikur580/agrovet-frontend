//====>>>> Optimized code
import React, {
  useState,
  useEffect,
  lazy,
  Suspense,
  useContext,
  useCallback,
} from "react";
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";

//=>>> Components
import Spinner from "../../../components/Loader/Spinner";
// const ModalTable = lazy(() =>
//   import("../../../components/Modal/CommonModal/ModalTable")
// );

const LowStockAlerts = ({ setLoader }) => {
  const { headers } = useContext(AuthContext);
  const [apiData, setApiData] = useState([]);
  const [msg, setMsg] = useState("");
  const [spinnerLoader, setSpinnerLoader] = useState(false);

  //==> Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      setSpinnerLoader(true);
      const response = await ApiConfig.get("/low_stock_alerts", { headers });
      if (response.data.status) {
        const datas = response.data.low_stock_alerts;
        setApiData(datas);

        //==> For offline use
        localStorage.setItem("LowStockAlerts", JSON.stringify(datas));
      } else {
        setMsg(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching due invoices:", error);
      // setMsg("Failed to fetch due invoices. Please try again later.");
      //==> For offline use
      const cachedData = localStorage.getItem("LowStockAlerts");
      if (cachedData) {
        setApiData(JSON.parse(cachedData));
      }
    } finally {
      setSpinnerLoader(false);
    }
  }, [headers, setLoader]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
        <div className="flex items-center justify-center gap-2 py-2">
          <h1 className="">
            Low stock <span>({apiData.length})</span>
          </h1>
        </div>
      </div>

      {spinnerLoader && (
        <div className="flex justify-center items-center mt-7">
          <Spinner />
        </div>
      )}

      {apiData.length > 0 ? (
        apiData.map((item, index) => {
          return (
            <div className="reportBoxMini" key={index}>
              <div className="w-full d-flex items-center justify-between text-dark_3 py-1 px-2 cursor-pointer hover:bg-light_blue hover:rounded-lg">
                <p>Name : {item.product_name} ({item.pack_size})</p>
                <p className="text-red-500">Stock : {item.current_stock}</p>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-400 text-justify p-2">
          {msg || "No due invoices found."}
        </p>
      )}
    </>
  );
};

export default React.memo(LowStockAlerts);

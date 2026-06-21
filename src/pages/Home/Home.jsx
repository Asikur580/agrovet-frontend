import React, { lazy, Suspense, useContext, useState } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

//=>>> Css
import "./Home.css";

//=>>> Components
import Spinner from "../../components/Loader/Spinner";
const CashCreditSales = lazy(() => import("./HomeComponents/CashCreditSales"));
const ProfitLoss = lazy(() => import("./HomeComponents/ProfitLoss"));
// const ProfitLossChart = lazy(() =>
//   import("../../components/Charts/ProfitLossChart")
// );
const DueInvoice = lazy(() => import("./HomeComponents/DueInvoice"));
const CustomerWiseSales = lazy(() =>
  import("./HomeComponents/CustomerWiseSales")
);
const ProductWiseSales = lazy(() =>
  import("./HomeComponents/ProductWiseSales")
);
const CategoryWiseSales = lazy(() =>
  import("./HomeComponents/CategoryWiseSales")
);
const CreditLimitList = lazy(() => import("./HomeComponents/CreditLimitList"));
const LowStockAlerts = lazy(() => import("./HomeComponents/LowStockAlerts"));
const Summery = lazy(() => import("./HomeComponents/Summery/Summery"));

//=>>> Utility
import { AuthContext } from "../../context/AuthContext";

const Home = ({ setLoader }) => {
  const { userDesignationSlug } = useContext(AuthContext);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="Agrovet software" />
      </Helmet>

      {/* Hidden input for auto-focus */}
      <input
        type="file"
        autoFocus
        style={{ height: "0", opacity: 0, pointerEvents: "none" }}
      />

      <div className="Home content animated fadeInDown">
        {userDesignationSlug == "admin" ? (
          <>
            <h1 className="page-title">Dashboard</h1>
            {/* Top Boxes */}
            <div className="mb-5">
              <Summery />
            </div>

            {/* Report Box */}
            <div className="reportBox">
              <div className="left">
                {/* Profit/Loss Chart */}
                <div className="leftBox rounded-lg p-2 flex items-center justify-between flex-col min-h-[300px]">
                  <Suspense fallback={<Spinner />}>
                    <ProfitLoss />
                  </Suspense>
                  <p></p>
                </div>
                {/* Profit/Loss Chart  */}

                <div className="leftBox rounded-lg p-2 flex items-center justify-between flex-col mt-5 min-h-[300px]">
                  <Suspense fallback={<Spinner />}>
                    <CashCreditSales />
                  </Suspense>
                </div>

                <div className="leftBox leftTxtBox flex justify-between flex-col rounded-lg px-2 mt-5">
                  <Suspense fallback={<Spinner />}>
                    <CreditLimitList />
                  </Suspense>
                  <p></p>
                </div>
              </div>

              {/* Right Section - Due Invoice */}
              <div className="right">
                <div className="box rounded-lg px-2">
                  <Suspense fallback={<Spinner />}>
                    <DueInvoice />
                  </Suspense>
                </div>
                <div className="box rounded-lg px-2">
                  <Suspense fallback={<Spinner />}>
                    <CustomerWiseSales />
                  </Suspense>
                </div>
                <div className="box rounded-lg px-2">
                  <Suspense fallback={<Spinner />}>
                    <ProductWiseSales />
                  </Suspense>
                </div>
                <div className="box rounded-lg px-2">
                  <Suspense fallback={<Spinner />}>
                    <CategoryWiseSales />
                  </Suspense>
                </div>
                {/* <div className="box rounded-lg px-2">
                      <Suspense fallback={<Spinner />}>
                        <CreditLimitList />
                      </Suspense>
                    </div> */}
                <div className="box rounded-lg px-2">
                  <Suspense fallback={<Spinner />}>
                    <LowStockAlerts setLoader={setLoader} />
                  </Suspense>
                </div>
              </div>
            </div>
          </>
        ) : (
          <h1
            style={{
              height: "calc(100vh - 250px)",
              fontSize: "2rem",
              opacity: "0.4",
            }}
            className="flex items-center justify-center"
          >
            Secured content
          </h1>
        )}
      </div>
    </HelmetProvider>
  );
};

export default React.memo(Home);

// const profitLossCharOldVersion = () => {
// const [timePeriodVal, setTimePeriodVal] = useState("year");
// //==> Memoize time period to avoid recalculating on every render
// const timePeriod = useMemo(() => {
//   return {
//     from_date: DateRange(timePeriodVal).formattedStartDate,
//     to_date: DateRange(timePeriodVal).formattedEndDate,
//   };
// }, [timePeriodVal]);

// //===> Handle time period change
// const handleTimePeriodChange = useCallback((e) => {
//   const value = e.target.value;
//   setTimePeriodVal(value);
//   setReloader((prev) => !prev);
// }, []);

//   return (
//     <div className="leftBox rounded-lg p-2 flex items-center justify-center flex-col">
//       <h1 className="capitalize font-semibold mb-2">Profit / Loss Report</h1>
//       <div className="w-full flex items-center justify-end gap-5">
//         {reloader && <Spinner />}
//         <select
//           className="rounded-lg p-1 border border-solid border-border_clr"
//           value={timePeriodVal}
//           onChange={handleTimePeriodChange}
//         >
//           <option value="0" disabled>
//             Select time period
//           </option>
//           <option value="today">Today</option>
//           <option value="last-day">Last day</option>
//           <option value="week">Last Week</option>
//           <option value="month">Last Month</option>
//           <option value="year">Last Year</option>
//           <option value="100-years">Last 100 Years</option>
//         </select>
//       </div>
//       <Suspense fallback={<Spinner />}>
//         <ProfitLossChart
//           api="/profit-loss-report"
//           identifier="profit-loss report"
//           headers={headers}
//           timePeriod={timePeriod}
//           setLoader={setLoader}
//           reloader={reloader}
//           setReloader={setReloader}
//         />
//       </Suspense>
//     </div>
//   );
// };

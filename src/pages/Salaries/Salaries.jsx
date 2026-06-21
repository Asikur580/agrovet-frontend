import { useState, useEffect, lazy, Suspense, useContext } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

//___ Components ___//
const SalariesTable = lazy(() => import("./SalariesTable"));
const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);

//___ Utilities ___//
import ApiConfig from "../../assets/js/ApiConfig";
import { AuthContext } from "../../context/AuthContext";

const Salaries = ({ setLoader }) => {
  const { headers } = useContext(AuthContext);
  const [relodeTable, setRelodeTable] = useState(false);

  const [employeeData, setEmployeeData] = useState();
  const getApiData = async () => {
    try {
      setLoader(true);
      await ApiConfig.get("/employees", { headers }).then((response) => {
        // console.log(response.data.data);
        setEmployeeData(response.data.data);
        setLoader(false);
      });
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  useEffect(() => {
    getApiData();
  }, []);

  //___ Input For modal ___//
  const inputFields = [
    {
      field: "sell_price",
      type: "text",
      label: "Paid amount",
      isRequired: true,
      placeholder: "Enter paid amount",
    },
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>Salaries</title>
        <meta name="description" content="Agrovet software" />
      </Helmet>

      {/* For go to top */}
      <input
        type="file"
        autoFocus
        style={{ height: "0", opacity: 0, pointerEvents: "none" }}
      />
      {/* For go to top */}

      <div className="content animated fadeInDown">
        <h1 className="page-title">Salaries</h1>
        <div style={{ textAlign: "end" }}>
          <Suspense fallback="...">
            <CommonModal
              slug={`Salary`}
              inputFields={inputFields}
              ModalOpenBtnTitle={"Salary"}
              className="addBtn"
              identifier="salaryStore"
              api={`/salaryStore`}
              setRelodeTable={setRelodeTable}
              setLoader={setLoader}
              data={employeeData}
            />
          </Suspense>
        </div>

        <Suspense fallback="">
          <SalariesTable
            headers={headers}
            relodeTable={relodeTable}
            setRelodeTable={setRelodeTable}
            setLoader={setLoader}
            inputFields={inputFields}
          />
        </Suspense>
      </div>
    </HelmetProvider>
  );
};

export default Salaries;

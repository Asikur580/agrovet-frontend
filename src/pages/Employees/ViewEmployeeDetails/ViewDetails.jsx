import { lazy, Suspense, useState, useEffect, useContext } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";

//=>>> Css
import "../../../assets/css/ViewDetails.css";

//=>>> Utility
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";

//=>>> Components
const ViewDetailsTable = lazy(() => import("./ViewDetailsTable"));
const ImageViewer = lazy(() =>
  import("../../../components/ImageViewer/ImageViewer")
);
const CommonModal = lazy(() =>
  import("../../../components/Modal/CommonModal/CommonModal")
);

const ViewDetails = ({ setLoader }) => {
  const { id } = useParams();
  const { headers, userRole } = useContext(AuthContext);
  const pathname = useLocation().pathname;

  const [info, setInfo] = useState({});
  const [apiData, setApiData] = useState([]);
  const [filteredApiData, setFilteredApiData] = useState([]);
  const [empCostCat, setEmpCostCat] = useState([]);
  const [relodeTable, setRelodeTable] = useState(false);

  useEffect(() => {
    const getApiData = async () => {
      try {
        setLoader(true);
        await ApiConfig.get(`/employeeReport/${id}`, { headers }).then(
          (response) => {
            setInfo(response.data.data.employee);
            setApiData(response.data.data.invoices);
            setFilteredApiData(response.data.data.invoices);
            setLoader(false);

            // console.clear();
          }
        );
      } catch (error) {
        setLoader(false);
        console.log(error);
      }
    };
    const getEmpCostCat = async () => {
      try {
        setLoader(true);
        await ApiConfig.get(`/employeeCostCategories`, { headers }).then(
          (response) => {
            setEmpCostCat(response.data.data);
            sessionStorage.setItem(
              "empCostCat",
              JSON.stringify(response.data.data)
            );
            setLoader(false);
            // console.clear();
          }
        );
      } catch (error) {
        setLoader(false);
        console.log(error);
      }
    };

    getApiData();
    getEmpCostCat();
  }, []);

  //=>>> Input For modal
  const inputFields = [
    {
      field: "sell_price",
      type: "text",
      label: "Amount",
      isRequired: true,
      placeholder: "Enter amount",
    },
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>Employee details-{id}</title>
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
        <h1 className="page-title">
          {pathname.replaceAll("/", " > ").slice(2)}
        </h1>

        <div className="view-details">
          <div className="info-section">
            <div className="left d-flex items-start justify-center">
              <div className="u-info">
                <h3 className="text-center text-[1.2rem] capitalize bg-gray-300 rounded-t-md py-1">
                  Employee info
                </h3>
                <div className="u-img-box">
                  <div className="u-img">
                    <Suspense fallback="">
                      <ImageViewer
                        src={info.image}
                        width="100%"
                        height="250px"
                        border="var(--table-border)"
                        radius="0.5rem"
                      />
                    </Suspense>
                  </div>
                </div>
                <div className="txt-box px-4 pb-4">
                  <table className="w-full font-bold text-md">
                    <tbody>
                      <tr className="align-top">
                        <td className="w-3">Name</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.name}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="w-3">Phone</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.phone}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="w-3">Nid</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.national_id}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="w-3">Territory</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.territory}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="w-3">District</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.district}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="w-3">C limit</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.credit_limit}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="w-3">Status</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.status}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="mt-8 flex justify-between items-center">
                    {["Developer", "Employee-cost-create"].some((item) =>
                      userRole.includes(item)
                    ) && (
                      <Suspense fallback="...">
                        <CommonModal
                          slug={`Add cost`}
                          inputFields={inputFields}
                          ModalOpenBtnTitle="Add cost"
                          className="addBtn"
                          identifier="costStoreEmployee"
                          api="/costStore"
                          data={id}
                          data_2={empCostCat}
                          setLoader={setLoader}
                          setRelodeTable={setRelodeTable}
                        />
                      </Suspense>
                    )}
                    {["Developer", "Employee-cost-history"].some((item) =>
                      userRole.includes(item)
                    ) && (
                      <Link
                        to={`/employees/cost-history/${id}`}
                        className="button"
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          padding: "5px 10px",
                        }}
                      >
                        Cost history
                      </Link>
                    )}
                  </div>

                  <div className="mt-8 flex justify-between items-center">
                    {["Developer", "Employee-salary-create"].some((item) =>
                      userRole.includes(item)
                    ) && (
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
                          data={id}
                        />
                      </Suspense>
                    )}
                    {["Developer", "Employee-salary-history"].some((item) =>
                      userRole.includes(item)
                    ) && (
                      <Link
                        to={`/employees/salary-history/${id}`}
                        className="button"
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          padding: "5px 10px",
                        }}
                      >
                        Salary history
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="right">
              <h3 className="text-center text-[1.2rem] capitalize bg-gray-300 rounded-t-md py-1">
                Employee history
              </h3>
              <div className="p-4">
                <Suspense fallback="">
                  <ViewDetailsTable
                    apiData={apiData}
                    setApiData={setApiData}
                    filteredApiData={filteredApiData}
                    setFilteredApiData={setFilteredApiData}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default ViewDetails;

// What will use hear from mui
// > Skeleton

import { lazy, Suspense, useState, useEffect, useContext } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";

//=>>> Css
import "../../../assets/css/ViewDetails.css";

//=>>> Additional utility
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";

//=>>> Components
const ViewDetailsTable = lazy(() => import("./ViewDetailsTable"));

const ViewDetails = ({ setLoader }) => {
  const { id } = useParams();
  const { headers, userRole } = useContext(AuthContext);
  const pathname = useLocation().pathname;

  const [info, setInfo] = useState({});
  const [apiData, setApiData] = useState([]);
  const [filteredApiData, setFilteredApiData] = useState([]);
  const [relodeTable, setRelodeTable] = useState(false);
  useEffect(() => {
    const getApiData = async () => {
      try {
        setLoader(true);
        await ApiConfig.get(`/brandReport/${id}`, { headers }).then(
          (response) => {
            setInfo(response.data.data || {});
            setApiData(response.data.data.products_sold);
            setFilteredApiData(response.data.data.products_sold);
            setLoader(false);
          }
        );
      } catch (error) {
        setLoader(false);
        console.log(error);
      }
    };
    getApiData();
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Brand details-{id}</title>
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

        <div className="view-details customer">
          <div className="info-section">
            <div className="left d-flex items-start justify-center">
              <div className="u-info">
                <h3 className="text-center text-[1.2rem] capitalize bg-gray-300 rounded-t-md py-1">
                  Brand info
                </h3>
                <div className="txt-box px-4 pb-4 mt-5">
                  <table className="w-full font-bold text-md">
                    <tbody>
                      <tr className="align-top">
                        <td className="w-3">Name</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.brand_name}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="w-3">Sale</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{Number(info.total_sales).toFixed(2)} /-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="right">
              <h3 className="text-center text-[1.2rem] capitalize bg-gray-300 rounded-t-md py-1">
                Invoice history
              </h3>
              <div className="p-4">
                <Suspense fallback="">
                  <ViewDetailsTable
                    apiData={apiData}
                    setApiData={setApiData}
                    filteredApiData={filteredApiData}
                    setFilteredApiData={setFilteredApiData}
                    // invoiceInfo={invoiceInfo}
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

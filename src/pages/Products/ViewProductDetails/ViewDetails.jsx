import { lazy, Suspense, useState, useEffect, useContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";

//=>>> Css
import "../../../assets/css/ViewDetails.css";

//=>>> Additional utility
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";

//=>>> Components
const ViewDetailsTable = lazy(() => import("./ViewDetailsTable"));
const ImageViewer = lazy(() =>
  import("../../../components/ImageViewer/ImageViewer")
);

const ViewDetails = ({ setLoader }) => {
  const { id } = useParams();
  const { headers } = useContext(AuthContext);
  const pathname = useLocation().pathname;

  const [info, setInfo] = useState({});
  const [apiData, setApiData] = useState([]);
  const [filteredApiData, setFilteredApiData] = useState([]);
  useEffect(() => {
    const getApiData = async () => {
      try {
        setLoader(true);
        await ApiConfig.get(`/productReport/${id}`, { headers }).then(
          (response) => {
            setInfo(response.data.data.product_details);
            setApiData(response.data.data.product_sales);
            setFilteredApiData(response.data.data.product_sales);
            setLoader(false);
            // console.log(response.data.data);
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
        <title>Prodect details-{id}</title>
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

        <div className="view-details products">
          <div className="info-section">
            <div className="left d-flex items-start justify-center">
              <div className="u-info">
                <h3 className="text-center text-[1.2rem] capitalize bg-gray-300 rounded-t-md py-1">
                  Prodect info
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
                        <td className="w-20">Name</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.name}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="w-20">Quantity</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.quantity}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="w-20">Expire</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.expire_date}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="w-20">Pack size</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.pack_size}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="w-20">B price</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.buy_price}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="w-20">S price</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.sell_price}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="w-20">Flat price</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.flat_price}</td>
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
                    id={id}
                    setLoader={setLoader}
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

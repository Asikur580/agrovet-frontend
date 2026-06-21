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

  const [info, setInfo] = useState({
    id: "",
    image: "",
    proprietor_name: "",
    company_name: "",
    phone: "",
    address: "",
    total_purchase: "",
    total_payment: "",
    net_due: "",
  });
  const [apiData, setApiData] = useState([]);
  const [filteredApiData, setFilteredApiData] = useState([]);
  const [relodeTable, setRelodeTable] = useState(false);

  const getApiData = async () => {
    try {
      setLoader(true);
      await ApiConfig.get(`/supplierReport/${id}`, { headers }).then(
        (response) => {
          const res = response.data.data;
          setInfo({
            id: res.supplier.id,
            image: res.supplier.image,
            proprietor_name: res.supplier.proprietor_name,
            company_name: res.supplier.company_name,
            phone: res.supplier.phone,
            address: res.supplier.address,
            total_purchase: res.total_purchase,
            total_payment: res.total_payment,
            net_due: res.net_due,
          });
          setApiData(res.supplier.stock_in_outs);
          setFilteredApiData(res.supplier.stock_in_outs);
          setLoader(false);
          // console.log(res);
        }
      );
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getApiData();
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
        <title>Customer details-{id}</title>
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
                  Supplier info
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
                        <td>{info.proprietor_name}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="w-3">Company </td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.company_name}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="w-3">Phone</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.phone}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="w-3">Address</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.address}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="w-3">Purchase</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.total_purchase}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="w-3">Payment</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.total_payment}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="w-3">Due</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.net_due}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="mt-8 flex justify-between items-center">
                    {["Developer", "Supplier-payment-create"].some((item) =>
                      userRole.includes(item)
                    ) && (
                      <Suspense fallback="...">
                        <CommonModal
                          slug={`Payment`}
                          inputFields={inputFields}
                          ModalOpenBtnTitle="Payment"
                          className="addBtn"
                          identifier="paymentStoreSupplier"
                          api="/paymentStore"
                          data={info.id}
                          setLoader={setLoader}
                          setRelodeTable={setRelodeTable}
                        />
                      </Suspense>
                    )}
                    {["Developer", "Supplier-payment-history"].some((item) =>
                      userRole.includes(item)
                    ) && (
                      <Link
                        to={`/suppliers/payment-history/${id}`}
                        className="button"
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          padding: "5px 10px",
                        }}
                      >
                        Payment history
                      </Link>
                    )}
                  </div>
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

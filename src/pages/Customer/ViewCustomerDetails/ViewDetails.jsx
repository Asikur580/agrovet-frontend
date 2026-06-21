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
// import ImageMagnifier from "../../../components/ImageMagnifier/ImageMagnifier";

const ViewDetails = ({ setLoader }) => {
  const { id } = useParams();
  const { headers, userRole } = useContext(AuthContext);
  const pathname = useLocation().pathname;

  const [info, setInfo] = useState({
    cust_id: "",
    image: "",
    employee_id: "",
    customer_id: "",
    customer_name: "",
    phone: "",
    address: "",
    old_due: "",
    total_purchases: "",
    total_payments: "",
    total_due: "",
    credit_limit: "",
  });
  const [apiData, setApiData] = useState([]);
  const [filteredApiData, setFilteredApiData] = useState([]);
  const [relodeTable, setRelodeTable] = useState(false);
  useEffect(() => {
    const getApiData = async () => {
      try {
        setLoader(true);
        await ApiConfig.get(`/customerReport/${id}`, { headers }).then(
          (response) => {
            const res = response.data.data;
            setInfo({
              cust_id: res.customer_details.id,
              image: res.customer_details.image,
              employee_id: res.customer_details.employee_id,
              customer_id: res.customer_details.customer_id,
              customer_name: res.customer_details.customer_name,
              phone: res.customer_details.phone,
              address: res.customer_details.address,
              old_due: res.customer_details.old_due,
              total_purchases: res.total_purchases,
              total_payments: res.total_payments,
              total_due: res.total_due,
              credit_limit: res.customer_details.credit_limit,
            });
            setApiData(response.data.data.customer_invoices);
            setFilteredApiData(response.data.data.customer_invoices);
            setLoader(false);
            // console.log(res.customer_details.employee_id);
            // console.log(res);
          }
        );
      } catch (error) {
        setLoader(false);
        console.log(error);
      }
    };
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

        <div className="view-details customer">
          <div className="info-section">
            <div className="left d-flex items-start justify-center">
              <div className="u-info">
                <h3 className="text-center text-[1.2rem] capitalize bg-gray-300 rounded-t-md py-1">
                  Customer info
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
                        <td className="w-3">Cust id</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.customer_id}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="w-3">Name</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.customer_name}</td>
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
                        <td className="w-3">Old Due</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.old_due}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="w-3">C Limit</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.credit_limit || 0}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="w-3">Purchases</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.total_purchases}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="w-3">Payments</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.total_payments}</td>
                      </tr>
                      <tr className="align-top">
                        <td className="w-3">Due</td>
                        <td className="w-5 text-center font-black">:</td>
                        <td>{info.total_due}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="mt-8 flex justify-between items-center">
                    {["Developer", "Customer-payment-create"].some((item) =>
                      userRole.includes(item)
                    ) && (
                      <Suspense fallback="...">
                        <CommonModal
                          slug={`Payment`}
                          inputFields={inputFields}
                          ModalOpenBtnTitle="Payment"
                          className="addBtn"
                          identifier="paymentStoreCustomer"
                          api="/paymentStore"
                          data={info.cust_id}
                          data_2={info.employee_id}
                          setLoader={setLoader}
                          setRelodeTable={setRelodeTable}
                        />
                      </Suspense>
                    )}
                    {["Developer", "Customer-payment-history"].some((item) =>
                      userRole.includes(item)
                    ) && (
                      <Link
                        to={`/customers/payment-history/${id}`}
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

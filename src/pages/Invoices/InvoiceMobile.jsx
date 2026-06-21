import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { useReactToPrint } from "react-to-print";

//=>>> Css
import "./Invoice.css";

//=>>> Utilities
import ApiConfig from "../../assets/js/ApiConfig";
import { AuthContext } from "../../context/AuthContext";

const InvoiceMobile = ({ setLoader }) => {
  const { id } = useParams();
  const { headers } = useContext(AuthContext);

  const [apiData, setApiData] = useState([]);
  const [custData, setCustData] = useState({});
  const [empData, setEmpData] = useState({});
  const [dateOfInvoice, setDateOfInvoice] = useState();
  const [salesCount, setSalesCount] = useState();

  const GetApiData = async () => {
    setLoader(true);
    await ApiConfig.get(`/invoiceShow/${id}`, { headers })
      .then((response) => {
        if (response.data.status == true) {
          setApiData(response.data.data);
          setCustData(response.data.data.customer);
          setEmpData(response.data.data.employee);
          localStorage.setItem(
            "invoice-data",
            JSON.stringify(response.data.data)
          );
          setDateOfInvoice(
            new Date(response.data.data.created_at).toISOString().split("T")[0]
          );
          setSalesCount(response.data.data.sale_date);
          setLoader(false);
          // console.log(response.data.data);
        } else {
          setLoader(false);
        }
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  };
  useEffect(() => {
    GetApiData();
  }, []);

  //=>>> Print
  const contentRef = useRef();
  const reactToPrintFn = useReactToPrint({
    contentRef,
  });

  return (
    <HelmetProvider>
      <Helmet>
        <title>{`Invoice-${custData.customer_name || ""}`}</title>
        <meta name="description" content="Agrovet software" />
      </Helmet>

      {/* For go to top */}
      <input
        type="file"
        autoFocus
        style={{ height: "0", opacity: 0, pointerEvents: "none" }}
      />
      {/* For go to top */}

      <div
        ref={contentRef}
        className="invoice-container content animated fadeInDown"
      >
        <div className="invoice-header">
          <button
            className="button printBtn no-print"
            onClick={() => reactToPrintFn()}
          >
            print
          </button>
          <p className="compName">RADIANT AGROVET</p>
          <p>House # 37, Road # 01, Dhaka Uddyan, Mohammadpur, Dhaka-1207</p>
          <h2>INVOICE</h2>
        </div>

        <div className="invoice-details">
          {/* <div className="full-width">
            <div>
              <strong>Customer Name:</strong> {custData.customer_name}
            </div>
            <div>
              <strong>Proprietor Name:</strong> {custData.proprietor_name}
            </div>
            <div>
              <strong>Address:</strong> {custData.address}
            </div>
          </div> */}
          <div className="flex justify-between">
            <div className="left">
              <div>
                <strong>Customer Name:</strong> {custData.customer_name}
              </div>
              <div>
                <strong>Proprietor Name:</strong> {custData.proprietor_name}
              </div>
              <div>
                <strong>Address:</strong> {custData.address}
              </div>
              <div>
                <strong>Cell:</strong> {custData.phone}
              </div>
            </div>
            <div className="right">
              <div>
                <strong>Invoice Id:</strong> {apiData.invoiceId}
              </div>
              <div>
                <strong>Date of Invoice:</strong> {dateOfInvoice}
              </div>
              <div>
                <strong>Sales Count:</strong> {salesCount}
              </div>
              <div>
                <strong>Sales Ref:</strong> {empData.name}
              </div>
              <div>
                <strong>Territory:</strong> {empData.territory}
              </div>
              <div>
                <strong>Mode of Sales:</strong> {apiData.sale_type}
              </div>
            </div>
          </div>
        </div>

        <table className="product-table">
          <thead>
            <tr>
              <th>Sl No</th>
              <th className="prodName">Product Name</th>
              <th>Pack Size</th>
              <th>TP/Flat</th>
              <th>Qty</th>
              <th>Due qty</th>
              <th>Total TP</th>
              <th>Bonus Qty</th>
              <th>Net Qty</th>
              <th>Net Amount</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(apiData.products) &&
              apiData.products.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="prodName">{item.product.name}</td>
                    <td>{item.product.pack_size}</td>
                    <td>
                      {item.unit_price}/-({item.price_type})
                    </td>
                    <td>{item.quantity}</td>
                    <td>{item.due_quantity}</td>
                    <td>{item.quantity * item.unit_price}/-</td>
                    <td>{item.bonus_qty}</td>
                    <td>{item.quantity + item.bonus_qty}</td>
                    <td>{item.unit_price * item.quantity}/-</td>
                  </tr>
                );
              })}

            {/* <tr>
              <td
                colSpan={9}
                style={{ textAlign: "end", paddingRight: "10px" }}
              >
                <strong>Total</strong>
              </td>
              <td>
                {Number(apiData.total_price).toFixed(2)}
                <span className="tk">/-</span>
              </td>
            </tr> */}
          </tbody>
        </table>

        <div className="invoiceCustomize">
          <div className="left"></div>
          <div className="right">
            <table>
              <tbody>
                <tr>
                  <td>Total</td>
                  <td>:</td>
                  <td>
                    {Number(apiData.total_price).toFixed(2)}
                    <span className="tk">/-</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    Discount -{" "}
                    {1 /
                      (Number(apiData.total_price).toFixed(2) /
                        (Number(apiData.discount).toFixed(2) * 100))}
                    %
                  </td>
                  <td>:</td>
                  <td>
                    {Number(apiData.discount).toFixed(2)}
                    <span className="tk">/-</span>
                  </td>
                </tr>
                <tr>
                  <td>Net Payable Amount</td>
                  <td>:</td>
                  <td>
                    {(
                      Number(apiData.total_price).toFixed(2) -
                      Number(apiData.discount).toFixed(2)
                    ).toFixed(2)}
                    <span className="tk">/-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="invoice-footer ">
          <div>
            <span>Prepared By</span>
            <span>Delivered By</span>
            <span>Received By</span>
          </div>
          <p className="note text-[0.8rem]">
            PRODUCT SOLD ARE NOT RETURNABLE OR REFUNDABLE
          </p>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default InvoiceMobile;

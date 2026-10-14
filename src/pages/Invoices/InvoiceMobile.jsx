import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";
import { FaPrint, FaDownload } from "react-icons/fa";

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
    documentTitle: `Invoice-${custData.customer_name || id || ""}`,
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 10mm 10mm 10mm 10mm;
      }
      * {
        color: #000000 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        -webkit-text-fill-color: #000000 !important;
        text-shadow: none !important;
        box-sizing: border-box !important;
      }
      html, body {
        height: 100% !important;
        background: #ffffff !important;
        color: #000000 !important;
        margin: 0 !important;
        padding: 0 !important;
        font-family: Arial, "Helvetica Neue", Helvetica, "Segoe UI", Kalpurush, sans-serif !important;
        -webkit-font-smoothing: antialiased !important;
        text-rendering: geometricPrecision !important;
      }
      .invoice-container {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        box-shadow: none !important;
        color: #000000 !important;
        background: #ffffff !important;
        display: flex !important;
        flex-direction: column !important;
        min-height: calc(100vh - 22mm) !important;
        box-sizing: border-box !important;
        font-family: Arial, "Helvetica Neue", Helvetica, "Segoe UI", Kalpurush, sans-serif !important;
      }
      .invoice-actions, .no-print {
        display: none !important;
      }
      .invoice-header .compName {
        font-size: 24pt !important;
        font-weight: 900 !important;
        color: #000000 !important;
        line-height: 1.1 !important;
      }
      .invoice-header p {
        font-size: 10pt !important;
        font-weight: 700 !important;
        color: #000000 !important;
      }
      .invoice-header h2 {
        font-size: 14pt !important;
        font-weight: 900 !important;
        color: #000000 !important;
        margin: 8px 0 12px 0 !important;
      }
      .invoice-details {
        font-size: 10pt !important;
        line-height: 1.4 !important;
        color: #000000 !important;
        font-family: Arial, "Helvetica Neue", Helvetica, "Segoe UI", Kalpurush, sans-serif !important;
      }
      .invoice-details > div {
        display: flex !important;
        justify-content: space-between !important;
      }
      .invoice-details strong {
        font-weight: 800 !important;
        color: #000000 !important;
      }
      .invoice-details div, .invoice-details span {
        font-weight: 700 !important;
        color: #000000 !important;
      }
      .product-table {
        width: 100% !important;
        border-collapse: collapse !important;
        margin-top: 12px !important;
        font-family: Arial, "Helvetica Neue", Helvetica, "Segoe UI", Kalpurush, sans-serif !important;
      }
      .product-table thead {
        display: table-header-group !important;
      }
      .product-table tr {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      .product-table th {
        background-color: transparent !important;
        border: 1.2px solid #000000 !important;
        color: #000000 !important;
        font-weight: 800 !important;
        font-size: 9pt !important;
        padding: 4px 3px !important;
        text-align: center !important;
        vertical-align: middle !important;
      }
      .product-table td {
        border: 1.2px solid #000000 !important;
        color: #000000 !important;
        font-weight: 700 !important;
        font-size: 9pt !important;
        padding: 4px 3px !important;
        text-align: center !important;
        vertical-align: middle !important;
      }
      .product-table th.prodName,
      .product-table td.prodName {
        text-align: left !important;
        padding-left: 8px !important;
      }
      .invoiceCustomize table tr td {
        font-size: 10pt !important;
        font-weight: 700 !important;
        color: #000000 !important;
        padding: 3px 1px !important;
      }
      .invoiceCustomize table tr td:first-child {
        font-weight: 800 !important;
      }
      .invoiceCustomize table tr td:last-child {
        font-weight: 800 !important;
      }
      .invoice-footer {
        margin-top: auto !important;
        padding-top: 40px !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        font-weight: 700 !important;
      }
      .invoice-footer div span {
        font-size: 10pt !important;
        font-weight: 700 !important;
        color: #000000 !important;
      }
      .note {
        font-size: 8.5pt !important;
        font-weight: 700 !important;
        color: #000000 !important;
        margin-top: 20px !important;
        margin-bottom: 0 !important;
      }
    `,
  });

  //=>>> Download PDF
  const [downloading, setDownloading] = useState(false);
  const handleDownload = () => {
    if (!contentRef.current) return;
    setDownloading(true);
    const element = contentRef.current;

    // Temporarily remove border and box-shadow from the live element so html2canvas captures zero border
    const prevBorder = element.style.border;
    const prevShadow = element.style.boxShadow;
    element.style.setProperty("border", "none", "important");
    element.style.setProperty("box-shadow", "none", "important");

    const opt = {
      margin: [8, 8, 8, 8],
      filename: `Invoice-${custData.customer_name || id || "invoice"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        scrollY: 0,
        scrollX: 0,
        onclone: (clonedDoc) => {
          const style = clonedDoc.createElement("style");
          style.innerHTML = `
            .invoice-container {
              border: none !important;
              box-shadow: none !important;
              outline: none !important;
              font-family: Arial, "Helvetica Neue", Helvetica, "Segoe UI", Kalpurush, sans-serif !important;
              display: flex !important;
              flex-direction: column !important;
              min-height: 1060px !important;
            }
            .invoice-footer {
              margin-top: auto !important;
              padding-top: 40px !important;
            }
            .product-table {
              border-collapse: collapse !important;
              width: 100% !important;
            }
            .product-table th,
            .product-table td {
              border: 1.2px solid #000 !important;
              padding-top: 2px !important;
              padding-bottom: 12px !important;
              padding-left: 4px !important;
              padding-right: 4px !important;
              vertical-align: middle !important;
              line-height: 1.2 !important;
              font-family: Arial, "Helvetica Neue", Helvetica, "Segoe UI", Kalpurush, sans-serif !important;
              font-weight: 700 !important;
              text-align: center !important;
              box-sizing: border-box !important;
            }
            .product-table th.prodName,
            .product-table td.prodName {
              text-align: left !important;
              padding-left: 8px !important;
            }
            .product-table th {
              background-color: transparent !important;
              font-weight: 800 !important;
            }
          `;
          clonedDoc.head.appendChild(style);

          const invoice = clonedDoc.querySelector(".invoice-container");
          if (invoice) {
            invoice.style.animation = "none";
            invoice.style.webkitAnimation = "none";
            invoice.style.transform = "none";
            invoice.style.opacity = "1";
            invoice.style.setProperty("box-shadow", "none", "important");
            invoice.style.setProperty("border", "none", "important");
            invoice.style.setProperty("outline", "none", "important");
            invoice.style.background = "#ffffff";
            invoice.style.color = "#000000";
          }
          const table = clonedDoc.querySelector(".product-table");
          if (table) {
            table.style.borderCollapse = "collapse";
          }
          const cells = clonedDoc.querySelectorAll(
            ".product-table th, .product-table td"
          );
          cells.forEach((cell) => {
            cell.style.setProperty("border", "1.2px solid #000", "important");
            cell.style.setProperty("padding-top", "2px", "important");
            cell.style.setProperty("padding-bottom", "12px", "important");
            cell.style.setProperty("padding-left", "4px", "important");
            cell.style.setProperty("padding-right", "4px", "important");
            cell.style.setProperty("vertical-align", "middle", "important");
            cell.style.setProperty("line-height", "1.2", "important");
            cell.style.setProperty(
              "font-family",
              'Arial, "Helvetica Neue", Helvetica, "Segoe UI", Kalpurush, sans-serif',
              "important"
            );
            cell.style.setProperty("font-weight", "700", "important");
            if (cell.classList.contains("prodName")) {
              cell.style.setProperty("text-align", "left", "important");
              cell.style.setProperty("padding-left", "8px", "important");
            } else {
              cell.style.setProperty("text-align", "center", "important");
            }
          });
        },
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        element.style.border = prevBorder;
        element.style.boxShadow = prevShadow;
        setDownloading(false);
      })
      .catch((err) => {
        element.style.border = prevBorder;
        element.style.boxShadow = prevShadow;
        console.error("PDF download error:", err);
        setDownloading(false);
      });
  };

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
        className="invoice-container"
      >
        <div className="invoice-header">
          <div
            className="invoice-actions no-print"
            data-html2canvas-ignore="true"
          >
            <button
              type="button"
              className="button printBtn"
              onClick={() => reactToPrintFn()}
            >
              <FaPrint /> Print
            </button>
            <button
              type="button"
              className="button downloadBtn"
              onClick={handleDownload}
              disabled={downloading}
            >
              <FaDownload /> {downloading ? "Downloading..." : "Download"}
            </button>
          </div>
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
              {custData.customer_id && (
                <div>
                  <strong>Customer Id:</strong> {custData.customer_id}
                </div>
              )}
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
              {apiData.offer && (
                <div>
                  <strong>Offer:</strong> {apiData.offer}
                </div>
              )}
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
                    {Number(apiData.total_price || 0).toFixed(2)}
                    <span className="tk">/-</span>
                  </td>
                </tr>
                {Number(apiData.discount || 0) > 0 && (
                  <tr>
                    <td>
                      Discount -{" "}
                      {Number(
                        1 /
                          (Number(apiData.total_price).toFixed(2) /
                            (Number(apiData.discount).toFixed(2) * 100))
                      ).toFixed(0)}
                      %
                    </td>
                    <td>:</td>
                    <td>
                      {Number(apiData.discount).toFixed(2)}
                      <span className="tk">/-</span>
                    </td>
                  </tr>
                )}
                {Number(apiData.less || 0) > 0 && (
                  <tr>
                    <td>Less</td>
                    <td>:</td>
                    <td>
                      {Number(apiData.less).toFixed(2)}
                      <span className="tk">/-</span>
                    </td>
                  </tr>
                )}
                {Number(apiData.paid || 0) > 0 && (
                  <tr>
                    <td>Paid</td>
                    <td>:</td>
                    <td>
                      {Number(apiData.paid).toFixed(2)}
                      <span className="tk">/-</span>
                    </td>
                  </tr>
                )}
                <tr>
                  <td>Net Payable Amount</td>
                  <td>:</td>
                  <td>
                    {(
                      Number(apiData.total_price || 0) -
                      Number(apiData.discount || 0) -
                      Number(apiData.less || 0) -
                      Number(apiData.paid || 0)
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

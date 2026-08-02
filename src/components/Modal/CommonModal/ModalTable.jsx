import React, { useRef, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { Button, Modal } from "antd";
import Draggable from "react-draggable";
import { useReactToPrint } from "react-to-print";
import { ImArrowDownRight2 } from "react-icons/im";

//=>>> Css
import "./CommonModal.css";

const ModalTable = (props) => {
  const {
    data,
    tableHead,
    slug,
    ModalOpenBtnTitle,
    className,
    toolTip,
    identifier,
    width,
    btnStatus,
    setBtnStatus,
  } = props;
  const [sessionStoreData, setSessionStoreData] = useState([]);

  //=>>> Modal config start
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);
  const showModal = () => {
    setOpen(true);
    identifier == "dueInvoice" &&
      setBtnStatus({ ...btnStatus, [data[0].id]: true });

    setSessionStoreData(JSON.parse(sessionStorage.getItem(identifier)));
    identifier == "stockHistory" && separateStockInOut();
  };
  const handleOk = (e) => {
    setOpen(false);
  };
  const handleCancel = (e) => {
    setOpen(false);
    identifier == "dueInvoice" &&
      setBtnStatus({ ...btnStatus, [data[0].id]: false });
  };
  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };
  //=>>> Modal config end

  //=>>> My code start
  const contentRef = useRef();
  const reactToPrintFn = useReactToPrint({ contentRef });

  //=>>> Separate stock in and out
  const [stockInData, setStockInData] = useState({});
  const [stockOutData, setStockOutData] = useState({});
  const separateStockInOut = () => {
    setStockInData(data.filter((item) => item.in_out == "in"));
    setStockOutData(data.filter((item) => item.in_out == "out"));
  };
  //=>>> My code end

  return (
    <>
      <Tooltip title={toolTip} placement="bottom">
        <Button
          onClick={showModal}
          className={`${className} ${
            identifier == "dueInvoice" &&
            btnStatus[data[0].id] == true &&
            "activeModalTable"
          }`}
          style={{ width: width }}
        >
          {ModalOpenBtnTitle}
        </Button>
      </Tooltip>
      <Modal
        title={
          <div
            className="modalTitle"
            style={{
              width: "100%",
              cursor: "move",
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            onFocus={() => {}}
            onBlur={() => {}}
            // end
          >
            {slug}
          </div>
        }
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            nodeRef={draggleRef}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        {/* Content start */}
        <div className="modalContent modalTableContent">
          {(() => {
            if (identifier == "dueInvoice") {
              return (
                <table className="w-full dueInvoiceTable">
                  {Array.isArray(data) &&
                    data.map((item, index) => {
                      return (
                        <tbody key={index}>
                          <tr>
                            <td>Invoice Id</td>
                            <td className="seperator">:</td>
                            <td>{item.invoiceId}</td>
                          </tr>
                          <tr>
                            <td>Customer name</td>
                            <td className="seperator">:</td>
                            <td>{item.customer.customer_name}</td>
                          </tr>
                          <tr>
                            <td>Employee name</td>
                            <td className="seperator">:</td>
                            <td>{item.employee.name}</td>
                          </tr>
                          <tr>
                            <td>Sale date</td>
                            <td className="seperator">:</td>
                            <td>{item.sale_date}</td>
                          </tr>
                          <tr>
                            <td>Total item</td>
                            <td className="seperator">:</td>
                            <td>
                              {parseInt(item.total_item) > 1
                                ? `${item.total_item} pices`
                                : `${item.total_item} pice`}
                            </td>
                          </tr>
                          <tr>
                            <td>Total price</td>
                            <td className="seperator">:</td>
                            <td>{item.total_price} /-</td>
                          </tr>
                          <tr>
                            <td>Grand total</td>
                            <td className="seperator">:</td>
                            <td>{item.grand_total} /-</td>
                          </tr>
                          <tr>
                            <td>Paid</td>
                            <td className="seperator">:</td>
                            <td>{item.paid} /-</td>
                          </tr>
                          <tr>
                            <td>Due</td>
                            <td className="seperator">:</td>
                            <td>{item.due} /-</td>
                          </tr>
                          <tr>
                            <td>Days since sale</td>
                            <td className="seperator">:</td>
                            <td>{item.days_since_sale}</td>
                          </tr>
                        </tbody>
                      );
                    })}
                </table>
              );
            } else if (identifier == "CustomerWiseSales") {
              return (
                <table className="w-full dueInvoiceTable">
                  {Array.isArray(data) &&
                    data.map((item, index) => {
                      return (
                        <tbody key={index}>
                          <tr>
                            <td>Customer name</td>
                            <td className="seperator">:</td>
                            <td>{item.customer_name}</td>
                          </tr>
                          <tr>
                            <td>Phone</td>
                            <td className="seperator">:</td>
                            <td>{item.phone}</td>
                          </tr>
                          <tr>
                            <td>Total invoices</td>
                            <td className="seperator">:</td>
                            <td>{item.total_invoices}</td>
                          </tr>
                          <tr>
                            <td>Old due</td>
                            <td className="seperator">:</td>
                            <td>{item.old_due}</td>
                          </tr>
                          <tr>
                            <td>Total purchases</td>
                            <td className="seperator">:</td>
                            <td>{item.total_purchases}</td>
                          </tr>
                          <tr>
                            <td>Total payments</td>
                            <td className="seperator">:</td>
                            <td>{item.total_payments}</td>
                          </tr>
                          <tr>
                            <td>Total due</td>
                            <td className="seperator">:</td>
                            <td>{item.total_due}</td>
                          </tr>
                        </tbody>
                      );
                    })}
                </table>
              );
            } else if (identifier == "ProductWiseSales") {
              return (
                <table className="w-full dueInvoiceTable">
                  {Array.isArray(data) &&
                    data.map((item, index) => {
                      return (
                        <tbody key={index}>
                          <tr>
                            <td>Product name</td>
                            <td className="seperator">:</td>
                            <td>{item.product_name}</td>
                          </tr>
                          <tr>
                            <td>Total Invoice</td>
                            <td className="seperator">:</td>
                            <td>{item.total_invoice}</td>
                          </tr>
                          <tr>
                            <td>Total quantity</td>
                            <td className="seperator">:</td>
                            <td>{item.total_quantity}</td>
                          </tr>
                          <tr>
                            <td>Total amount</td>
                            <td className="seperator">:</td>
                            <td>{Number(item.total_amount).toFixed(2)}/-</td>
                          </tr>
                        </tbody>
                      );
                    })}
                </table>
              );
            } else if (identifier == "CategoryWiseSales") {
              return (
                <table className="w-full dueInvoiceTable">
                  {Array.isArray(data) &&
                    data.map((item, index) => {
                      return (
                        <tbody key={index}>
                          <tr>
                            <td>Category name</td>
                            <td className="seperator">:</td>
                            <td>{item.category_name}</td>
                          </tr>
                          <tr>
                            <td>Total Invoice</td>
                            <td className="seperator">:</td>
                            <td>{item.total_invoice}</td>
                          </tr>
                          <tr>
                            <td>Total quantity</td>
                            <td className="seperator">:</td>
                            <td>{item.total_quantity}</td>
                          </tr>
                          <tr>
                            <td>Total amount</td>
                            <td className="seperator">:</td>
                            <td>{Number(item.total_amount).toFixed(2)}/-</td>
                          </tr>
                        </tbody>
                      );
                    })}
                </table>
              );
            } else if (identifier == "CreditLimitList") {
              return (
                <table className="w-full dueInvoiceTable">
                  {Array.isArray(data) &&
                    data.map((item, index) => {
                      return (
                        <tbody key={index}>
                          <tr>
                            <td>Employee name</td>
                            <td className="seperator">:</td>
                            <td>{item.employee_name}</td>
                          </tr>
                          <tr>
                            <td>Credit limit</td>
                            <td className="seperator">:</td>
                            <td>{item.credit_limit}</td>
                          </tr>
                          <tr>
                            <td>Total purchase</td>
                            <td className="seperator">:</td>
                            <td>{item.total_purchase}</td>
                          </tr>
                          <tr>
                            <td>Total payment</td>
                            <td className="seperator">:</td>
                            <td>{item.total_payment}</td>
                          </tr>
                          <tr>
                            <td>Total due</td>
                            <td className="seperator">:</td>
                            <td>{item.total_due}</td>
                          </tr>
                          <tr>
                            <td>Credit use</td>
                            <td className="seperator">:</td>
                            <td>{item.credit_use}</td>
                          </tr>
                          <tr>
                            <td>Credit due</td>
                            <td className="seperator">:</td>
                            <td>{item.credit_due}</td>
                          </tr>
                        </tbody>
                      );
                    })}
                </table>
              );
            } else if (
              identifier == "printCustomer" ||
              identifier == "printProduct" ||
              identifier == "printBrandDetails" ||
              identifier == "printCategoryDetails" ||
              identifier == "printEmployeeDetails" ||
              identifier == "printSupplierDetails" ||
              identifier == "printProductDetails" ||
              identifier == "printCustomerDetails" ||
              identifier == "printCustomerPayment" ||
              identifier == "printSupplierPayment" ||
              identifier == "printEmployeeCost" ||
              identifier == "printEmployeeSalary" ||
              identifier == "printOfficeCost" ||
              identifier == "printDueInvoice" ||
              identifier == "printCustomerWiseSales" ||
              identifier == "printProductWiseSales" ||
              identifier == "printCategoryWiseSales" ||
              identifier == "printCreditLimitList"
            ) {
              return (
                <>
                  {Array.isArray(sessionStoreData) &&
                    sessionStoreData.length > 0 && (
                      <div className="text-end mb-3">
                        <button
                          className="printBtn font-bold text-main_clr border border-solid border-main_clr rounded-md px-4 py-1"
                          style={{ top: "12px", right: "50px" }}
                          onClick={() => reactToPrintFn()}
                        >
                          print
                        </button>
                      </div>
                    )}

                  {Array.isArray(sessionStoreData) &&
                  sessionStoreData.length > 0 ? (
                    <div ref={contentRef} className="printTable">
                      <h1 className="hidden print:block text-2xl text-center font-bold mb-3">
                        {slug}
                      </h1>
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-300 border text-center h-[35px]">
                            {Array.isArray(tableHead) &&
                              tableHead.map((item, index) => {
                                return (
                                  <th key={index} className="print:px-2">
                                    {item}
                                  </th>
                                );
                              })}
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(sessionStoreData) &&
                            sessionStoreData.map((item, index) => {
                              return (
                                <tr
                                  key={index}
                                  className="border h-[35px] text-center"
                                >
                                  <td
                                    className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                  >
                                    {index + 1}
                                  </td>
                                  {identifier == "printCustomer" ? (
                                    <>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.customer_name}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.phone}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.proprietor_name}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {Number(item.due || 0).toFixed(2)}
                                      </td>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {/* ---- */}
                                  {identifier == "printProduct" ? (
                                    <>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.name}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.expire_date}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.sell_price}
                                      </td>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {/* ---- */}
                                  {identifier == "printBrandDetails" ||
                                  identifier == "printCategoryDetails" ? (
                                    <>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.name}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.total_quantity_sold}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.sale_date}
                                      </td>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {/* ---- */}
                                  {identifier == "printEmployeeDetails" ||
                                  identifier == "printCustomerDetails" ? (
                                    <>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.invoiceId}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.grand_total}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.sale_date}
                                      </td>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {/* ---- */}
                                  {identifier == "printSupplierDetails" ? (
                                    <>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.product.name}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.quantity}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.buy_price}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.in_out_date}
                                      </td>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {/* ---- */}
                                  {identifier == "printProductDetails" ? (
                                    <>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.customer_name}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.quantity}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.unit_price}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.item_amount}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.item_discount}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.less}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.net_amount}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.grand_total}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.sale_date}
                                      </td>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {/* ---- */}
                                  {identifier == "printCustomerPayment" ? (
                                    <>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.customer_name}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.employee_name}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.payment_method}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.amount}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.payment_date}
                                      </td>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {/* ---- */}
                                  {identifier == "printSupplierPayment" ? (
                                    <>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.supplier_name}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.payment_method}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.amount}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.payment_date}
                                      </td>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {/* ---- */}
                                  {identifier == "printEmployeeCost" ? (
                                    <>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.employee_name}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.employee_cost_category_name}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.amount}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.cost_date}
                                      </td>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {/* ---- */}
                                  {identifier == "printEmployeeSalary" ? (
                                    <>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.month_year}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.basic_salary}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.paid_amount}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.advance_amount}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.due_amount}
                                      </td>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {/* ---- */}
                                  {identifier == "printOfficeCost" ? (
                                    <>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.cost_category_name}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.amount}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.cost_date}
                                      </td>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {/* ---- */}
                                  {identifier == "printDueInvoice" ? (
                                    <>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                        style={{ width: "250px" }}
                                      >
                                        {item.customer.customer_name}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.grand_total}/-
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.due}/-
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.sale_date}
                                      </td>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {/* ---- */}
                                  {identifier == "printCustomerWiseSales" ? (
                                    <>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                        style={{
                                          width: "1000px",
                                        }}
                                      >
                                        {item.customer_name}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                        style={{
                                          width: "400px",
                                        }}
                                      >
                                        {item.phone}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.total_invoices}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.old_due}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.total_purchases}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.total_payments}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.total_due}
                                      </td>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {/* ---- */}
                                  {identifier == "printProductWiseSales" ? (
                                    <>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.product_name}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.pack_size}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.total_invoice}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.total_quantity}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {Number(item.total_amount).toFixed(2)}/-
                                      </td>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {/* ---- */}
                                  {identifier == "printCategoryWiseSales" ? (
                                    <>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.category_name}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.total_invoice}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.total_quantity}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {Number(item.total_amount).toFixed(2)}/-
                                      </td>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {/* ---- */}
                                  {identifier == "printCreditLimitList" ? (
                                    <>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.employee_name}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.credit_limit}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.total_purchase}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.total_payment}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.total_due}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.credit_use}
                                      </td>
                                      <td
                                        className={`${prTr.b} ${prTr.bc} ${prTr.px}`}
                                      >
                                        {item.credit_due}/-
                                      </td>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </tr>
                              );
                            })}
                        </tbody>
                        {identifier == "printCustomer" && (
                          <tfoot>
                            <tr className="border h-[35px] font-bold text-center">
                              <td colSpan={4} className="text-right pr-4 border border-border_clr">Total Due:</td>
                              <td className="border border-border_clr px-2">
                                {Number(
                                  sessionStoreData.reduce((acc, curr) => acc + Number(curr.due || 0), 0)
                                ).toFixed(2)}
                              </td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                  ) : (
                    "Opps! Data not found."
                  )}
                </>
              );
            } else if (identifier == "stockHistory") {
              return (
                <>
                  {/* stock history table */}
                  <h1 className="text-center text-blue-600 text-[1.3rem] font-semibold flex items-center gap-2">
                    <ImArrowDownRight2 size={15} className="text-green-600" />
                    Stock in
                  </h1>
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-300 border text-center h-[35px]">
                        <th>Sl no</th>
                        <th>Supplier name</th>
                        <th>Buy price</th>
                        <th>Qty</th>
                        <th>In Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockInData.length != 0 ? (
                        Array.isArray(stockInData) &&
                        stockInData.map((item, index) => {
                          return (
                            <tr
                              key={index}
                              className="border h-[35px] text-center"
                            >
                              <td className={`${prTr.b} ${prTr.bc} ${prTr.px}`}>
                                {index + 1}
                              </td>
                              <td className={`${prTr.b} ${prTr.bc} ${prTr.px}`}>
                                {item.supplier_name}
                              </td>
                              <td className={`${prTr.b} ${prTr.bc} ${prTr.px}`}>
                                {item.buy_price}
                              </td>
                              <td className={`${prTr.b} ${prTr.bc} ${prTr.px}`}>
                                {item.quantity}
                              </td>
                              <td className={`${prTr.b} ${prTr.bc} ${prTr.px}`}>
                                {item.in_out_date}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center border border-solid border-[#c7c7c7]"
                          >
                            No data found
                          </td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <h1 className="text-center text-blue-600 text-[1.3rem] font-semibold flex items-center gap-2 mt-4">
                    <ImArrowDownRight2
                      size={15}
                      className="text-red-600 rotate-180"
                    />
                    Stock out
                  </h1>
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-300 border text-center h-[35px]">
                        <th>Sl no</th>
                        <th>Who take</th>
                        <th>Qty</th>
                        <th>Purpose</th>
                        <th>Out Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockOutData.length != 0 ? (
                        Array.isArray(stockOutData) &&
                        stockOutData.map((item, index) => {
                          return (
                            <tr
                              key={index}
                              className="border h-[35px] text-center"
                            >
                              <td className={`${prTr.b} ${prTr.bc} ${prTr.px}`}>
                                {index + 1}
                              </td>
                              <td className={`${prTr.b} ${prTr.bc} ${prTr.px}`}>
                                {item.who_take}
                              </td>
                              <td className={`${prTr.b} ${prTr.bc} ${prTr.px}`}>
                                {item.quantity}
                              </td>
                              <td className={`${prTr.b} ${prTr.bc} ${prTr.px}`}>
                                {item.purpose}
                              </td>
                              <td className={`${prTr.b} ${prTr.bc} ${prTr.px}`}>
                                {item.in_out_date}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center border border-solid border-[#c7c7c7]"
                          >
                            No data found
                          </td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              );
            } else if (identifier == "printCashCreditSales") {
              return (
                <>
                  {Array.isArray(sessionStoreData) &&
                  sessionStoreData.length > 0 ? (
                    <>
                      <div className="text-end mb-3">
                        <button
                          className="printBtn font-bold text-main_clr border border-solid border-main_clr rounded-md px-4 py-1"
                          style={{ top: "12px", right: "50px" }}
                          onClick={() => reactToPrintFn()}
                        >
                          print
                        </button>
                      </div>

                      <div ref={contentRef} className="printTable">
                        <h1 className="hidden print:block text-2xl text-center font-bold mb-3">
                          {slug}
                        </h1>
                        <table className="w-full dueInvoiceTable">
                          <thead>
                            <tr className="bg-gray-300 border text-center h-[35px]">
                              <th>Cash</th>
                              <th>Credit</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border h-[35px] text-center">
                              <td className={`${prTr.b} ${prTr.bc} ${prTr.px}`}>
                                {Number(sessionStoreData[0]).toFixed(2)}/-
                              </td>
                              <td className={`${prTr.b} ${prTr.bc} ${prTr.px}`}>
                                {Number(sessionStoreData[1]).toFixed(2)}/-
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    "Opps! Data not found."
                  )}
                </>
              );
            } else if (identifier == "printProfitLoss") {
              return (
                <>
                  <div className="text-end mb-3">
                    <button
                      className="printBtn font-bold text-main_clr border border-solid border-main_clr rounded-md px-4 py-1"
                      style={{ top: "12px", right: "50px" }}
                      onClick={() => reactToPrintFn()}
                    >
                      print
                    </button>
                  </div>

                  <div ref={contentRef} className="printTable">
                    <h1 className="hidden print:block text-2xl text-center font-bold mb-3">
                      {slug}
                    </h1>
                    <table className="w-full dueInvoiceTable">
                      <thead>
                        <tr className="bg-gray-300 border text-center h-[35px]">
                          <th>Product Sales</th>
                          <th>Product Buy Price</th>
                          <th>Salary Cost</th>
                          <th>Employee Add Cost</th>
                          <th>Office Cost</th>
                          <th>Net Profit / Loss</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border h-[35px] text-center">
                          <td className={`${prTr.b} ${prTr.bc} ${prTr.px}`}>
                            {Number(sessionStoreData["Product Sales"]).toFixed(2)}/-
                          </td>
                          <td className={`${prTr.b} ${prTr.bc} ${prTr.px}`}>
                            {Number(sessionStoreData["Product Buy Price"]).toFixed(2)}/-
                          </td>
                          <td className={`${prTr.b} ${prTr.bc} ${prTr.px}`}>
                            {Number(sessionStoreData["Salary Cost"]).toFixed(2)}/-
                          </td>
                          <td className={`${prTr.b} ${prTr.bc} ${prTr.px}`}>
                            {Number(sessionStoreData["Employee Add Cost"]).toFixed(2)}/-
                          </td>
                          <td className={`${prTr.b} ${prTr.bc} ${prTr.px}`}>
                            {Number(sessionStoreData["Office Cost"]).toFixed(2)}/-
                          </td>
                          <td className={`${prTr.b} ${prTr.bc} ${prTr.px}`}>
                            {Number(sessionStoreData["Net Profit / Loss"]).toFixed(2)}/-
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* <table className="w-full dueInvoiceTable">
                      <tbody>
                        <tr>
                          <td>Sales</td>
                          <td className="seperator">:</td>
                          <td>{Number(sessionStoreData.sales).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Dues</td>
                          <td className="seperator">:</td>
                          <td>{Number(sessionStoreData.dues).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Cogs</td>
                          <td className="seperator">:</td>
                          <td>{Number(sessionStoreData.cogs).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Salaries</td>
                          <td className="seperator">:</td>
                          <td>
                            {Number(sessionStoreData.salaries).toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td>Costs</td>
                          <td className="seperator">:</td>
                          <td>{Number(sessionStoreData.costs).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Net profit</td>
                          <td className="seperator">:</td>
                          <td>
                            {Number(sessionStoreData.net_profit).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table> */}
                  </div>
                </>
              );
            } else if (identifier == "printSalesSummary") {
              const summary = Array.isArray(sessionStoreData) && sessionStoreData.length > 0 ? sessionStoreData[0] : null;
              return (
                <>
                  <div className="text-end mb-3">
                    <button
                      className="printBtn font-bold text-main_clr border border-solid border-main_clr rounded-md px-4 py-1"
                      style={{ top: "12px", right: "50px" }}
                      onClick={() => reactToPrintFn()}
                    >
                      print
                    </button>
                  </div>

                  {summary ? (
                    <div ref={contentRef} className="printTable px-4">
                      <h1 className="hidden print:block text-2xl text-center font-bold mb-3">
                        {slug}
                      </h1>
                      
                      <div className="mb-4 flex justify-between border-b pb-2 text-[15px]">
                         <div><strong>Date Range:</strong> {summary.dateRange}</div>
                         <div><strong>Employee:</strong> {summary.employeeName}</div>
                      </div>

                      <table className="w-full mt-4 text-left border text-[15px]">
                        <tbody>
                          <tr className="border-b h-[35px]">
                            <td className="px-3 border-r font-semibold w-1/2">Total Invoices</td>
                            <td className="px-3 w-1/2">{summary.totalInvoices}</td>
                          </tr>
                          <tr className="border-b h-[35px]">
                            <td className="px-3 border-r font-semibold">Cash Invoices</td>
                            <td className="px-3">{summary.cashInvoicesCount} (Amount: {summary.totalCashAmount.toFixed(2)}/-)</td>
                          </tr>
                          <tr className="border-b h-[35px]">
                            <td className="px-3 border-r font-semibold">Credit Invoices</td>
                            <td className="px-3">{summary.creditInvoicesCount} (Amount: {summary.totalCreditAmount.toFixed(2)}/-)</td>
                          </tr>
                          <tr className="h-[35px] bg-gray-100">
                            <td className="px-3 border-r font-bold text-[16px]">Total Sales Amount</td>
                            <td className="px-3 font-bold text-[16px]">{summary.totalSalesAmount.toFixed(2)}/-</td>
                          </tr>
                        </tbody>
                      </table>

                      {summary.invoices && summary.invoices.length > 0 && (
                        <div className="mt-8">
                          <h2 className="text-lg font-bold mb-3 border-b pb-1">Invoices List</h2>
                          <table className="w-full text-left border text-[14px]">
                            <thead>
                              <tr className="bg-gray-100 border-b">
                                <th className="px-2 py-1 border-r">Sl</th>
                                <th className="px-2 py-1 border-r">Date</th>
                                <th className="px-2 py-1 border-r">Customer</th>
                                <th className="px-2 py-1 border-r">Employee</th>
                                <th className="px-2 py-1 border-r">Type</th>
                                <th className="px-2 py-1">Grand Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {summary.invoices.map((inv, idx) => (
                                <tr key={inv.id || idx} className="border-b">
                                  <td className="px-2 py-1 border-r">{idx + 1}</td>
                                  <td className="px-2 py-1 border-r">{inv.invoice_date || inv.sale_date}</td>
                                  <td className="px-2 py-1 border-r">{inv.customer_name || (inv.customer && inv.customer.customer_name) || "N/A"}</td>
                                  <td className="px-2 py-1 border-r">{inv.employee_name || (inv.employee && inv.employee.name) || "N/A"}</td>
                                  <td className="px-2 py-1 border-r capitalize">{inv.sale_type || inv.pay_type || inv.invoice_type || inv.payment_method || "N/A"}</td>
                                  <td className="px-2 py-1">{Number(inv.grand_total || 0).toFixed(2)}/-</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ) : (
                    "Opps! Data not found."
                  )}
                </>
              );
            }
          })()}
        </div>
      </Modal>
    </>
  );
};

export default ModalTable;

//===> Tailwind classes
const prTr = {
  b: "border",
  bc: "border-border_clr",
  px: "px-2",
};

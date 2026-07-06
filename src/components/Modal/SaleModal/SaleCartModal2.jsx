import React, { useRef, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { Button, Modal, Badge, Flex, Radio, Select } from "antd";
import Draggable from "react-draggable";

//=>>>  Icons
import { RxCross2 } from "react-icons/rx";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

//=>>>  Css
import "../CartModal.css";

//=>>>  Components
import SingleDatePicker from "../../DatePicker/SingleDatePicker";

//=>>>  Additional utility
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";
import { DataContext } from "../../../context/DataContext";

const SaleCartModal2 = (props) => {
  const { headers } = useContext(AuthContext);
  const roundPointValue = (value) => {
    const numericValue = parseFloat(value);
    return Number.isNaN(numericValue) ? 0 : Math.round(numericValue);
  };
  const { customerDataContext } = useContext(DataContext);
  const {
    slug,
    ModalOpenBtnTitle,
    className,
    api,
    identifier,
    data,
    data_2,
    setSelectedRows,
    setLoader,
    setRelodeTable,
    handleClearRows,
  } = props;

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

    if (identifier === "orderUpdate") {
      GetSpecificData();
    }
  };
  const handleOk = (e) => {
    setOpen(false);
  };
  const handleCancel = (e) => {
    setOpen(false);
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
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [inputValues, setInputValues] = useState({
    customer_id: "0",
    pay_type: "0",
    offer: "",
  });
  const handleInputValue = (e) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  //=>>>  Quantity, Total, Grand total section
  const [dbPrice, setDbPrice] = useState({});
  const [tpOrFlat, setTpOrFlat] = useState({});
  //=>>> New code start (Click tp or flat change database pricce)
  const [tpOrFlatCount, setTpOrFlatCount] = useState(1);
  //=>>> New code end (Click tp or flat change database pricce)
  const [bonus, setBonus] = useState({});
  const [quantities, setQuantities] = useState({});
  const [totals, setTotals] = useState({});
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    if (Array.isArray(data)) {
      const initialQuantities = {};
      const initialTotals = {};
      const initialDbPrice = {};
      //=>>> New code start (Click tp or flat change database pricce)
      const initialTpOrFlat = {};
      //=>>> New code end (Click tp or flat change database pricce)

      data.forEach((item, index) => {
        //=>>> New code start (Click tp or flat change database pricce)
        initialTpOrFlat[item.id] = tpOrFlat[item.id] || "tp";
        //=>>> New code end (Click tp or flat change database pricce)

        if (!quantities[index]) {
          initialQuantities[index] = 1;
        } else {
          initialQuantities[index] = quantities[index];
        }
        if (!dbPrice[item.id]) {
          // initialDbPrice[item.id] = item.sell_price;
          //=>>> New code start (Click tp or flat change database pricce)
          initialDbPrice[item.id] =
            initialTpOrFlat[item.id] == "tp"
              ? item.sell_price
              : item.flat_price;
          //=>>> New code end (Click tp or flat change database pricce)
        } else {
          // initialDbPrice[item.id] = dbPrice[item.id];
          //=>>> New code start (Click tp or flat change database pricce)
          initialDbPrice[item.id] =
            initialTpOrFlat[item.id] == "tp"
              ? item.sell_price
              : item.flat_price;
          //=>>> New code end (Click tp or flat change database pricce)
        }
        initialTotals[index] =
          initialQuantities[index] * initialDbPrice[item.id];
      });

      setQuantities(initialQuantities);
      setDbPrice(initialDbPrice);
      setTotals(initialTotals);
      setGrandTotal(
        Object.values(initialTotals).reduce((sum, value) => sum + value, 0)
      );
    }

    // Clear all when data is empty
    if (data.length == 0) {
      CancelOrder();
    }
  }, [data, tpOrFlatCount]);

  const handleInc = (index, price) => {
    setQuantities((prev) => {
      const newQuantities = {
        ...prev,
        [index]: (prev[index] || 0) + 1,
      };
      updateTotals(newQuantities, price, index);
      return newQuantities;
    });
  };

  const handleDec = (index, price) => {
    setQuantities((prev) => {
      const newQuantities = {
        ...prev,
        [index]: Math.max((prev[index] || 0) - 1, 0),
      };
      updateTotals(newQuantities, price, index);
      return newQuantities;
    });
  };

  const handleQtyInput = (index, value, price) => {
    const numericValue = roundPointValue(value);
    setQuantities((prev) => {
      const newQuantities = {
        ...prev,
        [index]: numericValue,
      };
      updateTotals(newQuantities, price, index);
      return newQuantities;
    });
  };

  const handleDbPrice = (e, id) => {
    setDbPrice((prev) => ({ ...prev, [id]: e.target.value }));
  };

  const updateTotals = (newQuantities, price, index) => {
    const newTotals = { ...totals };
    newTotals[index] = (newQuantities[index] || 0) * price;

    setTotals(newTotals);
    const total = Object.values(newTotals).reduce(
      (sum, value) => sum + value,
      0
    );
    setGrandTotal(total);
  };

  // Add state variables for discount, less, paid, and due
  const [discount, setDiscount] = useState(0);
  const [less, setLess] = useState(0);
  const [paid, setPaid] = useState(0);
  const [due, setDue] = useState(0);

  // Handle input changes for discount, less, and paid
  const handleDiscountChange = (e) => {
    const value = parseFloat(e.target.value) || "";
    if (value >= 0 && value <= 100) {
      setDiscount(value);
    } else {
      toast.error("Discount should be between 1% to 100%");
    }
  };

  const handleLessChange = (e) => {
    const value = parseFloat(e.target.value) || "";
    if (value >= 0) {
      setLess(value);
    } else {
      toast.error("Less amount should be up to 0");
    }
  };

  const handlePaidChange = (e) => {
    const value = parseFloat(e.target.value) || "";
    if (value >= 0) {
      setPaid(value);
    } else {
      toast.error("Paid amount should be up to 0");
    }
  };

  // Recalculate due whenever grand total, discount, less, or paid changes
  useEffect(() => {
    const totalAfterDiscountAndLess = grandTotal - discount - less;
    setDue(Math.max(totalAfterDiscountAndLess - paid, 0));
  }, [grandTotal, discount, less, paid]);

  const [netTotal, setNetTotal] = useState(grandTotal);

  useEffect(() => {
    const discountAmount = (grandTotal * discount) / 100; // Calculate discount as percentage
    const adjustedTotal = Math.max(grandTotal - discountAmount - less, 0);

    // Custom rounding: x.50 -> x, x.51 -> x + 1
    const customRound = (num) => {
      const fixedNum = Number(num).toFixed(2);
      const [integerPart, decimalPart] = fixedNum.split(".");
      if (parseInt(decimalPart, 10) > 50) {
        return parseInt(integerPart, 10) + 1;
      }
      return parseInt(integerPart, 10);
    };

    setNetTotal(customRound(adjustedTotal));
  }, [grandTotal, discount, less]);

  // Recalculate due whenever netTotal or paid changes
  useEffect(() => {
    setDue(Math.max(netTotal - paid, 0));
  }, [netTotal, paid]);

  useEffect(() => {
    if (Array.isArray(data)) {
      const updatedTotals = {};
      data.forEach((item, index) => {
        const quantity = quantities[index] || 1;
        const price = dbPrice[item.id] || item.sell_price;
        updatedTotals[index] = quantity * price;
      });

      setTotals(updatedTotals);

      const newGrandTotal = Object.values(updatedTotals).reduce(
        (sum, value) => sum + value,
        0
      );
      setGrandTotal(newGrandTotal);
    }
  }, [dbPrice, quantities, data]);

  const CancelOrder = () => {
    if (Array.isArray(data)) {
      const resetQuantities = {};
      const resetTotals = {};
      const resetBonus = {};

      data.forEach((item, index) => {
        resetQuantities[index] = 1;
        resetTotals[index] = item.sell_price;
        resetBonus[item.id] = "";
      });

      setBonus(resetBonus);
      setDiscount(0);
      setPaid(0);
      setLess(0);
      setTotals(resetTotals);
      setGrandTotal(
        Object.values(resetTotals).reduce((sum, value) => sum + value, 0)
      );
    }
    setInputValues({ customer_id: "0", pay_type: "0", offer: "" });
    data.length = 0;
    handleCancel();
    handleClearRows();
    sessionStorage.removeItem("OrderCartModalData");
  };

  const handleRemoveItem = (indexToDelete) => {
    const updatedData = data.filter((_, index) => index !== indexToDelete);

    const updatedQuantities = {};
    const updatedTotals = {};

    updatedData.forEach((item, newIndex) => {
      const oldIndex = newIndex >= indexToDelete ? newIndex + 1 : newIndex;
      updatedQuantities[newIndex] = quantities[oldIndex] || 1;
      updatedTotals[newIndex] = item.sell_price * updatedQuantities[newIndex];
    });

    const newGrandTotal = Object.values(updatedTotals).reduce(
      (sum, value) => sum + value,
      0
    );

    setSelectedRows(updatedData);
    setQuantities(updatedQuantities);
    setTotals(updatedTotals);
    setGrandTotal(newGrandTotal);
  };

  //=>>>  Submit form data
  const SubmitForm = async (e) => {
    e.preventDefault();

    if (inputValues.customer_id <= "0") {
      toast.error("Please select a customer!");
    } else if (date == "YYYY-MM-DD" && date == "") {
      toast.error("Please select a date!");
    } else if (inputValues.pay_type <= "0" || !inputValues.pay_type) {
      toast.error("Please select a payment method!");
    } else {
      const orderData = data.map((item, index) => ({
        product_id: item.id,
        quantity: roundPointValue(quantities[index]),
        bonus_qty: roundPointValue(bonus[item.id]),
        price_type: tpOrFlat[item.id] || "tp",
        unit_price: dbPrice[item.id] || 0,
      }));

      const payload = {
        cust_id: inputValues.customer_id,
        sale_date: date,
        total_item: data.length,
        total_price: grandTotal,
        products: orderData,
        discount: (grandTotal * discount) / 100,
        less: less,
        paid: paid,
        due: due,
        grand_total: netTotal,
        sale_type: inputValues.pay_type,
        offer: inputValues.offer || null,
      };

      setLoader(true);
      await ApiConfig.post(api, payload, { headers })
        .then((response) => {
          if (response.data.status == true) {
            setInputValues({ customer_id: "0", pay_type: "0", offer: "" });
            // setDate("YYYY-MM-DD");
            setLoader(false);
            setRelodeTable((prev) => !prev);
            CancelOrder();
            toast.success(response.data.message);
          } else {
            setLoader(false);
            toast.error(response.data.message);
          }
        })
        .catch((err) => {
          setLoader(false);
          toast.error(err.response.data.message);
        });
    }
  };
  //=>>> My code end

  return (
    <>
      <Badge count={data.length} overflowCount={100}>
        <Button onClick={showModal} className={className}>
          {ModalOpenBtnTitle}
        </Button>
      </Badge>
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
            // fix eslintjsx-a11y/mouse-events-have-key-events
            // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
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
        <div className="cartModalContent">
          <form className="" onSubmit={SubmitForm}>
            {identifier == "invoiceStore" && data.length <= 0 && (
              <h1 className="cartItemCard">
                You have not selected any product
              </h1>
            )}

            {identifier == "invoiceStore" && data.length !== 0 && (
              <div className="select-from-cart-modal">
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select a customer - (employee)"
                  optionFilterProp="children"
                  value={inputValues.customer_id === "0" || inputValues.customer_id === 0 ? undefined : inputValues.customer_id}
                  onChange={(value) => {
                    setInputValues({ ...inputValues, customer_id: value });
                  }}
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                  options={
                    Array.isArray(customerDataContext)
                      ? customerDataContext.map((items) => ({
                          value: items.id,
                          label: `${items.customer_name} - (${items.employee?.name || "N/A"})`,
                        }))
                      : []
                  }
                />
              </div>
            )}

            {Array.isArray(data) &&
              data.map((item, index) => {
                return (
                  <div key={index} className="cartItemCard d-flex">
                    <div className="left">
                      <h1 className="title">
                        {item.name} ({item.pack_size})
                      </h1>
                      <div style={{ width: "50%", marginTop: "7px" }}>
                        <label style={{ margin: "0" }}>Price</label>
                        <div className="inputBox noTopPadd">
                          <input
                            type="number"
                            value={dbPrice[item.id]}
                            onChange={(e) => handleDbPrice(e, item.id)}
                          />
                        </div>
                      </div>
                      <p className="price d-flex">
                        Total: {(totals[index] || 0).toFixed(2)}{" "}
                        <FaBangladeshiTakaSign size={15} />
                      </p>

                      <Flex vertical gap="middle">
                        <Radio.Group
                          onChange={(e) => {
                            setTpOrFlat({
                              ...tpOrFlat,
                              [item.id]: roundPointValue(e.target.value),
                            });
                            //=>>> New code start (Click tp or flat change database pricce)
                            setTpOrFlatCount(tpOrFlatCount + 1);
                            //=>>> New code end (Click tp or flat change database pricce)
                          }}
                          value={tpOrFlat[item.id] || "tp"}
                        >
                          <Radio.Button value="tp">Tp</Radio.Button>
                          <Radio.Button value="flat">Flat</Radio.Button>
                        </Radio.Group>
                      </Flex>

                      <div style={{ width: "50%", marginTop: "10px" }}>
                        <label style={{ margin: "0" }}>Bonus</label>
                        <div className="inputBox noTopPadd">
                          <input
                            type="number"
                            value={bonus[item.id] || ""}
                            onChange={(e) => {
                              setBonus({
                                ...bonus,
                                [item.id]: roundPointValue(e.target.value),
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="right d-flex">
                      <button
                        type="button"
                        className="button"
                        onClick={() => handleInc(index, dbPrice[item.id])}
                      >
                        +
                      </button>
                      <input
                        type="text"
                        className="display"
                        value={quantities[index] || 0}
                        onChange={(e) =>
                          handleQtyInput(
                            index,
                            e.target.value,
                            dbPrice[item.id]
                          )
                        }
                      />
                      <button
                        type="button"
                        className="button"
                        onClick={() => handleDec(index, dbPrice[item.id])}
                      >
                        -
                      </button>
                      <RxCross2
                        className="deleteItemIcon"
                        size={24}
                        onClick={() => handleRemoveItem(index)}
                      />
                    </div>
                  </div>
                );
              })}

            {identifier == "invoiceStore" && data.length !== 0 && (
              <div className="cartTotal d-flex">
                <p className="d-flex">
                  Total: {grandTotal.toFixed(2)}{" "}
                  <FaBangladeshiTakaSign size={18} />
                </p>
              </div>
            )}

            {/* ___ Date Section Start  ___ */}
            {data.length !== 0 && (
              <div className="w-full">
                <label>
                  Selected date: <span className="font-bold">{date}</span>
                </label>
                <br />
                <SingleDatePicker setDate={setDate} />
              </div>
            )}
            {/* ___ Date Section End  ___ */}

            {/* ___ Pay type Section Start  ___ */}
            {identifier == "invoiceStore" && data.length !== 0 && (
              <div className="select-from-cart-modal">
                <label>
                  Payment method<span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  className="select"
                  name="pay_type"
                  value={inputValues.pay_type}
                  onChange={handleInputValue}
                >
                  <option value="0">Select payment method</option>
                  <option value="cash">Cash</option>
                  <option value="credit">Credit</option>
                </select>
              </div>
            )}
            {/* ___ Pay type Section End  ___ */}

            {/* ___ Offer Section Start  ___ */}
            {data.length !== 0 && (
              <div className="select-from-cart-modal">
                <label>Offer</label>
                <div className="inputBox">
                  <input
                    type="text"
                    name="offer"
                    placeholder="Enter offer details..."
                    value={inputValues.offer}
                    onChange={handleInputValue}
                  />
                </div>
              </div>
            )}
            {/* ___ Offer Section End  ___ */}

            {data.length !== 0 && (
              <>
                <div className="cartSummaryInputs">
                  <div style={{ width: "100%" }}>
                    <label>Discount (%)</label>
                    <div className="inputBox">
                      <input
                        type="number"
                        value={discount}
                        onChange={handleDiscountChange}
                        placeholder="Discount percentage"
                      />
                    </div>
                  </div>

                  <div style={{ width: "100%" }}>
                    <label>Less:</label>
                    <div className="inputBox">
                      <input
                        type="number"
                        value={less}
                        onChange={handleLessChange}
                        placeholder="Less amount"
                      />
                    </div>
                  </div>

                  <div style={{ width: "100%" }}>
                    <label>Paid:</label>
                    <div className="inputBox">
                      <input
                        type="number"
                        value={paid}
                        onChange={handlePaidChange}
                        placeholder="Paid amount"
                      />
                    </div>
                  </div>

                  <div className="cartTotal d-flex">
                    <p className="d-flex">
                      Grand Total: {netTotal}{" "}
                      <FaBangladeshiTakaSign size={18} />
                    </p>
                    <p className="d-flex">
                      Due: {due} <FaBangladeshiTakaSign size={18} />
                    </p>
                  </div>
                </div>
              </>
            )}

            {identifier == "invoiceStore" && data.length !== 0 && (
              <div
                className="d-flex"
                style={{
                  justifyContent: "space-around",
                  marginTop: "30px",
                }}
              >
                <button
                  type="button"
                  className="cancelOrder button"
                  onClick={CancelOrder}
                >
                  Cancel
                </button>
                <button type="submit" className="confirm button">
                  Confirm
                </button>
              </div>
            )}
          </form>
        </div>
      </Modal>
    </>
  );
};

export default SaleCartModal2;

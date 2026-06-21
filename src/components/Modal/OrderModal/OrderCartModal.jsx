import React, { useRef, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { Badge, Button, Modal, Flex, Radio, Select } from "antd";
import Draggable from "react-draggable";
//=>>> Icons
import { RxCross2 } from "react-icons/rx";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

//=>>> Css
import "../CartModal.css";

//=>>> Additional utility
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";
import { DataContext } from "../../../context/DataContext";
import SingleDatePicker from "../../DatePicker/SingleDatePicker";

const OrderCartModal = (props) => {
  const { headers } = useContext(AuthContext);
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

  //=>>>  Modal config start
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
  //=>>>  Modal config end

  //=>>>  My code start
  const [inputValues, setInputValues] = useState({
    customer_id: "0",
    pay_type: "0",
  });
  const handleInputValue = (e) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  //=>>> Quantity, Total, Grand total section
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [quantities, setQuantities] = useState({});
  const [bonus, setBonus] = useState({});
  const [tpOrFlat, setTpOrFlat] = useState({});
  const [dbPrice, setDbPrice] = useState({});
  const [totals, setTotals] = useState({});
  const [total, setTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [tpOrFlatCount, setTpOrFlatCount] = useState(1);

  useEffect(() => {
    if (Array.isArray(data)) {
      const initialQuantities = {};
      const initialTotals = {};
      const initialDbPrice = {};
      const initialTpOrFlat = {};

      data.forEach((item, index) => {
        initialQuantities[index] = quantities[index] || 1;
        initialTotals[index] = item.sell_price * (quantities[index] || 1);
        initialTpOrFlat[item.id] = tpOrFlat[item.id] || "tp";
        // initialDbPrice[item.id] = dbPrice[item.id] || item.sell_price;
        initialDbPrice[item.id] =
          initialTpOrFlat[item.id] == "tp" ? item.sell_price : item.flat_price;
      });

      setQuantities(initialQuantities);
      setDbPrice(initialDbPrice);
      setTpOrFlat(initialTpOrFlat);
      setTotals(initialTotals);
      setTotal(
        Object.values(initialTotals).reduce((sum, value) => sum + value, 0)
      );
    }

    // Clear all when data is empty
    if (data.length == 0) {
      CancelOrder();
    }
  }, [data.length]); // Only trigger when data length changes

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
    // Validate input value
    const numericValue = parseInt(value, 10);
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
    // console.log(id + " = " + e.target.value);
  };

  const updateTotals = (newQuantities, price, index) => {
    const newTotals = { ...totals };
    newTotals[index] = (newQuantities[index] || 0) * price;

    setTotals(newTotals);
    const total = Object.values(newTotals).reduce(
      (sum, value) => sum + value,
      0
    );
    setTotal(total);
  };

  useEffect(() => {
    // Update Total whenever dbPrice or quantities changes
    const newTotals = {};
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        const price = dbPrice[item.id]
          ? parseFloat(dbPrice[item.id])
          : item.sell_price;
        const quantity = quantities[index] || 0;
        newTotals[index] = price * quantity;
      });
    }

    setTotals(newTotals);

    const total = Object.values(newTotals).reduce(
      (sum, value) => sum + value,
      0
    );
    setTotal(total);
  }, [dbPrice, quantities, data]);

  const [discount, setDiscount] = useState(0);
  const handleDiscountChange = (e) => {
    const value = parseFloat(e.target.value) || "";
    if (value >= 0 && value <= 100) {
      setDiscount(value);
    } else {
      toast.error("Discount should be between 1% to 100%");
    }
  };
  useEffect(() => {
    const grand_Total =
      discount == 0 ? total : total - total * (discount / 100);
    setGrandTotal(grand_Total);
  }, [discount, quantities, total]);

  const CancelOrder = () => {
    if (Array.isArray(data)) {
      const resetQuantities = {};
      const resetTotals = {};
      const resetBonus = {};
      const resetTpOrFlat = {};

      data.forEach((item, index) => {
        resetQuantities[index] = 1;
        resetTotals[index] = item.sell_price;
        resetBonus[index] = "";
        resetTpOrFlat[item.id] = "tp";
      });

      setQuantities(resetQuantities);
      setTotals(resetTotals);
      setBonus(resetBonus);
      setTpOrFlat(resetTpOrFlat);
      setTotal(
        Object.values(resetTotals).reduce((sum, value) => sum + value, 0)
      );
    }
    setInputValues({ customer_id: "0" });
    data.length = 0;
    handleCancel();
    handleClearRows();
    sessionStorage.removeItem("OrderCartModalData");
  };

  const handleRemoveItem = (indexToDelete) => {
    // Filter out the item at the specified index
    const updatedData = data.filter((_, index) => index !== indexToDelete);

    // Rebuild quantities and totals based on the updated data
    const updatedQuantities = {};
    const updatedTotals = {};

    updatedData.forEach((item, newIndex) => {
      // Preserve quantities from the previous state; reset to 1 if not found
      const oldIndex = newIndex >= indexToDelete ? newIndex + 1 : newIndex;
      updatedQuantities[newIndex] = quantities[oldIndex] || 1;
      updatedTotals[newIndex] = item.sell_price * updatedQuantities[newIndex];
    });

    // Calculate new grand total
    const newTotal = Object.values(updatedTotals).reduce(
      (sum, value) => sum + value,
      0
    );

    // Update state
    setSelectedRows(updatedData);
    setQuantities(updatedQuantities);
    setTotals(updatedTotals);
    setTotal(newTotal);
  };

  //=>>> Submit form data
  const SubmitForm = async (e) => {
    e.preventDefault();

    if (inputValues.customer_id <= "0") {
      toast.error("Please select a customer");
    } else if (date == "YYYY-MM-DD" && date == "") {
      toast.error("Please select a date!");
    } else if (inputValues.pay_type <= "0" || !inputValues.pay_type) {
      toast.error("Please select a payment method!");
    } else {
      const orderData = data.map((item, index) => ({
        product_id: item.id,
        quantity: quantities[index] || 0,
        bonus_qty: bonus[item.id] || 0,
        price_type: tpOrFlat[item.id] || "tp",
        unit_price: dbPrice[item.id] || 0,
      }));

      const payload = {
        cust_id: inputValues.customer_id,
        products: orderData,
        order_date: date,
        discount: discount,
        order_type: inputValues.pay_type,
      };

      setLoader(true);
      await ApiConfig.post(api, payload, { headers })
        .then((response) => {
          if (response.data.status == true) {
            setLoader(false);
            setInputValues({ customer_id: 0, pay_type: "0" });
            setDiscount(0);
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
  //=>>>  My code end

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
            {identifier == "orderStore" && data.length <= 0 && (
              <h1 className="cartItemCard">
                You have not selected any product
              </h1>
            )}

            {identifier == "orderStore" && data.length !== 0 && (
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
                // console.log("**Db Price**");
                // console.log(dbPrice[item.id]);

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
                      {/* <p>Price: {item.sell_price}</p> */}
                      <p className="price d-flex">
                        Total: {(totals[index] || 0).toFixed(2)}{" "}
                        <FaBangladeshiTakaSign size={15} />
                      </p>
                      <Flex vertical gap="middle">
                        <Radio.Group
                          onChange={(e) => {
                            // Update the TP/Flat selection
                            setTpOrFlat({
                              ...tpOrFlat,
                              [item.id]: e.target.value,
                            });
                            
                            // Immediately update the price for this specific item based on selection
                            const newPrice = e.target.value === "tp" ? item.sell_price : item.flat_price;
                            setDbPrice((prev) => ({
                              ...prev,
                              [item.id]: newPrice,
                            }));
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
                                [item.id]: e.target.value,
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

            {identifier == "orderStore" && data.length !== 0 && (
              <div className="cartTotal d-flex">
                <p className="d-flex">
                  Total: {total.toFixed(2)} <FaBangladeshiTakaSign size={18} />
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
            {data.length !== 0 && (
              <div className="select-from-cart-modal">
                <label>
                  Payment method <span className="text-red-500 ml-1">*</span>
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

            {data.length !== 0 && (
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

                <div className="cartTotal d-flex">
                  <p className="d-flex">
                    Grand Total: {grandTotal.toFixed(2)}{" "}
                    <FaBangladeshiTakaSign size={18} />
                  </p>
                </div>
              </div>
            )}

            {identifier == "orderStore" && data.length !== 0 && (
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

export default OrderCartModal;

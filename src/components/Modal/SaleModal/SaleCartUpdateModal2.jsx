import React, { useRef, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { Tooltip } from "@mui/material";
import { Button, Modal, Flex, Radio } from "antd";
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

const SaleCartUpdateModal2 = (props) => {
  const { headers } = useContext(AuthContext);
  const { customerDataContext } = useContext(DataContext);
  const {
    id,
    slug,
    ModalOpenBtnTitle,
    className,
    api,
    getSpecificDataApi,
    identifier,
    // data_2,
    setRelodeTable,
    setLoader,
    toolTip,
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

    if (identifier === "invoiceUpdate") {
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
  const [date, setDate] = useState();

  const [tpOrFlat, setTpOrFlat] = useState({});
  const [bonus, setBonus] = useState({});
  const [dbPrice, setDbPrice] = useState({});
  const [quantities, setQuantities] = useState({});
  const [dueQuantity, setDueQuantity] = useState({});
  const [totals, setTotals] = useState({});
  const [grandTotal, setGrandTotal] = useState(0);
  const [inputValues, setInputValues] = useState({
    customer_id: "0",
    customer_name: "",
    pay_type: "0",
  });
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountAmountState, setDiscountAmountState] = useState(0);
  const [less, setLess] = useState(0);
  const [paid, setPaid] = useState(0);
  const [due, setDue] = useState(0);
  const [totalPriceBeforeAdjustments, setTotalPriceBeforeAdjustments] =
    useState(0);

  const [data, setData] = useState([]);
  const GetSpecificData = async () => {
    setLoader(true);
    try {
      const response = await ApiConfig.get(`${getSpecificDataApi}/${id}`, {
        headers,
      });
      if (response.data.status) {
        const products = response.data.data.products;
        // let fatchedDate = new Date(response.data.data.sale_date);
        // setDate(fatchedDate.toISOString().split("T")[0]);
        setDate(response.data.data.sale_date);
        setData(products);
        setInputValues({
          customer_id: response.data.data.customer.id,
          customer_name: response.data.data.customer.name,
          pay_type: response.data.data.sale_type,
        });
        setLess(response.data.data.less);
        setPaid(response.data.data.paid);
        setDiscountPercentage(
          (response.data.data.discount * 100) / response.data.data.total_price
        );

        const initialQuantities = {};
        const initialTotals = {};
        const initialDueQuantity = {};
        const initialTpOrFlat = {};
        const initialBonus = {};
        const initialDbPrice = {};
        products.forEach((item) => {
          initialQuantities[item.product.id] = item.quantity || 1;
          initialTotals[item.product.id] =
            (item.quantity || 1) * item.unit_price;
          initialDueQuantity[item.product.id] = item.due_quantity;
          initialTpOrFlat[item.product.id] = item.price_type;
          initialBonus[item.product.id] = item.bonus_qty;
          initialDbPrice[item.product.id] = item.unit_price;
        });

        setTpOrFlat(initialTpOrFlat);
        setBonus(initialBonus);
        setDbPrice(initialDbPrice);
        setQuantities(initialQuantities);
        setDueQuantity(initialDueQuantity);
        setTotals(initialTotals);
        setGrandTotal(
          Object.values(initialTotals).reduce((sum, val) => sum + val, 0)
        );

        setTotalPriceBeforeAdjustments(
          Object.values(initialTotals).reduce((sum, val) => sum + val, 0)
        );
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error(`Error fetching data: ${error}`);
    } finally {
      setLoader(false);
    }
  };

  const handleInputValue = (e) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
    // console.log([e.target.name] + " = " + e.target.value);
  };
  const handleDuQeuantity = (e, productId) => {
    setDueQuantity({ ...dueQuantity, [productId]: e.target.value });
  };

  const handleInc = (productId) => {
    setQuantities((prev) => {
      const newQuantities = {
        ...prev,
        [productId]: (prev[productId] || 1) + 1,
      };
      updateTotals(newQuantities);
      return newQuantities;
    });
  };

  const handleDec = (productId) => {
    setQuantities((prev) => {
      const newQuantities = {
        ...prev,
        [productId]: Math.max((prev[productId] || 1) - 1, 1), // Minimum quantity is 1
      };
      updateTotals(newQuantities);
      return newQuantities;
    });
  };

  const handleQtyInput = (id, value, price) => {
    // Validate input value
    const numericValue = parseInt(value, 10);
    setQuantities((prev) => {
      const newQuantities = {
        ...prev,
        [id]: numericValue,
      };
      updateTotals(newQuantities, price, id);
      return newQuantities;
    });
  };

  const updateTotals = (newQuantities) => {
    const newTotals = {};
    data.forEach((item) => {
      newTotals[item.product.id] =
        (newQuantities[item.product.id] || 1) * item.product.sell_price; // Ensure valid quantity
    });
    setTotals(newTotals);
    setGrandTotal(Object.values(newTotals).reduce((sum, val) => sum + val, 0));
    setTotalPriceBeforeAdjustments(
      Object.values(newTotals).reduce((sum, val) => sum + val, 0)
    );
  };

  const handleDiscountChange = (e) => {
    const percentage = parseFloat(e.target.value) || "";
    if (percentage >= 0 && percentage <= 100) {
      setDiscountPercentage(percentage);
      updateGrandTotal(percentage, less, paid);
    } else {
      toast.error("Discount should be between 1% to 100%");
    }
  };

  const handleLessChange = (e) => {
    const value = parseFloat(e.target.value) || "";
    if (value >= 0) {
      setLess(value);
      updateGrandTotal(discountPercentage, value, paid);
    } else {
      toast.error("Less amount should be up to 0");
    }
  };

  const handlePaidChange = (e) => {
    const value = parseFloat(e.target.value) || "";
    if (value >= 0) {
      setPaid(value);
      updateGrandTotal(discountPercentage, less, value);
    } else {
      toast.error("Paid amount should be up to 0");
    }
  };

  const updateGrandTotal = (discount, less, paid) => {
    const total = Object.values(totals).reduce((sum, val) => sum + val, 0);
    const discountAmount = (total * discount) / 100;
    const newGrandTotal = total - discountAmount - less;
    setGrandTotal(newGrandTotal);
    setDue(newGrandTotal - paid);
    setDiscountAmountState(discountAmount);
  };

  const handleRemoveItem = (productId) => {
    // Remove the item from data
    setData((prev) => prev.filter((item) => item.product.id !== productId));

    // Remove the product's quantity and total without resetting others
    setQuantities((prev) => {
      const { [productId]: _, ...rest } = prev; // Exclude the removed product
      return rest;
    });

    setTotals((prev) => {
      const { [productId]: _, ...rest } = prev; // Exclude the removed total
      setGrandTotal(Object.values(rest).reduce((sum, val) => sum + val, 0)); // Update grand total
      setTotalPriceBeforeAdjustments(
        Object.values(rest).reduce((sum, val) => sum + val, 0)
      );
      return rest;
    });
  };

  useEffect(() => {
    // Update totals and related states when dbPrice changes
    const newTotals = {};
    data.forEach((item) => {
      const productId = item.product.id;
      const quantity = quantities[productId] || 1;
      const price = dbPrice[productId] || 0;
      newTotals[productId] = quantity * price;
    });

    const newGrandTotal = Object.values(newTotals).reduce(
      (sum, val) => sum + val,
      0
    );
    const discountAmount = (newGrandTotal * discountPercentage) / 100;
    const adjustedTotal = newGrandTotal - discountAmount - less;

    setTotals(newTotals);
    setTotalPriceBeforeAdjustments(newGrandTotal);
    setGrandTotal(adjustedTotal);
    setDue(adjustedTotal - paid);
  }, [dbPrice, quantities, discountPercentage, less, paid, data]);

  const CancelOrder = () => {
    setQuantities({});
    setDueQuantity({});
    setTotals({});
    setGrandTotal(0);
    setDiscountPercentage(0);
    setLess(0);
    setPaid(0);
    setDue(0);
    setInputValues({ customer_id: "0", customer_name: "", pay_type: "0" });
    setData([]);
    handleCancel();
  };

  const SubmitForm = async (e) => {
    e.preventDefault();
    if (date == "") {
      toast.error("Please select a date!");
    } else if (inputValues.pay_type <= "0" || !inputValues.pay_type) {
      toast.error("Please select a payment method!");
    } else {
      const orderData = data.map((item) => ({
        product_id: item.product.id,
        quantity: quantities[item.product.id] || 0,
        unit_price: dbPrice[item.product.id] || 0,
        due_quantity: dueQuantity[item.product.id] || 0,
        bonus_qty: bonus[item.product.id] || 0,
        price_type: tpOrFlat[item.product.id] || "tp",
      }));
      // console.log("___Order data___");
      // console.log(orderData);

      const payload = {
        cust_id: inputValues.customer_id,
        sale_date: date,
        total_item: data.length,
        total_price: totalPriceBeforeAdjustments,
        products: orderData,
        discount: discountAmountState,
        less: less,
        paid: paid,
        due: due,
        grand_total: grandTotal,
        sale_type: inputValues.pay_type,
      };
      // console.log(payload);

      setLoader(true);
      await ApiConfig.post(api, payload, { headers })
        .then((response) => {
          if (response.data.status === true) {
            setRelodeTable((prev) => !prev);
            setLoader(false);
            CancelOrder();
            console.clear();
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
      <Tooltip title={toolTip} placement="bottom">
        <Button onClick={showModal} className={className}>
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
          <form onSubmit={SubmitForm}>
            <div className="select-from-cart-modal">
              <select
                className="select"
                name="customer_id"
                value={inputValues.customer_id}
                onChange={handleInputValue}
              >
                <option value="0" disabled>
                  Select a customer
                </option>
                {Array.isArray(customerDataContext) &&
                  customerDataContext.map((items, index) => (
                    <option value={items.id} key={index}>
                      {items.customer_name}
                    </option>
                  ))}
              </select>
            </div>

            {data.map((item) => {
              return (
                <div key={item.product.id} className="cartItemCard d-flex">
                  <div className="left">
                    <h1 className="title">
                      {item.product.name} ({item.product.pack_size})
                    </h1>
                    <div style={{ width: "50%", marginTop: "7px" }}>
                      <label style={{ margin: "0" }}>Price</label>
                      <div className="inputBox noTopPadd">
                        <input
                          type="number"
                          value={dbPrice[item.product.id] || ""}
                          onChange={(e) => {
                            const newPrice = parseFloat(e.target.value) || 0;
                            setDbPrice((prev) => ({
                              ...prev,
                              [item.product.id]: newPrice,
                            }));
                          }}
                        />
                      </div>
                    </div>
                    <p className="price d-flex">
                      Total: {(totals[item.product.id] || 0).toFixed(2)}
                      <FaBangladeshiTakaSign size={15} />
                    </p>

                    <Flex vertical gap="middle">
                      <Radio.Group
                        onChange={(e) => {
                          setTpOrFlat({
                            ...tpOrFlat,
                            [item.product.id]: e.target.value,
                          });
                        }}
                        defaultValue={tpOrFlat[item.product.id]}
                        disabled
                      >
                        <Radio.Button value="tp">Tp</Radio.Button>
                        <Radio.Button value="flat">Flat</Radio.Button>
                      </Radio.Group>
                    </Flex>

                    <div style={{ width: "50%", marginTop: "10px" }}>
                      <label style={{ margin: "0" }}>Due quantity</label>
                      <div className="inputBox noTopPadd">
                        <input
                          type="number"
                          value={dueQuantity[item.product.id]}
                          onChange={(e) =>
                            handleDuQeuantity(e, item.product.id)
                          }
                        />
                      </div>
                    </div>
                    <div style={{ width: "50%", marginTop: "10px" }}>
                      <label style={{ margin: "0" }}>Bonus</label>
                      <div className="inputBox noTopPadd">
                        <input
                          type="number"
                          value={bonus[item.product.id] || ""}
                          onChange={(e) => {
                            setBonus({
                              ...bonus,
                              [item.product.id]: e.target.value,
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
                      onClick={() => handleInc(item.product.id)}
                    >
                      +
                    </button>
                    <input
                      type="text"
                      className="display"
                      value={quantities[item.product.id] || 0}
                      onChange={(e) =>
                        handleQtyInput(
                          item.product.id,
                          e.target.value
                          // dbPrice[item.product.id]
                        )
                      }
                    />
                    <button
                      type="button"
                      className="button"
                      onClick={() => handleDec(item.product.id)}
                    >
                      -
                    </button>
                    <RxCross2
                      size={20}
                      color="red"
                      className="c-pointer"
                      onClick={() => handleRemoveItem(item.product.id)}
                    />
                  </div>
                </div>
              );
            })}

            <div className="summary">
              <div className="cartTotal d-flex">
                <p className="d-flex">
                  Total: {totalPriceBeforeAdjustments.toFixed(2)}
                  <FaBangladeshiTakaSign size={18} />
                </p>
              </div>

              {/* ___ Date Section Start  ___ */}
              <div className="w-full">
                <label>
                  <label>
                    Selected date: <span className="font-bold">{date}</span>
                  </label>
                </label>
                <br />
                <SingleDatePicker setDate={setDate} />
              </div>
              {/* ___ Date Section End  ___ */}

              {/* ___ Pay type Section Start  ___ */}
              {data.length !== 0 && (
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

              <div style={{ width: "100%" }}>
                <label>Discount (%)</label>
                <div className="inputBox">
                  <input
                    type="number"
                    value={discountPercentage}
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
                    placeholder="Less Amount"
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
                    placeholder="Paid Amount"
                  />
                </div>
              </div>
              <div className="cartTotal d-flex">
                <p className="d-flex">
                  Grand Total: {grandTotal.toFixed(2)}
                  <FaBangladeshiTakaSign size={18} />
                </p>
                <p className="d-flex">
                  Due: {due.toFixed(2)}
                  <FaBangladeshiTakaSign size={18} />
                </p>
              </div>
            </div>

            <div
              className="d-flex"
              style={{ justifyContent: "space-around", marginTop: "30px" }}
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
          </form>
        </div>
      </Modal>
    </>
  );
};

export default SaleCartUpdateModal2;

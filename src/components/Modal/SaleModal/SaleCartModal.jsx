import React, { useRef, useState, useContext } from "react";
import { toast } from "react-toastify";
import { Tooltip } from "@mui/material";
import { Button, Modal, Flex, Radio } from "antd";
import Draggable from "react-draggable";

//=>>> Icons
import { FaBangladeshiTakaSign } from "react-icons/fa6";

//=>>> Css
import "../CartModal.css";

//=>>> Additional utility
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";
import SingleDatePicker from "../../DatePicker/SingleDatePicker";

const SaleCartUpdateModal = (props) => {
  const { headers } = useContext(AuthContext);
  const {
    id,
    slug,
    ModalOpenBtnTitle,
    className,
    api,
    getSpecificDataApi,
    identifier,
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
  const [date, setDate] = useState();
  const [tpOrFlat, setTpOrFlat] = useState({});
  const [bonus, setBonus] = useState({});
  const [quantities, setQuantities] = useState({});
  const [totals, setTotals] = useState({});
  const [grandTotal, setGrandTotal] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [less, setLess] = useState(0);
  const [paid, setPaid] = useState(0);
  const [due, setDue] = useState(0);
  const [inputValues, setInputValues] = useState({
    customer_id: "0",
    customer_name: "",
    sale_date: "",
    pay_type: "0",
  });
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
        const products = response.data.data.order_products;
        // let fatchedDate = new Date(response.data.data.order_date);
        // setDate(fatchedDate.toISOString().split("T")[0]);
        setDate(response.data.data.order_date);
        setData(products);
        setInputValues({
          customer_id: response.data.data.customer.id,
          customer_name: response.data.data.customer.customer_name,
          pay_type: response.data.data.order_type,
        });

        const initialQuantities = {};
        const initialTotals = {};
        const initialTpOrFlat = {};
        const initialBonus = {};
        products.forEach((item, index) => {
          initialQuantities[index] = item.quantity || 1;
          initialTotals[index] = (item.quantity || 1) * item.unit_price;
          initialTpOrFlat[item.id] = item.price_type;
          initialBonus[item.id] = item.bonus_qty;
        });

        setQuantities(initialQuantities);
        setTotals(initialTotals);
        setTpOrFlat(initialTpOrFlat);
        setBonus(initialBonus);

        // Calculate totalPriceBeforeAdjustments
        const totalPrice = Object.values(initialTotals).reduce(
          (sum, val) => sum + val,
          0
        );
        setTotalPriceBeforeAdjustments(totalPrice); // Set static total
        // setGrandTotal(totalPrice);
        const discountFromApi = response.data.data.discount || 0;
        setDiscountPercentage(discountFromApi);

        const discountAmount = (totalPrice * discountFromApi) / 100;
        setDiscount(discountAmount);

        const newGrandTotal = totalPrice - discountAmount - less;
        setGrandTotal(newGrandTotal);
        setDue(newGrandTotal - paid);
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
  };

  const handleDiscountChange = (e) => {
    const percentage = parseFloat(e.target.value) || "";
    if (percentage >= 0 && percentage <= 100) {
      setDiscountPercentage(percentage);

      const total = Object.values(totals).reduce((sum, val) => sum + val, 0);
      const discountAmount = (total * percentage) / 100;
      setDiscount(discountAmount);
      updateGrandTotal(discountAmount, less, paid);
    } else {
      toast.error("Discount should be between 1% to 100%");
    }
  };

  const handleLessChange = (e) => {
    const value = parseFloat(e.target.value) || "";
    if (value >= 0) {
      setLess(value);
      updateGrandTotal(discount, value, paid);
    } else {
      toast.error("Less amount should be up to 0");
    }
  };

  const handlePaidChange = (e) => {
    const value = parseFloat(e.target.value) || "";
    if (value >= 0) {
      setPaid(value);
      updateGrandTotal(discount, less, value);
    } else {
      toast.error("Paid amount should be up to 0");
    }
  };

  const handleInc = (index) => {
    // if (quantities[index] < data[index].product.quantity) {
    // } else {
    //   toast.error("You don't have sufficient products in your stock");
    // }
    setQuantities((prev) => {
      const newQuantities = { ...prev, [index]: (prev[index] || 0) + 1 };
      updateTotals(newQuantities);

      // Update totalPriceBeforeAdjustments only here
      const updatedTotalPrice = Object.keys(newQuantities).reduce(
        (sum, i) => sum + newQuantities[i] * data[i].product.sell_price,
        0
      );
      setTotalPriceBeforeAdjustments(updatedTotalPrice);

      return newQuantities;
    });
  };

  const handleDec = (index) => {
    setQuantities((prev) => {
      const newQuantities = {
        ...prev,
        [index]: Math.max((prev[index] || 0) - 1, 0),
      };
      updateTotals(newQuantities);

      // Update totalPriceBeforeAdjustments only here
      const updatedTotalPrice = Object.keys(newQuantities).reduce(
        (sum, i) => sum + newQuantities[i] * data[i].product.sell_price,
        0
      );
      setTotalPriceBeforeAdjustments(updatedTotalPrice);

      return newQuantities;
    });
  };

  const updateTotals = (newQuantities) => {
    const newTotals = {};
    data.forEach((item, index) => {
      newTotals[index] = (newQuantities[index] || 0) * item.product.sell_price;
    });
    setTotals(newTotals);

    const total = Object.values(newTotals).reduce((sum, val) => sum + val, 0);
    const discountAmount = (total * discountPercentage) / 100;
    setDiscount(discountAmount);
    setGrandTotal(total - discountAmount - less);
    setDue(total - discountAmount - less - paid);
  };

  const updateGrandTotal = (discount, less, paid) => {
    const total = Object.values(totals).reduce((sum, val) => sum + val, 0);
    const newGrandTotal = total - discount - less;
    setGrandTotal(newGrandTotal);
    setDue(newGrandTotal - paid);
  };

  const CancelOrder = () => {
    setQuantities({});
    setTotals({});
    setGrandTotal(0);
    setDiscountPercentage(0);
    setDiscount(0);
    setLess(0);
    setPaid(0);
    setDue(0);
    setInputValues({ customer_id: "0", customer_name: "" });
    setData([]);
    handleCancel();
  };

  const SubmitForm = async (e) => {
    e.preventDefault();
    if (date == null) {
      toast.error("Please select a date!");
    } else if (inputValues.pay_type <= "0" || !inputValues.pay_type) {
      toast.error("Please select a payment method!");
    } else {
      const orderData = data.map((item, index) => ({
        product_id: item.product.id,
        quantity: quantities[index] || 0,
        unit_price: item.unit_price,
        bonus_qty: item.bonus_qty,
        price_type: item.price_type,
      }));

      const payload = {
        cust_id: inputValues.customer_id,
        sale_date: date,
        total_item: data.length,
        total_price: totalPriceBeforeAdjustments,
        products: orderData,
        discount: discount,
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
  //=>>> My code start

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
                disabled
                // onChange={handleInputValue}
              >
                <option value={inputValues.customer_id}>
                  {inputValues.customer_name}
                </option>
              </select>
            </div>

            {data.map((item, index) => (
              <div key={index} className="cartItemCard d-flex">
                <div className="left">
                  <h1 className="title">
                    {item.product.name} ({item.product.pack_size})
                  </h1>
                  <div style={{ width: "50%", marginTop: "7px" }}>
                    <label style={{ margin: "0" }}>Price</label>
                    <div className="inputBox noTopPadd">
                      <input
                        type="number"
                        value={item.unit_price}
                        disabled
                        // onChange={(e) => handleDbPrice(e, item.id)}
                      />
                    </div>
                  </div>

                  {/* <p>Price: {item.unit_price}</p> */}
                  <p className="price d-flex">
                    Total: {(totals[index] || 0).toFixed(2)}
                    <FaBangladeshiTakaSign size={15} />
                  </p>

                  <Flex vertical gap="middle">
                    <Radio.Group
                      onChange={(e) => {
                        setTpOrFlat({
                          ...tpOrFlat,
                          [item.id]: e.target.value,
                        });
                      }}
                      defaultValue={tpOrFlat[item.id]}
                      disabled
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
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="right d-flex">
                  <button
                    type="button"
                    className="button"
                    disabled
                    onClick={() => handleInc(index)}
                  >
                    +
                  </button>
                  <input
                    type="text"
                    className="display"
                    value={quantities[index] || 0}
                    onChange={() => {
                      return;
                    }}
                    disabled
                  />
                  <button
                    type="button"
                    className="button"
                    disabled
                    onClick={() => handleDec(index)}
                  >
                    -
                  </button>
                </div>
              </div>
            ))}

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
                  Selected date: <span className="font-bold">{date}</span>
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

export default SaleCartUpdateModal;

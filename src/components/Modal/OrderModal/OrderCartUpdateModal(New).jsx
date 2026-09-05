import React, { useRef, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { Tooltip } from "@mui/material";
import { Button, Modal, Flex, Radio } from "antd";
import Draggable from "react-draggable";
import SidePanel from "../../Drawer/ProductsDrawer";

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

const OrderCartUpdateModal = (props) => {
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

    if (identifier === "orderUpdate") {
      GetSpecificData();
    }
  };
  const handleOk = (e) => {
    setOpen(false);
  };
  const handleCancel = (e) => {
    if (
      confirm("If you close this menu you will loss your customized datas") ==
      true
    )
      setOpen(false);
    ClearAllStates();
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
  const [bonus, setBonus] = useState({});
  const [tpOrFlat, setTpOrFlat] = useState({});
  const [dbPrice, setDbPrice] = useState({});
  const [quantities, setQuantities] = useState({});
  const [totals, setTotals] = useState({});
  const [total, setTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [inputValues, setInputValues] = useState({
    customer_id: "0",
    customer_name: "",
    pay_type: "0",
  });

  const [data, setData] = useState([]);
  useEffect(() => {
    setData(JSON.parse(sessionStorage.getItem("OrdersApi/AddedData")) || []);
  });

  //=>>> New code start (Click tp or flat change database pricce)
  // const [paramForDbpriceToggleOnTpFlat, setParamForDbpriceToggleOnTpFlat] =
  //   useState({});
  // const [valueForDbpriceToggleOnTpFlat, setValueForDbpriceToggleOnTpFlat] =
  //   useState({});
  // const [tpOrFlatCounter, setTpOrFlatCounter] = useState(1);
  //=>>> New code end (Click tp or flat change database pricce)

  const GetSpecificData = async () => {
    setLoader(true);
    try {
      const response = await ApiConfig.get(`${getSpecificDataApi}/${id}`, {
        headers,
      });
      if (response.data.status) {
        const products = response.data.data.order_products;
        // setData(products);
        sessionStorage.setItem("OrdersApi/AddedData", JSON.stringify(products));
        setDate(response.data.data.order_date);
        setInputValues({
          customer_id: response.data.data.customer.id,
          customer_name: response.data.data.customer.name,
          pay_type: response.data.data.order_type,
        });
        setDiscount(response.data.data.discount);

        const initialQuantities = {};
        const initialTotals = {};
        const initialDbPrice = {};
        const initialBonus = {};
        const initialTpOrFlat = {};
        //=>>> New code start (Click tp or flat change database pricce)
        // const initialParamForDbpriceToggleOnTpFlat = {};
        //=>>> New code end (Click tp or flat change database pricce)
        products.forEach((item) => {
          initialQuantities[item.product?.id ?? item.id] = item.quantity || 1;
          initialTotals[item.product?.id ?? item.id] =
            (item.quantity || 1) * item.unit_price;
          initialBonus[item.id] = item.bonus_qty;
          initialTpOrFlat[item.id] = item.price_type;
          initialDbPrice[item.id] = item.unit_price;
          //=>>> New code start (Click tp or flat change database pricce)
          // initialParamForDbpriceToggleOnTpFlat[item.id] = {
          //   product_id: item.id,
          //   price_type: initialTpOrFlat[item.id],
          //   unit_price: item.unit_price,
          //   flat_price: item.product.flat_price,
          // };
          // initialDbPrice[item.id] = valueForDbpriceToggleOnTpFlat[item.id];
          //=>>> New code end (Click tp or flat change database pricce)
        });

        setQuantities(initialQuantities);
        setDbPrice(initialDbPrice);
        setBonus(initialBonus);
        setTpOrFlat(initialTpOrFlat);
        setTotals(initialTotals);
        setTotal(
          Object.values(initialTotals).reduce((sum, val) => sum + val, 0)
        );
        //=>>> New code start (Click tp or flat change database pricce)
        // setParamForDbpriceToggleOnTpFlat(initialParamForDbpriceToggleOnTpFlat);
        //=>>> New code end (Click tp or flat change database pricce)
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error(`Error fetching data: ${error}`);
    } finally {
      setLoader(false);
    }
  };

  //=>>> New code start (Click tp or flat change database pricce)
  // useEffect(() => {
  //   const newValues = {};

  //   Object.values(paramForDbpriceToggleOnTpFlat).forEach((item) => {
  //     if (tpOrFlat[item.product_id] === "tp") {
  //       newValues[item.product_id] = 100;
  //     } else if (tpOrFlat[item.product_id] === "flat") {
  //       newValues[item.product_id] = 200;
  //     }
  //   });

  //   setValueForDbpriceToggleOnTpFlat(newValues);
  // }, [tpOrFlatCounter]);
  // console.log(valueForDbpriceToggleOnTpFlat);
  //=>>> New code end (Click tp or flat change database pricce)

  const handleInputValue = (e) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  const handleInc = (productId, index) => {
    // if (quantities[productId] < data[index].quantity) {} else {toast.error("you don't have sufficient products in your stock");}

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

  const handleDbPrice = (e, id) => {
    const newDbPrice = { ...dbPrice, [id]: parseFloat(e.target.value) || 0 };
    setDbPrice(newDbPrice);

    // Update totals and grand total based on the new dbPrice
    updateTotals(quantities, newDbPrice);
  };

  const updateTotals = (newQuantities, updatedDbPrice = dbPrice) => {
    const newTotals = {};
    data.forEach((item) => {
      const price = parseFloat(updatedDbPrice[item.id]) || item.unit_price;
      newTotals[item.product?.id ?? item.id] =
        (newQuantities[item.product?.id ?? item.id] || 1) * price;
    });
    setTotals(newTotals);
    setTotal(Object.values(newTotals).reduce((sum, val) => sum + val, 0));
  };

  const handleRemoveItem = (productId) => {
    // Remove the item from data
    setData((prev) =>
      prev.filter((item) => item.product?.id ?? item.id !== productId)
    );

    // Remove the product's quantity and total without resetting others
    setQuantities((prev) => {
      const { [productId]: _, ...rest } = prev; // Exclude the removed product
      return rest;
    });

    setTotals((prev) => {
      const { [productId]: _, ...rest } = prev; // Exclude the removed total
      setGrandTotal(Object.values(rest).reduce((sum, val) => sum + val, 0)); // Update grand total
      return rest;
    });
  };

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
    let grand_Total = discount == 0 ? total : total - total * (discount / 100);

    // Custom rounding: x.50 -> x, x.51 -> x + 1
    const customRound = (num) => {
      const fixedNum = Number(num).toFixed(2);
      const [integerPart, decimalPart] = fixedNum.split(".");
      if (parseInt(decimalPart, 10) > 50) {
        return parseInt(integerPart, 10) + 1;
      }
      return parseInt(integerPart, 10);
    };

    setGrandTotal(customRound(grand_Total));
  }, [discount, quantities]);

  const ClearAllStates = () => {
    setQuantities({});
    setTotals({});
    setGrandTotal(0);
    setInputValues({ customer_id: "0", customer_name: "" });
    setData([]);
  };

  const SubmitForm = async (e) => {
    e.preventDefault();
    if (inputValues.customer_id <= "0") {
      toast.error("Please select a customer!");
      return;
    } else if (date == "YYYY-MM-DD" && date == "") {
      toast.error("Please select a date!");
    } else if (inputValues.pay_type <= "0" || !inputValues.pay_type) {
      toast.error("Please select a payment method!");
    } else {
      const orderData = data.map((item, index) => ({
        product_id: item.product?.id ?? item.id,
        quantity: quantities[item.product?.id ?? item.id] || 0,
        product_name: item.product?.name ?? item.name,
        unit_price: dbPrice[item.id] || 0,
        bonus_qty: bonus[item.id] || 0,
        price_type: tpOrFlat[item.id] || "tp",
      }));

      const payload = {
        cust_id: inputValues.customer_id,
        products: orderData,
        order_date: date,
        discount: discount,
        order_type: inputValues.pay_type,
      };
      // console.log(payload);

      setLoader(true);
      await ApiConfig.post(api, payload, { headers })
        .then((response) => {
          if (response.data.status == true) {
            setRelodeTable((prev) => !prev);
            setLoader(false);
            setInputValues({
              customer_id: "0",
              customer_name: "",
              pay_type: "0",
            });
            setDiscount(0);
            ClearAllStates();
            handleOk();
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

            {data.map((item, index) => {
              return (
                <div
                  key={item.product?.id ?? item.id}
                  className="cartItemCard d-flex"
                >
                  <div className="left">
                    <h1 className="title">{item.product?.name ?? item.name}</h1>
                    <div style={{ width: "50%", marginTop: "7px" }}>
                      <label style={{ margin: "0" }}>Price</label>
                      <div className="inputBox noTopPadd">
                        <input
                          type="number"
                          value={dbPrice[item.id] || ""}
                          onChange={(e) => handleDbPrice(e, item.id)}
                        />
                      </div>
                    </div>
                    <p className="price d-flex">
                      Total: {(totals[item.product?.id ?? ""] || 0).toFixed(2)}
                      <FaBangladeshiTakaSign size={15} />
                    </p>

                    <Flex vertical gap="middle">
                      <Radio.Group
                        onChange={(e) => {
                          const newType = e.target.value;
                          setTpOrFlat({
                            ...tpOrFlat,
                            [item.id]: newType,
                          });
                          const flatPrice = item.product?.flat_price ?? item.flat_price;
                          const sellPrice = item.product?.sell_price ?? item.sell_price;
                          const newPrice = newType === "flat" ? flatPrice : sellPrice;
                          setDbPrice((prev) => ({
                            ...prev,
                            [item.id]: newPrice || 0,
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
                      onClick={() =>
                        handleInc(item.product?.id ?? item.id, index)
                      }
                    >
                      +
                    </button>
                    <input
                      type="text"
                      className="display"
                      value={quantities[item.product?.id ?? ""] || 0}
                      onChange={(e) =>
                        handleQtyInput(
                          item.product?.id ?? item.id,
                          e.target.value,
                          dbPrice[item.product?.id ?? item.id]
                        )
                      }
                    />
                    <button
                      type="button"
                      className="button"
                      onClick={() => handleDec(item.product?.id ?? item.id)}
                    >
                      -
                    </button>
                    <RxCross2
                      size={20}
                      color="red"
                      className="c-pointer"
                      onClick={() =>
                        handleRemoveItem(item.product?.id ?? item.id)
                      }
                    />
                  </div>
                </div>
              );
            })}

            <div className="cartTotal d-flex">
              <p className="d-flex">
                Total: {total.toFixed(2)} <FaBangladeshiTakaSign size={18} />
              </p>
            </div>

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
                    Grand Total: {grandTotal}{" "}
                    <FaBangladeshiTakaSign size={18} />
                  </p>
                </div>
              </div>
            )}

            <div
              className="d-flex"
              style={{ justifyContent: "space-around", marginTop: "30px" }}
            >
              <SidePanel slug="+ product" setLoader={setLoader} />
              <button
                type="button"
                className="cancelOrder button"
                onClick={handleCancel}
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

export default OrderCartUpdateModal;

/* eslint-disable react/prop-types */
import { useRef, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { Tooltip } from "@mui/material";
import { Button, Modal, Flex, Radio, Select } from "antd";
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
      GetProductsData();
    }
  };
  const handleOk = () => {
    setOpen(false);
  };
  const handleCancel = () => {
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
    offer: "",
  });

  const [productsData, setProductsData] = useState([]);
  const [data, setData] = useState([]);

  const GetProductsData = async () => {
    try {
      const response = await ApiConfig.get("/products", { headers });
      setProductsData(response.data.data || []);
    } catch (error) {
      console.error(`Error fetching products: ${error}`);
    }
  };

  const GetSpecificData = async () => {
    setLoader(true);
    try {
      const response = await ApiConfig.get(`${getSpecificDataApi}/${id}`, {
        headers,
      });
      if (response.data.status) {
        const products = response.data.data.order_products;
        setDate(response.data.data.order_date);
        setData(products);
        setInputValues({
          customer_id: response.data.data.customer.id,
          customer_name: response.data.data.customer.name,
          pay_type: response.data.data.order_type,
          offer: response.data.data.offer || "",
        });
        setDiscount(response.data.data.discount);

        const initialQuantities = {};
        const initialTotals = {};
        const initialDbPrice = {};
        const initialBonus = {};
        const initialTpOrFlat = {};
        products.forEach((item) => {
          const productId = item.product.id;
          initialQuantities[productId] = item.quantity || 1;
          initialTotals[productId] = (item.quantity || 1) * item.unit_price;
          initialBonus[productId] = item.bonus_qty;
          initialTpOrFlat[productId] = item.price_type || "tp";
          initialDbPrice[productId] = item.unit_price;
        });

        setQuantities(initialQuantities);
        setDbPrice(initialDbPrice);
        setBonus(initialBonus);
        setTpOrFlat(initialTpOrFlat);
        setTotals(initialTotals);
        setTotal(
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
  };

  const handleInc = (productId) => {
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

  const handleQtyInput = (id, value) => {
    // Validate input value
    const numericValue = parseInt(value, 10);
    setQuantities((prev) => {
      const newQuantities = {
        ...prev,
        [id]: numericValue,
      };
      updateTotals(newQuantities);
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
      const productId = item.product.id;
      const price = parseFloat(updatedDbPrice[productId]) || item.unit_price;
      newTotals[productId] = (newQuantities[productId] || 1) * price;
    });
    setTotals(newTotals);
    setTotal(Object.values(newTotals).reduce((sum, val) => sum + val, 0));
  };

  const handleAddProduct = (productId) => {
    const selectedProduct = productsData.find((item) => item.id === productId);
    if (!selectedProduct) return;

    const alreadyAdded = data.some((item) => item.product.id === productId);
    if (alreadyAdded) {
      toast.warning("This product is already added");
      return;
    }

    setData((prev) => [
      ...prev,
      {
        id: `new-${selectedProduct.id}`,
        product: selectedProduct,
        quantity: 1,
        unit_price: selectedProduct.sell_price,
        bonus_qty: 0,
        price_type: "tp",
      },
    ]);
    setQuantities((prev) => ({ ...prev, [productId]: 1 }));
    setDbPrice((prev) => ({
      ...prev,
      [productId]: selectedProduct.sell_price || 0,
    }));
    setBonus((prev) => ({ ...prev, [productId]: 0 }));
    setTpOrFlat((prev) => ({ ...prev, [productId]: "tp" }));
  };

  const handleRemoveItem = (productId) => {
    // Remove the item from data
    setData((prev) => prev.filter((item) => item.product.id !== productId));

    // Remove the product's quantity and total without resetting others
    setQuantities((prev) => {
      const nextQuantities = { ...prev };
      delete nextQuantities[productId];
      return nextQuantities;
    });

    setTotals((prev) => {
      const nextTotals = { ...prev };
      delete nextTotals[productId];
      setGrandTotal(Object.values(nextTotals).reduce((sum, val) => sum + val, 0)); // Update grand total
      return nextTotals;
    });

    setDbPrice((prev) => {
      const nextDbPrice = { ...prev };
      delete nextDbPrice[productId];
      return nextDbPrice;
    });
    setBonus((prev) => {
      const nextBonus = { ...prev };
      delete nextBonus[productId];
      return nextBonus;
    });
    setTpOrFlat((prev) => {
      const nextTpOrFlat = { ...prev };
      delete nextTpOrFlat[productId];
      return nextTpOrFlat;
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
    const grand_Total =
      discount == 0 ? total : total - total * (discount / 100);
    setGrandTotal(grand_Total);
  }, [discount, total]);

  useEffect(() => {
    const newTotals = {};
    data.forEach((item) => {
      const productId = item.product.id;
      const price = parseFloat(dbPrice[productId]) || item.unit_price;
      newTotals[productId] = (quantities[productId] || 1) * price;
    });
    setTotals(newTotals);
    setTotal(Object.values(newTotals).reduce((sum, val) => sum + val, 0));
  }, [data, quantities, dbPrice]);

  const CancelOrder = () => {
    setQuantities({});
    setTotals({});
    setDbPrice({});
    setBonus({});
    setTpOrFlat({});
    setGrandTotal(0);
    setInputValues({ customer_id: "0", customer_name: "", offer: "" });
    setData([]);
    handleCancel();
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
      const orderData = data.map((item) => ({
        product_id: item.product.id,
        quantity: quantities[item.product.id] || 0,
        product_name: item.product.name,
        unit_price: dbPrice[item.product.id] || 0,
        bonus_qty: bonus[item.product.id] || 0,
        price_type: tpOrFlat[item.product.id] || "tp",
      }));

      const payload = {
        cust_id: inputValues.customer_id,
        products: orderData,
        order_date: date,
        discount: discount,
        order_type: inputValues.pay_type,
        offer: inputValues.offer || null,
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

            <div className="select-from-cart-modal">
              <label>Add product</label>
              <Select
                showSearch
                allowClear
                style={{ width: "100%" }}
                placeholder="Search and add product"
                optionFilterProp="label"
                value={undefined}
                onChange={handleAddProduct}
                options={
                  Array.isArray(productsData)
                    ? productsData.map((item) => ({
                        value: item.id,
                        label: `${item.name} (${item.pack_size})`,
                        disabled: data.some(
                          (cartItem) => cartItem.product.id === item.id
                        ),
                      }))
                    : []
                }
              />
            </div>

            {data.map((item) => {
              const productId = item.product.id;
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
                          value={dbPrice[productId] || ""}
                          onChange={(e) => handleDbPrice(e, productId)}
                        />
                      </div>
                    </div>
                    <p className="price d-flex">
                      Total: {(totals[productId] || 0).toFixed(2)}
                      <FaBangladeshiTakaSign size={15} />
                    </p>

                    <Flex vertical gap="middle">
                      <Radio.Group
                        onChange={(e) => {
                          setTpOrFlat({
                            ...tpOrFlat,
                            [productId]: e.target.value,
                          });
                        }}
                        value={tpOrFlat[productId] || "tp"}
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
                          value={bonus[productId] || ""}
                          onChange={(e) => {
                            setBonus({
                              ...bonus,
                              [productId]: e.target.value,
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
                      onClick={() => handleInc(productId)}
                    >
                      +
                    </button>
                    <input
                      type="text"
                      className="display"
                      value={quantities[productId] || 0}
                      onChange={(e) =>
                        handleQtyInput(
                          productId,
                          e.target.value,
                          dbPrice[productId]
                        )
                      }
                    />
                    <button
                      type="button"
                      className="button"
                      onClick={() => handleDec(productId)}
                    >
                      -
                    </button>
                    <RxCross2
                      size={20}
                      color="red"
                      className="c-pointer"
                      onClick={() => handleRemoveItem(productId)}
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

export default OrderCartUpdateModal;

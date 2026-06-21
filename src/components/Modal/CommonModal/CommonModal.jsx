import React, { useRef, useState, lazy, Suspense, useContext } from "react";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import { Button, Modal, Select } from "antd";
import Draggable from "react-draggable";

//=>>> Css
import "./CommonModal.css";

//=>>> Components
import SingleDatePicker from "../../DatePicker/SingleDatePicker";
import MonthPicker from "../../DatePicker/MonthPicker";
import ImageUploader from "../../ImageUploader/ImageUploader";
const PriceCalculator = lazy(() => import("../Calculator/PriceCalculator"));

//=>>> Additional utility
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";
import { DateFormater } from "../../../assets/js/DateFormater";

const CommonModal = (props) => {
  const { headers, uid } = useContext(AuthContext);
  const {
    id,
    slug,
    inputFields,
    identifier,
    api,
    getSpecificDataApi,
    ModalOpenBtnTitle,
    className,
    data,
    data_2,
    setData,
    toolTip,
    setRelodeTable,
    setLoader,
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

    const initialIsRequired = {};
    inputFields.map((item, index) => {
      initialIsRequired[item.field] = item.isRequired;
    });
    setIsRequired(initialIsRequired);

    if (
      identifier == "designationUpdate" ||
      identifier == "employeeUpdate" ||
      identifier == "brandUpdate" ||
      identifier == "categoryUpdate" ||
      identifier == "supplierUpdate" ||
      identifier == "customerUpdate" ||
      identifier == "productUpdate" ||
      identifier == "paymentUpdateCustomer" ||
      identifier == "paymentUpdateSupplier" ||
      identifier == "costCategoryUpdate" ||
      identifier == "costUpdateEmployee" ||
      identifier == "salaryUpdate" ||
      identifier == "costUpdateOffice" ||
      identifier == "permissionUpdate" ||
      identifier == "employeeCostCategoryUpdate"
    ) {
      GetSpecificData();
    }
  };
  const handleOk = (e) => {
    setOpen(false);
  };
  const handleCancel = (e) => {
    setOpen(false);
    setImg(null);
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
  const [date, setDate] = useState(DateFormater(new Date()));
  const [date_2, setDate_2] = useState(DateFormater(new Date()));
  const [month, setMonth] = useState("YYYY-MM");

  const [img, setImg] = useState(null);
  const [inputValue, setInputValue] = useState({
    name: "",
    phone: "",
    email: "",
    whatsapp: "",
    national_id: "",
    company_name: "",
    territory: "",
    district: "",
    address: "",
    country: "",
    generated_employee_id: "",
    employee_id: "0",
    designation_id: "0",
    category_id: "0",
    brand_id: "0",
    designation: "",
    slug: "",
    blood_group: "",
    brand: "",
    categories: "",
    buy_price: "",
    sell_price: "",
    flat_price: "",
    model: "",
    serial: "",
    warranty: "",
    supplier_id: "",
    quantity: "",
    who_take: "",
    resone: "",
    credit_limit: "",
    basic_salary: "",
    pack_size: "",
    payment_method: "",
    old_due: "",
  });
  const [isRequired, setIsRequired] = useState({});
  const handleInputValue = (e, isRequiredVal) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  //=>>> Get specific data with id
  const GetSpecificData = async () => {
    setLoader(true);
    await ApiConfig.get(getSpecificDataApi + "/" + id, { headers })
      .then((response) => {
        if (response.data.status == true) {
          if (identifier == "employeeUpdate") {
            setInputValue({
              ...inputValue,
              generated_employee_id: response.data.data.employee_id,
              designation_id: response.data.data.designation_id,
              name: response.data.data.name,
              phone: response.data.data.phone,
              national_id: response.data.data.national_id,
              blood_group: response.data.data.blood_group,
              // address: response.data.data.address,
              territory: response.data.data.territory,
              district: response.data.data.district,
              credit_limit: response.data.data.credit_limit,
              basic_salary: response.data.data.basic_salary,
            });
          } else if (
            identifier == "designationUpdate" ||
            identifier == "brandUpdate" ||
            identifier == "categoryUpdate" ||
            identifier == "permissionUpdate" ||
            identifier == "employeeCostCategoryUpdate"
          ) {
            setInputValue({
              ...inputValue,
              name: response.data.data.name,
              slug: response.data.data.slug,
            });
          } else if (identifier == "supplierUpdate") {
            setInputValue({
              ...inputValue,
              name: response.data.data.proprietor_name,
              company_name: response.data.data.company_name,
              phone: response.data.data.phone,
              whatsapp: response.data.data.whatsapp,
              email: response.data.data.email,
              balance: response.data.data.balance,
              due: response.data.data.due,
              address: response.data.data.address,
              country: response.data.data.country,
            });
          } else if (identifier == "customerUpdate") {
            setInputValue({
              ...inputValue,
              employee_id: response.data.data.employee_id,
              name: response.data.data.customer_name,
              company_name: response.data.data.proprietor_name,
              phone: response.data.data.phone,
              address: response.data.data.address,
              old_due: response.data.data.old_due,
              credit_limit: response.data.data.credit_limit,
            });
          } else if (identifier == "productUpdate") {
            setInputValue({
              ...inputValue,
              category_id: response.data.data.cat_id,
              brand_id: response.data.data.brand_id,
              categories: response.data.data.category.name,
              brand: response.data.data.brand.name,
              name: response.data.data.name,
              buy_price: response.data.data.buy_price,
              sell_price: response.data.data.sell_price,
              flat_price: response.data.data.flat_price,
              serial: response.data.data.serial,
              model: response.data.data.model,
              pack_size: response.data.data.pack_size,
            });
            setDate(response.data.data.expire_date);
          } else if (
            identifier == "paymentUpdateCustomer" ||
            identifier == "paymentUpdateSupplier"
          ) {
            setInputValue({
              ...inputValue,
              employee_id: response.data.data.employee_id,
              sell_price: response.data.data.amount,
              payment_method: response.data.data.payment_method,
            });
            setDate(response.data.data.payment_date);
          } else if (identifier == "costCategoryUpdate") {
            setInputValue({
              ...inputValue,
              name: response.data.data.name,
            });
          } else if (identifier == "costUpdateEmployee") {
            setInputValue({
              ...inputValue,
              category_id: response.data.data.employee_cost_cat_id,
              sell_price: response.data.data.amount,
            });
            setDate(response.data.data.cost_date);
          } else if (identifier == "salaryUpdate") {
            setInputValue({
              ...inputValue,
              sell_price: response.data.data.paid_amount,
            });
            setMonth(response.data.data.month_year);
          } else if (identifier == "costUpdateOffice") {
            setInputValue({
              ...inputValue,
              category_id: response.data.data.cost_cat_id,
              sell_price: response.data.data.amount,
            });
            setDate(response.data.data.cost_date);
          }
          setLoader(false);
          // console.clear();
          // console.log(response.data.data);
        } else {
          setLoader(false);
          console.log(response);
        }
      })
      .catch((e) => {
        setLoader(false);
        toast.error(e.response.data.message);
      });
  };

  //=>>> Submit form data
  const SubmitForm = async (e) => {
    e.preventDefault();
    if (identifier == "employeeStore" || identifier == "employeeUpdate") {
      if (inputValue.designation_id <= 0) {
        toast.error("Please select designation");
      } else if (
        isRequired.generated_employee_id == true &&
        inputValue.generated_employee_id == ""
      ) {
        toast.error("Please enter employees unique id");
      } else if (isRequired.name == true && inputValue.name == "") {
        toast.error("Please enter employee name");
      } else if (isRequired.phone == true && inputValue.phone == "") {
        toast.error("Please enter phone number");
      } else if (
        isRequired.national_id == true &&
        inputValue.national_id == ""
      ) {
        toast.error("Please enter national id number");
      } else if (
        isRequired.blood_group == true &&
        inputValue.blood_group == ""
      ) {
        toast.error("Please enter blood group");
      } else if (isRequired.territory == true && inputValue.territory == "") {
        toast.error("Please enter territory");
      } else if (isRequired.district == true && inputValue.district == "") {
        toast.error("Please enter district");
      } else if (
        isRequired.credit_limit == true &&
        inputValue.credit_limit == ""
      ) {
        toast.error("Please enter credit limit");
      } else if (
        isRequired.basic_salary == true &&
        inputValue.basic_salary == ""
      ) {
        toast.error("Please enter basic salary");
      } else {
        const payload = new FormData();
        payload.append("employee_id", inputValue.generated_employee_id);
        payload.append("designation_id", inputValue.designation_id);
        payload.append("name", inputValue.name);
        payload.append("phone", inputValue.phone);
        payload.append("territory", inputValue.territory);
        payload.append("district", inputValue.district);
        payload.append("national_id", inputValue.national_id || "N/A");
        payload.append("blood_group", inputValue.blood_group || "N/A");
        payload.append("credit_limit", inputValue.credit_limit || 0);
        payload.append("basic_salary", inputValue.basic_salary || 0);
        payload.append("created_by", uid);
        payload.append("image", img);
        setLoader(true);
        await ApiConfig.post(api, payload, { headers })
          .then((response) => {
            if (response.data.status == true) {
              setInputValue({
                generated_employee_id: "",
                designation_id: "0",
                name: "",
                phone: "",
                territory: "",
                district: "",
                national_id: "",
                blood_group: "",
                credit_limit: "",
                basic_salary: "",
              });
              handleCancel();
              setRelodeTable((prev) => !prev);
              console.clear();
              setLoader(false);
              toast.success(response.data.message);
            } else {
              toast.error(response.data.error);
              setLoader(false);
            }
          })
          .catch((e) => {
            setLoader(false);
            toast.error(e.response.data.message);
          });
      }
    } else if (
      identifier == "designationStore" ||
      identifier == "designationUpdate" ||
      identifier == "brandStore" ||
      identifier == "brandUpdate" ||
      identifier == "categoryStore" ||
      identifier == "categoryUpdate" ||
      identifier == "permissionStore" ||
      identifier == "permissionUpdate" ||
      identifier == "employeeCostCategoryStore" ||
      identifier == "employeeCostCategoryUpdate"
    ) {
      if (isRequired.name == true && inputValue.name == "") {
        toast.error("Please enter a name");
      } else if (isRequired.slug == true && inputValue.slug == "") {
        toast.error("Please enter slug");
      } else {
        const payload = new FormData();
        payload.append("name", inputValue.name);
        if (
          identifier == "designationStore" ||
          identifier == "designationUpdate"
        ) {
          payload.append("slug", inputValue.slug);
        }
        setLoader(true);
        await ApiConfig.post(api, payload, { headers })
          .then((response) => {
            if (response.data.status == true) {
              setInputValue({
                name: "",
                slug: "",
              });
              handleCancel();
              setRelodeTable((prev) => !prev);
              setLoader(false);
              toast.success(response.data.message);
            } else {
              setLoader(false);
              toast.error(response.data.message);
            }
          })
          .catch((e) => {
            setLoader(false);
            toast.error(e.response.data.message);
          });
      }
    } else if (
      identifier == "supplierStore" ||
      identifier == "supplierUpdate"
    ) {
      if (isRequired.name == true && inputValue.name == "") {
        toast.error("Please enter proprietor name");
      } else if (
        isRequired.company_name == true &&
        inputValue.company_name == ""
      ) {
        toast.error("Please enter company name");
      } else if (isRequired.phone == true && inputValue.phone == "") {
        toast.error("Please enter supplier phone number");
      } else if (isRequired.whatsapp == true && inputValue.whatsapp == "") {
        toast.error("Please enter supplier whatsapp number");
      } else if (isRequired.email == true && inputValue.email == "") {
        toast.error("Please enter supplier email");
      } else if (isRequired.address == true && inputValue.address == "") {
        toast.error("Please enter supplier address");
      } else if (isRequired.country == true && inputValue.country == "") {
        toast.error("Please enter supplier country");
      } else {
        const payload = new FormData();
        payload.append("proprietor_name", inputValue.name);
        payload.append("company_name", inputValue.company_name);
        payload.append("phone", inputValue.phone);
        payload.append("whatsapp", inputValue.whatsapp || "N/A");
        if (inputValue.email != null) {
          payload.append("email", inputValue.email);
        }
        payload.append("country", inputValue.country);
        payload.append("address", inputValue.address);
        payload.append("image", img);

        setLoader(true);
        await ApiConfig.post(api, payload, { headers })
          .then((response) => {
            if (response.data.status == true) {
              setInputValue({
                name: "",
                company_name: "",
                phone: "",
                whatsapp: "",
                email: "",
                country: "",
                address: "",
              });
              handleCancel();
              setRelodeTable((prev) => !prev);
              console.clear();
              setLoader(false);
              toast.success(response.data.message);
            } else {
              setLoader(false);
              toast.error(response.data.error);
            }
          })
          .catch((e) => {
            setLoader(false);
            toast.error(e.response.data.message);
          });
      }
    } else if (
      identifier == "customerStore" ||
      identifier == "customerUpdate"
    ) {
      if (inputValue.employee_id <= 0) {
        toast.error("Please select employee");
      } else if (isRequired.name == true && inputValue.name == "") {
        toast.error("Please enter customer name");
      } else if (
        isRequired.company_name == true &&
        inputValue.company_name == ""
      ) {
        toast.error("Please enter proprietor name");
      } else if (isRequired.phone == true && inputValue.phone == "") {
        toast.error("Please enter customer phone no");
      } else if (isRequired.address == true && inputValue.address == "") {
        toast.error("Please enter customer address");
      } else {
        const payload = new FormData();
        payload.append("employee_id", inputValue.employee_id);
        payload.append("customer_name", inputValue.name);
        payload.append("proprietor_name", inputValue.company_name);
        payload.append("phone", inputValue.phone);
        payload.append("address", inputValue.address);
        payload.append("old_due", inputValue.old_due || 0);
        payload.append("credit_limit", inputValue.credit_limit || 0);
        payload.append("image", img);

        setLoader(true);
        await ApiConfig.post(api, payload, { headers })
          .then((response) => {
            if (response.data.status == true) {
              setInputValue({
                employee_id: 0,
                name: "",
                phone: "",
                address: "",
                old_due: "",
                credit_limit: "",
              });
              handleCancel();
              setRelodeTable((prev) => !prev);
              console.clear();
              setLoader(false);
              toast.success(response.data.message);
            } else {
              setLoader(false);
              toast.error(response.data.error);
            }
          })
          .catch((e) => {
            setLoader(false);
            toast.error(e.response.data.message);
          });
      }
    } else if (identifier == "productStore" || identifier == "productUpdate") {
      if (inputValue.category_id <= "0") {
        toast.error("Please select a category");
      } else if (inputValue.brand_id <= "0") {
        toast.error("Please select a brand");
      } else if (isRequired.name == true && inputValue.name == "") {
        toast.error("Please enter product name");
      } else if (isRequired.pack_size == true && inputValue.pack_size == "") {
        toast.error("Please enter pack size");
      } else if (isRequired.buy_price == true && inputValue.buy_price == "") {
        toast.error("Please enter buy price");
      } else if (isRequired.sell_price == true && inputValue.sell_price == "") {
        toast.error("Please enter sell price");
      } else if (isRequired.flat_price == true && inputValue.flat_price == "") {
        toast.error("Please enter flat price");
      } else {
        const payload = new FormData();
        payload.append("cat_id", inputValue.category_id);
        payload.append("brand_id", inputValue.brand_id);
        payload.append("name", inputValue.name);
        payload.append("pack_size", inputValue.pack_size);
        payload.append("buy_price", inputValue.buy_price);
        payload.append("sell_price", inputValue.sell_price);
        payload.append("flat_price", inputValue.flat_price);
        payload.append("expire_date", date);
        payload.append("image", img);
        setLoader(true);
        await ApiConfig.post(api, payload, { headers })
          .then((response) => {
            if (response.data.status == true) {
              setInputValue({
                category_id: "",
                brand_id: "",
                buy_price: "",
                sell_price: "",
              });
              handleCancel();
              setRelodeTable((prev) => !prev);
              console.clear();
              setLoader(false);
              toast.success(response.data.message);
            } else {
              setLoader(false);
              toast.error(response.data.error);
            }
          })
          .catch((e) => {
            setLoader(false);
            toast.error(e.response.data.message);
          });
      }
    } else if (identifier == "stock_in") {
      if (inputValue.supplier_id <= "0") {
        toast.error("Please select a supplier");
      } else if (isRequired.buy_price == true && inputValue.buy_price == "") {
        toast.error("Please enter buy price");
      } else if (isRequired.quantity == true && inputValue.quantity == "") {
        toast.error("Please enter quantity");
      } else if (date == "YYYY-MM-DD") {
        toast.error("Please select a date");
      } else {
        const payload = new FormData();
        payload.append("product_id", id);
        payload.append("quantity", inputValue.quantity);
        payload.append("buy_price", inputValue.buy_price);
        payload.append("supplier_id", inputValue.supplier_id);
        payload.append("expire_date", date);
        payload.append("in_out_date", date_2);
        setLoader(true);
        await ApiConfig.post(api, payload, { headers })
          .then((response) => {
            if (response.data.status == true) {
              setInputValue({
                quantity: "",
                buy_price: "",
                supplier_id: "",
              });
              setDate("YYYY-MM-DD");
              handleCancel();
              setRelodeTable((prev) => !prev);
              console.clear();
              setLoader(false);
              toast.success(response.data.message);
            } else {
              setLoader(false);
              toast.error(response.data.error);
            }
          })
          .catch((e) => {
            setLoader(false);
            toast.error(e.response.data.message);
          });
      }
    } else if (identifier == "stock_out") {
      if (isRequired.quantity == true && inputValue.quantity == "") {
        toast.error("Please enter quantity");
      } else if (isRequired.who_take == true && inputValue.who_take == "") {
        toast.error("Please enter name");
      } else if (isRequired.resone == true && inputValue.resone == "") {
        toast.error("Please type any resone");
      } else if (date == "YYYY-MM-DD") {
        toast.error("Please select a date");
      } else {
        const payload = new FormData();
        payload.append("product_id", id);
        payload.append("quantity", inputValue.quantity);
        payload.append("who_take", inputValue.who_take);
        payload.append("purpose", inputValue.resone);
        payload.append("in_out_date", date_2);
        setLoader(true);
        await ApiConfig.post(api, payload, { headers })
          .then((response) => {
            if (response.data.status == true) {
              setInputValue({
                quantity: "",
                who_take: "",
                resone: "",
              });
              setDate("YYYY-MM-DD");
              handleCancel();
              setRelodeTable((prev) => !prev);
              console.clear();
              setLoader(false);
              toast.success(response.data.message);
            } else {
              setLoader(false);
              toast.error(response.data.error);
            }
          })
          .catch((e) => {
            setLoader(false);
            toast.error(e.response.data.message);
          });
      }
    } else if (
      identifier == "paymentStoreCustomer" ||
      identifier == "paymentUpdateCustomer" ||
      identifier == "paymentStoreSupplier" ||
      identifier == "paymentUpdateSupplier"
    ) {
      if (inputValue.payment_method == "") {
        toast.error("Please select payment method");
      } else if (isRequired.sell_price == true && inputValue.sell_price == "") {
        toast.error("Please enter amount");
      } else if (isRequired.resone == true && inputValue.resone == "") {
        toast.error("Please type payment cause");
      } else if (date == "YYYY-MM-DD") {
        toast.error("Please select a date");
      } else {
        const payload = new FormData();
        if (identifier == "paymentStoreCustomer") {
          payload.append("cust_id", data);
          payload.append("employee_id", data_2);
        } else if (identifier == "paymentUpdateCustomer") {
          payload.append("cust_id", data);
          payload.append("employee_id", inputValue.employee_id);
        } else if (
          identifier == "paymentStoreSupplier" ||
          identifier == "paymentUpdateSupplier"
        ) {
          payload.append("cust_id", "");
          payload.append("supplier_id", data);
        }
        payload.append("amount", inputValue.sell_price);
        payload.append("payment_method", inputValue.payment_method);
        payload.append("payment_date", date);

        setLoader(true);
        await ApiConfig.post(api, payload, { headers })
          .then((response) => {
            if (response.data.status == true) {
              setInputValue({
                payment_method: "",
                sell_price: "",
              });
              setDate("YYYY-MM-DD");
              handleCancel();
              setRelodeTable((prev) => !prev);
              console.clear();
              setLoader(false);
              toast.success(response.data.message);
            } else {
              setLoader(false);
              toast.error(response.data.error);
              console.log(response.data);
            }
          })
          .catch((e) => {
            setLoader(false);
            toast.error(e.response.data.message);
          });
      }
    } else if (
      identifier == "costCategoryStore" ||
      identifier == "costCategoryUpdate"
    ) {
      if (isRequired.name == true && inputValue.name == "") {
        toast.error("Please enter name");
      } else {
        const payload = new FormData();
        payload.append("name", inputValue.name);

        setLoader(true);
        await ApiConfig.post(api, payload, { headers })
          .then((response) => {
            if (response.data.status == true) {
              setInputValue({
                name: "",
              });
              handleCancel();
              setRelodeTable((prev) => !prev);
              console.clear();
              setLoader(false);
              toast.success(response.data.message);
            } else {
              setLoader(false);
              toast.error(response.data.error);
            }
          })
          .catch((e) => {
            setLoader(false);
            toast.error(e.response.data.message);
          });
      }
    } else if (
      identifier == "costStoreEmployee" ||
      identifier == "costUpdateEmployee" ||
      identifier == "costCreateOffice" ||
      identifier == "costUpdateOffice"
    ) {
      if (inputValue.category_id <= 0) {
        toast.error("Please select a category");
      } else if (isRequired.sell_price == true && inputValue.sell_price == "") {
        toast.error("Please enter amount");
      } else if (date == "YYYY-MM-DD") {
        toast.error("Please select a date");
      } else {
        const payload = new FormData();
        if (
          identifier == "costStoreEmployee" ||
          identifier == "costUpdateEmployee"
        ) {
          payload.append("employee_id", data);
          payload.append("employee_cost_cat_id", inputValue.category_id);
        } else if (
          identifier == "costCreateOffice" ||
          identifier == "costUpdateOffice"
        ) {
          payload.append("cost_cat_id", inputValue.category_id);
        }
        payload.append("cost_date", date);
        payload.append("amount", inputValue.sell_price);

        for (var pair of payload.entries()) {
          console.log(pair[0] + ", " + pair[1]);
        }

        setLoader(true);
        await ApiConfig.post(api, payload, { headers })
          .then((response) => {
            if (response.data.status == true) {
              setInputValue({
                sell_price: "",
                category_id: 0,
              });
              setDate("YYYY-MM-DD");
              handleCancel();
              setRelodeTable((prev) => !prev);
              // console.clear();
              setLoader(false);
              toast.success(response.data.message);
            } else {
              setLoader(false);
              toast.error(response.data.error);
            }
          })
          .catch((e) => {
            setLoader(false);
            toast.error(e.response.data.message);
          });
      }
    } else if (identifier == "salaryStore" || identifier == "salaryUpdate") {
      if (isRequired.sell_price == true && inputValue.sell_price == "") {
        toast.error("Please enter amount");
      } else if (month == "YYYY-MM") {
        toast.error("Please select a month");
      } else {
        const payload = new FormData();
        payload.append("employee_id", data);
        payload.append("paid_amount", inputValue.sell_price);
        payload.append("month_year", month);

        setLoader(true);
        await ApiConfig.post(api, payload, { headers })
          .then((response) => {
            if (response.data.status == true) {
              setInputValue({
                sell_price: "",
              });
              setMonth("YYYY-MM");
              handleCancel();
              setRelodeTable((prev) => !prev);
              console.clear();
              setLoader(false);
              toast.success(response.data.message);
            } else {
              setLoader(false);
              toast.error(response.data.error);
            }
          })
          .catch((e) => {
            setLoader(false);
            toast.error(e.response.data.message);
          });
      }
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
        <div className="modalContent">
          {/* Calculator */}
          {(() => {
            if (
              identifier == "productStore" ||
              identifier == "productUpdate" ||
              identifier == "stock_in"
            ) {
              return (
                <div className="text-right">
                  <Suspense fallback="...">
                    <PriceCalculator
                      slug={`Calculate price`}
                      ModalOpenBtnTitle="Calculate price"
                      className="addBtn"
                      identifier={identifier}
                    />
                  </Suspense>
                </div>
              );
            } else {
              return "";
            }
          })()}

          <form className="d-flex" onSubmit={SubmitForm}>
            {/* ___ Designation Selection Start  ___ */}
            {identifier == "employeeStore" || identifier == "employeeUpdate" ? (
              <div className="select-from-modal">
                <label>
                  Select designation{" "}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  className="select"
                  name="designation_id"
                  value={inputValue.designation_id}
                  onChange={handleInputValue}
                  disabled={identifier == "employeeUpdate" ? true : false}
                >
                  <option value="0" disabled>
                    Select designation
                  </option>
                  {Array.isArray(data) &&
                    data.map((items, index) => {
                      return (
                        <option value={items.id} key={index}>
                          {items.name}
                        </option>
                      );
                    })}
                </select>
              </div>
            ) : (
              ""
            )}
            {/* ___ Designation Selection End ___ */}

            {/* ___ Employee Selection Start  ___ */}
            {identifier == "customerStore" || identifier == "customerUpdate" ? (
              <div className="select-from-modal">
                <label>
                  Select employee<span className="text-red-500 ml-1">*</span>
                </label>
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select employee"
                  optionFilterProp="children"
                  value={inputValue.employee_id === "0" || inputValue.employee_id === 0 ? undefined : Number(inputValue.employee_id)}
                  onChange={(value) => {
                    setInputValue({ ...inputValue, employee_id: value });
                  }}
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                  options={
                    Array.isArray(data)
                      ? data.map((items) => ({
                          value: items.id,
                          label: items.name,
                        }))
                      : []
                  }
                />
              </div>
            ) : (
              ""
            )}
            {/* ___ Employee Selection End ___ */}

            {/* ___ Category Selection Start  ___ */}
            {identifier == "productStore" || identifier == "productUpdate" ? (
              <div className="select-from-modal">
                <label>
                  Select category <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  className="select"
                  name="category_id"
                  value={inputValue.category_id}
                  onChange={handleInputValue}
                  // disabled={identifier == "productUpdate" ? true : false}
                >
                  <option value="0">
                    {inputValue.categories
                      ? inputValue.categories
                      : "Select category"}
                  </option>
                  {Array.isArray(data) &&
                    data.map((items, index) => {
                      return (
                        <option value={items.id} key={index}>
                          {items.name}
                        </option>
                      );
                    })}
                </select>
              </div>
            ) : (
              ""
            )}
            {/* ___ Category Selection End ___ */}

            {/* ___ Brand Selection Start  ___ */}
            {identifier == "productStore" || identifier == "productUpdate" ? (
              <div className="select-from-modal">
                <label>
                  Select brand <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  className="select"
                  name="brand_id"
                  value={inputValue.brand_id}
                  onChange={handleInputValue}
                  // disabled={identifier == "productUpdate" ? true : false}
                >
                  <option value="0">
                    {inputValue.brand ? inputValue.brand : "Select brand"}
                  </option>
                  {Array.isArray(data_2) &&
                    data_2.map((items, index) => {
                      return (
                        <option value={items.id} key={index}>
                          {items.name}
                        </option>
                      );
                    })}
                </select>
              </div>
            ) : (
              ""
            )}
            {/* ___ Brand Selection End ___ */}

            {/* ___ Suppliers Selection Start  ___ */}
            {identifier == "stock_in" ? (
              <div className="select-from-modal">
                <label>Select supplier</label>
                <select
                  className="select"
                  name="supplier_id"
                  value={inputValue.supplier_id}
                  onChange={handleInputValue}
                  // disabled={identifier == "productUpdate" ? true : false}
                >
                  <option value="0">Select supplier</option>
                  {Array.isArray(data) &&
                    data.map((items, index) => {
                      return (
                        <option value={items.id} key={index}>
                          {items.proprietor_name}
                        </option>
                      );
                    })}
                </select>
              </div>
            ) : (
              ""
            )}
            {/* ___ Suppliers Selection End ___ */}

            {/* ___ Payment Method Selection Start  ___ */}
            {identifier == "paymentStoreCustomer" ||
            identifier == "paymentUpdateCustomer" ||
            identifier == "paymentStoreSupplier" ||
            identifier == "paymentUpdateSupplier" ? (
              <div className="select-from-modal">
                <label>Payment method</label>
                <select
                  className="select"
                  name="payment_method"
                  value={inputValue.payment_method}
                  onChange={handleInputValue}
                  // disabled={identifier == "productUpdate" ? true : false}
                >
                  <option value="">Select a payment method</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                </select>
              </div>
            ) : (
              ""
            )}
            {/* ___ Payment Method Selection End ___ */}

            {/* ___ Cost category Selection Start  ___ */}
            {identifier == "costCreateOffice" ||
            identifier == "costUpdateOffice" ? (
              <div className="select-from-modal">
                <label>Select cost category</label>
                <select
                  className="select"
                  name="category_id"
                  value={inputValue.category_id}
                  onChange={handleInputValue}
                  // disabled={identifier == "costUpdateOffice" ? true : false}
                >
                  <option value="0">Select a category</option>
                  {Array.isArray(data) &&
                    data.map((items, index) => {
                      return (
                        <option value={items.id} key={index}>
                          {items.name}
                        </option>
                      );
                    })}
                </select>
              </div>
            ) : (
              ""
            )}
            {/* ___ Cost category Selection End ___ */}

            {/* ___ Employee cost category Selection Start  ___ */}
            {identifier == "costStoreEmployee" ||
            identifier == "costUpdateEmployee" ? (
              <div className="select-from-modal">
                <label>Select employee cost category</label>
                <select
                  className="select"
                  name="category_id"
                  value={inputValue.category_id}
                  onChange={handleInputValue}
                  // disabled={identifier == "costUpdateOffice" ? true : false}
                >
                  <option value="0">Select a category</option>
                  {Array.isArray(data_2) &&
                    data_2.map((items, index) => {
                      return (
                        <option value={items.id} key={index}>
                          {items.name}
                        </option>
                      );
                    })}
                </select>
              </div>
            ) : (
              ""
            )}
            {/* ___ Employee cost category Selection End ___ */}

            {/* ___ Dynamic input field start ___ */}
            {Array.isArray(inputFields) &&
              inputFields.map((items, index) => {
                return (
                  <div style={{ width: "100%" }} key={index}>
                    <label>
                      {items.label}
                      {items.isRequired == true && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <div className="inputBox">
                      <input
                        type={items.type}
                        name={items.field}
                        placeholder={`${items.placeholder}`}
                        onChange={(e) => handleInputValue(e, items.isRequired)}
                        value={inputValue[items.field] || ""}
                        disabled={items.isDisabled}
                      />
                    </div>
                  </div>
                );
              })}
            {/* ___ Dynamic input field end ___ */}

            {/* ___ Date Section Start  ___ */}
            {(() => {
              if (
                identifier == "productStore" ||
                identifier == "productUpdate" ||
                identifier == "stock_in"
              ) {
                return (
                  <div className="w-full">
                    <label>
                      Expire date: <span className="font-bold">{date}</span>
                    </label>
                    <br />
                    <SingleDatePicker setDate={setDate} />
                  </div>
                );
              } else {
                return "";
              }
            })()}

            {(() => {
              if (identifier == "stock_in" || identifier == "stock_out") {
                return (
                  <div className="w-full">
                    <label>
                      {identifier == "stock_in"
                        ? "Stock in date"
                        : identifier == "stock_out"
                        ? "Stock out date"
                        : "Date"}
                      : <span className="font-bold">{date_2}</span>
                    </label>
                    <br />
                    <SingleDatePicker setDate={setDate_2} />
                  </div>
                );
              } else {
                return "";
              }
            })()}

            {identifier == "paymentStoreCustomer" ||
            identifier == "paymentUpdateCustomer" ||
            identifier == "paymentStoreSupplier" ||
            identifier == "paymentUpdateSupplier" ||
            identifier == "costStoreEmployee" ||
            identifier == "costUpdateEmployee" ||
            identifier == "costCreateOffice" ||
            identifier == "costUpdateOffice" ? (
              <div className="w-full">
                <label>
                  Select date:<span className="font-bold">{date}</span>
                </label>
                <br />
                <SingleDatePicker setDate={setDate} />
              </div>
            ) : (
              ""
            )}
            {/* ___ Date Section End  ___ */}

            {/* ___ Month Section Start  ___ */}
            {identifier == "salaryStore" ? (
              <div className="w-full">
                <label>
                  Select month <strong>:</strong> {month}
                </label>
                <br />
                <MonthPicker setMonth={setMonth} />
              </div>
            ) : (
              ""
            )}
            {/* ___ Month Section End  ___ */}

            {/* ___ Image Section Start  ___ */}
            {identifier == "employeeStore" ||
            identifier == "employeeUpdate" ||
            identifier == "supplierStore" ||
            identifier == "supplierUpdate" ||
            identifier == "customerStore" ||
            identifier == "customerUpdate" ||
            identifier == "productStore" ||
            identifier == "productUpdate" ? (
              <div className="w-full mt-5">
                <p className="cursor-default text-center">Upload image</p>
                <ImageUploader
                  img={img}
                  setImg={setImg}
                  width="60px"
                  height="60px"
                />
              </div>
            ) : (
              ""
            )}
            {/* ___ Image Section End  ___*/}

            <div>
              <button type="submit" className="button">
                next
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};
export default CommonModal;

// {/* ___ Date Section Start  ___ */}
//             {(() => {
//               if (
//                 identifier == "productStore" ||
//                 identifier == "productUpdate" ||
//                 identifier == "stock_in" ||
//                 identifier == "stock_out"
//               ) {
//                 return (
//                   <div className="w-full">
//                     <label>
//                       {identifier == "stock_out"
//                         ? "Stock out date"
//                         : identifier == "stock_in"
//                         ? "Stock in date"
//                         : "Expire date"}
//                       : <span className="font-bold">{date}</span>
//                     </label>
//                     <br />
//                     <SingleDatePicker setDate={setDate} />
//                   </div>
//                 );
//               } else {
//                 return "";
//               }
//             })()}

//             {/* ___ Date Section 2 Start  ___ */}
//             {(() => {
//               if (identifier == "stock_in") {
//                 return (
//                   <div className="w-full">
//                     <label>
//                       {identifier == "stock_in"
//                         ? "Stock in date"
//                         : "Expire date"}
//                       : <span className="font-bold">{date}</span>
//                     </label>
//                     <br />
//                     <SingleDatePicker setDate={setDate} />
//                   </div>
//                 );
//               } else {
//                 return "";
//               }
//             })()}

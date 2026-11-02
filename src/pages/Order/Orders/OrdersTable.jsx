import {
  useEffect,
  useState,
  lazy,
  Suspense,
  useMemo,
  useContext,
} from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import DataTable from "react-data-table-component";

//=>>> Css
import "../../../assets/css/DataTable.css";

//=>>> Icons
import { FaEdit } from "react-icons/fa";
import { IoTrashBinSharp } from "react-icons/io5";
import { FaTruckFast } from "react-icons/fa6";

//=>>> Components
const OrderCartUpdateModal = lazy(() =>
  import("../../../components/Modal/OrderModal/OrderCartUpdateModal")
);
const SaleCartModal = lazy(() =>
  import("../../../components/Modal/SaleModal/SaleCartModal")
);

//=>>> Utilities
import ApiConfig from "../../../assets/js/ApiConfig";
import { DataContext } from "../../../context/DataContext";
import { TableStyles, rowPerPage } from "../../../assets/js/Utility";
import dayjs from "dayjs";

const parseStandardDate = (dateStr) => {
  if (!dateStr) return "";
  const str = String(dateStr).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    return str.slice(0, 10);
  }
  const parts = str.split(/[-/]/);
  if (parts.length === 3 && parts[0].length === 2 && parts[2].length === 4) {
    return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
  }
  const d = dayjs(str);
  return d.isValid() ? d.format("YYYY-MM-DD") : str.slice(0, 10);
};


const OrdersTable = (props) => {
  const {
    headers,
    userRole,
    userDesignationSlug,
    relodeTable,
    setRelodeTable,
    setLoader,
    searchData,
    selectedEmpID,
    dateVal,
    selectedStatus = "all",
    onOrdersLoaded,
    allOrders: propOrders,
  } = props;
  const customStyles = TableStyles();
  const { setEmployeeDataContext } = useContext(DataContext);

  //=>>> Get order id from url query param
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  // States
  const [allOrders, setAllOrders] = useState([]);
  const [apiData, setApiData] = useState([]);
  const [filteredApiData, setFilteredApiData] = useState([]);

  const getApiData = async () => {
    try {
      await ApiConfig.get("/orders", { headers }).then((response) => {
        const datas = response.data.data || [];
        setAllOrders(datas);
        if (onOrdersLoaded) {
          onOrdersLoaded(datas);
        }
        setApiData(datas);
        setFilteredApiData(datas);
        //=>>> Filter order for selected employee
      });
    } catch (error) {
      setLoader(false);
      // console.log(error);
    }
  };
  useEffect(() => {
    if (propOrders && propOrders.length) {
      setAllOrders(propOrders);
    } else if (headers && headers.Authorization) {
      getApiData();
    }
  }, [propOrders, headers, relodeTable]);

  //=>>> Seperation employee from order
  useEffect(() => {
    const initialSeperatedEmp = {};
    allOrders.map((item) => {
      initialSeperatedEmp[item.employee_id] = item.employee_name;
    });

    const arrayObjectsOfEmployee = Object.entries(initialSeperatedEmp).map(
      ([id, name]) => ({
        id: id,
        name: name,
      })
    );
    setEmployeeDataContext(arrayObjectsOfEmployee);
  }, [allOrders]);
  //=>>> Seperation employee from order

  //=>>> Filter order for selected employee, date range, and status
  useEffect(() => {
    let filtered = allOrders;

    // Filter by employee
    if (selectedEmpID && selectedEmpID != "0") {
      filtered = filtered.filter(
        (item) => String(item.employee_id) === String(selectedEmpID)
      );
    }

    // Filter by date range
    if (dateVal && dateVal.start && dateVal.end) {
      filtered = filtered.filter((item) => {
        const d = parseStandardDate(item.order_date || item.created_at);
        return d >= dateVal.start && d <= dateVal.end;
      });
    }

    // Filter by status (pending, active, inactive)
    if (selectedStatus && selectedStatus !== "all") {
      filtered = filtered.filter(
        (item) => String(item.status || "").toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    setApiData(filtered);
    setFilteredApiData(filtered);
  }, [selectedEmpID, dateVal, selectedStatus, allOrders]);
  //=>>> Filter order for selected employee, date range, and status

  const canManageOrderStatus = useMemo(() => {
    if (Array.isArray(userDesignationSlug)) {
      return userDesignationSlug.some((s) =>
        ["manager", "admin", "super_admin", "developer", "rsm"].includes(
          String(s).toLowerCase()
        )
      );
    }
    return [
      "manager",
      "admin",
      "super_admin",
      "developer",
      "rsm",
    ].includes(String(userDesignationSlug).toLowerCase());
  }, [userDesignationSlug]);

  const approveOrder = async (idParam, statusParam) => {
    if (canManageOrderStatus) {
      const payload = {};
      await ApiConfig.post(
        `orders/${idParam}/status?status=${
          statusParam == "pending" ? "active" : "pending"
        }`,
        payload,
        { headers }
      )
        .then((response) => {
          setRelodeTable((prev) => !prev);
          toast.success("Order status changed successfully");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      return;
    }
  };

  //=>>> Data table expanded data
  const ExpandedComponent = ({ data }) => {
    // console.log(typeof data);
    return <pre>{JSON.stringify(data.products, null, 2)}</pre>;
  };

  //=>>> Column for datatable start
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10; // Item per page
  const columnsFunction = () => {
    const columns = [
      {
        name: "Sl No",
        field: "SlNo",
        width: "72px",
        selector: (row, index) => (currentPage - 1) * perPage + (index + 1),
      },
      {
        name: "Customer name",
        field: "cust_name",
        grow: 2,
        selector: (row) => row.customer_name,
      },
      {
        name: "Employee name",
        field: "employee_name",
        grow: 2,
        selector: (row) => row.employee_name,
      },
      {
        name: "Products",
        field: "Products",
        grow: 4,
        cell: (row) => (
          <div className="w-full text-left">
            {row.products.map((item, index) => {
              return (
                <ol key={index}>
                  <li className="my-3">
                    <strong className="mr-2">{index + 1})</strong>
                    <strong>
                      {item.product_name}-{item.pack_size}
                    </strong>
                    <br />{" "}
                    <span style={{ fontSize: "0.85rem" }}>
                      (Qty: {item.quantity}), (Due qty: {item.due_quantity}),
                      (Bonus: {item.bonus_qty})
                    </span>
                  </li>
                </ol>
              );
            })}
          </div>
        ),
      },
      {
        name: "Date",
        field: "created_at",
        grow: 2,
        selector: (row) => row.order_date,
      },
      {
        name: "Offer",
        field: "offer",
        grow: 2,
        selector: (row) => row.offer || "-",
      },
    ];
    //=>>> Push status
    columns.push({
      name: "Status",
      grow: 2,
      cell: (row) => (
        <div>
          <button
            onClick={() => approveOrder(row.id, row.status)}
            disabled={!canManageOrderStatus}
            style={{
              backgroundColor:
                row.status === "active"
                  ? "green"
                  : row.status === "inactive"
                  ? "red"
                  : row.status === "pending"
                  ? "orange"
                  : "gray",
              color: "white",
              fontWeight: "600",
              fontSize: "0.8rem",
              padding: "4px 7px",
              borderRadius: "6px",
              border: "none",
            }}
          >
            {row.status}
          </button>
        </div>
      ),
    });

    //=>>> Push action
    columns.push({
      name: "Action",
      width: "150px",
      cell: (row) => (
        <div className="d-flex" style={{ gap: "20px" }}>
          {["Developer", "Order-edit"].some((item) =>
            userRole.includes(item)
          ) && (
            <div className="shortModalBtn">
              <Suspense fallback="...">
                <OrderCartUpdateModal
                  id={row.id}
                  slug={`Edit order`}
                  ModalOpenBtnTitle={<FaEdit />}
                  className="editBtn"
                  identifier="orderUpdate"
                  api={`/orderUpdate/${row.id}`}
                  getSpecificDataApi="/orderShow"
                  // products_data={products}
                  // data_2={customers}
                  setRelodeTable={setRelodeTable}
                  setLoader={setLoader}
                  toolTip={`Edit`}
                />
              </Suspense>
            </div>
          )}
          {["Developer", "Order-delete"].some((item) =>
            userRole.includes(item)
          ) && (
            <Tooltip title={`Delete`} placement="bottom">
              <button>
                <IoTrashBinSharp
                  className="deleteIcon c-pointer"
                  size={20}
                  onClick={async () => {
                    const confirmation = confirm(
                      "Do you want to delete this order?"
                    );
                    if (confirmation) {
                      const payload = new FormData();
                      payload.append("id", row.id);
                      setLoader(true);
                      await ApiConfig.post(`/orderDelete/${row.id}`, payload, {
                        headers,
                      })
                        .then((response) => {
                          if (response.data.status == true) {
                            setRelodeTable((prev) => !prev);
                            console.clear();
                            setLoader(false);
                            toast.success(response.data.message);
                          } else {
                            toast.error(response.data.error);
                          }
                        })
                        .catch((e) => {
                          console.log(`Error = ${e}`);
                        });
                    } else {
                      return;
                    }
                  }}
                />
              </button>
            </Tooltip>
          )}
          {["Developer", "Sale-from-order"].some((item) =>
            userRole.includes(item)
          ) && (
            <div className="shortModalBtn">
              <Suspense fallback="">
                <SaleCartModal
                  id={row.id}
                  slug={`Sale`}
                  ModalOpenBtnTitle={<FaTruckFast />}
                  className="createUserIcon"
                  identifier="orderUpdate"
                  api={`/invoiceStore/${row.id}`}
                  getSpecificDataApi="/orderShow"
                  data={row.products}
                  setRelodeTable={setRelodeTable}
                  setLoader={setLoader}
                  toolTip={`Sale`}
                />
              </Suspense>
            </div>
          )}
        </div>
      ),
    });

    return columns;
  };
  const columns = useMemo(() => columnsFunction(), []);
  const conditionalRowStyles = [
    {
      when: (row) => row.id == id,
      style: {
        backgroundColor: "var(--light-blue)",
        animation: "blinkBg .5s ease-in-out 5", // This animation is controlling from global.css
        "&:hover": {},
      },
    },
  ];

  // Paginate with url param
  const paginationPerPage = 10;
  const targetIndex = filteredApiData.findIndex(
    (item) => String(item.id) === id
  );
  const targetPage =
    targetIndex !== -1 ? Math.floor(targetIndex / paginationPerPage) + 1 : 1;
  //=>>> Column for datatable end

  //=>>> Searching function
  useEffect(() => {
    if (!searchData || !searchData.trim()) {
      setFilteredApiData(apiData);
      return;
    }
    const q = searchData.toLowerCase().trim();
    const result = apiData.filter((item) => {
      const matchCustomer = (item.customer_name || "").toLowerCase().includes(q);
      const matchEmployee = (item.employee_name || "").toLowerCase().includes(q);
      const matchProduct = Array.isArray(item.products) && item.products.some((p) =>
        (p.product_name || "").toLowerCase().includes(q)
      );
      return matchCustomer || matchEmployee || matchProduct;
    });
    setFilteredApiData(result);
  }, [searchData, apiData]);

  return (
    <>
      <DataTable
        columns={columns}
        data={filteredApiData}
        conditionalRowStyles={conditionalRowStyles}
        customStyles={customStyles}
        pagination
        paginationRowsPerPageOptions={rowPerPage}
        paginationPerPage={paginationPerPage}
        paginationDefaultPage={targetPage}
        onChangePage={(page) => setCurrentPage(page)}
      />
    </>
  );
};

export default OrdersTable;

import {
  useEffect,
  useState,
  lazy,
  Suspense,
  useMemo,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import DataTable from "react-data-table-component";
import { Switch } from "antd";
import { FaEdit, FaEye } from "react-icons/fa";
import { IoTrashBinSharp } from "react-icons/io5";

// Utilities
import ApiConfig from "../../assets/js/ApiConfig";
import { TableStyles, rowPerPage } from "../../assets/js/Utility";

// CSS
import "../../assets/css/DataTable.css";

// Components
const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);

const CustomerTable = ({
  headers,
  userRole = [],
  uid,
  userDesignationSlug,
  relodeTable,
  setRelodeTable,
  setLoader,
  inputFields,
  officersData = [],
  selectedRows = [],
  setSelectedRows,
  toggledClearRows,
  searchData = "",
  selectedOfficerId = "",
  selectedDueStatus = "all",
  selectedSmsStatus = "all",
  propCustomers,
  onCustomersLoaded,
}) => {
  const [apiData, setApiData] = useState([]);
  const [filteredApiData, setFilteredApiData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const customStyles = useMemo(() => TableStyles(), []);

  const isOfficer = useMemo(() => {
    if (Array.isArray(userDesignationSlug)) {
      return userDesignationSlug.includes("officer");
    }
    return userDesignationSlug === "officer";
  }, [userDesignationSlug]);

  // Sync propCustomers from parent or fetch internally
  const getApiData = useCallback(async () => {
    try {
      if (setLoader) setLoader(true);
      const api = isOfficer ? `customerByEmployee/${uid}` : "/customers";

      const response = await ApiConfig.get(api, { headers });
      const data = response.data?.data || [];
      setApiData(data);
      setFilteredApiData(data);
      if (onCustomersLoaded) {
        onCustomersLoaded(data);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      if (setLoader) setLoader(false);
    }
  }, [headers, uid, isOfficer, setLoader, onCustomersLoaded]);

  useEffect(() => {
    if (propCustomers && Array.isArray(propCustomers)) {
      setApiData(propCustomers);
      setFilteredApiData(propCustomers);
    } else if (headers && headers.Authorization) {
      getApiData();
    }
  }, [propCustomers, headers, relodeTable, getApiData]);

  // Multi-field search and dropdown filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      let result = apiData;

      // 1. Live text search
      if (searchData && searchData.trim() !== "") {
        const lower = searchData.toLowerCase().trim();
        result = result.filter(
          (item) =>
            (item.customer_name?.toLowerCase() || "").includes(lower) ||
            (item.phone?.toLowerCase() || "").includes(lower) ||
            (item.proprietor_name?.toLowerCase() || "").includes(lower) ||
            String(item.customer_id || "").toLowerCase().includes(lower) ||
            (item.address?.toLowerCase() || "").includes(lower)
        );
      }

      // 2. Sales Officer filter
      if (selectedOfficerId && selectedOfficerId !== "") {
        result = result.filter(
          (item) => String(item.employee_id) === String(selectedOfficerId)
        );
      }

      // 3. Due status filter
      if (selectedDueStatus === "due") {
        result = result.filter((item) => Number(item.due || 0) > 0);
      } else if (selectedDueStatus === "clear") {
        result = result.filter((item) => Number(item.due || 0) <= 0);
      }

      // 4. SMS status filter
      if (selectedSmsStatus === "enabled") {
        result = result.filter((item) => Boolean(item.sms_enabled));
      } else if (selectedSmsStatus === "disabled") {
        result = result.filter((item) => !item.sms_enabled);
      }

      setFilteredApiData(result);
      setCurrentPage(1);
    }, 200);

    return () => clearTimeout(timer);
  }, [
    searchData,
    apiData,
    selectedOfficerId,
    selectedDueStatus,
    selectedSmsStatus,
  ]);

  const handleTabelSelectChange = useCallback(
    ({ selectedRows: selRows }) => {
      if (setSelectedRows) {
        setSelectedRows(selRows);
      }
      sessionStorage.setItem("printCustomer", JSON.stringify(selRows));
    },
    [setSelectedRows]
  );

  const handleSmsToggle = async (checked, customerId) => {
    try {
      if (setLoader) setLoader(true);
      const response = await ApiConfig.post(
        `/customerToggleSms/${customerId}`,
        {},
        { headers }
      );
      if (response.data?.status) {
        toast.success(response.data.message || "SMS status updated");
        if (setRelodeTable) setRelodeTable((prev) => !prev);
      } else {
        toast.error(response.data?.message || "Failed to toggle SMS status");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while toggling SMS status");
    } finally {
      if (setLoader) setLoader(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        name: "Sl No",
        width: "68px",
        selector: (_, index) => (currentPage - 1) * perPage + (index + 1),
      },
      {
        name: "Cust ID",
        width: "95px",
        sortable: true,
        selector: (row) => row.customer_id,
        cell: (row) => (
          <span className="font-semibold text-slate-700">
            {row.customer_id}
          </span>
        ),
      },
      {
        name: "Customer Name",
        grow: 2,
        sortable: true,
        selector: (row) => row.customer_name,
        cell: (row) => (
          <span className="font-bold text-slate-900">
            {row.customer_name}
          </span>
        ),
      },
      {
        name: "Proprietor",
        grow: 1.5,
        sortable: true,
        selector: (row) => row.proprietor_name || "-",
      },
      {
        name: "Phone",
        width: "125px",
        selector: (row) => row.phone,
      },
      {
        name: "Address",
        grow: 2,
        selector: (row) => row.address || "-",
      },
      {
        name: "Credit Limit",
        width: "125px",
        sortable: true,
        selector: (row) => Number(row.credit_limit || 0),
        cell: (row) => {
          const num = Number(row.credit_limit || 0);
          return (
            <span>
              {num > 0
                ? "Tk " +
                  num.toLocaleString("en-IN", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : "Tk 0"}
            </span>
          );
        },
      },
      {
        name: "Due",
        width: "135px",
        sortable: true,
        selector: (row) => Number(row.due || 0),
        cell: (row) => {
          const num = Number(row.due || 0);
          return (
            <span
              style={{
                fontWeight: "700",
                color: num > 0 ? "#dc2626" : "#16a34a",
              }}
            >
              Tk{" "}
              {num.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          );
        },
      },
      {
        name: "SMS",
        width: "85px",
        cell: (row) => (
          <Switch
            checked={Boolean(row.sms_enabled)}
            onChange={(checked) => handleSmsToggle(checked, row.id)}
            checkedChildren="On"
            unCheckedChildren="Off"
          />
        ),
      },
      {
        name: "Action",
        width: "135px",
        cell: (row) => (
          <div className="d-flex align-items-center gap-3">
            {["Developer", "Customer-edit"].some((r) =>
              userRole.includes(r)
            ) && (
              <Suspense fallback={null}>
                <CommonModal
                  id={row.id}
                  slug="Edit customer"
                  inputFields={inputFields}
                  ModalOpenBtnTitle={<FaEdit />}
                  className="editBtn"
                  identifier="customerUpdate"
                  api={`/customerUpdate/${row.id}`}
                  data={officersData}
                  getSpecificDataApi="/customerShow"
                  setRelodeTable={setRelodeTable}
                  setLoader={setLoader}
                  toolTip={`Edit ${row.customer_name}`}
                />
              </Suspense>
            )}

            {["Developer", "Customer-delete"].some((r) =>
              userRole.includes(r)
            ) && (
              <Tooltip title={`Delete ${row.customer_name}`}>
                <button
                  type="button"
                  className="bg-transparent border-0 p-0 cursor-pointer"
                  onClick={async () => {
                    if (confirm(`Delete ${row.customer_name}?`)) {
                      try {
                        if (setLoader) setLoader(true);
                        const payload = new FormData();
                        payload.append("id", row.id);
                        const response = await ApiConfig.post(
                          `/customerDelete/${row.id}`,
                          payload,
                          { headers }
                        );
                        if (response.data?.status) {
                          toast.success(response.data.message);
                          if (setRelodeTable) setRelodeTable((prev) => !prev);
                        } else {
                          toast.error(response.data?.error || "Delete failed");
                        }
                      } catch (err) {
                        console.error(err);
                        toast.error("Something went wrong!");
                      } finally {
                        if (setLoader) setLoader(false);
                      }
                    }
                  }}
                >
                  <IoTrashBinSharp
                    className="deleteIcon cursor-pointer text-red-500 hover:text-red-700"
                    size={18}
                  />
                </button>
              </Tooltip>
            )}

            {["Developer", "Customer-details-page"].some((r) =>
              userRole.includes(r)
            ) && (
              <Tooltip title={`View ${row.customer_name}`}>
                <Link
                  to={`/customers/view-details/${row.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaEye size={17} />
                </Link>
              </Tooltip>
            )}
          </div>
        ),
      },
    ],
    [
      currentPage,
      perPage,
      userRole,
      inputFields,
      officersData,
      setRelodeTable,
      setLoader,
      headers,
    ]
  );

  return (
    <DataTable
      columns={columns}
      data={filteredApiData}
      customStyles={customStyles}
      pagination
      paginationRowsPerPageOptions={rowPerPage}
      onChangePage={(page) => setCurrentPage(page)}
      onChangeRowsPerPage={(newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
      }}
      selectableRows
      onSelectedRowsChange={handleTabelSelectChange}
      clearSelectedRows={toggledClearRows}
      persistTableHead
    />
  );
};

export default CustomerTable;

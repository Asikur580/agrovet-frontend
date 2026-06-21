import { useEffect, useState, lazy, Suspense, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import DataTable from "react-data-table-component";

//=>>> Css
import "../../../assets/css/DataTable.css";

//=>>> Icons
import {
  FaEdit,
  FaFileInvoiceDollar,
  FaCloudDownloadAlt,
} from "react-icons/fa";
import { IoTrashBinSharp } from "react-icons/io5";

//=>>> Components
const SaleCartUpdateModal2 = lazy(() =>
  import("../../../components/Modal/SaleModal/SaleCartUpdateModal2")
);

//=>>> Utilities
import ApiConfig from "../../../assets/js/ApiConfig";
import { DataContext } from "../../../context/DataContext";
import { TableStyles, rowPerPage } from "../../../assets/js/Utility";
import useOSDetection from "../../../hooks/useOSDetection";

const SalesTable = (props) => {
  const {
    headers,
    userRole,
    userDesignationSlug,
    relodeTable,
    setRelodeTable,
    setLoader,
    inputFields,
    searchData,
    dateVal,
    selectedEmpID,
  } = props;
  const customStyles = TableStyles();
  const { setContextData, setEmployeeDataContext } = useContext(DataContext);
  const { os, isMobile } = useOSDetection();
  const matchDesignationSlug =
    userDesignationSlug == "admin" ||
    userDesignationSlug == "manager" ||
    userDesignationSlug == "officer" ||
    userDesignationSlug == "rsm";

  //=>>> Get invoice id from url query param
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  // States
  const [allInvoices, setAllInvoices] = useState([]);
  const [apiData, setApiData] = useState([]);
  const [filteredApiData, setFilteredApiData] = useState([]);
  // const [empIdFromInvoice, setEmpIdFromInvoice] = useState([]);

  const getApiData = async () => {
    try {
      /*const api =
        userDesignationSlug == "officer"
          ? `salesByEmployee/${uid}`
          : "/invoices";*/

      await ApiConfig.get("/invoices", { headers }).then((response) => {
        const datas = response.data.data;
        setAllInvoices(datas);
        //=>>> Filter invoice for selected employee
        if (selectedEmpID != "0") {
          const filtered = datas.filter(
            (item) => item.employee_id == selectedEmpID
          );
          setApiData(filtered);
          setFilteredApiData(filtered);
        } else {
          setApiData(allInvoices);
          setFilteredApiData(allInvoices);
        }
        //=>>> Filter invoice for selected employee

        // setApiData(datas);
        // setFilteredApiData(datas);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    getApiData();
  }, [relodeTable]);

  //=>>> Seperation employee from invoice
  useEffect(() => {
    const initialSeperatedEmp = {};
    allInvoices.map((item) => {
      initialSeperatedEmp[item.employee_id] = item.employee_name;
    });

    const arrayObjectsOfEmployee = Object.entries(initialSeperatedEmp).map(
      ([id, name]) => ({
        id: id,
        name: name,
      })
    );
    setEmployeeDataContext(arrayObjectsOfEmployee);
  }, [allInvoices]);
  //=>>> Seperation employee from invoice

  //=>>> Filter invoice for selected employee
  useEffect(() => {
    if (selectedEmpID != "0") {
      const filtered = allInvoices.filter(
        (item) => item.employee_id == selectedEmpID
      );
      setApiData(filtered);
      setFilteredApiData(filtered);
    } else {
      setApiData(allInvoices);
      setFilteredApiData(allInvoices);
    }
    // console.log(selectedEmpID);
  }, [selectedEmpID]);
  //=>>> Filter invoice for selected employee

  //=>>> Column for datatable start
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10; // Item per page
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
      selector: (row) =>
        matchDesignationSlug ? row.customer_name : row.customer.customer_name,
    },
    {
      name: "Employee name",
      field: "employee_name",
      grow: 2,
      selector: (row) =>
        matchDesignationSlug ? row.employee_name : row.employee.name,
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
                    {matchDesignationSlug
                      ? item.product_name
                      : item.product.name}
                    -{item.pack_size}
                  </strong>
                  <br />{" "}
                  <div className="text-[0.85rem]">
                    (Qty: {item.quantity}), (Due qty: {item.due_quantity}),
                    (Bonus: {item.bonus_qty})
                  </div>
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
      selector: (row) =>
        matchDesignationSlug ? row.invoice_date : row.sale_date,
    },
    {
      name: "G total",
      field: "grand_total",
      selector: (row) => row.grand_total,
    },
    {
      name: "Action",
      width: "150px",
      cell: (row) => (
        <div className="d-flex" style={{ gap: "20px" }}>
          {["Developer", "Sale-edit"].some((item) =>
            userRole.includes(item)
          ) && (
            <Suspense fallback="">
              <SaleCartUpdateModal2
                id={row.id}
                slug={`Edit sale`}
                inputFields={inputFields}
                ModalOpenBtnTitle={<FaEdit />}
                className="editBtn"
                identifier="invoiceUpdate"
                api={`/invoiceUpdate/${row.id}`}
                getSpecificDataApi="/invoiceShow"
                // data_2={customers}
                setRelodeTable={setRelodeTable}
                setLoader={setLoader}
                toolTip={`Edit`}
              />
            </Suspense>
          )}
          {["Developer", "Sale-delete"].some((item) =>
            userRole.includes(item)
          ) && (
            <Tooltip title={`Delete`} placement="bottom">
              <button>
                <IoTrashBinSharp
                  className="deleteIcon c-pointer"
                  size={20}
                  onClick={async () => {
                    const confirmation = confirm(
                      "Do you want to delete this sale?"
                    );
                    if (confirmation) {
                      const payload = new FormData();
                      payload.append("id", row.id);
                      setLoader(true);
                      await ApiConfig.post(
                        `/invoiceDelete/${row.id}`,
                        payload,
                        {
                          headers,
                        }
                      )
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
          {isMobile &&
            ["Developer", "Sale-invoice"].some((item) =>
              userRole.includes(item)
            ) && (
              <Tooltip title={`Invoice`} placement="bottom">
                <Link to={`/sales/invo-mobile/${row.id}`}>
                  <FaFileInvoiceDollar
                    style={{
                      color: "var(--light-purple)",
                      fontSize: "1.12rem",
                    }}
                  />
                </Link>
              </Tooltip>
            )}
          {!isMobile &&
            ["Developer", "Sale-invoice"].some((item) =>
              userRole.includes(item)
            ) && (
              <Tooltip title={`Invoice`} placement="bottom">
                <Link to={`/invoice/${row.id}`} target="_blank">
                  <FaCloudDownloadAlt
                    style={{ color: "var(--light-purple)", fontSize: "1.3rem" }}
                  />
                </Link>
              </Tooltip>
            )}
        </div>
      ),
    },
  ];
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

  const filterData = () => {
    let filteredData = apiData;

    // Search filter
    if (searchData) {
      filteredData = filteredData.filter((row) => {
        // const searchPath =
        //   userDesignationSlug == "admin" || userDesignationSlug == "manager"
        //     ? row.customer_name
        //     : row.customer.customer_name;
        const searchPath = row.customer_name;
        return searchPath.toLowerCase().includes(searchData.toLowerCase());
      });
    }

    // Date range filter
    if (dateVal.start && dateVal.end) {
      filteredData = filteredData.filter((row) => {
        // const searchPath =
        //   userDesignationSlug == "admin" || userDesignationSlug == "manager"
        //     ? row.invoice_date
        //     : row.sale_date;
        const searchPath = row.invoice_date;

        const saleDate = searchPath;
        const startDate = dateVal.start;
        const endDate = dateVal.end;
        return saleDate >= startDate && saleDate <= endDate;
      });
    }

    setFilteredApiData(filteredData);
  };
  useEffect(() => {
    filterData();
  }, [searchData, dateVal]);

  //=>>> Calculate sum of grand total
  const calculateGrandTotal = () => {
    return filteredApiData.reduce((total, row) => total + row.grand_total, 0);
  };
  useEffect(() => {
    setContextData(calculateGrandTotal().toFixed(2));
  }, [filteredApiData]);

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

export default SalesTable;

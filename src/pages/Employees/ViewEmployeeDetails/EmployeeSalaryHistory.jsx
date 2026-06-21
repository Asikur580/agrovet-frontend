import { useEffect, useState, lazy, Suspense, useContext } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import DataTable from "react-data-table-component";
import { HelmetProvider, Helmet } from "react-helmet-async";

//=>>> Css
import "../../../assets/css/DataTable.css";

//=>>> Icons
import { FaEdit } from "react-icons/fa";
import { IoTrashBinSharp } from "react-icons/io5";

//=>>> Components
const CommonModal = lazy(() =>
  import("../../../components/Modal/CommonModal/CommonModal")
);
const ModalTable = lazy(() =>
  import("../../../components/Modal/CommonModal/ModalTable")
);

//=>>> Utilities
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";
import { TableStyles, rowPerPage } from "../../../assets/js/Utility";
import useStickyScroll from "../../../hooks/useStickyScroll";

const EmployeeSalaryHistory = ({ setLoader }) => {
  const { id } = useParams(); // customer id
  const { headers, userRole } = useContext(AuthContext);
  const customStyles = TableStyles();
  const stickyRef = useStickyScroll(67);

  // States
  const [apiData, setApiData] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [filteredApiData, setFilteredApiData] = useState([]);
  const [relodeTable, setRelodeTable] = useState(false);

  const getApiData = async () => {
    try {
      setLoader(true);
      await ApiConfig.get(`/employeeSalary/${id}`, { headers }).then(
        (response) => {
          setApiData(response.data.data);
          setFilteredApiData(response.data.data);
          setLoader(false);
          // console.log(response.data);
        }
      );
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  useEffect(() => {
    getApiData();
  }, [relodeTable]);

  //=>>> Input For modal
  const inputFields = [
    {
      field: "sell_price",
      type: "text",
      label: "Amount",
      isRequired: true,
      placeholder: "Enter amount",
    },
  ];

  //=>>> Column for datatable start
  const columns = [
    {
      name: "Sl No",
      field: "SlNo",
      width: "80px",
      selector: (row, index) => index + 1,
    },
    {
      name: "Employee name",
      field: "employee_name",
      selector: (row) => row.employee_name,
    },
    {
      name: "Basic salary",
      field: "basic_salary",
      selector: (row) => row.basic_salary,
    },
    {
      name: "paid",
      field: "paid_amount",
      selector: (row) => row.paid_amount,
    },
    {
      name: "Advance",
      field: "advance_amount",
      selector: (row) => row.advance_amount,
    },
    {
      name: "Due",
      field: "due_amount",
      selector: (row) => row.due_amount,
    },
    {
      name: "Month",
      field: "month_year",
      width: "500px",
      selector: (row) => row.month_year,
    },
    {
      name: "Action",
      width: "150px",
      cell: (row) => (
        <div className="d-flex" style={{ gap: "20px" }}>
          <div className="shortModalBtn">
            <Suspense fallback="...">
              <CommonModal
                id={row.id}
                slug={`Edit cost`}
                inputFields={inputFields}
                ModalOpenBtnTitle={<FaEdit />}
                className="editBtn"
                identifier="salaryUpdate"
                api={`/salaryUpdate/${row.id}`}
                data={id}
                getSpecificDataApi="/salaryShow"
                setRelodeTable={setRelodeTable}
                setLoader={setLoader}
                toolTip={`Edit ${row.amount}`}
              />
            </Suspense>
          </div>
          <Tooltip title={`Delete ${row.amount}`} placement="bottom">
            <button>
              <IoTrashBinSharp
                className="deleteIcon c-pointer"
                size={20}
                onClick={async () => {
                  const confirmation = confirm(
                    "Do you want to delete this salary?"
                  );
                  if (confirmation) {
                    const payload = new FormData();
                    payload.append("id", row.id);

                    setLoader(true);
                    await ApiConfig.post(`/salaryDelete/${row.id}`, payload, {
                      headers,
                    })
                      .then((response) => {
                        if (response.data.status == true) {
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
                        console.log(`Error = ${e}`);
                      });
                  } else {
                    return;
                  }
                }}
              />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];
  //=>>> Column for datatable end

  //=>>> Searching function
  useEffect(() => {
    const result = apiData.filter((filteredApiData) => {
      return filteredApiData.employee_name
        .toLowerCase()
        .match(searchData.toLowerCase());
    });
    setFilteredApiData(result);
  }, [searchData]);

  //=>>> Print section start
  const [selectedRows, setSelectedRows] = useState(false);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const handleClearRows = () => {
    setToggleClearRows(!toggledClearRows);
  };

  const handleTabelSelectChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
    sessionStorage.setItem("printEmployeeSalary", JSON.stringify(selectedRows));
  };

  const tableHead = ["Sl no", "Month", "Basic", "Paid", "Advance", "Due"];
  //=>>> Print section end

  return (
    <HelmetProvider>
      <Helmet>
        <title>Salary history</title>
        <meta name="description" content="Agrovet software" />
      </Helmet>

      {/* For go to top */}
      <input
        type="file"
        autoFocus
        style={{ height: "0", opacity: 0, pointerEvents: "none" }}
      />
      {/* For go to top */}

      <div className="users content animated fadeInDown">
        <h1 className="page-title">Salary history</h1>
        <div
          ref={stickyRef}
          className="sticky top-[67px] z-50 flex justify-between mb-2"
        >
          <div className="searchInput">
            <input
              type="text"
              placeholder="Search"
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
            />
          </div>

          {["Developer", "Employee-salary-print"].some((item) =>
            userRole.includes(item)
          ) && (
            <Suspense fallback="...">
              <ModalTable
                id={null}
                slug={`Employee salary's details`}
                inputFields={[]}
                ModalOpenBtnTitle={"Print"}
                className="addBtn"
                identifier="printEmployeeSalary"
                data={selectedRows}
                tableHead={tableHead}
                width={""}
              />
            </Suspense>
          )}
        </div>

        <DataTable
          columns={columns}
          data={filteredApiData}
          customStyles={customStyles}
          pagination
          paginationRowsPerPageOptions={rowPerPage}
          selectableRows
          onSelectedRowsChange={handleTabelSelectChange}
          clearSelectedRows={toggledClearRows}
        />
      </div>
    </HelmetProvider>
  );
};

export default EmployeeSalaryHistory;

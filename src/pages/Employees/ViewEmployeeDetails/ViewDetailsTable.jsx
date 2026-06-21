import { useContext, useEffect, useState, lazy, Suspense } from "react";
import DataTable from "react-data-table-component";
import { DatePicker, Space } from "antd";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";

//=>>> Css
import "../../../assets/css/DataTable.css";

//=>>> Icons
import { FaCloudDownloadAlt } from "react-icons/fa";

//=>>> Components
const ModalTable = lazy(() =>
  import("../../../components/Modal/CommonModal/ModalTable")
);

//=>>> Utility
import { TableStyles, rowPerPage } from "../../../assets/js/Utility";
import { AuthContext } from "../../../context/AuthContext";
import { DataContext } from "../../../context/DataContext";
import useStickyScroll from "../../../hooks/useStickyScroll";

const ViewDetailsTable = (props) => {
  const { apiData, setApiData, filteredApiData, setFilteredApiData } = props;
  const { userRole } = useContext(AuthContext);
  const { setContextData } = useContext(DataContext);
  const stickyRef = useStickyScroll(67);
  const { RangePicker } = DatePicker;
  const customStyles = TableStyles();

  // States
  const [dateVal, setDateVal] = useState({ start: "", end: "" });
  const [searchData, setSearchData] = useState("");

  // Function to filter based on search term and date range
  const filterData = () => {
    let filteredData = apiData;

    // Search filter
    if (searchData) {
      filteredData = filteredData.filter((row) =>
        row.invoiceId.toLowerCase().includes(searchData.toLowerCase())
      );
    }

    // Date range filter
    if (dateVal.start && dateVal.end) {
      filteredData = filteredData.filter((row) => {
        const saleDate = row.sale_date;
        const startDate = dateVal.start;
        const endDate = dateVal.end;

        return saleDate >= startDate && saleDate <= endDate;
      });
    }

    setFilteredApiData(filteredData);
  };

  //=>>> Watch for changes in search or date range
  useEffect(() => {
    filterData();
  }, [searchData, dateVal]);

  //=>>> Calculate sum of grand total
  const calculateGrandTotal = () => {
    return filteredApiData.reduce((total, row) => total + row.grand_total, 0);
  };
  useEffect(() => {
    setContextData(calculateGrandTotal());
  }, [filteredApiData]);

  //=>>> Columns for data table
  const columns = [
    {
      name: "Sl No",
      field: "SlNo",
      width: "80px",
      selector: (row, index) => index + 1,
    },
    {
      name: "Invoice Id",
      field: "invoiceId",
      selector: (row) => row.invoiceId,
    },
    {
      name: "Customer name",
      field: "invoiceId",
      selector: (row) => row.customer.customer_name,
    },
    {
      name: "Grand total",
      field: "grand_total",
      selector: (row) => row.grand_total,
    },
    {
      name: "Sale date",
      field: "sale_date",
      selector: (row) => row.sale_date,
    },
    {
      name: "Action",
      width: "90px",
      cell: (row) => (
        <div className="d-flex" style={{ gap: "20px" }}>
          {["Developer", "Sale-invoice"].some((item) =>
            userRole.includes(item)
          ) && (
            <Tooltip title={`Invoice`} placement="bottom">
              <Link to={`/invoice-pdf/${row.id}`} target="_blank">
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

  //=>>> Print section start
  const [selectedRows, setSelectedRows] = useState(false);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const handleClearRows = () => {
    setToggleClearRows(!toggledClearRows);
  };

  const handleTabelSelectChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
    sessionStorage.setItem(
      "printEmployeeDetails",
      JSON.stringify(selectedRows)
    );
  };

  const tableHead = ["Sl no", "Invoice id", "Grand total", "Sale date"];
  //=>>> Print section end

  return (
    <>
      <div
        ref={stickyRef}
        className="sticky top-[67px] z-50 flex justify-between items-center mb-2"
      >
        <div className="flex flex-col gap-y-3">
          {/* gap-2.5 */}
          <div className="searchDate">
            <Space direction="vertical" size={12}>
              <RangePicker
                format="YYYY-MM-DD"
                onChange={(evt, dateString) => {
                  if (!evt) {
                    setDateVal({ start: "", end: "" });
                  } else {
                    setDateVal({
                      start: dateString[0],
                      end: dateString[1],
                    });
                  }
                }}
              />
            </Space>
          </div>
          <div className="searchInput">
            <input
              type="text"
              placeholder="Search"
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
            />
          </div>
        </div>

        {["Developer", "Employee-details-print"].some((item) =>
          userRole.includes(item)
        ) && (
          <Suspense fallback="...">
            <ModalTable
              id={null}
              slug={`Employee's details`}
              inputFields={[]}
              ModalOpenBtnTitle={"Print"}
              className="addBtn"
              identifier="printEmployeeDetails"
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
    </>
  );
};

export default ViewDetailsTable;

import { useEffect, useState, lazy, Suspense, useContext } from "react";
import DataTable from "react-data-table-component";
import Tooltip from "@mui/material/Tooltip";
import { DatePicker, Space } from "antd";

//=>>> Css
import "../../../assets/css/DataTable.css";

//=>>> Components
const ModalTable = lazy(() =>
  import("../../../components/Modal/CommonModal/ModalTable")
);

//=>>> Utility
import { TableStyles, rowPerPage } from "../../../assets/js/Utility";
import { AuthContext } from "../../../context/AuthContext";
import useStickyScroll from "../../../hooks/useStickyScroll";
import ApiConfig from "../../../assets/js/ApiConfig";

const ViewDetailsTable = (props) => {
  const {
    apiData,
    setApiData,
    filteredApiData,
    setFilteredApiData,
    id,
    setLoader,
  } = props;
  const { headers, userRole } = useContext(AuthContext);
  const { RangePicker } = DatePicker;
  const customStyles = TableStyles();
  const stickyRef = useStickyScroll(67);

  // States
  const [dateVal, setDateVal] = useState({ start: "", end: "" });
  const [searchData, setSearchData] = useState("");

  // Function to filter based on search term and date range
  const filterData = () => {
    let filteredData = apiData;

    // Search filter
    if (searchData) {
      filteredData = filteredData.filter((row) =>
        row.customer_name.toLowerCase().includes(searchData.toLowerCase())
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

  // Watch for changes in search or date range
  useEffect(() => {
    filterData();
  }, [searchData, dateVal]);

  const [sotckHistory, setSotckHistory] = useState({});
  const GetSotckHistory = async () => {
    try {
      setLoader(true);
      await ApiConfig.get(`stockInOutHistory/${id}`, { headers }).then(
        (response) => {
          setSotckHistory(response.data.data);
          setLoader(false);
        }
      );
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  useEffect(() => {
    GetSotckHistory();
  }, []);

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
      field: "customer_name",
      selector: (row) => row.customer_name,
    },
    {
      name: "Quantity",
      field: "quantity",
      selector: (row) => row.quantity + row.bonus_qty,
    },
    {
      name: "Unit Price",
      field: "unit_price",
      selector: (row) => row.unit_price,
    },
    {
      name: "Item Total",
      field: "item_amount",
      selector: (row) => row.item_amount,
    },
    {
      name: "Discount",
      field: "item_discount",
      selector: (row) => Number(row.item_discount).toFixed(2),
    },
    {
      name: "less",
      field: "less",
      selector: (row) => Number(row.item_less).toFixed(2),
    },
    {
      name: "Net Amount",
      field: "net_amount",
      selector: (row) => Number(row.net_amount).toFixed(2),
    },
    {
      name: "Grand Total",
      field: "grand_total",
      selector: (row) => row.grand_total,
    },
    {
      name: "Sale date",
      field: "sale_date",
      selector: (row) => row.sale_date,
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
    sessionStorage.setItem("printProductDetails", JSON.stringify(selectedRows));
  };

  const tableHead = [
    "Sl no",
    "Customer name",
    "Quantity",
    "U.Price",
    "Item Total",
    "Discount",
    "less",
    "Net Amount",
    "Grand Total",
    "Sale date",
  ];
  //=>>> Print section end

  return (
    <>
      <div
        ref={stickyRef}
        className="sticky top-[67px] z-50 flex justify-between items-center mb-2"
      >
        <div className="flex flex-col gap-y-3">
          <div className="searchDate">
            <Space direction="vertical" size={12}>
              <RangePicker
                format="YYYY-MM-DD"
                onChange={(evt, dateString) => {
                  if (!evt) {
                    setDateVal({ start: "", end: "" });
                  } else {
                    setDateVal({
                      // start: new Date(evt[0]).toLocaleDateString(),
                      // end: new Date(evt[1]).toLocaleDateString(),
                      start: dateString[0],
                      end: dateString[1],
                    });

                    // console.log(new Date(eDate).toLocaleDateString());
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

        <div
          className="inline-grid gap-3
"
        >
          {["Developer", "Product-details-print"].some((item) =>
            userRole.includes(item)
          ) && (
            <Suspense fallback="...">
              <ModalTable
                id={null}
                slug={`Product's details`}
                inputFields={[]}
                ModalOpenBtnTitle={"Print"}
                className="addBtn"
                identifier="printProductDetails"
                data={selectedRows}
                tableHead={tableHead}
                width={""}
              />
            </Suspense>
          )}
          {["Developer", "Product-stockin/out-history"].some((item) =>
            userRole.includes(item)
          ) && (
            <Suspense fallback="...">
              <ModalTable
                id={null}
                slug={``}
                inputFields={[]}
                ModalOpenBtnTitle={"Stock history"}
                className="addBtn"
                identifier="stockHistory"
                data={sotckHistory}
                tableHead={{}}
                width={""}
              />
            </Suspense>
          )}
        </div>
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
        onChangePage={(page) => setCurrentPage(page)}
      />
    </>
  );
};

export default ViewDetailsTable;

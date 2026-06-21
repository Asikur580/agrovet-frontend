import { useContext, useEffect, useState, lazy, Suspense } from "react";
import DataTable from "react-data-table-component";
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

const ViewDetailsTable = (props) => {
  const { apiData, setApiData, filteredApiData, setFilteredApiData } = props;
  const { headers, userRole } = useContext(AuthContext);
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
        row.product.name.toLowerCase().includes(searchData.toLowerCase())
      );
    }

    // Date range filter
    if (dateVal.start && dateVal.end) {
      filteredData = filteredData.filter((row) => {
        const saleDate = row.in_out_date;
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

  // Columns for data table
  const columns = [
    {
      name: "Sl No",
      field: "SlNo",
      width: "72px",
      selector: (row, index) => index + 1,
    },
    {
      name: "Product Name",
      field: "product.name",
      selector: (row) => row.product.name,
    },
    {
      name: "Quantity",
      field: "quantity",
      selector: (row) => row.quantity,
    },
    {
      name: "Buy price",
      field: "buy_price",
      selector: (row) => row.buy_price,
    },
    {
      name: "In/out Date",
      field: "in_out_date",
      selector: (row) => row.in_out_date,
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
      "printSupplierDetails",
      JSON.stringify(selectedRows)
    );
  };

  const tableHead = [
    "Sl no",
    "Product name",
    "Quantity",
    "Buy price",
    "In/out date",
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
                onChange={(evt, dateString) => {
                  if (!evt) {
                    setDateVal({ start: "", end: "" });
                  } else {
                    setDateVal({
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

        {["Developer", "Supplier-details-print"].some((item) =>
          userRole.includes(item)
        ) && (
          <Suspense fallback="...">
            <ModalTable
              id={null}
              slug={`Supplier's details`}
              inputFields={[]}
              ModalOpenBtnTitle={"Print"}
              className="addBtn"
              identifier="printSupplierDetails"
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

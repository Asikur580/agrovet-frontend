import { useEffect, useState, lazy, Suspense, useContext } from "react";
import DataTable from "react-data-table-component";
import { DatePicker, Space } from "antd";

//=>>> Css
import "../../../assets/css/DataTable.css";

//=>>> Components
const ModalTable = lazy(() =>
  import("../../../components/Modal/CommonModal/ModalTable")
);

//=>>> Utility
import { DateFormater } from "../../../assets/js/DateFormater";
import { TableStyles, rowPerPage } from "../../../assets/js/Utility";
import { AuthContext } from "../../../context/AuthContext";
import useStickyScroll from "../../../hooks/useStickyScroll";

const ViewDetailsTable = (props) => {
  const { apiData, setApiData, filteredApiData, setFilteredApiData } = props;
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
        row.name.toLowerCase().includes(searchData.toLowerCase())
      );
    }

    // Date range filter
    if (dateVal.start && dateVal.end) {
      filteredData = filteredData.filter((row) => {
        const saleDate = DateFormater(row.sale_date);
        const startDate = DateFormater(dateVal.start);
        const endDate = DateFormater(dateVal.end);

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
      width: "80px",
      selector: (row, index) => index + 1,
    },
    {
      name: "Brand name",
      field: "name",
      selector: (row) => row.name,
    },
    {
      name: "Total sold qty",
      field: "total_quantity_sold",
      selector: (row) => row.total_quantity_sold,
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
    sessionStorage.setItem("printBrandDetails", JSON.stringify(selectedRows));
  };

  const tableHead = ["Sl no", "Brand name", "Total sold qty", "Sale date"];
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
                onChange={(evt) => {
                  if (!evt) {
                    setDateVal({ start: "", end: "" });
                  } else {
                    // let eDate = `${evt[1].$y}-${evt[1].$M}-${evt[1].$D + 1}`;

                    setDateVal({
                      start: new Date(evt[0]).toLocaleDateString(),
                      end: new Date(evt[1]).toLocaleDateString(),
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
        {["Developer", "Brand-details-print"].some((item) =>
          userRole.includes(item)
        ) && (
          <Suspense fallback="...">
            <ModalTable
              id={null}
              slug={`Brand's details`}
              inputFields={[]}
              ModalOpenBtnTitle={"Print"}
              className="addBtn"
              identifier="printBrandDetails"
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

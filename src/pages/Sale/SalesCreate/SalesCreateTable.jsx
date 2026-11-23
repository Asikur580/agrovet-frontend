import { useEffect, useState, lazy, Suspense } from "react";
import DataTable from "react-data-table-component";

//=>>> Css
import "../../../assets/css/DataTable.css";

//=>>> Utilities
import ApiConfig from "../../../assets/js/ApiConfig";
import { TableStyles, rowPerPage } from "../../../assets/js/Utility";

const SalesCreateTable = (props) => {
  const {
    headers,
    userDesignationSlug,
    relodeTable,
    setSelectedRows,
    toggledClearRows,
    searchData,
  } = props;
  const customStyles = TableStyles();

  const handleTabelSelectChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  // States
  const [apiData, setApiData] = useState([]);
  const [filteredApiData, setFilteredApiData] = useState([]);

  const getApiData = async () => {
    try {
      await ApiConfig.get("/products", { headers }).then((response) => {
        setApiData(response.data.data);
        setFilteredApiData(response.data.data);
        console.clear();
      });
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  useEffect(() => {
    getApiData();
  }, [relodeTable]);

  //=>>> Column for datatable start
  const columns = [
    {
      name: "Sl No",
      field: "SlNo",
      width: "80px",
      selector: (row, index) => index + 1,
    },
    {
      name: "Product name",
      field: "product_name",
      selector: (row) => row.name,
    },
    {
      name: "Pack size",
      field: "pack_size",
      selector: (row) => row.pack_size,
    },
    userDesignationSlug == "admin"
      ? {
          name: "Buy price",
          field: "buy_price",
          selector: (row) => row.buy_price,
        }
      : {
          name: "Buy price",
          field: "buy_price",
          selector: (row) => "-",
        },
    {
      name: "Sell price",
      field: "sell_price",
      selector: (row) => row.sell_price,
    },
    {
      name: "Quantity",
      field: "quantity",
      selector: (row) => row.quantity,
      cell: (row) => {
        const q = Number(row.quantity || 0);
        if (q < 0) {
          return (
            <span className="text-red-700 font-bold bg-red-100 px-2 py-0.5 rounded text-xs border border-red-300">
              {q}
            </span>
          );
        }
        if (q === 0) {
          return (
            <span className="text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded text-xs">
              0
            </span>
          );
        }
        return <span>{q}</span>;
      },
    },
  ];
  //=>>> Column for datatable end ____//

  //=>>> Searching function
  useEffect(() => {
    const result = apiData.filter((filteredApiData) => {
      return filteredApiData.name.toLowerCase().match(searchData.toLowerCase());
    });
    setFilteredApiData(result);
  }, [searchData]);

  return (
    <>
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

export default SalesCreateTable;

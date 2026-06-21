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

const CustomerTable = ({ setLoader }) => {
  const { id } = useParams(); // Supplier id
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
      await ApiConfig.get(`/supplierPaymentHistory/${id}`, { headers }).then(
        (response) => {
          setApiData(response.data.data);
          setFilteredApiData(response.data.data);
          setLoader(false);
          // console.log(response.data.data);
          // console.clear();
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

  //___ Input For modal ___//
  const inputFields = [
    {
      field: "sell_price",
      type: "text",
      label: "Amount",
      isRequired: true,
      placeholder: "Enter amount",
    },
    // {
    //   field: "resone",
    //   type: "text",
    //   label: "Payment cause",
    //   isRequired: false,
    //   placeholder: "Enter cause of payment",
    // },
  ];

  //___ Column for datatable start ___//
  const columns = [
    {
      name: "Sl No",
      field: "SlNo",
      width: "80px",
      selector: (row, index) => index + 1,
    },
    {
      name: "Supplier name",
      field: "supplier_name",
      selector: (row) => row.supplier_name,
    },
    {
      name: "Pay method",
      field: "payment_method",
      selector: (row) => row.payment_method,
    },
    {
      name: "Amount",
      field: "amount",
      selector: (row) => row.amount,
    },
    {
      name: "Payment date",
      field: "payment_date",
      selector: (row) => row.payment_date,
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
                slug={`Edit payment`}
                inputFields={inputFields}
                ModalOpenBtnTitle={<FaEdit />}
                className="editBtn"
                identifier="paymentUpdateSupplier"
                api={`/paymentUpdate/${row.id}`}
                data={id}
                getSpecificDataApi="/paymentShow"
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
                    "Do you want to delete this payment?"
                  );
                  if (confirmation) {
                    const payload = new FormData();
                    payload.append("id", row.id);

                    setLoader(true);
                    await ApiConfig.post(`/paymentDelete/${row.id}`, payload, {
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
  //___ Column for datatable end ____//

  //___ Searching function ___//
  useEffect(() => {
    const result = apiData.filter((filteredApiData) => {
      return filteredApiData.supplier_name
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
    sessionStorage.setItem(
      "printSupplierPayment",
      JSON.stringify(selectedRows)
    );
  };

  const tableHead = ["Sl no", "Supplier name", "Pay method", "Amount", "Date"];
  //=>>> Print section end

  return (
    <HelmetProvider>
      <Helmet>
        <title>Payment history</title>
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
        <h1 className="page-title">Payment history</h1>
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

          {["Developer", "Supplier-payment-print"].some((item) =>
            userRole.includes(item)
          ) && (
            <Suspense fallback="...">
              <ModalTable
                id={null}
                slug={`Supplier payment's details`}
                inputFields={[]}
                ModalOpenBtnTitle={"Print"}
                className="addBtn"
                identifier="printSupplierPayment"
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

export default CustomerTable;

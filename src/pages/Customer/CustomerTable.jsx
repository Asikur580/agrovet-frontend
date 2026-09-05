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
import "../../assets/css/DataTable.css";
import { FaEdit, FaEye } from "react-icons/fa";
import { Switch } from "antd";
import { IoTrashBinSharp } from "react-icons/io5";
import ApiConfig from "../../assets/js/ApiConfig";
import { TableStyles, rowPerPage } from "../../assets/js/Utility";

const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);

const CustomerTable = ({
  headers,
  userRole,
  uid,
  userDesignationSlug,
  relodeTable,
  setRelodeTable,
  setLoader,
  inputFields,
  officersData,
  setSelectedRows,
  toggledClearRows,
  searchData,
  selectedOfficerId,
}) => {
  const [apiData, setApiData] = useState([]);
  const [filteredApiData, setFilteredApiData] = useState([]);
  const customStyles = useMemo(() => TableStyles(), []);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      let result = apiData;

      if (searchData && searchData.trim() !== "") {
        const lower = searchData.toLowerCase();
        result = result.filter(
          (item) =>
            (item.customer_name?.toLowerCase() || "").includes(lower) ||
            (item.phone?.toLowerCase() || "").includes(lower)
        );
      }

      if (selectedOfficerId && selectedOfficerId !== "") {
        result = result.filter((item) => item.employee_id == selectedOfficerId);
      }

      setFilteredApiData(result);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchData, apiData, selectedOfficerId]);

  const getApiData = useCallback(async () => {
    try {
      setLoader(true);
      const api =
        userDesignationSlug === "officer"
          ? `customerByEmployee/${uid}`
          : "/customers";

      const response = await ApiConfig.get(api, { headers });
      const data = response.data.data || [];
      setApiData(data);
      setFilteredApiData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  }, [headers, uid, userDesignationSlug, setLoader]);

  useEffect(() => {
    getApiData();
  }, [getApiData, relodeTable]);

  const handleTabelSelectChange = useCallback(
    ({ selectedRows }) => {
      setSelectedRows(selectedRows);
      sessionStorage.setItem("printCustomer", JSON.stringify(selectedRows));
    },
    [setSelectedRows]
  );

  const handleSmsToggle = async (checked, customerId) => {
    try {
      setLoader(true);
      const response = await ApiConfig.post(`/customerToggleSms/${customerId}`, {}, { headers });
      if (response.data.status) {
        toast.success(response.data.message);
        setRelodeTable((prev) => !prev);
      } else {
        toast.error(response.data.message || "Failed to toggle SMS status");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while toggling SMS status");
    } finally {
      setLoader(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        name: "Sl No",
        width: "72px",
        selector: (_, index) => index + 1,
      },
      { name: "Cust id", selector: (row) => row.customer_id },
      { name: "Customer name", selector: (row) => row.customer_name },
      { name: "Phone", selector: (row) => row.phone },
      { name: "Proprietor name", selector: (row) => row.proprietor_name },
      { name: "Address", selector: (row) => row.address },
      { name: "Credit Limit", selector: (row) => row.credit_limit || 0 },
      {
        name: "Due",
        selector: (row) => row.due || 0,
      },
      {
        name: "SMS",
        width: "90px",
        cell: (row) => (
          <Switch
            checked={row.sms_enabled}
            onChange={(checked) => handleSmsToggle(checked, row.id)}
            checkedChildren="On"
            unCheckedChildren="Off"
          />
        ),
      },
      {
        name: "Action",
        width: "150px",
        cell: (row) => (
          <div className="d-flex gap-4">
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
                <button>
                  <IoTrashBinSharp
                    className="deleteIcon cursor-pointer"
                    size={20}
                    onClick={async () => {
                      if (confirm(`Delete ${row.customer_name}?`)) {
                        try {
                          setLoader(true);
                          const payload = new FormData();
                          payload.append("id", row.id);
                          const response = await ApiConfig.post(
                            `/customerDelete/${row.id}`,
                            payload,
                            { headers }
                          );
                          if (response.data.status) {
                            toast.success(response.data.message);
                            setRelodeTable((prev) => !prev);
                          } else {
                            toast.error(response.data.error);
                          }
                        } catch (err) {
                          console.error(err);
                          toast.error("Something went wrong!");
                        } finally {
                          setLoader(false);
                        }
                      }
                    }}
                  />
                </button>
              </Tooltip>
            )}

            {["Developer", "Customer-details-page"].some((r) =>
              userRole.includes(r)
            ) && (
              <Tooltip title={`View ${row.customer_name}`}>
                <Link to={`/customers/view-details/${row.id}`}>
                  <FaEye className="text-blue-600 text-lg" />
                </Link>
              </Tooltip>
            )}
          </div>
        ),
      },
    ],
    [userRole, inputFields, officersData, setRelodeTable, setLoader]
  );

  return (
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
  );
};

export default CustomerTable;

// import { useEffect, useState, lazy, Suspense } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import Tooltip from "@mui/material/Tooltip";
// import DataTable from "react-data-table-component";

// //=>>> Css
// import "../../assets/css/DataTable.css";

// //=>>> Icons
// import { FaEdit, FaEye, FaImage } from "react-icons/fa";
// import { IoTrashBinSharp } from "react-icons/io5";

// //=>>> Components
// const CommonModal = lazy(() =>
//   import("../../components/Modal/CommonModal/CommonModal")
// );
// const ImageLazyLoad = lazy(() =>
//   import("../../components/ImageLazyLoad/ImageLazyLoad")
// );

// //=>>> Additional utilities
// import ApiConfig, { imgUrl } from "../../assets/js/ApiConfig";
// import { TableStyles, rowPerPage } from "../../assets/js/Utility";

// const CustomerTable = (props) => {
//   const {
//     headers,
//     userRole,
//     uid,
//     userDesignationSlug,
//     relodeTable,
//     setRelodeTable,
//     setLoader,
//     inputFields,
//     officersData,
//     setSelectedRows,
//     toggledClearRows,
//     searchData,
//   } = props;
//   const customStyles = TableStyles();

//   const handleTabelSelectChange = ({ selectedRows }) => {
//     setSelectedRows(selectedRows);
//     sessionStorage.setItem("printCustomer", JSON.stringify(selectedRows));
//   };

//   // States
//   const [apiData, setApiData] = useState([]);
//   const [filteredApiData, setFilteredApiData] = useState([]);

//   const getApiData = async () => {
//     try {
//       const api =
//         userDesignationSlug == "officer"
//           ? `customerByEmployee/${uid}`
//           : "/customers";

//       setLoader(true);
//       await ApiConfig.get("/customers", { headers }).then((response) => {
//         setApiData(response.data.data);
//         setFilteredApiData(response.data.data);
//         // console.log(response.data.data);
//         // console.clear();
//         setLoader(false);
//       });
//     } catch (error) {
//       setLoader(false);
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     getApiData();
//   }, [relodeTable]);

//   //=>>> Column for datatable start
//   const columns = [
//     {
//       name: "Sl No",
//       field: "SlNo",
//       width: "80px",
//       selector: (row, index) => index + 1,
//     },
//     {
//       name: "Customer name",
//       field: "Customer name",
//       selector: (row) => row.customer_name,
//     },
//     {
//       name: "Phone",
//       field: "phone",
//       selector: (row) => row.phone,
//     },
//     {
//       name: "Proprietor name",
//       field: "proprietor_name",
//       selector: (row) => row.proprietor_name,
//     },
//     {
//       name: "Address",
//       field: "address",
//       selector: (row) => row.address,
//     },
//     {
//       name: "Image",
//       field: "Image",
//       cell: (row) =>
//         row.image ? (
//           <Suspense fallback="">
//             <ImageLazyLoad
//               height="55px"
//               width="50px"
//               alt="Img-from-table"
//               src={`${imgUrl}${row.image}`}
//             />
//           </Suspense>
//         ) : (
//           <FaImage size={30} style={{ opacity: 0.3 }} />
//         ),
//     },
//     {
//       name: "Action",
//       width: "150px",
//       cell: (row) => (
//         <div className="d-flex" style={{ gap: "20px" }}>
//           {["Developer", "Customer-edit"].some((item) =>
//             userRole.includes(item)
//           ) && (
//             <div className="shortModalBtn">
//               <Suspense fallback="...">
//                 <CommonModal
//                   id={row.id}
//                   slug={`Edit customer`}
//                   inputFields={inputFields}
//                   ModalOpenBtnTitle={<FaEdit />}
//                   className="editBtn"
//                   identifier="customerUpdate"
//                   api={`/customerUpdate/${row.id}`}
//                   data={officersData}
//                   getSpecificDataApi="/customerShow"
//                   setRelodeTable={setRelodeTable}
//                   setLoader={setLoader}
//                   toolTip={`Edit ${row.customer_name}`}
//                 />
//               </Suspense>
//             </div>
//           )}
//           {["Developer", "Customer-delete"].some((item) =>
//             userRole.includes(item)
//           ) && (
//             <Tooltip title={`Delete ${row.customer_name}`} placement="bottom">
//               <button>
//                 <IoTrashBinSharp
//                   className="deleteIcon c-pointer"
//                   size={20}
//                   onClick={async () => {
//                     const confirmation = confirm(
//                       "Do you want to delete this customer?"
//                     );
//                     if (confirmation) {
//                       const payload = new FormData();
//                       payload.append("id", row.id);

//                       setLoader(true);
//                       await ApiConfig.post(
//                         `/customerDelete/${row.id}`,
//                         payload,
//                         {
//                           headers,
//                         }
//                       )
//                         .then((response) => {
//                           if (response.data.status == true) {
//                             setRelodeTable((prev) => !prev);
//                             console.clear();
//                             setLoader(false);
//                             toast.success(response.data.message);
//                           } else {
//                             setLoader(false);
//                             toast.error(response.data.error);
//                           }
//                         })
//                         .catch((e) => {
//                           console.log(`Error = ${e}`);
//                         });
//                     } else {
//                       return;
//                     }
//                   }}
//                 />
//               </button>
//             </Tooltip>
//           )}
//           {["Developer", "Customer-details-page"].some((item) =>
//             userRole.includes(item)
//           ) && (
//             <Tooltip title={`View ${row.customer_name}`} placement="bottom">
//               <Link to={`/customers/view-details/${row.id}`}>
//                 <FaEye style={{ color: "#0a57f7", fontSize: "1.12rem" }} />
//               </Link>
//             </Tooltip>
//           )}
//         </div>
//       ),
//     },
//   ];
//   //=>>> Column for datatable end ____//

//   //=>>> Searching function
//   useEffect(() => {
//     const result = apiData.filter((filteredApiData) => {
//       return (
//         filteredApiData.customer_name
//           .toLowerCase()
//           .match(searchData.toLowerCase()) ||
//         filteredApiData.phone.toLowerCase().match(searchData.toLowerCase())
//       );
//     });
//     setFilteredApiData(result);
//   }, [searchData]);

//   return (
//     <>
//       <DataTable
//         columns={columns}
//         data={filteredApiData}
//         customStyles={customStyles}
//         pagination
//         paginationRowsPerPageOptions={rowPerPage}
//         selectableRows
//         onSelectedRowsChange={handleTabelSelectChange}
//         clearSelectedRows={toggledClearRows}
//       />
//     </>
//   );
// };

// export default CustomerTable;

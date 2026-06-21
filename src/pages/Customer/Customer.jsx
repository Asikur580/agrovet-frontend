import {
  useEffect,
  useState,
  lazy,
  Suspense,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import ApiConfig from "../../assets/js/ApiConfig";
import { AuthContext } from "../../context/AuthContext";
import useStickyScroll from "../../hooks/useStickyScroll";

const CustomerTable = lazy(() => import("./CustomerTable"));
const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);
const ModalTable = lazy(() =>
  import("../../components/Modal/CommonModal/ModalTable")
);

const Customer = ({ setLoader }) => {
  const { headers, userRole, uid, userDesignationSlug } =
    useContext(AuthContext);
  const stickyRef = useStickyScroll(67);
  const [searchData, setSearchData] = useState("");
  const [selectedOfficerId, setSelectedOfficerId] = useState("");
  const [reloadTable, setReloadTable] = useState(false);
  const [officersData, setOfficersData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggledClearRows, setToggleClearRows] = useState(false);

  // Officers data fetch
  const GetOfficersData = useCallback(async () => {
    try {
      setLoader(true);
      const response = await ApiConfig.get("/getOfficers", { headers });
      setOfficersData(response.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  }, [headers, setLoader]);

  useEffect(() => {
    GetOfficersData();
  }, [GetOfficersData]);

  const handleClearRows = useCallback(() => {
    setToggleClearRows((prev) => !prev);
  }, []);

  const inputFields = useMemo(
    () => [
      {
        field: "name",
        type: "text",
        label: "Customer name",
        isRequired: true,
        placeholder: "Enter customer name",
      },
      {
        field: "company_name",
        type: "text",
        label: "Proprietor name",
        isRequired: true,
        placeholder: "Enter proprietor name",
      },
      {
        field: "phone",
        type: "text",
        label: "Phone",
        isRequired: true,
        placeholder: "Enter phone number",
      },
      {
        field: "address",
        type: "text",
        label: "Address",
        isRequired: true,
        placeholder: "Enter address",
      },
      {
        field: "old_due",
        type: "number",
        label: "Old Due",
        isRequired: false,
        placeholder: "Enter old due",
      },
      {
        field: "credit_limit",
        type: "number",
        label: "Credit Limit",
        isRequired: false,
        placeholder: "Enter credit limit",
      },
    ],
    []
  );

  const tableHead = useMemo(
    () => ["Sl no", "Customer name", "Phone", "Proprietor name", "Due"],
    []
  );

  return (
    <HelmetProvider>
      <Helmet>
        <title>Customers</title>
        <meta name="description" content="Agrovet software" />
      </Helmet>

      <div className="content animated fadeInDown">
        <h1 className="page-title">Customers</h1>

        <div
          ref={stickyRef}
          className="sticky top-[67px] z-50 flex justify-between mb-2"
        >
          <div className="d-flex align-items-center gap-4">
            <div className="searchInput">
              <input
                type="text"
                placeholder="Search customer"
                value={searchData}
                onChange={(e) => setSearchData(e.target.value)}
              />
            </div>
            {userDesignationSlug !== "officer" && (
              <select
                className="form-control rounded outline-none border border-gray-300 px-2"
                style={{ minWidth: "200px", height: "35px" }}
                value={selectedOfficerId}
                onChange={(e) => setSelectedOfficerId(e.target.value)}
              >
                <option value="">All Employees</option>
                {officersData?.map((officer) => (
                  <option key={officer.id} value={officer.id}>
                    {officer.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex justify-end gap-5">
            {["Developer", "Customer-print"].some((item) =>
              userRole.includes(item)
            ) && (
              <Suspense fallback={null}>
                <ModalTable
                  slug="Customer's details"
                  ModalOpenBtnTitle="Print"
                  identifier="printCustomer"
                  className="addBtn"
                  data={selectedRows}
                  tableHead={tableHead}
                />
              </Suspense>
            )}

            {["Developer", "Customer-create"].some((item) =>
              userRole.includes(item)
            ) && (
              <Suspense fallback={null}>
                <CommonModal
                  slug="Create customer"
                  inputFields={inputFields}
                  ModalOpenBtnTitle="Create Customer"
                  className="addBtn"
                  identifier="customerStore"
                  api="/customerStore"
                  data={officersData}
                  setRelodeTable={setReloadTable}
                  setLoader={setLoader}
                />
              </Suspense>
            )}
          </div>
        </div>

        <Suspense fallback={<div>Loading customers...</div>}>
          <CustomerTable
            headers={headers}
            userRole={userRole}
            uid={uid}
            userDesignationSlug={userDesignationSlug}
            relodeTable={reloadTable}
            setRelodeTable={setReloadTable}
            setLoader={setLoader}
            inputFields={inputFields}
            officersData={officersData}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            toggledClearRows={toggledClearRows}
            handleClearRows={handleClearRows}
            searchData={searchData}
            selectedOfficerId={selectedOfficerId}
          />
        </Suspense>
      </div>
    </HelmetProvider>
  );
};

export default Customer;

// import { useEffect, useState, lazy, Suspense, useContext } from "react";
// import { HelmetProvider, Helmet } from "react-helmet-async";

// //=>>> Utilities
// import ApiConfig from "../../assets/js/ApiConfig";
// import { AuthContext } from "../../context/AuthContext";
// import useStickyScroll from "../../hooks/useStickyScroll";

// //=>>> Components
// const CustomerTable = lazy(() => import("./CustomerTable"));
// const CommonModal = lazy(() =>
//   import("../../components/Modal/CommonModal/CommonModal")
// );
// const ModalTable = lazy(() =>
//   import("../../components/Modal/CommonModal/ModalTable")
// );

// const Customer = ({ setLoader }) => {
//   const { headers, userRole, uid, userDesignationSlug } =
//     useContext(AuthContext);
//   const stickyRef = useStickyScroll(67);
//   const [searchData, setSearchData] = useState("");
//   const [relodeTable, setRelodeTable] = useState(false);

//   const [officersData, setOfficersData] = useState();
//   const GetOfficersData = async () => {
//     try {
//       setLoader(true);
//       await ApiConfig.get("/getOfficers", { headers }).then((response) => {
//         setOfficersData(response.data.data);
//         setLoader(false);
//         //console.clear();
//       });
//     } catch (error) {
//       setLoader(false);
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     GetOfficersData();
//   }, []);

//   //=>>> Input For modal
//   const inputFields = [
//     {
//       field: "name",
//       type: "text",
//       label: "Customer name",
//       isRequired: true,
//       placeholder: "Enter customer name",
//     },
//     {
//       field: "company_name",
//       type: "text",
//       label: "Proprietor name",
//       isRequired: true,
//       placeholder: "Enter proprietor name",
//     },
//     {
//       field: "phone",
//       type: "text",
//       label: "Phone",
//       isRequired: true,
//       placeholder: "Enter phone number",
//     },
//     {
//       field: "address",
//       type: "text",
//       label: "Address",
//       isRequired: true,
//       placeholder: "Enter address",
//     },
//   ];

//   //===> Print section start
//   const [selectedRows, setSelectedRows] = useState(false);
//   const [toggledClearRows, setToggleClearRows] = useState(false);
//   const handleClearRows = () => {
//     setToggleClearRows(!toggledClearRows);
//   };

//   const tableHead = ["Sl no", "Customer name", "Phone", "proprietor name"];
//   //===> Print section end

//   return (
//     <HelmetProvider>
//       <Helmet>
//         <title>Customers</title>
//         <meta name="description" content="Agrovet software" />
//       </Helmet>

//       {/* For go to top */}
//       <input
//         type="file"
//         autoFocus
//         style={{ height: "0", opacity: 0, pointerEvents: "none" }}
//       />
//       {/* For go to top */}

//       <div className="content animated fadeInDown">
//         <h1 className="page-title">Customers</h1>
//         <div
//           ref={stickyRef}
//           className="sticky top-[67px] z-50 flex justify-between mb-2"
//         >
//           <div className="searchInput">
//             <input
//               type="text"
//               placeholder="Search customer"
//               value={searchData}
//               onChange={(e) => {
//                 setSearchData(e.target.value);
//               }}
//             />
//           </div>
//           <div className="flex justify-end  gap-5">
//             {["Developer", "Customer-print"].some((item) =>
//               userRole.includes(item)
//             ) && (
//               <Suspense fallback="...">
//                 <ModalTable
//                   id={null}
//                   slug={`Customer's details`}
//                   inputFields={[]}
//                   ModalOpenBtnTitle={"Print"}
//                   className="addBtn"
//                   identifier="printCustomer"
//                   data={selectedRows}
//                   tableHead={tableHead}
//                   width={""}
//                 />
//               </Suspense>
//             )}

//             {["Developer", "Customer-create"].some((item) =>
//               userRole.includes(item)
//             ) && (
//               <Suspense fallback="...">
//                 <CommonModal
//                   slug={`Create customer`}
//                   inputFields={inputFields}
//                   ModalOpenBtnTitle="create customer"
//                   className="addBtn"
//                   identifier="customerStore"
//                   api="/customerStore"
//                   data={officersData}
//                   setRelodeTable={setRelodeTable}
//                   setLoader={setLoader}
//                 />
//               </Suspense>
//             )}
//           </div>
//         </div>

//         <Suspense fallback="">
//           <CustomerTable
//             headers={headers}
//             userRole={userRole}
//             uid={uid}
//             userDesignationSlug={userDesignationSlug}
//             relodeTable={relodeTable}
//             setRelodeTable={setRelodeTable}
//             setLoader={setLoader}
//             inputFields={inputFields}
//             officersData={officersData}
//             selectedRows={selectedRows}
//             setSelectedRows={setSelectedRows}
//             toggledClearRows={toggledClearRows}
//             setToggleClearRows={setToggleClearRows}
//             handleClearRows={handleClearRows}
//             searchData={searchData}
//           />
//         </Suspense>
//       </div>
//     </HelmetProvider>
//   );
// };

// export default Customer;

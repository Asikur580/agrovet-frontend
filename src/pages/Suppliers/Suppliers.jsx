import { useState, lazy, Suspense, useContext } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

//=>>>Components
const SuppliersTable = lazy(() => import("./SuppliersTable"));
const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);

//=>>> Utilities
import { AuthContext } from "../../context/AuthContext";
import useStickyScroll from "../../hooks/useStickyScroll";

const Suppliers = ({ setLoader }) => {
  const { headers, userRole } = useContext(AuthContext);
  const stickyRef = useStickyScroll(67);
  const [relodeTable, setRelodeTable] = useState(false);
  const [searchData, setSearchData] = useState("");

  //=>>> Input For modal
  const inputFields = [
    {
      field: "name",
      type: "text",
      label: "Proprietor name",
      isRequired: true,
      placeholder: "Enter proprietor name",
    },
    {
      field: "company_name",
      type: "text",
      label: "Company name",
      isRequired: true,
      placeholder: "Enter company name",
    },
    {
      field: "phone",
      type: "text",
      label: "Phone",
      isRequired: true,
      placeholder: "Enter supplier phone no",
    },
    {
      field: "whatsapp",
      type: "text",
      label: "Whatsapp",
      isRequired: false,
      placeholder: "Enter supplier whatsapp no",
    },
    {
      field: "email",
      type: "email",
      label: "Email",
      isRequired: false,
      placeholder: "Enter supplier email",
    },
    {
      field: "address",
      type: "text",
      label: "Address",
      isRequired: true,
      placeholder: "Enter supplier address",
    },
    {
      field: "country",
      type: "text",
      label: "Country",
      isRequired: true,
      placeholder: "Enter supplier country",
    },
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>Suppliers</title>
        <meta name="description" content="Agrovet software" />
      </Helmet>

      {/* For go to top */}
      <input
        type="file"
        autoFocus
        style={{ height: "0", opacity: 0, pointerEvents: "none" }}
      />
      {/* For go to top */}

      <div className="content animated fadeInDown">
        <h1 className="page-title">Suppliers</h1>
        <div
          ref={stickyRef}
          className="sticky top-[67px] z-50 flex justify-between mb-2"
        >
          <div className="searchInput">
            <input
              type="text"
              placeholder="Search supplier"
              value={searchData}
              onChange={(e) => {
                setSearchData(e.target.value);
              }}
            />
          </div>
          {["Developer", "Supplier-create"].some((item) =>
            userRole.includes(item)
          ) && (
            <Suspense fallback="...">
              <CommonModal
                slug={`create supplier`}
                inputFields={inputFields}
                ModalOpenBtnTitle="create supplier"
                className="addBtn"
                identifier="supplierStore"
                api="/supplierStore"
                setRelodeTable={setRelodeTable}
                setLoader={setLoader}
              />
            </Suspense>
          )}
        </div>

        <Suspense fallback="">
          <SuppliersTable
            headers={headers}
            userRole={userRole}
            relodeTable={relodeTable}
            setRelodeTable={setRelodeTable}
            setLoader={setLoader}
            inputFields={inputFields}
            searchData={searchData}
          />
        </Suspense>
      </div>
    </HelmetProvider>
  );
};

export default Suppliers;

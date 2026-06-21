import { useState, lazy, Suspense, useContext } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

//==>>> Components
const DesignationTable = lazy(() => import("./DesignationTable"));
const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);

//==>>> Utilities
import { AuthContext } from "../../context/AuthContext";
import useStickyScroll from "../../hooks/useStickyScroll";

const Designation = ({ setLoader }) => {
  const { headers, userRole } = useContext(AuthContext);
  const stickyRef = useStickyScroll(67);
  const [relodeTable, setRelodeTable] = useState(false);
  const [searchData, setSearchData] = useState("");

  //==>>> Input For modal
  const inputFields = [
    {
      field: "name",
      type: "text",
      label: "Name",
      isRequired: true,
      placeholder: "Enter name",
    },
    {
      field: "slug",
      type: "text",
      label: "Slug",
      isRequired: true,
      placeholder: "Enter slug",
    },
  ];
  const inputFieldsForUpdate = [
    {
      field: "name",
      type: "text",
      label: "Name",
      isRequired: true,
      placeholder: "Enter name",
    },
    // {
    //   field: "slug",
    //   type: "text",
    //   label: "Slug",
    //   isRequired: true,
    //   placeholder: "Enter slug",
    // },
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>Designation</title>
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
        <h1 className="page-title">Designation</h1>
        <div
          ref={stickyRef}
          className="sticky top-[67px] z-50 flex justify-between mb-2"
        >
          <div className="searchInput">
            <input
              type="text"
              placeholder="Search here"
              value={searchData}
              onChange={(e) => {
                setSearchData(e.target.value);
              }}
            />
          </div>
          {["Developer", "Designation-create"].some((item) =>
            userRole.includes(item)
          ) && (
            <Suspense fallback="">
              <CommonModal
                slug={`create designation`}
                inputFields={inputFields}
                ModalOpenBtnTitle="create designation"
                className="addBtn"
                identifier="designationStore"
                api="/designationStore"
                setRelodeTable={setRelodeTable}
                setLoader={setLoader}
              />
            </Suspense>
          )}
        </div>

        <Suspense fallback="">
          <DesignationTable
            headers={headers}
            userRole={userRole}
            relodeTable={relodeTable}
            setRelodeTable={setRelodeTable}
            inputFields={inputFieldsForUpdate}
            setLoader={setLoader}
            searchData={searchData}
          />
        </Suspense>
      </div>
    </HelmetProvider>
  );
};

export default Designation;

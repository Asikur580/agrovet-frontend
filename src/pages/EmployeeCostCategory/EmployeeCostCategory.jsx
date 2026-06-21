import { useState, lazy, Suspense, useContext } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { AuthContext } from "../../context/AuthContext";
import useStickyScroll from "../../hooks/useStickyScroll";

//=>>> Components
const CostCategoriesTable = lazy(() => import("./EmployeeCostCategoryTable"));
const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);

const EmployeeCostCategory = ({ setLoader }) => {
  const { headers, userRole } = useContext(AuthContext);
  const stickyRef = useStickyScroll(67);
  const [searchData, setSearchData] = useState("");
  const [relodeTable, setRelodeTable] = useState(false);

  //=>>> Input For modal
  const inputFields = [
    {
      field: "name",
      type: "text",
      label: "Employee cost category",
      isRequired: true,
      placeholder: "Enter employee cost category",
    },
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>Employee cost category</title>
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
        <h1 className="page-title">Employee cost category</h1>
        <div
          ref={stickyRef}
          className="sticky top-[67px] z-50 flex justify-between mb-2"
        >
          <div className="searchInput">
            <input
              type="text"
              placeholder="Search"
              value={searchData}
              onChange={(e) => {
                setSearchData(e.target.value);
              }}
            />
          </div>
          {["Developer", "Employee-cost-category-create"].some((item) =>
            userRole.includes(item)
          ) && (
            <Suspense fallback="...">
              <CommonModal
                slug={`create employee cost category`}
                inputFields={inputFields}
                ModalOpenBtnTitle="create cost category"
                className="addBtn"
                identifier="employeeCostCategoryStore"
                api="/employeeCostCategoryStore"
                setRelodeTable={setRelodeTable}
                setLoader={setLoader}
              />
            </Suspense>
          )}
        </div>

        <Suspense fallback="">
          <CostCategoriesTable
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

export default EmployeeCostCategory;

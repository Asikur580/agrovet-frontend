import { useState, lazy, Suspense, useContext } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { AuthContext } from "../../context/AuthContext";
import useStickyScroll from "../../hooks/useStickyScroll";

//=>>>Components
const CategoriesTable = lazy(() => import("./CategoriesTable"));
const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);

const Categories = ({ setLoader }) => {
  const { headers, userRole } = useContext(AuthContext);
  const stickyRef = useStickyScroll(67);
  const [relodeTable, setRelodeTable] = useState(false);
  const [searchData, setSearchData] = useState("");

  //=>>>Input For modal
  const inputFields = [
    {
      field: "name",
      type: "text",
      label: "Categories",
      isRequired: true,
      placeholder: "Enter Category",
    },
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>Categories</title>
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
        <h1 className="page-title">Categories</h1>
        <div
          ref={stickyRef}
          className="sticky top-[67px] z-50 flex justify-between mb-2"
        >
          <div className="searchInput">
            <input
              type="text"
              placeholder="Search category"
              value={searchData}
              onChange={(e) => {
                setSearchData(e.target.value);
              }}
            />
          </div>
          {["Developer", "Category-create"].some((item) =>
            userRole.includes(item)
          ) && (
            <Suspense fallback="...">
              <CommonModal
                slug={`create category`}
                inputFields={inputFields}
                ModalOpenBtnTitle="create category"
                className="addBtn"
                identifier="categoryStore"
                api="/categoryStore"
                setRelodeTable={setRelodeTable}
                setLoader={setLoader}
              />
            </Suspense>
          )}
        </div>

        <Suspense fallback="">
          <CategoriesTable
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

export default Categories;

import { useContext, useState, lazy, Suspense } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { AuthContext } from "../../context/AuthContext";
import useStickyScroll from "../../hooks/useStickyScroll";

//=>>> Components
const BrandsTable = lazy(() => import("./BrandsTable"));
const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);

const Brands = ({ setLoader }) => {
  const { headers, userRole } = useContext(AuthContext);
  const stickyRef = useStickyScroll(67);
  const [relodeTable, setRelodeTable] = useState(false);
  const [searchData, setSearchData] = useState("");

  //=>>> Input For modal
  const inputFields = [
    {
      field: "name",
      type: "text",
      label: "Brand",
      isRequired: true,
      placeholder: "Enter brand name",
    },
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>Brands</title>
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
        <h1 className="page-title">Brands</h1>
        <div
          ref={stickyRef}
          className="sticky top-[67px] z-50 flex justify-between mb-2"
        >
          <div className="searchInput">
            <input
              type="text"
              placeholder="Search brand"
              value={searchData}
              onChange={(e) => {
                setSearchData(e.target.value);
              }}
            />
          </div>
          {["Developer", "Brand-create"].some((item) =>
            userRole.includes(item)
          ) && (
            <Suspense fallback="...">
              <CommonModal
                slug={`create brand`}
                inputFields={inputFields}
                ModalOpenBtnTitle="create brand"
                className="addBtn"
                identifier="brandStore"
                api="/brandStore"
                setRelodeTable={setRelodeTable}
                setLoader={setLoader}
              />
            </Suspense>
          )}
          {/* <Suspense fallback="">
            <MyModal
              slug={`create brand`}
              inputFields={inputFields}
              ModalOpenBtnTitle="create brand"
              className="addBtn"
              identifier="brandStore"
              api="/brandStore"
              setRelodeTable={setRelodeTable}
              setLoader={setLoader}
            />
          </Suspense> */}
        </div>

        <Suspense fallback="">
          <BrandsTable
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

export default Brands;

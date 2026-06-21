import { useState, lazy, Suspense, useContext } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

//=>>> Components
const PermissionsTable = lazy(() => import("./PermissionsTable"));
const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);

//=>>> Utilities
import { AuthContext } from "../../context/AuthContext";
import useStickyScroll from "../../hooks/useStickyScroll";

const Permissions = ({ setLoader }) => {
  const { headers, userRole } = useContext(AuthContext);
  const stickyRef = useStickyScroll(67);
  const [searchData, setSearchData] = useState("");
  const [relodeTable, setRelodeTable] = useState(false);

  //=>>> Input For modal
  const inputFields = [
    {
      field: "name",
      type: "text",
      label: "Permission",
      isRequired: true,
      placeholder: "Enter permission",
    },
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>Permissions</title>
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
        <h1 className="page-title">Permissions</h1>
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
          {["Developer", "Permission-create"].some((item) =>
            userRole.includes(item)
          ) && (
            <Suspense fallback="...">
              <CommonModal
                slug={`create permission`}
                inputFields={inputFields}
                ModalOpenBtnTitle="create permission"
                className="addBtn"
                identifier="permissionStore"
                api="/permissionStore"
                setRelodeTable={setRelodeTable}
                setLoader={setLoader}
              />
            </Suspense>
          )}
        </div>

        <Suspense fallback="">
          <PermissionsTable
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

export default Permissions;

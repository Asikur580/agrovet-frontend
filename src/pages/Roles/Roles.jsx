import { useState, lazy, Suspense, useContext } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

//___ Components ___//
const RolesTable = lazy(() => import("./RolesTable"));
const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);

//___ Utilities ___//
import { AuthContext } from "../../context/AuthContext";

const Roles = ({ setLoader }) => {
  const { headers } = useContext(AuthContext);
  const [relodeTable, setRelodeTable] = useState(false);

  //___ Input For modal ___//
  const inputFields = [
    {
      field: "categories",
      type: "text",
      label: "Permission",
      isRequired: true,
      placeholder: "Enter permission",
    },
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>Roles</title>
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
        <h1 className="page-title">Roles</h1>
        <div style={{ textAlign: "end" }}>
          <Suspense fallback="...">
            <CommonModal
              slug={`create role`}
              inputFields={inputFields}
              ModalOpenBtnTitle="create role"
              className="addBtn"
              identifier="roleStore"
              api="/roleStore"
              setRelodeTable={setRelodeTable}
              setLoader={setLoader}
            />
          </Suspense>
        </div>

        <Suspense fallback="">
          <RolesTable
            headers={headers}
            relodeTable={relodeTable}
            setRelodeTable={setRelodeTable}
            setLoader={setLoader}
            inputFields={inputFields}
          />
        </Suspense>
      </div>
    </HelmetProvider>
  );
};

export default Roles;

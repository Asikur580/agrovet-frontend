import { useState, lazy, Suspense, useContext } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

//=>>> Components
const UsersTable = lazy(() => import("./UsersTable"));

//=>>> Utilities
import { AuthContext } from "../../context/AuthContext";
import useStickyScroll from "../../hooks/useStickyScroll";

const Users = ({ setLoader }) => {
  const { headers, userRole } = useContext(AuthContext);
  const stickyRef = useStickyScroll(67);
  const [relodeTable, setRelodeTable] = useState(false);
  const [searchData, setSearchData] = useState("");

  return (
    <HelmetProvider>
      <Helmet>
        <title>Users</title>
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
        <h1 className="page-title">Users</h1>
        <div
          ref={stickyRef}
          className="sticky top-[67px] z-50 flex justify-between mb-2"
        >
          <div className="searchInput">
            <input
              type="text"
              placeholder="Search user"
              value={searchData}
              onChange={(e) => {
                setSearchData(e.target.value);
              }}
            />
          </div>
        </div>
        <Suspense fallback="">
          <UsersTable
            headers={headers}
            userRole={userRole}
            relodeTable={relodeTable}
            setRelodeTable={setRelodeTable}
            setLoader={setLoader}
            searchData={searchData}
          />
        </Suspense>
      </div>
    </HelmetProvider>
  );
};

export default Users;

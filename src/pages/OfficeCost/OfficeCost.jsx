import { useState, useEffect, lazy, Suspense, useContext } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

//=>>> Components
const OfficeCostTable = lazy(() => import("./OfficeCostTable"));
const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);
const ModalTable = lazy(() =>
  import("../../components/Modal/CommonModal/ModalTable")
);

//=>>> Utilities
import ApiConfig from "../../assets/js/ApiConfig";
import { AuthContext } from "../../context/AuthContext";
import useStickyScroll from "../../hooks/useStickyScroll";

const OfficeCost = ({ setLoader }) => {
  const { headers, userRole } = useContext(AuthContext);
  const stickyRef = useStickyScroll(67);
  const [searchData, setSearchData] = useState("");
  const [relodeTable, setRelodeTable] = useState(false);

  const [costCategory, setCostCategory] = useState([]);
  const GetCostCategory = async () => {
    try {
      setLoader(true);
      await ApiConfig.get(`/costCategories`, { headers }).then((response) => {
        setCostCategory(response.data.data);
        setLoader(false);
        // console.clear();
        // console.log(response.data.data);
      });
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  useEffect(() => {
    GetCostCategory();
  }, []);

  //=>>> Input For modal
  const inputFields = [
    {
      field: "sell_price",
      type: "text",
      label: "Amount",
      isRequired: true,
      placeholder: "Enter amount",
    },
  ];

  //===> Print section start
  const [selectedRows, setSelectedRows] = useState(false);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const handleClearRows = () => {
    setToggleClearRows(!toggledClearRows);
  };

  const tableHead = ["Sl no", "Cost cat name", "Amount", "Date"];
  //===> Print section end

  return (
    <HelmetProvider>
      <Helmet>
        <title>Office cost</title>
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
        <h1 className="page-title">Office cost</h1>
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
          <div className="flex justify-end  gap-5">
            {["Developer", "Office-cost-print"].some((item) =>
              userRole.includes(item)
            ) && (
              <Suspense fallback="...">
                <ModalTable
                  id={null}
                  slug={`Office cost details`}
                  inputFields={[]}
                  ModalOpenBtnTitle={"Print"}
                  className="addBtn"
                  identifier="printOfficeCost"
                  data={selectedRows}
                  tableHead={tableHead}
                  width={""}
                />
              </Suspense>
            )}

            {["Developer", "Office-cost-create"].some((item) =>
              userRole.includes(item)
            ) && (
              <Suspense fallback="...">
                <CommonModal
                  slug={`create office cost`}
                  inputFields={inputFields}
                  ModalOpenBtnTitle="Create office cost"
                  className="addBtn"
                  identifier="costCreateOffice"
                  api="/costStore"
                  data={costCategory}
                  setRelodeTable={setRelodeTable}
                  setLoader={setLoader}
                />
              </Suspense>
            )}
          </div>
        </div>

        <Suspense fallback="">
          <OfficeCostTable
            headers={headers}
            userRole={userRole}
            relodeTable={relodeTable}
            setRelodeTable={setRelodeTable}
            setLoader={setLoader}
            inputFields={inputFields}
            costCategory={costCategory}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            toggledClearRows={toggledClearRows}
            setToggleClearRows={setToggleClearRows}
            handleClearRows={handleClearRows}
            searchData={searchData}
          />
        </Suspense>
      </div>
    </HelmetProvider>
  );
};

export default OfficeCost;

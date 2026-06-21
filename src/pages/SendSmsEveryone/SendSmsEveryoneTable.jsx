import { useEffect, useState, lazy, Suspense } from "react";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import DataTable from "react-data-table-component";

//___ Css ___//
import "../../assets/css/DataTable.css";

//___ Icons ___//
import { FaEdit } from "react-icons/fa";
import { IoTrashBinSharp } from "react-icons/io5";

//___ Components ___//
const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);

//___ Utilities ___//
import ApiConfig from "../../assets/js/ApiConfig";
import { TableStyles } from "../../assets/js/Utility";

const BrandsTable = (props) => {
  const {
    headers,
    userRole,
    relodeTable,
    setRelodeTable,
    setLoader,
    inputFields,
  } = props;
  const customStyles = TableStyles();

  // States
  const [apiData, setApiData] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [filteredApiData, setFilteredApiData] = useState([]);

  const getApiData = async () => {
    try {
      setLoader(true);
      await ApiConfig.get("/brands", { headers }).then((response) => {
        setApiData(response.data.data);
        setFilteredApiData(response.data.data);
        // console.clear();
        setLoader(false);
      });
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  useEffect(() => {
    getApiData();
  }, [relodeTable]);

  //___ Column for datatable start ___//
  const columns = [
    {
      name: "Sl No",
      field: "SlNo",
      selector: (row, index) => index + 1,
    },
    {
      name: "Brands",
      field: "Brands",
      selector: (row) => row.name,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex" style={{ gap: "20px" }}>
          {["Developer", "Brands-edit"].some((item) =>
            userRole.includes(item)
          ) && (
            <div className="shortModalBtn">
              <Suspense fallback="...">
                <CommonModal
                  id={row.id}
                  slug={`Edit brand`}
                  inputFields={inputFields}
                  ModalOpenBtnTitle={<FaEdit />}
                  className="editBtn"
                  identifier="brandUpdate"
                  api={`/brandUpdate/${row.id}`}
                  getSpecificDataApi="/brandShow"
                  setRelodeTable={setRelodeTable}
                  setLoader={setLoader}
                  toolTip={`Edit ${row.name}`}
                />
              </Suspense>
            </div>
          )}
          {["Developer", "Brands-delete"].some((item) =>
            userRole.includes(item)
          ) && (
            <Tooltip title={`Delete ${row.name}`} placement="bottom">
              <button>
                <IoTrashBinSharp
                  className="deleteIcon c-pointer"
                  size={20}
                  onClick={async () => {
                    const confirmation = confirm(
                      "Do you want to delete this brand?"
                    );
                    if (confirmation) {
                      const payload = new FormData();
                      payload.append("id", row.id);

                      setLoader(true);
                      await ApiConfig.post(`/brandDelete/${row.id}`, payload, {
                        headers,
                      })
                        .then((response) => {
                          if (response.data.status == true) {
                            setRelodeTable((prev) => !prev);
                            console.clear();
                            setLoader(false);
                            toast.success(response.data.message);
                          } else {
                            setLoader(false);
                            toast.error(response.data.error);
                          }
                        })
                        .catch((e) => {
                          console.log(`Error = ${e}`);
                        });
                    } else {
                      return;
                    }
                  }}
                />
              </button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];
  //___ Column for datatable end ____//

  //___ Searching function ___//
  useEffect(() => {
    const result = apiData.filter((filteredApiData) => {
      return filteredApiData.name.toLowerCase().match(searchData.toLowerCase());
    });
    setFilteredApiData(result);
  }, [searchData]);

  return (
    <>
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

      <DataTable
        columns={columns}
        data={filteredApiData}
        customStyles={customStyles}
        pagination
        // fixedHeader
        // fixedHeaderScrollHeight="400px"
      />
    </>
  );
};

export default BrandsTable;

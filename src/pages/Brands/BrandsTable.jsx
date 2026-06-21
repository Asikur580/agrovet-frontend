import { useEffect, useState, lazy, Suspense } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import DataTable from "react-data-table-component";

//=>>> Css
import "../../assets/css/DataTable.css";

//=>>> Icons
import { FaEdit, FaEye } from "react-icons/fa";
import { IoTrashBinSharp } from "react-icons/io5";

//=>>> Components
const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);

//=>>> Utilities
import ApiConfig from "../../assets/js/ApiConfig";
import { TableStyles, rowPerPage } from "../../assets/js/Utility";

const BrandsTable = (props) => {
  const {
    headers,
    userRole,
    relodeTable,
    setRelodeTable,
    setLoader,
    inputFields,
    searchData,
  } = props;
  const customStyles = TableStyles();

  // States
  const [apiData, setApiData] = useState([]);
  const [filteredApiData, setFilteredApiData] = useState([]);

  const getApiData = async () => {
    try {
      setLoader(true);
      await ApiConfig.get("/brands", { headers }).then((response) => {
        setApiData(response.data.data);
        setFilteredApiData(response.data.data);
        setLoader(false);
        //==> For offline use
        localStorage.setItem("BrandData", JSON.stringify(response.data.data));
      });
    } catch (error) {
      setLoader(false);
      console.log(error);
      //==> For offline use
      const cachedData = localStorage.getItem("BrandData");
      if (cachedData) {
        setApiData(JSON.parse(cachedData));
        setFilteredApiData(JSON.parse(cachedData));
      }
    }
  };
  useEffect(() => {
    getApiData();
  }, [relodeTable]);

  //=>>> Column for datatable start
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
          {["Developer", "Brand-edit"].some((item) =>
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
          {["Developer", "Brand-delete"].some((item) =>
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
          {["Developer", "Brand-details-page"].some((item) =>
            userRole.includes(item)
          ) && (
            <Tooltip title={`View ${row.name}`} placement="bottom">
              <Link to={`/brands/view-details/${row.id}`}>
                <FaEye style={{ color: "#0a57f7", fontSize: "1.12rem" }} />
              </Link>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];
  //=>>> Column for datatable end ____//

  //=>>> Searching function
  useEffect(() => {
    const result = apiData.filter((filteredApiData) => {
      return filteredApiData.name.toLowerCase().match(searchData.toLowerCase());
    });
    setFilteredApiData(result);
  }, [searchData]);

  return (
    <>
      <DataTable
        columns={columns}
        data={filteredApiData}
        customStyles={customStyles}
        pagination
        paginationRowsPerPageOptions={rowPerPage}
      />
    </>
  );
};

export default BrandsTable;

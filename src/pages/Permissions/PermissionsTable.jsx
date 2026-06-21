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
import { TableStyles, rowPerPage } from "../../assets/js/Utility";

const PermissionsTable = (props) => {
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
      await ApiConfig.get("/permissions", { headers }).then((response) => {
        setApiData(response.data.data);
        setFilteredApiData(response.data.data);
        console.clear();
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
      // width: "80px",
      selector: (row, index) => index + 1,
    },
    {
      name: "Permissions",
      field: "permissions",
      selector: (row) => row.name,
    },
    {
      name: "Action",
      // width: "250px",
      cell: (row) => (
        <div className="d-flex" style={{ gap: "20px" }}>
          {["Developer", "Permission-edit"].some((item) =>
            userRole.includes(item)
          ) && (
            <div className="shortModalBtn">
              <Suspense fallback="...">
                <CommonModal
                  id={row.id}
                  slug={`Edit permission`}
                  inputFields={inputFields}
                  ModalOpenBtnTitle={<FaEdit />}
                  className="editBtn"
                  identifier="permissionUpdate"
                  api={`/permissionUpdate/${row.id}`}
                  getSpecificDataApi="/permissionShow"
                  setRelodeTable={setRelodeTable}
                  setLoader={setLoader}
                  toolTip={`Edit ${row.name}`}
                />
              </Suspense>
            </div>
          )}
          {["Developer", "Permission-delete"].some((item) =>
            userRole.includes(item)
          ) && (
            <Tooltip title={`Delete ${row.name}`} placement="bottom">
              <button>
                <IoTrashBinSharp
                  className="deleteIcon c-pointer"
                  size={20}
                  onClick={async () => {
                    const confirmation = confirm(
                      "Do you want to delete this permission?"
                    );
                    if (confirmation) {
                      const payload = new FormData();
                      payload.append("id", row.id);

                      setLoader(true);
                      await ApiConfig.post(
                        `/permissionDelete/${row.id}`,
                        payload,
                        {
                          headers,
                        }
                      )
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

export default PermissionsTable;

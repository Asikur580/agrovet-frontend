import { useEffect, useState, lazy, Suspense } from "react";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import DataTable from "react-data-table-component";

//___ Css ___//
import "../../assets/css/DataTable.css";

//___ Icons ___//
import { FaEdit } from "react-icons/fa";
import { IoTrashBinSharp } from "react-icons/io5";
import { SiPrivateinternetaccess } from "react-icons/si";

//___ Components ___//
const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);
const UserCreateModal = lazy(() =>
  import("../../components/Modal/CommonModal/UserCreateModal")
);

//___ Utilities ___//
import ApiConfig from "../../assets/js/ApiConfig";
import { TableStyles, rowPerPage } from "../../assets/js/Utility";

const RolesTable = (props) => {
  const { headers, relodeTable, setRelodeTable, setLoader, inputFields } =
    props;
  const customStyles = TableStyles();

  // States
  const [apiData, setApiData] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [filteredApiData, setFilteredApiData] = useState([]);

  const getApiData = async () => {
    try {
      setLoader(true);
      await ApiConfig.get("/roles", { headers }).then((response) => {
        setApiData(response.data.data);
        setFilteredApiData(response.data.data);
        // console.clear();
        setLoader(false);
      });
    } catch (error) {
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
      name: "Roles",
      field: "name",
      selector: (row) => row.name,
    },
    {
      name: "Action",
      // width: "250px",
      cell: (row) => (
        <div className="d-flex" style={{ gap: "20px" }}>
          <div className="shortModalBtn">
            <Suspense fallback="...">
              <CommonModal
                id={row.id}
                slug={`Edit role`}
                inputFields={inputFields}
                ModalOpenBtnTitle={<FaEdit />}
                className="editBtn"
                identifier="roleUpdate"
                api={`/roleUpdate/${row.id}`}
                getSpecificDataApi="/roleShow"
                setRelodeTable={setRelodeTable}
                setLoader={setLoader}
                toolTip={`Edit ${row.name}`}
              />
            </Suspense>
          </div>
          <Tooltip title={`Delete ${row.name}`} placement="right">
            <button>
              <IoTrashBinSharp
                className="deleteIcon c-pointer"
                size={20}
                onClick={async () => {
                  const confirmation = confirm(
                    "Do you want to delete this role?"
                  );
                  if (confirmation) {
                    const payload = new FormData();
                    payload.append("id", row.id);

                    setLoader(true);
                    await ApiConfig.post(`/roleDelete/${row.id}`, payload, {
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
          <div className="shortModalBtn">
            <Suspense fallback="...">
              <UserCreateModal
                id={row.id}
                slug={`Permission`}
                inputFields={[]}
                ModalOpenBtnTitle={<SiPrivateinternetaccess />}
                className="createUserIcon"
                identifier="givePermissions"
                api={`/roles/${row.id}/give-permissions`}
                getSpecificDataApi={`roles/${row.id}/give-permissions`}
                data={row.employee_id}
                setRelodeTable={setRelodeTable}
                setLoader={setLoader}
                toolTip={`${row.name}'s permission`}
              />
            </Suspense>
          </div>
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
          placeholder="Search role"
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
        paginationRowsPerPageOptions={rowPerPage}
      />
    </>
  );
};

export default RolesTable;

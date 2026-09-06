import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import DataTable from "react-data-table-component";

//=>>> Css
import "../../assets/css/DataTable.css";

//=>>> Icons
import {
  FaEdit,
  FaHandsHelping,
  FaUserEdit,
  FaEye,
  FaImage,
} from "react-icons/fa";
import { IoTrashBinSharp } from "react-icons/io5";

//=>>> Components
const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);
const UserCreateModal = lazy(() =>
  import("../../components/Modal/CommonModal/UserCreateModal")
);
const ReletionCreateModal = lazy(() =>
  import("../../components/Modal/CommonModal/ReletionCreateModal")
);
const ImageLazyLoad = lazy(() =>
  import("../../components/ImageLazyLoad/ImageLazyLoad")
);

//=>>> Utilities
import ApiConfig, { imgUrl } from "../../assets/js/ApiConfig";
import { TableStyles, rowPerPage } from "../../assets/js/Utility";

const EmployeesTable = (props) => {
  const {
    headers,
    userRole,
    relodeTable,
    setRelodeTable,
    setLoader,
    setRelodeSelect,
    inputFields,
    inputFieldsForCreateUser,
    designationData,
    searchData,
  } = props;
  const customStyles = TableStyles();

  //=>>> States
  const [apiData, setApiData] = useState([]);
  const [filteredApiData, setFilteredApiData] = useState([]);

  const getApiData = async () => {
    try {
      setLoader(true);
      await ApiConfig.get("/employees", { headers }).then((response) => {
        setApiData(response.data.data);
        setFilteredApiData(response.data.data);
        setLoader(false);
        // console.log(response.data.data);
      });
    } catch (error) {
      setLoader(false);
      console.log(error);
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
      width: "72px",
      selector: (row, index) => index + 1,
    },
    {
      name: "Employee name",
      field: "Employee name",
      grow: 4,
      selector: (row) => row.name,
      cell: (row) => (
        <div>
          <div>{row.name}</div>
          {row.user?.email && (
            <div style={{ fontSize: "0.8rem", opacity: 0.6 }}>
              {row.user.email}
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Phone",
      field: "phone",
      grow: 2,
      sortable: true,
      selector: (row) => row.phone,
    },
    {
      name: "Nid",
      field: "national_id",
      selector: (row) => row.national_id,
    },
    {
      name: "Blood",
      field: "blood_group",
      selector: (row) => row.blood_group,
    },
    {
      name: "Territory",
      field: "territory",
      grow: 2,
      selector: (row) => row.territory,
    },
    {
      name: "District",
      field: "district",
      grow: 2,
      selector: (row) => row.district,
    },
    {
      name: "Credit",
      field: "credit_limit",
      selector: (row) => row.credit_limit,
    },
    {
      name: "Basic salary",
      field: "basic_salary",
      selector: (row) => row.basic_salary,
    },
    {
      name: "Role",
      field: "role",
      grow: 3,
      selector: (row) => row.designation.name,
    },
    {
      name: "Image",
      field: "Image",
      cell: (row) =>
        row.image ? (
          <Suspense fallback="">
            <ImageLazyLoad
              height="55px"
              width="50px"
              alt="Img-from-table"
              src={`${imgUrl}${row.image}`}
            />
          </Suspense>
        ) : (
          <FaImage size={30} style={{ opacity: 0.3 }} />
        ),
    },
    {
      name: "Action",
      width: "250px",
      cell: (row) => (
        <div className="d-flex" style={{ gap: "20px" }}>
          {["Developer", "Employee-edit"].some((item) =>
            userRole.includes(item)
          ) && (
            <div className="shortModalBtn">
              <Suspense fallback="...">
                <CommonModal
                  id={row.id}
                  slug={`Edit employees`}
                  inputFields={inputFields}
                  ModalOpenBtnTitle={<FaEdit />}
                  className="editBtn"
                  identifier="employeeUpdate"
                  api={`/employeeUpdate/${row.id}`}
                  getSpecificDataApi="/employeeShow"
                  setRelodeTable={setRelodeTable}
                  setLoader={setLoader}
                  setRelodeSelect={setRelodeSelect}
                  toolTip={`Edit ${row.name}`}
                  data={designationData}
                />
              </Suspense>
            </div>
          )}
          {["Developer", "Employee-delete"].some((item) =>
            userRole.includes(item)
          ) && (
            <Tooltip title={`Delete ${row.name}`} placement="bottom">
              <button>
                <IoTrashBinSharp
                  className="deleteIcon c-pointer"
                  size={20}
                  onClick={async () => {
                    const confirmation = confirm(
                      "Do you want to delete this employee?"
                    );
                    if (confirmation) {
                      const payload = new FormData();
                      payload.append("id", row.id);

                      setLoader(true);
                      await ApiConfig.post(
                        `/employeeDelete/${row.id}`,
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
                            toast.error(response.data.message);
                            setLoader(false);
                          }
                        })
                        .catch((e) => {
                          setLoader(false);
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
          {["Developer", "User-create"].some((item) =>
            userRole.includes(item)
          ) && (
            <div className="shortModalBtn">
              <Suspense fallback="">
                <UserCreateModal
                  id={row.id}
                  slug={`Create ${row.name} as a user`}
                  inputFields={inputFieldsForCreateUser}
                  ModalOpenBtnTitle={<FaUserEdit />}
                  className="createUserIcon"
                  identifier="userStore"
                  api={`/userStore`}
                  getSpecificDataApi="/permissions"
                  setRelodeTable={setRelodeTable}
                  setLoader={setLoader}
                  // setRelodeSelect={setRelodeSelect}
                  toolTip={`Create user ${row.id}`}
                />
              </Suspense>
            </div>
          )}
          {["Developer", "Employee-relation-create"].some((item) =>
            userRole.includes(item)
          ) && (
            <div className="shortModalBtn">
              <Suspense fallback="">
                {(() => {
                  if (
                    row.designation.slug == "officer" ||
                    row.designation.slug == "manager"
                  ) {
                    return (
                      <ReletionCreateModal
                        id={row.id}
                        slug={`Create reletion with ${row.name}(${row.designation.name})`}
                        inputFields=""
                        ModalOpenBtnTitle={<FaHandsHelping />}
                        className="createRelationIcon"
                        identifier="relationStore"
                        api={`/relationStore`}
                        getSpecificDataApi="/getRelatedEmployees"
                        data={row}
                        setRelodeTable={setRelodeTable}
                        setLoader={setLoader}
                        toolTip="Create relation"
                      />
                    );
                  } else {
                    return "......";
                  }
                })()}
              </Suspense>
            </div>
          )}
          {["Developer", "Employee-details-page"].some((item) =>
            userRole.includes(item)
          ) && (
            <Tooltip title={`View ${row.name}`} placement="bottom">
              <Link to={`/employees/view-details/${row.id}`}>
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
      return (
        filteredApiData.name.toLowerCase().match(searchData.toLowerCase()) ||
        filteredApiData.phone.toLowerCase().match(searchData.toLowerCase())
      );
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

export default EmployeesTable;

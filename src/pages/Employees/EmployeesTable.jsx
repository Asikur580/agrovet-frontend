import {
  lazy,
  Suspense,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import DataTable from "react-data-table-component";

// CSS
import "../../assets/css/DataTable.css";

// Icons
import {
  FaEdit,
  FaHandsHelping,
  FaUserEdit,
  FaEye,
  FaImage,
} from "react-icons/fa";
import { IoTrashBinSharp } from "react-icons/io5";

// Components
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

// Utilities
import ApiConfig, { imgUrl } from "../../assets/js/ApiConfig";
import { TableStyles, rowPerPage } from "../../assets/js/Utility";

const EmployeesTable = ({
  headers,
  userRole = [],
  relodeTable,
  setRelodeTable,
  setLoader,
  setRelodeSelect,
  inputFields,
  inputFieldsForCreateUser,
  designationData = [],
  searchData = "",
  selectedRole = "all",
  selectedTerritory = "all",
  selectedUserStatus = "all",
  propEmployees,
  onEmployeesLoaded,
}) => {
  const customStyles = useMemo(() => TableStyles(), []);

  const [apiData, setApiData] = useState([]);
  const [filteredApiData, setFilteredApiData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const getApiData = useCallback(async () => {
    try {
      if (setLoader) setLoader(true);
      const response = await ApiConfig.get("/employees", { headers });
      const data = response.data?.data || [];
      setApiData(data);
      setFilteredApiData(data);
      if (onEmployeesLoaded) {
        onEmployeesLoaded(data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      if (setLoader) setLoader(false);
    }
  }, [headers, setLoader, onEmployeesLoaded]);

  useEffect(() => {
    if (propEmployees && Array.isArray(propEmployees)) {
      setApiData(propEmployees);
      setFilteredApiData(propEmployees);
    } else if (headers && headers.Authorization) {
      getApiData();
    }
  }, [propEmployees, headers, relodeTable, getApiData]);

  // Filtering function
  useEffect(() => {
    const timer = setTimeout(() => {
      let result = apiData;

      // 1. Text search
      if (searchData && searchData.trim() !== "") {
        const lower = searchData.toLowerCase().trim();
        result = result.filter((item) => {
          const name = String(item.name || "").toLowerCase();
          const phone = String(item.phone || "").toLowerCase();
          const email = String(item.user?.email || "").toLowerCase();
          const territory = String(item.territory || "").toLowerCase();
          const district = String(item.district || "").toLowerCase();
          const nid = String(item.national_id || "").toLowerCase();
          const desig = String(item.designation?.name || "").toLowerCase();
          const empId = String(item.generated_employee_id || item.id || "").toLowerCase();

          return (
            name.includes(lower) ||
            phone.includes(lower) ||
            email.includes(lower) ||
            territory.includes(lower) ||
            district.includes(lower) ||
            nid.includes(lower) ||
            desig.includes(lower) ||
            empId.includes(lower)
          );
        });
      }

      // 2. Role / Designation filter
      if (selectedRole !== "all") {
        result = result.filter((item) => {
          if (selectedRole === "officer") {
            return item.designation?.slug === "officer";
          }
          if (selectedRole === "manager") {
            return ["manager", "rsm"].includes(item.designation?.slug);
          }
          return (
            String(item.designation_id) === String(selectedRole) ||
            String(item.designation?.id) === String(selectedRole) ||
            item.designation?.slug === selectedRole
          );
        });
      }

      // 3. Territory filter
      if (selectedTerritory !== "all") {
        result = result.filter(
          (item) => String(item.territory) === String(selectedTerritory)
        );
      }

      // 4. User Account filter
      if (selectedUserStatus === "has_user") {
        result = result.filter((item) => Boolean(item.user?.email));
      } else if (selectedUserStatus === "no_user") {
        result = result.filter((item) => !item.user?.email);
      }

      setFilteredApiData(result);
      setCurrentPage(1);
    }, 200);

    return () => clearTimeout(timer);
  }, [
    searchData,
    apiData,
    selectedRole,
    selectedTerritory,
    selectedUserStatus,
  ]);

  const columns = useMemo(
    () => [
      {
        name: "Sl No",
        width: "68px",
        selector: (_, index) => (currentPage - 1) * perPage + (index + 1),
      },
      {
        name: "Employee Name",
        grow: 3,
        sortable: true,
        selector: (row) => row.name,
        cell: (row) => (
          <div className="py-1">
            <div className="font-bold text-slate-900">{row.name}</div>
            {row.user?.email ? (
              <div className="text-xs text-blue-600 font-medium">
                {row.user.email}
              </div>
            ) : (
              <div className="text-xs text-slate-400">No User Account</div>
            )}
          </div>
        ),
      },
      {
        name: "Phone",
        width: "125px",
        sortable: true,
        selector: (row) => row.phone,
      },
      {
        name: "Role / Designation",
        grow: 2,
        sortable: true,
        selector: (row) => row.designation?.name || "-",
        cell: (row) => {
          const desigName = row.designation?.name || "-";
          const slug = row.designation?.slug;
          let badgeBg = "#f1f5f9";
          let badgeClr = "#475569";

          if (slug === "admin" || slug === "super_admin") {
            badgeBg = "#fef2f2";
            badgeClr = "#dc2626";
          } else if (slug === "manager" || slug === "rsm") {
            badgeBg = "#edf2fc";
            badgeClr = "#3b5898";
          } else if (slug === "officer") {
            badgeBg = "#ecfdf5";
            badgeClr = "#059669";
          }

          return (
            <span
              style={{
                background: badgeBg,
                color: badgeClr,
                padding: "3px 8px",
                borderRadius: "6px",
                fontSize: "0.78rem",
                fontWeight: "600",
                display: "inline-block",
              }}
            >
              {desigName}
            </span>
          );
        },
      },
      {
        name: "Territory",
        grow: 1.5,
        sortable: true,
        selector: (row) => row.territory || "-",
      },
      {
        name: "District",
        grow: 1.5,
        sortable: true,
        selector: (row) => row.district || "-",
      },
      {
        name: "NID",
        width: "115px",
        selector: (row) => row.national_id || "-",
      },
      {
        name: "Blood",
        width: "75px",
        selector: (row) => row.blood_group || "-",
      },
      {
        name: "Credit Limit",
        width: "115px",
        sortable: true,
        selector: (row) => Number(row.credit_limit || 0),
        cell: (row) => {
          const num = Number(row.credit_limit || 0);
          return <span>{num > 0 ? "Tk " + num.toLocaleString("en-IN") : "0"}</span>;
        },
      },
      {
        name: "Basic Salary",
        width: "115px",
        sortable: true,
        selector: (row) => Number(row.basic_salary || 0),
        cell: (row) => {
          const num = Number(row.basic_salary || 0);
          return (
            <span className="font-semibold text-slate-700">
              {num > 0 ? "Tk " + num.toLocaleString("en-IN") : "0"}
            </span>
          );
        },
      },
      {
        name: "Image",
        width: "75px",
        cell: (row) =>
          row.image ? (
            <Suspense fallback={null}>
              <ImageLazyLoad
                height="45px"
                width="42px"
                alt="Employee"
                src={`${imgUrl}${row.image}`}
                style={{ borderRadius: "6px", objectFit: "cover" }}
              />
            </Suspense>
          ) : (
            <FaImage size={24} style={{ opacity: 0.25, color: "#64748b" }} />
          ),
      },
      {
        name: "Action",
        width: "210px",
        cell: (row) => (
          <div className="d-flex align-items-center gap-3">
            {["Developer", "Employee-edit"].some((item) =>
              userRole.includes(item)
            ) && (
              <div className="shortModalBtn">
                <Suspense fallback={null}>
                  <CommonModal
                    id={row.id}
                    slug="Edit employees"
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
                <button
                  type="button"
                  className="bg-transparent border-0 p-0 cursor-pointer"
                  onClick={async () => {
                    const confirmation = confirm(
                      `Do you want to delete employee ${row.name}?`
                    );
                    if (confirmation) {
                      try {
                        const payload = new FormData();
                        payload.append("id", row.id);
                        if (setLoader) setLoader(true);

                        const response = await ApiConfig.post(
                          `/employeeDelete/${row.id}`,
                          payload,
                          { headers }
                        );
                        if (response.data?.status === true) {
                          if (setRelodeTable) setRelodeTable((prev) => !prev);
                          toast.success(response.data.message);
                        } else {
                          toast.error(response.data?.message || "Delete failed");
                        }
                      } catch (e) {
                        console.error(e);
                        toast.error("An error occurred while deleting employee");
                      } finally {
                        if (setLoader) setLoader(false);
                      }
                    }
                  }}
                >
                  <IoTrashBinSharp
                    className="deleteIcon cursor-pointer text-red-500 hover:text-red-700"
                    size={18}
                  />
                </button>
              </Tooltip>
            )}

            {["Developer", "User-create"].some((item) =>
              userRole.includes(item)
            ) && (
              <div className="shortModalBtn">
                <Suspense fallback={null}>
                  <UserCreateModal
                    id={row.id}
                    slug={`Create ${row.name} as a user`}
                    inputFields={inputFieldsForCreateUser}
                    ModalOpenBtnTitle={<FaUserEdit />}
                    className="createUserIcon"
                    identifier="userStore"
                    api="/userStore"
                    getSpecificDataApi="/permissions"
                    setRelodeTable={setRelodeTable}
                    setLoader={setLoader}
                    toolTip={`Create user credentials for ${row.name}`}
                  />
                </Suspense>
              </div>
            )}

            {["Developer", "Employee-relation-create"].some((item) =>
              userRole.includes(item)
            ) && (
              <div className="shortModalBtn">
                <Suspense fallback={null}>
                  {row.designation?.slug === "officer" ||
                  row.designation?.slug === "manager" ||
                  row.designation?.slug === "rsm" ? (
                    <ReletionCreateModal
                      id={row.id}
                      slug={`Create relation with ${row.name} (${row.designation?.name})`}
                      inputFields=""
                      ModalOpenBtnTitle={<FaHandsHelping />}
                      className="createRelationIcon"
                      identifier="relationStore"
                      api="/relationStore"
                      getSpecificDataApi="/getRelatedEmployees"
                      data={row}
                      setRelodeTable={setRelodeTable}
                      setLoader={setLoader}
                      toolTip="Manage Hierarchy Relation"
                    />
                  ) : null}
                </Suspense>
              </div>
            )}

            {["Developer", "Employee-details-page"].some((item) =>
              userRole.includes(item)
            ) && (
              <Tooltip title={`View details for ${row.name}`} placement="bottom">
                <Link
                  to={`/employees/view-details/${row.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaEye size={17} />
                </Link>
              </Tooltip>
            )}
          </div>
        ),
      },
    ],
    [
      currentPage,
      perPage,
      userRole,
      inputFields,
      inputFieldsForCreateUser,
      designationData,
      setRelodeTable,
      setLoader,
      setRelodeSelect,
      headers,
    ]
  );

  return (
    <DataTable
      columns={columns}
      data={filteredApiData}
      customStyles={customStyles}
      pagination
      paginationRowsPerPageOptions={rowPerPage}
      onChangePage={(page) => setCurrentPage(page)}
      onChangeRowsPerPage={(newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
      }}
      persistTableHead
    />
  );
};

export default EmployeesTable;

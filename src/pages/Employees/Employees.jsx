import { useState, useEffect, lazy, Suspense, useContext } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

//=>>> Components
const EmployeesTable = lazy(() => import("./EmployeesTable"));
const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);

//=>>> Additional utility
import ApiConfig from "../../assets/js/ApiConfig";
import { AuthContext } from "../../context/AuthContext";
import useStickyScroll from "../../hooks/useStickyScroll";

const Employees = ({ setLoader }) => {
  const { headers, userRole } = useContext(AuthContext);
  const stickyRef = useStickyScroll(67);
  const [relodeTable, setRelodeTable] = useState(false);
  const [searchData, setSearchData] = useState("");

  //=>>> Input For create employee (modal)
  const inputFields = [
    {
      field: "generated_employee_id",
      type: "text",
      label: "Employee id",
      isRequired: true,
      placeholder: "Enter employees unique id",
      // isDisabled: true,
    },
    {
      field: "name",
      type: "text",
      label: "Name",
      isRequired: true,
      placeholder: "Enter name",
    },
    {
      field: "phone",
      type: "text",
      label: "Phone",
      isRequired: true,
      placeholder: "Enter phone number",
    },
    {
      field: "national_id",
      type: "text",
      label: "National id",
      isRequired: false,
      placeholder: "Enter national id number",
    },
    {
      field: "blood_group",
      type: "text",
      label: "Blood group",
      isRequired: false,
      placeholder: "Enter blood group",
    },
    {
      field: "territory",
      type: "text",
      label: "Territory",
      isRequired: true,
      placeholder: "Enter territory",
    },
    {
      field: "district",
      type: "text",
      label: "District",
      isRequired: true,
      placeholder: "Enter district",
    },
    {
      field: "credit_limit",
      type: "text",
      label: "Credit limit",
      isRequired: false,
      placeholder: "Enter credit limit",
    },
    {
      field: "basic_salary",
      type: "text",
      label: "Basic salary",
      isRequired: false,
      placeholder: "Enter basic salary",
    },
  ];

  //=>>> Input For create user (modal)
  const inputFieldsForCreateUser = [
    {
      field: "email",
      type: "text",
      label: "Email",
      isRequired: true,
      placeholder: "Enter email",
    },
    {
      field: "password",
      type: "text",
      label: "Password",
      isRequired: true,
      placeholder: "Enter password",
    },
  ];

  const [designationData, setDesignationData] = useState([]);
  const getDesignationData = async () => {
    try {
      setLoader(true);
      await ApiConfig.get("/designations", { headers }).then((response) => {
        setDesignationData(response.data.data);
        setLoader(false);
      });
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getDesignationData();
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Employees</title>
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
        <h1 className="page-title">Employees</h1>
        <div
          ref={stickyRef}
          className="sticky top-[67px] z-50 flex justify-between mb-2"
        >
          <div className="searchInput">
            <input
              type="text"
              placeholder="Search employee"
              value={searchData}
              onChange={(e) => {
                setSearchData(e.target.value);
              }}
            />
          </div>
          {["Developer", "Employee-create"].some((item) =>
            userRole.includes(item)
          ) && (
            <Suspense fallback="...">
              <CommonModal
                slug={`Add employees`}
                inputFields={inputFields}
                ModalOpenBtnTitle="Add employees"
                className="addBtn"
                identifier="employeeStore"
                api="/employeeStore"
                data={designationData}
                // setData={designationData}
                setRelodeTable={setRelodeTable}
                setLoader={setLoader}
              />
            </Suspense>
          )}
        </div>

        <Suspense fallback="">
          <EmployeesTable
            headers={headers}
            userRole={userRole}
            relodeTable={relodeTable}
            setRelodeTable={setRelodeTable}
            setLoader={setLoader}
            designationData={designationData}
            inputFields={inputFields}
            inputFieldsForCreateUser={inputFieldsForCreateUser}
            searchData={searchData}
          />
        </Suspense>
      </div>
    </HelmetProvider>
  );
};

export default Employees;

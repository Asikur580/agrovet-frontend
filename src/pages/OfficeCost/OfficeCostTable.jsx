import { useEffect, useState, lazy, Suspense } from "react";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import DataTable from "react-data-table-component";

//=>>> Css
import "../../assets/css/DataTable.css";

//=>>> Icons
import { FaEdit } from "react-icons/fa";
import { IoTrashBinSharp } from "react-icons/io5";

//=>>> Components
const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);

//=>>> Utilities
import ApiConfig from "../../assets/js/ApiConfig";
import { TableStyles, rowPerPage } from "../../assets/js/Utility";

const OfficeCostTable = (props) => {
  const {
    headers,
    userRole,
    relodeTable,
    setRelodeTable,
    setLoader,
    inputFields,
    costCategory,
    officersData,
    setSelectedRows,
    toggledClearRows,
    searchData,
  } = props;
  const customStyles = TableStyles();

  // States
  const [apiData, setApiData] = useState([]);
  const [filteredApiData, setFilteredApiData] = useState([]);

  const getApiData = async () => {
    try {
      setLoader(true);
      await ApiConfig.get("/officeCost", { headers }).then((response) => {
        setApiData(response.data.data);
        setFilteredApiData(response.data.data);
        // console.clear();
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
      selector: (row, index) => index + 1,
    },
    {
      name: "Name",
      field: "name",
      selector: (row) => row.cost_category_name,
    },
    {
      name: "Amount",
      field: "amount",
      selector: (row) => row.amount,
    },
    {
      name: "Cost date",
      field: "cost_date",
      selector: (row) => row.cost_date,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex" style={{ gap: "20px" }}>
          {["Developer", "Office-cost-edit"].some((item) =>
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
                  identifier="costUpdateOffice"
                  api={`/costUpdate/${row.id}`}
                  getSpecificDataApi="/costShow"
                  data={costCategory}
                  setRelodeTable={setRelodeTable}
                  setLoader={setLoader}
                  toolTip={`Edit ${row.name}`}
                />
              </Suspense>
            </div>
          )}
          {["Developer", "Office-cost-delete"].some((item) =>
            userRole.includes(item)
          ) && (
            <Tooltip title={`Delete ${row.amount}`} placement="bottom">
              <button>
                <IoTrashBinSharp
                  className="deleteIcon c-pointer"
                  size={20}
                  onClick={async () => {
                    const confirmation = confirm(
                      "Do you want to delete this cost?"
                    );
                    if (confirmation) {
                      const payload = new FormData();
                      payload.append("id", row.id);

                      setLoader(true);
                      await ApiConfig.post(`/costDelete/${row.id}`, payload, {
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
  //=>>> Column for datatable end ____//

  //=>>> Searching function
  useEffect(() => {
    const result = apiData.filter((filteredApiData) => {
      return filteredApiData.cost_category_name
        .toLowerCase()
        .match(searchData.toLowerCase());
    });
    setFilteredApiData(result);
  }, [searchData]);

  //===> Print section start
  const handleTabelSelectChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
    sessionStorage.setItem("printOfficeCost", JSON.stringify(selectedRows));
  };
  //===> Print section end

  return (
    <>
      <DataTable
        columns={columns}
        data={filteredApiData}
        customStyles={customStyles}
        pagination
        paginationRowsPerPageOptions={rowPerPage}
        selectableRows
        onSelectedRowsChange={handleTabelSelectChange}
        clearSelectedRows={toggledClearRows}
      />
    </>
  );
};

export default OfficeCostTable;

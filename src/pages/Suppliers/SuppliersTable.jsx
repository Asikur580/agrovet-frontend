import { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import DataTable from "react-data-table-component";

//=>>> Css
import "../../assets/css/DataTable.css";

//=>>> Icons
import { FaEdit, FaEye, FaImage } from "react-icons/fa";
import { IoTrashBinSharp } from "react-icons/io5";

//=>>> Components
const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);
const ImageLazyLoad = lazy(() =>
  import("../../components/ImageLazyLoad/ImageLazyLoad")
);
// import QrCode from "../../components/QrCode/QrCode";

//=>>> Utilities
import ApiConfig, { imgUrl } from "../../assets/js/ApiConfig";
import { TableStyles, rowPerPage } from "../../assets/js/Utility";

const SuppliersTable = (props) => {
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
      await ApiConfig.get("/suppliers", { headers }).then((response) => {
        setApiData(response.data.data);
        setFilteredApiData(response.data.data);
        // console.clear();
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
      width: "80px",
      selector: (row, index) => index + 1,
    },
    {
      name: "Proprietor name",
      field: "proprietor_name",
      selector: (row) => row.proprietor_name,
    },
    {
      name: "Phone",
      field: "Phone",
      selector: (row) => row.phone,
    },
    {
      name: "Whatsapp",
      field: "whatsapp",
      selector: (row) => row.whatsapp,
    },
    {
      name: "Email",
      field: "email",
      selector: (row) => row.email,
    },
    {
      name: "Company name",
      field: "company_name",
      selector: (row) => row.company_name,
    },
    {
      name: "Address",
      field: "address",
      selector: (row) => row.address,
    },
    {
      name: "Country",
      field: "country",
      selector: (row) => row.country,
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
      cell: (row) => (
        <div className="d-flex" style={{ gap: "20px" }}>
          {["Developer", "Supplier-edit"].some((item) =>
            userRole.includes(item)
          ) && (
            <div className="shortModalBtn">
              <Suspense fallback="...">
                <CommonModal
                  id={row.id}
                  slug={`Edit supplier`}
                  inputFields={inputFields}
                  ModalOpenBtnTitle={<FaEdit />}
                  className="editBtn"
                  identifier="supplierUpdate"
                  api={`/supplierUpdate/${row.id}`}
                  getSpecificDataApi="/supplierShow"
                  setRelodeTable={setRelodeTable}
                  setLoader={setLoader}
                  toolTip={`Edit ${row.proprietor_name}`}
                />
              </Suspense>
            </div>
          )}
          {["Developer", "Supplier-delete"].some((item) =>
            userRole.includes(item)
          ) && (
            <Tooltip title={`Delete ${row.proprietor_name}`} placement="bottom">
              <button>
                <IoTrashBinSharp
                  className="deleteIcon c-pointer"
                  size={20}
                  onClick={async () => {
                    const confirmation = confirm(
                      "Do you want to delete this supplier?"
                    );
                    if (confirmation) {
                      const payload = new FormData();
                      payload.append("id", row.id);

                      await ApiConfig.post(
                        `/supplierDelete/${row.id}`,
                        payload,
                        {
                          headers,
                        }
                      )
                        .then((response) => {
                          if (response.data.status == true) {
                            setRelodeTable((prev) => !prev);
                            console.clear();
                            toast.success(response.data.message);
                          } else {
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
          {["Developer", "Supplier-details-page"].some((item) =>
            userRole.includes(item)
          ) && (
            <Tooltip title={`View ${row.proprietor_name}`} placement="bottom">
              <Link to={`/suppliers/view-details/${row.id}`}>
                <FaEye style={{ color: "#0a57f7", fontSize: "1.12rem" }} />
              </Link>
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
      return (
        filteredApiData.proprietor_name
          .toLowerCase()
          .match(searchData.toLowerCase()) ||
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

export default SuppliersTable;

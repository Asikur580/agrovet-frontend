import React, { useRef, useState, lazy, Suspense, useContext } from "react";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import { Button, Modal } from "antd";
import Draggable from "react-draggable";

//___ Css ___//
import "./CommonModal.css";

//___ Components ___//
const UserPermissionCheckbox = lazy(() =>
  import("../../Checkbox/UserPermissionCheckbox")
);
// const UserPermissionSwitch = lazy(() =>
//   import("../../Switch/UserPermissionSwitch")
// );

//___ Additional utility ___//
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";

const UserCreateModal = (props) => {
  const { headers } = useContext(AuthContext);
  const {
    id,
    slug,
    inputFields,
    identifier,
    api,
    getSpecificDataApi,
    ModalOpenBtnTitle,
    className,
    toolTip,
    setRelodeTable,
    setLoader,
  } = props;
  const [reloader, setReloader] = useState(false);

  //__ Modal config start __//
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);
  const showModal = () => {
    setOpen(true);
    setReloader((prev) => (prev = true));

    if (identifier == "userUpdate" || identifier == "givePermissions") {
      GetSpecificData();
    } else if (identifier == "userStore") {
      GetSpecificData();
      setInputValue({ ...inputValue, employee_id: id });
    }

    const initialIsRequired = {};
    inputFields.map((item, index) => {
      initialIsRequired[item.field] = item.isRequired;
    });
    setIsRequired(initialIsRequired);
  };
  const handleOk = (e) => {
    setOpen(false);
    setReloader((prev) => (prev = false));
  };
  const handleCancel = (e) => {
    setOpen(false);
    setReloader((prev) => (prev = false));
  };
  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };
  //__ Modal config end __//

  //__ My code start __//
  const [searchData, setSearchData] = useState("");
  const [isRequired, setIsRequired] = useState({});
  const [permission, setPermission] = useState({});
  const [permissionData, setPermissionData] = useState([]);
  const [inputValue, setInputValue] = useState({
    employee_id: "",
    email: "",
    password: "",
  });
  const handleInputValue = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  //___ Get specific data with id ___//
  const GetSpecificData = async () => {
    setLoader(true);
    if (identifier == "userStore") {
      try {
        setLoader(true);
        await ApiConfig.get(getSpecificDataApi, { headers }).then(
          (response) => {
            setPermissionData(response.data.data);
            setLoader(false);
            // console.log(response.data.data);
          }
        );
      } catch (error) {
        setLoader(false);
        console.log(error);
      }
    } else if (identifier == "userUpdate" || identifier == "givePermissions") {
      await ApiConfig.get(`${getSpecificDataApi}/${id}`, { headers })
        .then((response) => {
          if (response.data.status == true) {
            setPermissionData(response.data.permissions);
            setInputValue({
              ...inputValue,
              employee_id: response.data.user.employee_id,
              email: response.data.user.email,
            });

            // Set initial permissions
            const tempPermissions = {};
            Object.values(response.data.userPermissions).forEach((item) => {
              tempPermissions[item] = item;
            });
            setPermission((prevPermissions) => ({
              ...prevPermissions,
              ...tempPermissions,
            }));

            setLoader(false);
            console.clear();
          } else {
            console.log(response);
            setLoader(false);
          }
        })
        .catch((e) => {
          setLoader(false);
          toast.error(e.response.data.message);
        });
    }
  };

  // React.useEffect(() => {
  //   console.log(
  //     "Selected permissions ",
  //     Object.keys(permission)
  //       .map(Number)
  //       .filter((key) => permission[key])
  //   );
  // }, [permission]);

  //___ Submit form data ___//
  const SubmitForm = async (e) => {
    e.preventDefault();
    if (identifier == "userStore" || identifier == "userUpdate") {
      if (inputValue.employee_id == "") {
        toast.error("Employee id not found");
      } else if (isRequired.email == true && inputValue.email == "") {
        toast.error("Please enter email");
      } else if (isRequired.password == true && inputValue.password == "") {
        toast.error("Please enter password");
      } else if (Object.keys(permission).length <= 0) {
        toast.error("You have not select any permission");
      } else {
        const payload = {
          employee_id: inputValue.employee_id,
          email: inputValue.email,
          password: inputValue.password,
          permission: Object.values(permission).map(Number),
          // permission: Object.keys(permission)
          //   .map(Number)
          //   .filter((key) => permission[key]),
        };
        // console.log("Payload ", payload);

        setLoader(true);
        await ApiConfig.post(api, payload, { headers })
          .then((response) => {
            if (response.data.status == true) {
              setPermission({});
              handleCancel();
              setRelodeTable((prev) => !prev);
              console.clear();
              setLoader(false);
              setSearchData("");
              toast.success(response.data.message);
            } else {
              setLoader(false);
              toast.error(response.data.error);
            }
          })
          .catch((e) => {
            setLoader(false);
            console.log(`Error = ${e}`);
          });
      }
    }
  };
  //__ My code end __//

  return (
    <>
      <Tooltip title={toolTip} placement="bottom">
        <Button onClick={showModal} className={className}>
          {ModalOpenBtnTitle}
        </Button>
      </Tooltip>
      <Modal
        title={
          <div
            className="modalTitle"
            style={{
              width: "100%",
              cursor: "move",
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            // fix eslintjsx-a11y/mouse-events-have-key-events
            // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
            onFocus={() => {}}
            onBlur={() => {}}
            // end
          >
            {slug}
          </div>
        }
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            nodeRef={draggleRef}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        {/* Content start */}
        <div className="modalContent">
          <form className="d-flex" onSubmit={SubmitForm}>
            {inputFields.map((items, index) => {
              return (
                <div style={{ width: "100%" }} key={index}>
                  <label>{items.label}</label>
                  <div className="inputBox">
                    <input
                      type={items.type}
                      name={items.field}
                      placeholder={`${items.placeholder}`}
                      onChange={handleInputValue}
                      value={inputValue[items.field] || ""}
                      readOnly={items.isEditAble}
                    />
                  </div>
                </div>
              );
            })}

            <br />
            <Suspense fallback="...">
              <UserPermissionCheckbox
                permission={permission}
                setPermission={setPermission}
                identifier={identifier}
                data={permissionData}
                searchData={searchData}
                setSearchData={setSearchData}
              />

              {/* <UserPermissionSwitch
                permission={permission}
                setPermission={setPermission}
                identifier={identifier}
                data={permissionData}
              /> */}
            </Suspense>

            <div>
              <button type="submit" className="button">
                next
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default React.memo(UserCreateModal);

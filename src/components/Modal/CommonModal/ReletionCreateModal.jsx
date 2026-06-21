import React, { useRef, useState, lazy, Suspense, useContext } from "react";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import { Button, Modal } from "antd";
import Draggable from "react-draggable";

//=>>> Css
import "./CommonModal.css";

//=>>> Additional utility
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";

const ReletionCreateModal = (props) => {
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
    data,
  } = props;

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

    if (identifier == "relationStore" || identifier == "abcd") {
      GetSpecificData();
    }
  };
  const handleOk = (e) => {
    setOpen(false);
  };
  const handleCancel = (e) => {
    setOpen(false);
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
  const [inputValue, setInputValue] = useState({
    employee_id: "0",
    relation_id: "0",
  });
  const handleInputValue = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
    // console.log(`${e.target.name} = ${e.target.value}`);
  };

  //=>>> Get specific data with id
  const [reletedData, setReletedData] = useState([]);
  const GetSpecificData = async () => {
    setLoader(true);
    await ApiConfig.post(
      getSpecificDataApi,
      { employee_id: data.id },
      { headers }
    )
      .then((response) => {
        if (response.data.status == true) {
          if (identifier == "relationStore") {
            setReletedData(response.data.data);
          }
          console.clear();
          setLoader(false);
        } else {
          setLoader(false);
          console.log(response);
        }
      })
      .catch((e) => {
        console.log(`Error = ${e}`);
      });
  };

  //=>>> Submit form data
  const SubmitForm = async (e) => {
    e.preventDefault();
    if (identifier == "relationStore" || identifier == "userUpdate") {
      if (inputValue.relation_id == "") {
        toast.error("Please select employee");
      } else {
        const payload = new FormData();
        payload.append("employee_id", data.id);
        payload.append("relation_id", inputValue.relation_id);

        setLoader(true);
        await ApiConfig.post(api, payload, { headers })
          .then((response) => {
            if (response.data.status == true) {
              setInputValue({
                employee_id: "",
                relation_id: "",
              });
              handleCancel();
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
            setLoader(false);
            toast.error(e.response.data.message);
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
            <div className="select-from-modal">
              <select
                className="select"
                name="relation_id"
                value={inputValue.relation_id}
                onChange={handleInputValue}
              >
                <option value="0" disabled>
                  Select employee
                </option>
                {Array.isArray(reletedData) &&
                  reletedData.map((items, index) => {
                    return (
                      <option value={items.id} key={index}>
                        {items.name}
                      </option>
                    );
                  })}
              </select>
            </div>

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

export default ReletionCreateModal;

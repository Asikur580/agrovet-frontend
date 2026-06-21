import React, { useEffect, useRef, useState } from "react";
// import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import { Button, Modal } from "antd";
import Draggable from "react-draggable";

//___ Css ___//
import "../CommonModal/CommonModal.css";
import "./Calculator.css";

//___ Additional utility ___//
// import ApiConfig from "../../../assets/js/ApiConfig";
// import { GetCookie } from "../../../assets/js/GetCookie";
// import { Decryption, secretKey } from "../../../assets/js/Encryption";

const PriceCalculator = (props) => {
  const { id, slug, identifier, ModalOpenBtnTitle, className, toolTip } = props;

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
  const [total, setTotal] = useState(0);
  const [totalCost, setTotalCost] = useState("");
  const [particularProductCost, setParticularProductCost] = useState("");
  const [particularProductQuantity, setParticularProductQuantity] =
    useState("");
  const [transportCost, setTransportCost] = useState("");

  useEffect(() => {
    if (totalCost != 0 && particularProductQuantity != 0) {
      // Equation
      const price =
        ((particularProductCost * transportCost) / totalCost +
          particularProductCost) /
        particularProductQuantity;

      setTotal(Math.ceil(price));
      // console.log(price);
    } else {
      setTotal(0);
    }
  }, [
    total,
    totalCost,
    particularProductCost,
    particularProductQuantity,
    transportCost,
  ]);

  // const [inputValue, setInputValue] = useState({});
  // const handleInputValue = (e) => {
  //   setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  //   const price = Math.ceil(inputValue.particularProductCost);
  //   setTotal(price);
  // };

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
        <div className="modalContent calculator">
          <div style={{ width: "100%" }}>
            <label>Total cost</label>
            <div className="inputBox">
              <input
                type="text"
                name="totalCost"
                placeholder="Enter total cost"
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setTotalCost(value);
                  // if (value >= 0) {
                  //   setTotalCost(value);
                  // }
                }}
                value={totalCost}
              />
            </div>
          </div>
          <div style={{ width: "100%" }}>
            <label>Particular product cost</label>
            <div className="inputBox">
              <input
                type="text"
                name="particularProductCost"
                placeholder="Enter particular product cost"
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  if (value >= 0) {
                    setParticularProductCost(value);
                  }
                }}
                value={particularProductCost}
              />
            </div>
          </div>
          <div style={{ width: "100%" }}>
            <label>Particular product quantity</label>
            <div className="inputBox">
              <input
                type="text"
                name="particularProductQuantity"
                placeholder="Enter particular product quantity"
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  if (value >= 0) {
                    setParticularProductQuantity(value);
                  }
                }}
                value={particularProductQuantity}
              />
            </div>
          </div>
          <div style={{ width: "100%" }}>
            <label>Transport cost</label>
            <div className="inputBox">
              <input
                type="text"
                name="transportCost"
                placeholder="Enter transport cost"
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  if (value >= 0) {
                    setTransportCost(value);
                  }
                }}
                value={transportCost}
              />
            </div>
          </div>

          <h3 className="mt-5 text-end text-2xl">Buy price = {total} /-</h3>
        </div>
      </Modal>
    </>
  );
};

export default PriceCalculator;

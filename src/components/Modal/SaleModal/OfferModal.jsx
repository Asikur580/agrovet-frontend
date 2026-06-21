import { useState, useRef } from "react";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import { Modal } from "antd";
import Draggable from "react-draggable";

//=>>> Css
import "../CommonModal/CommonModal.css";

//=>>> Utilities
import ApiConfig from "../../../assets/js/ApiConfig";

const OfferModal = ({
  row,
  headers,
  setRelodeTable,
  setLoader,
  children,
  toolTip,
}) => {
  const [open, setOpen] = useState(false);
  const [offerValue, setOfferValue] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);

  const showModal = () => {
    setOfferValue(row.offer || "");
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setOfferValue("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offerValue.trim()) {
      toast.error("Please enter an offer");
      return;
    }
    try {
      setLoader(true);
      const response = await ApiConfig.post(
        `/invoice/${row.id}/update-offer`,
        { offer: offerValue },
        { headers }
      );
      if (response.data.status === true) {
        setRelodeTable((prev) => !prev);
        toast.success(response.data.message);
        handleCancel();
      } else {
        toast.error(response.data.message);
      }
    } catch (e) {
      toast.error("Failed to update offer");
      console.log("Error:", e);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <Tooltip title={toolTip || "Offer"} placement="bottom">
        <button
          onClick={showModal}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {children}
        </button>
      </Tooltip>

      <Modal
        title={
          <div
            style={{ width: "100%", cursor: "move" }}
            onMouseOver={() => setDisabled(false)}
            onMouseOut={() => setDisabled(true)}
            onFocus={() => {}}
            onBlur={() => {}}
          >
            <span className="modalTitle">
              {row.offer ? "Update Offer" : "Add Offer"}
            </span>
          </div>
        }
        open={open}
        onCancel={handleCancel}
        footer={null}
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
        <div className="modalContent">
          <form onSubmit={handleSubmit}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                marginTop: "5px",
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--dark-3)",
              }}
            >
              Offer
            </label>
            <div
              className="inputBox"
              style={{
                border: "var(--table-border)",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <input
                type="text"
                name="offer"
                placeholder="Enter offer details..."
                value={offerValue}
                onChange={(e) => setOfferValue(e.target.value)}
                autoFocus
                style={{
                  width: "100%",
                  padding: "10px 15px",
                  border: "none",
                  outline: "none",
                  fontSize: "0.95rem",
                  color: "var(--dark-3)",
                  background: "transparent",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "24px",
                gap: "12px",
              }}
            >
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: "9px 22px",
                  border: "var(--border)",
                  borderRadius: "8px",
                  background: "var(--light-2)",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "var(--dark-3)",
                  transition: "var(--trans)",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "var(--light-3)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "var(--light-2)";
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "9px 28px",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  background: "var(--main-clr)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "var(--trans)",
                  letterSpacing: "0.5px",
                }}
                onMouseOver={(e) => {
                  e.target.style.opacity = "0.85";
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow = "0 4px 12px rgba(59, 88, 152, 0.35)";
                }}
                onMouseOut={(e) => {
                  e.target.style.opacity = "1";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default OfferModal;

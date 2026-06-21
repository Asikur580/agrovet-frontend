import React, { useContext, useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";

//=>>> Utility
import { DataContext } from "../../context/DataContext";
import useEscapeKey from "../../hooks/useEscapeKey";

//=>>> Icon
import { FaDisplay } from "react-icons/fa6";

//=>>> Css
import "./SeconderyDisplay.css";

const SeconderyDisplay = (props) => {
  const { width, height, title } = props;
  const { contextData, setContextData } = useContext(DataContext);
  const [displayOpen, setDisplayOpen] = useState(false);

  useEscapeKey(() => setDisplayOpen(false));

  return (
    <>
      <Tooltip title="Secondery display">
        <div
          className="displayOpen"
          onClick={() => {
            setDisplayOpen((prev) => !prev);
          }}
        >
          <FaDisplay size={21} />
        </div>
      </Tooltip>

      <div
        className={`seconderyDisplay ${
          displayOpen && "activeSeconderyDisplay"
        }`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <h1 className="displayValue">
          {title} : {contextData}/-
        </h1>
      </div>
    </>
  );
};

export default SeconderyDisplay;

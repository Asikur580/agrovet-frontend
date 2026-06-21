import React, { Suspense, useState } from "react";
import { Dropdown, Space } from "antd";
import { FaGear } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import "./DrpDownStyle.css";

//=>>> Components
import { daysPrevToToday } from "../../assets/js/DateFormater";
import ModalTable from "../Modal/CommonModal/ModalTable";
import Spinner from "../Loader/Spinner";

const SalesSumrDrpDown = ({
  countedDays,
  setDateRang,
  printData,
  spinnerLoader,
  tableHead,
  slug,
  identifierForPrintModal,
}) => {
  const [daysInput, setDaysInput] = useState(countedDays);
  const [btnRotater, setBtnRotater] = useState(false);

  const handleDayOfDueInv = () => {
    setDaysInput(daysInput);
    const modifiedDate = daysPrevToToday(daysInput);
    daysInput != 0 ? setDateRang(modifiedDate) : setDateRang("0");
  };

  const items = [
    {
      key: "1",
      label: (
        <div>
          <label className="drpDwnLabel">Type previous days</label>
          <div className="drpDwnInputBox">
            <input
              type="text"
              value={daysInput}
              onChange={(e) => {
                const val = e.target.value;
                // Check string
                if (val === "") {
                  setDaysInput("");
                  return;
                }
                // Check integer
                if (/^\d+$/.test(val)) {
                  const parsedVal = parseInt(val, 10);

                  if (parsedVal >= 0) {
                    setDaysInput(parsedVal.toString());
                    setBtnRotater(false);
                  }
                }
              }}
            />
            <button onClick={handleDayOfDueInv}>
              <IoIosSearch size={20} />
            </button>
          </div>

          {spinnerLoader && (
            <div className="flex justify-center items-center mt-7">
              <Spinner />
            </div>
          )}
        </div>
      ),
      disabled: true,
    },
    {
      key: "2",
      label: (
        <div className="flex justify-center">
          <Suspense fallback={null}>
            <ModalTable
              slug={slug}
              inputFields={[]}
              ModalOpenBtnTitle="Print"
              className="addBtn"
              identifier={identifierForPrintModal}
              data={printData}
              tableHead={tableHead}
            />
          </Suspense>
        </div>
      ),
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <a
        onClick={(e) => {
          e.preventDefault();
          setBtnRotater((prev) => !prev);
        }}
      >
        <Space>
          <FaGear
            size={20}
            className={`mt-[6px] cursor-pointer ${
              btnRotater == true ? "rotateBtn" : ""
            }`}
            style={{ transition: "var(--trans)" }}
          />
        </Space>
      </a>
    </Dropdown>
  );
};
export default SalesSumrDrpDown;

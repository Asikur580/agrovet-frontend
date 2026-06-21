import React, { Suspense, useState } from "react";
import { Dropdown, Space } from "antd";
import { FaGear } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import "./DrpDownStyle.css";

//=>>> Components
import { daysPrevToToday } from "../../assets/js/DateFormater";
import ModalTable from "../Modal/CommonModal/ModalTable";
import Spinner from "../../components/Loader/Spinner";

const DueInvoiceDrpDown = ({ setDateRang, printData, spinnerLoader }) => {
  const [daysInput, setDaysInput] = useState(30);
  const [btnRotater, setBtnRotater] = useState(false);

  const handleDayOfDueInv = () => {
    setDaysInput(daysInput);
    const modifiedDate = daysPrevToToday(daysInput);
    daysInput != 0 ? setDateRang(modifiedDate) : setDateRang("0");
  };

  const tableHead = ["Sl", "Customer name", "Total", "Due", "Date"];

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
                if (val >= 0) {
                  setDaysInput(val);
                  setBtnRotater(false);
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

        // <div className="flex items-end justify-end mb-2">
        //     <select
        //       name=""
        //       id=""
        //       className="select py-0"
        //       onChange={(daysAgo) => handleDayOfDueInv(daysAgo)}
        //       defaultValue="30"
        //     >
        //       <option value="0">All</option>
        //       <option value="15">15 day</option>
        //       <option value="30">30 day</option>
        //       <option value="60">60 day</option>
        //     </select>
        //   </div>
      ),
      disabled: true,
    },
    {
      key: "2",
      label: (
        <div className="flex justify-center">
          <Suspense fallback={null}>
            <ModalTable
              slug="Due invoices"
              inputFields={[]}
              ModalOpenBtnTitle="Print"
              className="addBtn"
              identifier="printDueInvoice"
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
export default DueInvoiceDrpDown;

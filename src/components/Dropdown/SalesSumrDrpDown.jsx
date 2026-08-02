import React, { Suspense, useState } from "react";
import { Dropdown, Space } from "antd";
import { FaGear } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import "./DrpDownStyle.css";

//=>>> Components
import { daysPrevToToday, DateFormater } from "../../assets/js/DateFormater";
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
  const [btnRotater, setBtnRotater] = useState(false);
  const [fromDate, setFromDate] = useState(countedDays ? daysPrevToToday(countedDays) : "");
  const [toDate, setToDate] = useState(countedDays ? DateFormater(new Date()) : "");

  const handleDateRange = () => {
    if (fromDate || toDate) {
      setDateRang({ startDate: fromDate, endDate: toDate });
      setBtnRotater(false);
    }
  };

  const items = [
    {
      key: "1",
      label: (
        <div>
          <div className="w-56">
            <label className="drpDwnLabel block mb-2">Select date range</label>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm w-10">From:</span>
                <input
                  type="date"
                  className="border border-gray-300 rounded px-2 py-1 outline-none text-sm flex-1 font-sans cursor-pointer"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setBtnRotater(false);
                  }}
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm w-10">To:</span>
                <input
                  type="date"
                  className="border border-gray-300 rounded px-2 py-1 outline-none text-sm flex-1 font-sans cursor-pointer"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setBtnRotater(false);
                  }}
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                />
              </div>
              <button 
                onClick={handleDateRange}
                className="bg-green-600 hover:bg-green-700 text-white px-2 py-1.5 rounded transition-colors flex items-center justify-center gap-1 mt-1 w-full"
              >
                <IoIosSearch size={20} /> <span className="text-sm font-medium">Search</span>
              </button>
            </div>
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

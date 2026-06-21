import React from "react";
import { DatePicker, Space } from "antd";
import { DateFormater } from "../../assets/js/DateFormater";

const MonthPicker = ({ setMonth }) => {
  const handleMonth = (evt) => {
    {
      if (evt != null) {
        const month = DateFormater(evt);
        setMonth(month.slice(0, 7));
      } else {
        setMonth("YYYY-MM");
      }
    }
  };

  return (
    <Space direction="vertical">
      <DatePicker
        picker="month"
        onChange={(evt) => handleMonth(evt)}
        style={{ width: "100%" }}
      />
    </Space>
  );
};

export default MonthPicker;

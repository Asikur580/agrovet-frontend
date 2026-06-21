import React from "react";
import { DatePicker, Space } from "antd";
// import { DateFormater } from "../../assets/js/DateFormater";
const SingleDatePicker = (props) => {
  const { setDate } = props;
  const onChange = (evt, dateString) => {
    if (dateString) {
      setDate(dateString);
    } else {
      setDate(new Date().toISOString().split("T")[0]);
    }
  };
  return (
    <Space direction="vertical">
      <DatePicker
        format="YYYY-MM-DD"
        onChange={onChange}
        inputReadOnly
        style={{ width: "100%" }}
        // onChange={(evt) => onChange(evt)}
      />
    </Space>
  );
};
export default SingleDatePicker;

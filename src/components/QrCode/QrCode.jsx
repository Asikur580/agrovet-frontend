import React from "react";
import { QRCode } from "antd";
import logo from "../../assets/images/Prifile.png";

const QrCode = (props) => {
  const { value } = props;
  return (
    <>
      <QRCode
        errorLevel="H"
        value={`https://project.molla-properties.com/backend/public/api/${value}`}
        icon={logo}
      />
    </>
  );
};

export default QrCode;

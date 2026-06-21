import React, { useEffect, useState } from "react";

const PrintProduct = () => {
  const [sessionStoreData, setSessionStoreData] = useState([]);
  useEffect(() => {
    setSessionStoreData(JSON.parse(sessionStorage.getItem("printProduct")));

    // console.log(sessionStoreData);
  }, []);
  return <div>PrintProduct</div>;
};

export default PrintProduct;

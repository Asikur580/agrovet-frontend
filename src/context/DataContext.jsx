import { createContext, useState } from "react";

export const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [contextData, setContextData] = useState("");
  const [customerDataContext, setCustomerDataContext] = useState([]);
  const [employeeDataContext, setEmployeeDataContext] = useState([]);

  return (
    <DataContext.Provider
      value={{
        contextData,
        setContextData,
        customerDataContext,
        setCustomerDataContext,
        employeeDataContext,
        setEmployeeDataContext,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
export default DataProvider;

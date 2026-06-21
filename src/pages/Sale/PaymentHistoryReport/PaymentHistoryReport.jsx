import {
  useState,
  useEffect,
  useContext,
} from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { DatePicker, Space, Table, Tag } from "antd";

// Utilities
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";
import useStickyScroll from "../../../hooks/useStickyScroll";

const PaymentHistoryReport = ({ setLoader }) => {
  const { headers, userDesignationSlug } = useContext(AuthContext);
  const stickyRef = useStickyScroll(67);
  const { RangePicker } = DatePicker;

  const [apiData, setApiData] = useState([]);
  const [dateVal, setDateVal] = useState({ start: "", end: "" });
  const [employeeId, setEmployeeId] = useState("");
  const [employees, setEmployees] = useState([]);

  const getPaymentHistory = async () => {
    try {
      setLoader(true);
      let query = "";
      if (dateVal.start && dateVal.end) {
        query += `?from_date=${dateVal.start}&to_date=${dateVal.end}`;
      }
      if (employeeId) {
        query += query ? `&employee_id=${employeeId}` : `?employee_id=${employeeId}`;
      }
      const response = await ApiConfig.get(`/payment-history-by-role${query}`, { headers });
      setApiData(response.data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const getEmployees = async () => {
    try {
      const response = await ApiConfig.get("/employees", { headers });
      setEmployees(response.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPaymentHistory();
  }, [headers, dateVal, employeeId]);

  useEffect(() => {
    if (userDesignationSlug.some((slug) => ["admin", "super_admin", "developer", "rsm", "manager"].includes(slug))) {
      getEmployees();
    }
  }, [headers, userDesignationSlug]);

  const columns = [
    {
      title: "Sl No",
      key: "sl_no",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Employee ID",
      dataIndex: "employee_id",
      key: "employee_id",
      render: (val) => val || "-",
    },
    {
      title: "Employee Name",
      dataIndex: "name",
      key: "name",
      render: (val) => val || "-",
    },
    {
      title: "Total Collected Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (val) => Number(val || 0).toFixed(2),
    },
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>Payment History</title>
      </Helmet>

      {/* For go to top */}
      <input
        type="file"
        autoFocus
        style={{ height: "0", opacity: 0, pointerEvents: "none" }}
      />

      <div className="content animated fadeInDown">
        <h1 className="page-title">Employee-wise Payment History</h1>
        <div ref={stickyRef} className="sticky top-[67px] z-50 flex justify-between items-center mb-4 bg-white p-3 rounded shadow-sm">
          <div className="flex gap-4 w-full items-end max-[600px]:flex-col max-[600px]:items-start">
            <div className="searchDate">
              <label className="block mb-1 text-sm font-semibold">Date Range</label>
              <Space direction="vertical" size={12}>
                <RangePicker
                  format="YYYY-MM-DD"
                  onChange={(evt, dateString) => {
                    if (!evt) {
                      setDateVal({ start: "", end: "" });
                    } else {
                      setDateVal({ start: dateString[0], end: dateString[1] });
                    }
                  }}
                  inputReadOnly
                />
              </Space>
            </div>
            
            {userDesignationSlug.some((slug) => ["admin", "super_admin", "developer", "rsm", "manager"].includes(slug)) && (
              <div className="searchEmployee flex flex-col">
                 <label className="block mb-1 text-sm font-semibold text-gray-700">Employee filter</label>
                 <select
                    value={employeeId} 
                    onChange={(e) => setEmployeeId(e.target.value)} 
                    className="border border-gray-300 p-1.5 rounded min-h-[32px] w-[200px] outline-none focus:border-blue-500"
                 >
                    <option value="">All Employees</option>
                    {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                 </select>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow-sm">
           <Table 
             dataSource={apiData} 
             columns={columns} 
             rowKey="id" 
             pagination={{ pageSize: 20 }} 
             scroll={{ x: 'max-content' }}
             summary={(pageData) => {
               let totalAmount = 0;
               pageData.forEach(({ total_amount }) => {
                 totalAmount += Number(total_amount || 0);
               });
               return (
                 <Table.Summary.Row className="bg-gray-50 font-bold">
                   <Table.Summary.Cell index={0} colSpan={3}><span className="float-right">Total:</span></Table.Summary.Cell>
                   <Table.Summary.Cell index={1}>{totalAmount.toFixed(2)}</Table.Summary.Cell>
                 </Table.Summary.Row>
               );
             }}
           />
        </div>
      </div>
    </HelmetProvider>
  );
};

export default PaymentHistoryReport;

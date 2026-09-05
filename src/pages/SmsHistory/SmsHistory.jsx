import { useState, useEffect, useContext, useMemo } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import DataTable from "react-data-table-component";
import { Select, DatePicker } from "antd";
import moment from "moment";
import { toast } from "react-toastify";

// Context & Utils
import { AuthContext } from "../../context/AuthContext";
import ApiConfig from "../../assets/js/ApiConfig";
import { TableStyles, rowPerPage } from "../../assets/js/Utility";
import Loader from "../../components/Loader/Loader";

// Css
import "./SmsHistory.css";

const { RangePicker } = DatePicker;

export default function SmsHistory() {
  const { headers } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [summaryData, setSummaryData] = useState({ total_sms: 0, sent_count: 0, failed_count: 0 });
  const [balanceData, setBalanceData] = useState(null);
  
  // Filters
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    fetchCustomers();
    fetchSummary();
    fetchBalance();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [selectedCustomer, selectedStatus, dateRange]);

  const fetchCustomers = async () => {
    try {
      const response = await ApiConfig.get("/customers", { headers });
      const custData = response.data.data.map((c) => ({
        value: c.id,
        label: `${c.customer_name} (${c.phone})`,
      }));
      setCustomers(custData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await ApiConfig.get("/sms-summary", { headers });
      if (response.data.status) {
        setSummaryData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await ApiConfig.get("/sms-balance", { headers });
      if (response.data.status) {
        setBalanceData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchHistory = async () => {
    setLoader(true);
    try {
      let url = "/sms-history?";
      if (selectedCustomer) url += `customer_id=${selectedCustomer}&`;
      if (selectedStatus) url += `status=${selectedStatus}&`;
      if (dateRange && dateRange.length === 2) {
        url += `from_date=${dateRange[0].format("YYYY-MM-DD")}&`;
        url += `to_date=${dateRange[1].format("YYYY-MM-DD")}&`;
      }

      const response = await ApiConfig.get(url, { headers });
      if (response.data.status) {
        // Use data.data since it's paginated on backend, we will just show the first page for now,
        // or just use pagination from server if we want, but for simplicity assuming we get a list
        setHistoryData(response.data.data.data || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch SMS history");
    } finally {
      setLoader(false);
    }
  };

  const customStyles = useMemo(() => TableStyles(), []);

  const columns = useMemo(
    () => [
      {
        name: "Sl No",
        width: "70px",
        selector: (_, index) => index + 1,
      },
      {
        name: "Customer",
        selector: (row) => row.customer ? row.customer.customer_name : "Unknown",
      },
      {
        name: "Phone",
        selector: (row) => row.phone,
        width: "140px",
      },
      {
        name: "Message",
        selector: (row) => row.message,
        wrap: true,
      },
      {
        name: "Status",
        width: "100px",
        selector: (row) => row.status,
        cell: (row) => (
          <span
            className={`px-2 py-1 rounded text-white text-xs ${
              row.status === "sent" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {row.status.toUpperCase()}
          </span>
        ),
      },
      {
        name: "Sent At",
        width: "180px",
        selector: (row) => moment(row.sent_at).format("DD MMM YYYY, h:mm a"),
      },
    ],
    []
  );

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>SMS History</title>
        </Helmet>
      </HelmetProvider>

      {loader && <Loader />}

      <div className="container-fluid page-container">
        <h1 className="page-title">SMS History</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow-md border-l-4 border-purple-500">
            <h3 className="text-gray-500 text-sm font-semibold uppercase">SMS Balance</h3>
            <p className="text-3xl font-bold text-gray-800">
              {balanceData ? (balanceData.Balance ?? balanceData.balance ?? "N/A") : "Loading..."}
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow-md border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-semibold uppercase">Total SMS Sent</h3>
            <p className="text-3xl font-bold text-gray-800">{summaryData.total_sms}</p>
          </div>
          <div className="bg-white p-4 rounded shadow-md border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-semibold uppercase">Delivered</h3>
            <p className="text-3xl font-bold text-gray-800">{summaryData.sent_count}</p>
          </div>
          <div className="bg-white p-4 rounded shadow-md border-l-4 border-red-500">
            <h3 className="text-gray-500 text-sm font-semibold uppercase">Failed</h3>
            <p className="text-3xl font-bold text-gray-800">{summaryData.failed_count}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded shadow-md mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-gray-600 mb-1">Customer</label>
            <Select
              className="w-full"
              showSearch
              allowClear
              placeholder="Filter by customer"
              options={customers}
              value={selectedCustomer}
              onChange={(value) => setSelectedCustomer(value)}
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <Select
              className="w-full"
              allowClear
              placeholder="Filter by status"
              options={[
                { value: "sent", label: "Sent" },
                { value: "failed", label: "Failed" },
              ]}
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value)}
            />
          </div>
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm text-gray-600 mb-1">Date Range</label>
            <RangePicker
              className="w-full"
              onChange={(dates) => setDateRange(dates)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white p-4 rounded shadow-md">
          <DataTable
            columns={columns}
            data={historyData}
            customStyles={customStyles}
            pagination
            paginationRowsPerPageOptions={rowPerPage}
          />
        </div>
      </div>
    </>
  );
}

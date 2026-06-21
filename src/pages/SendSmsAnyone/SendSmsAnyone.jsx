import { useContext, useState, useEffect } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Select } from "antd";

//===> Css
import "./SendSmsAnyone.css";

//===> Utility
import ApiConfig from "../../assets/js/ApiConfig";

export default function SendSmsAnyone({ setLoader }) {
  const { headers } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  useEffect(() => {
    fetchCustomers();
    fetchTemplates();
  }, [headers]);

  const fetchCustomers = async () => {
    try {
      setLoader(true);
      await ApiConfig.get("/customers", { headers }).then((res) => {
        const custData = res.data.data;
        if (Array.isArray(custData)) {
          setCustomers(
            custData.map((c) => ({
              label: `${c.customer_name} (${c.phone})`,
              value: c.id,
            }))
          );
        }
      });
      setLoader(false);
    } catch (err) {
      setLoader(false);
      console.error(err);
      toast.error("Failed to fetch customers");
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await ApiConfig.get("/sms-templates", { headers });
      if (res.data.status) {
        const activeTemplates = res.data.data.filter(
          (t) => t.status === 1 || t.status === true
        );
        setTemplates(
          activeTemplates.map((t) => ({
            label: t.name,
            value: t.id,
            content: t.content,
          }))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTemplateChange = (value) => {
    setSelectedTemplateId(value);
    const template = templates.find((t) => t.value === value);
    if (template) {
      setMessage(template.content);
    } else {
      setMessage("");
    }
  };

  const SendMessage = async (e) => {
    e.preventDefault();
    if (selectedCustomerIds.length === 0) {
      toast.error("Please select at least one customer");
      return;
    }
    if (message.trim() === "") {
      toast.error("Please type some message");
      return;
    }

    const payload = {
      customer_ids: selectedCustomerIds,
      message: message,
    };

    setLoader(true);
    await ApiConfig.post("/send-custom-sms", payload, {
      headers: headers,
    })
      .then((res) => {
        setLoader(false);
        if (res.data.status === true) {
          toast.success(
            `SMS sent successfully to ${res.data.data.success_count} customers. Failed for ${res.data.data.fail_count} customers.`
          );
          setMessage(""); // clear form
          setSelectedCustomerIds([]); // clear selection
          setSelectedTemplateId(null);
        } else {
          toast.error(res.data.message || "Failed to send SMS");
        }
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
        toast.error(err.response?.data?.message || "Failed to send SMS");
      });
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Send sms</title>
        <meta name="description" content="Agrovet software" />
      </Helmet>

      {/* For go to top */}
      <input
        type="file"
        autoFocus
        style={{ height: "0", opacity: 0, pointerEvents: "none" }}
      />
      {/* For go to top */}

      <div className="content animated fadeInDown">
        <h1 className="page-title">Send SMS to Selected Customers</h1>

        <form className="anyOneMsgBox" onSubmit={SendMessage}>
          <div className="left" style={{ width: "48%" }}>
            <div style={{ marginBottom: "15px", color: "#666" }}>
              <strong>Select Customers:</strong>
            </div>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%", marginBottom: "20px" }}
              placeholder="Search and select customers"
              options={customers}
              value={selectedCustomerIds}
              onChange={(values) => setSelectedCustomerIds(values)}
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
            />
          </div>
          <div className="right" style={{ width: "48%" }}>
            <div style={{ marginBottom: "15px", color: "#666" }}>
              <strong>Select Template (Optional):</strong>
            </div>
            <Select
              allowClear
              placeholder="Choose a template or write below"
              style={{ width: "100%", marginBottom: "20px" }}
              options={templates}
              value={selectedTemplateId}
              onChange={handleTemplateChange}
            />

            <div style={{ marginBottom: "15px", color: "#666" }}>
              <strong>Message:</strong>
            </div>
            <textarea
              rows={5}
              placeholder="Type your message or select a template above"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              style={{ width: "100%" }}
            ></textarea>
            <div className="text-center mt-5">
              <button className="button" type="submit">
                Send message
              </button>
            </div>
          </div>
        </form>
      </div>
    </HelmetProvider>
  );
}

import { useContext, useState, useEffect } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Select } from "antd";

//===> Utility
import ApiConfig from "../../assets/js/ApiConfig";

export default function SendSmsEveryone({ setLoader }) {
  const { headers, userRole } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, [headers]);

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
    if (message.trim() == "") {
      toast.error("Please type some message");
    } else {
      const payload = {
        customer_ids: [],
        message: message,
      };

      setLoader(true);
      await ApiConfig.post("/send-custom-sms", payload, {
        headers: headers,
      })
        .then((res) => {
          setLoader(false);
          if (res.data.status == true) {
            toast.success(
              `SMS sent successfully to ${res.data.data.success_count} customers. Failed for ${res.data.data.fail_count} customers.`
            );
            setMessage(""); // clear form
            setSelectedTemplateId(null);
          } else {
            toast.error(res.data.message || "Failed to send SMS");
          }
        })
        .catch((err) => {
          setLoader(false);
          console.log(err);
          toast.error(
            err.response?.data?.message || "Failed to send SMS"
          );
        });
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Send sms everyone</title>
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
        <h1 className="page-title">Send sms everyone</h1>

        <form className="anyOneMsgBox" onSubmit={SendMessage}>
          <div className="right" style={{ width: "100%", marginLeft: 0 }}>
            <div style={{ marginBottom: "15px", color: "#666" }}>
              <strong>Note:</strong> This message will be sent to <strong>ALL</strong> customers who have a valid phone number.
            </div>

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
              placeholder="Type your message for all customers or select a template above..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              style={{ width: "100%" }}
            ></textarea>
            <div className="text-center mt-5">
              <button className="button" type="submit">
                Send to Everyone
              </button>
            </div>
          </div>
        </form>
      </div>
    </HelmetProvider>
  );
}

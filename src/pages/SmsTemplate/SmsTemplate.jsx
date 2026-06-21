import { useContext, useState, useEffect } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Modal, Form, Input, Switch, Popconfirm } from "antd";

//===> Icons
import { FaEdit } from "react-icons/fa";
import { IoTrashBinSharp } from "react-icons/io5";

//===> Css
import "./SmsTemplate.css";

//===> Utility
import ApiConfig from "../../assets/js/ApiConfig";

export default function SmsTemplate({ setLoader }) {
  const { headers } = useContext(AuthContext);

  const [data, setData] = useState([]);
  const [readMoreState, setReadMoreState] = useState({});
  const [seeMoreState, setSeeMoreState] = useState(6);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form] = Form.useForm();

  const slicedData = data.slice(0, seeMoreState);

  useEffect(() => {
    fetchTemplates();
  }, [headers]);

  const fetchTemplates = async () => {
    try {
      setLoader(true);
      const res = await ApiConfig.get("/sms-templates", { headers });
      if (res.data.status) {
        setData(res.data.data);
        const initialReadMoreState = {};
        res.data.data.forEach((item) => {
          initialReadMoreState[item.id] = false;
        });
        setReadMoreState(initialReadMoreState);
      }
      setLoader(false);
    } catch (err) {
      setLoader(false);
      toast.error("Failed to fetch templates");
    }
  };

  const showModal = (template = null) => {
    if (template) {
      setIsEditing(true);
      setEditId(template.id);
      form.setFieldsValue({
        name: template.name,
        content: template.content,
        status: template.status === 1 || template.status === true,
      });
    } else {
      setIsEditing(false);
      setEditId(null);
      form.resetFields();
      form.setFieldsValue({ status: true });
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleFinish = async (values) => {
    const payload = {
      name: values.name,
      content: values.content,
      status: values.status,
    };

    try {
      setLoader(true);
      if (isEditing) {
        const res = await ApiConfig.post(`/sms-templates/${editId}`, payload, { headers });
        if (res.data.status) {
          toast.success("Template updated successfully");
          fetchTemplates();
          handleCancel();
        } else {
          toast.error(res.data.message || "Failed to update template");
        }
      } else {
        const res = await ApiConfig.post("/sms-templates", payload, { headers });
        if (res.data.status) {
          toast.success("Template created successfully");
          fetchTemplates();
          handleCancel();
        } else {
          toast.error(res.data.message || "Failed to create template");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    } finally {
      setLoader(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoader(true);
      const res = await ApiConfig.delete(`/sms-templates/${id}`, { headers });
      if (res.data.status) {
        toast.success("Template deleted successfully");
        fetchTemplates();
      } else {
        toast.error("Failed to delete template");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoader(false);
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Sms template</title>
        <meta name="description" content="Agrovet software" />
      </Helmet>

      {/* For go to top */}
      <input
        type="file"
        autoFocus
        style={{ height: "0", opacity: 0, pointerEvents: "none" }}
      />
      {/* For go to top */}

      <div className="SmsTemplate content animated fadeInDown">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 className="page-title">Sms template</h1>
          <button className="button" onClick={() => showModal()}>
            Create Template
          </button>
        </div>

        <div className="templateBox">
          {Array.isArray(slicedData) &&
            slicedData.map((item, index) => {
              const contentText = item.content || "";
              return (
                <div className="card" key={index}>
                  <h1 className="title py-1 px-3">
                    {item.name?.length >= 50
                      ? item.name.slice(0, 50) + " ......"
                      : item.name}
                  </h1>
                  <div className="card-content h-full py-2 px-3 text-center">
                    <p className="text-justify">
                      {readMoreState[item.id] == false
                        ? contentText.length >= 150
                          ? contentText.slice(0, 150) + " ......"
                          : contentText
                        : contentText}
                    </p>
                  </div>
                  <div className="action py-1 px-3">
                    <div>
                      {contentText.length >= 150 ? (
                        <button
                          className="text-orange cursor-pointer font-bold"
                          onClick={() => {
                            setReadMoreState((prev) => ({
                              ...prev,
                              [item.id]: !prev[item.id],
                            }));
                          }}
                        >
                          {readMoreState[item.id] ? "Read less" : "Read more"}
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="button edit" onClick={() => showModal(item)}>
                        <FaEdit size={25} />
                      </button>
                      <Popconfirm
                        title="Delete the template"
                        description="Are you sure to delete this template?"
                        onConfirm={() => handleDelete(item.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <button className="button delete">
                          <IoTrashBinSharp size={25} />
                        </button>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {data.length > seeMoreState && (
          <div className="text-center mt-20">
            <button
              className="button"
              onClick={() => {
                setSeeMoreState((prev) => prev + 6);
              }}
            >
              See more
            </button>
          </div>
        )}

        <Modal
          title={isEditing ? "Edit Template" : "Create Template"}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <Form layout="vertical" form={form} onFinish={handleFinish}>
            <Form.Item
              label="Template Name"
              name="name"
              rules={[{ required: true, message: "Please enter template name" }]}
            >
              <Input placeholder="e.g., Eid Mubarak Offer" />
            </Form.Item>
            <Form.Item
              label="Template Content"
              name="content"
              rules={[{ required: true, message: "Please enter template content" }]}
            >
              <Input.TextArea rows={4} placeholder="Type your SMS message here..." />
            </Form.Item>
            <Form.Item label="Active Status" name="status" valuePropName="checked">
              <Switch />
            </Form.Item>
            <div style={{ textAlign: "right", marginTop: "10px" }}>
              <button type="button" className="button bg-gray-500 mr-2" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="button">
                {isEditing ? "Update" : "Create"}
              </button>
            </div>
          </Form>
        </Modal>
      </div>
    </HelmetProvider>
  );
}

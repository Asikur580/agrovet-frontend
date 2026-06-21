import React, { useState, useEffect, useContext, useRef } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { toast } from "react-toastify";

//=>>> Styles & Assets
import "./Profile.css";
import DummyImg from "../../assets/images/profile.png";

//=>>> Icons
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaMapMarkerAlt,
  FaTint,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaCamera,
  FaCreditCard,
  FaChartLine,
  FaUsers,
  FaSitemap,
} from "react-icons/fa";

//=>>> Utilities
import ApiConfig from "../../assets/js/ApiConfig";
import { AuthContext } from "../../context/AuthContext";
import { Encryption } from "../../assets/js/Encryption";
import ImageViewer from "../../components/ImageViewer/ImageViewer";

const Profile = ({ setLoader }) => {
  const { headers, userRole, userDesignationSlug } = useContext(AuthContext);

  // --- API Profile State ---
  const [profile, setProfile] = useState(null);

  // --- Form States ---
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    national_id: "",
    blood_group: "",
    district: "",
    territory: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  // --- Toggle Password Visibility ---
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- Get Profile Details ---
  const getProfile = async () => {
    try {
      setLoader(true);
      const response = await ApiConfig.get("/profile", { headers });
      if (response.data.status) {
        const userData = response.data.data.user;
        setProfile(response.data.data);
        setEditForm({
          name: userData.employee?.name || "",
          email: userData.email || "",
          phone: userData.employee?.phone || "",
          national_id: userData.employee?.national_id || "",
          blood_group: userData.employee?.blood_group || "",
          district: userData.employee?.district || "",
          territory: userData.employee?.territory || "",
        });
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to retrieve profile data."
      );
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  // --- Handle Edit Input Changes ---
  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  // --- Handle Image Selection & Preview ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image file size should be less than 2MB");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Submit Profile Updates ---
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!editForm.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!editForm.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!editForm.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }
    if (!editForm.territory.trim()) {
      toast.error("Territory is required");
      return;
    }
    if (!editForm.district.trim()) {
      toast.error("District is required");
      return;
    }

    try {
      setLoader(true);
      const formData = new FormData();
      formData.append("name", editForm.name.trim());
      formData.append("phone", editForm.phone.trim());
      formData.append("email", editForm.email.trim());
      formData.append("territory", editForm.territory.trim());
      formData.append("district", editForm.district.trim());
      formData.append("national_id", editForm.national_id || "");
      formData.append("blood_group", editForm.blood_group || "");
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await ApiConfig.post("/profile/update", formData, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status) {
        toast.success(response.data.message || "Profile updated successfully!");
        
        const updatedUser = response.data.data;
        
        // --- Sync updated name and image in user cookies ---
        const secretKey = import.meta.env.VITE_SECRET_KEY;
        if (updatedUser.employee?.name) {
          document.cookie = `_Unme_AJS+c0mPanY-07@12#31_user=${Encryption(
            updatedUser.employee.name,
            secretKey
          )}; path=/`;
        }
        if (updatedUser.employee?.image) {
          document.cookie = `_Uimg_AJS+c0mPanY-07@12#31_user=${Encryption(
            updatedUser.employee.image,
            secretKey
          )}; path=/`;
        }

        // --- Reload to update Header/Sidenav profile data ---
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error(response.data.message || "Failed to update profile.");
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error(error);
      if (error.response && error.response.data && error.response.data.errors) {
        const validationErrors = error.response.data.errors;
        Object.keys(validationErrors).forEach((field) => {
          validationErrors[field].forEach((errMsg) => {
            toast.error(errMsg);
          });
        });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update profile details."
        );
      }
    }
  };

  // --- Handle Password Input Changes ---
  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  // --- Submit Password Change ---
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordForm.current_password) {
      toast.error("Current password is required");
      return;
    }
    if (!passwordForm.new_password) {
      toast.error("New password is required");
      return;
    }
    if (passwordForm.new_password.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      toast.error("New password confirmation does not match");
      return;
    }

    try {
      setLoader(true);
      const response = await ApiConfig.post(
        "/profile/change-password",
        {
          current_password: passwordForm.current_password,
          new_password: passwordForm.new_password,
          new_password_confirmation: passwordForm.new_password_confirmation,
        },
        { headers }
      );

      if (response.data.status) {
        toast.success(
          response.data.message || "Password changed successfully!"
        );
        setPasswordForm({
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
      } else {
        toast.error(response.data.message || "Failed to change password.");
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error(error);
      if (error.response && error.response.data && error.response.data.errors) {
        const validationErrors = error.response.data.errors;
        Object.keys(validationErrors).forEach((field) => {
          validationErrors[field].forEach((errMsg) => {
            toast.error(errMsg);
          });
        });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to change password."
        );
      }
    }
  };

  // --- Render Conditionals for Subordinates ---
  const showSubordinatesCount =
    profile?.metrics?.subordinates_count > 0 ||
    ["manager", "rsm"].includes(profile?.user?.employee?.designation?.slug) ||
    userDesignationSlug?.includes("manager") ||
    userDesignationSlug?.includes("rsm") ||
    userRole?.includes("Developer") ||
    userRole?.includes("admin");

  const employee = profile?.user?.employee;

  return (
    <HelmetProvider>
      <Helmet>
        <title>User Profile</title>
        <meta name="description" content="Manage your Agrovet user profile and credentials" />
      </Helmet>

      {/* Hidden input for auto-focus stability */}
      <input
        type="file"
        autoFocus
        style={{ height: "0", opacity: 0, pointerEvents: "none" }}
      />

      <div className="content animated fadeInDown">
        <h1 className="page-title">My Profile</h1>

        <div className="profile-container">
          {/* 1. PROFILE HEADER CARD */}
          {profile && (
            <div className="profile-header-card">
              <div className="profile-avatar-container">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" />
                ) : employee?.image ? (
                  <ImageViewer
                    src={employee.image}
                    width="100%"
                    height="100px"
                    border="none"
                    radius="50%"
                  />
                ) : (
                  <img src={DummyImg} alt="Default Avatar" />
                )}
              </div>
              <div className="profile-header-info">
                <h2>{employee?.name || "User Name"}</h2>
                <div className="profile-designation">
                  {employee?.designation?.name || "Employee"}
                </div>
                <div className="profile-meta-details">
                  <div className="profile-meta-item">
                    <strong>ID:</strong> {employee?.employee_id || "N/A"}
                  </div>
                  <div className="profile-meta-item">
                    <strong>Email:</strong> {profile?.user?.email || "N/A"}
                  </div>
                  <div className="profile-meta-item">
                    <strong>Status:</strong>
                    <span
                      className={`profile-status-badge ${
                        profile?.user?.status === "active" ? "active" : "inactive"
                      }`}
                    >
                      {profile?.user?.status || "inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. METRICS DASHBOARD CARDS */}
          {profile?.metrics && (
            <div className="profile-metrics-section">
              <h3 className="profile-section-title">Dashboard Statistics</h3>
              <div className="profile-metrics-grid">
                {/* Credit Limit */}
                <div className="metric-card">
                  <div className="metric-icon-box credit">
                    <FaCreditCard />
                  </div>
                  <div className="metric-details">
                    <span className="metric-label">Credit Limit</span>
                    <span className="metric-value">
                      ৳{parseFloat(profile.metrics.credit_limit).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Credit Used */}
                <div className="metric-card">
                  <div className="metric-icon-box credit">
                    <FaCreditCard style={{ opacity: 0.6 }} />
                  </div>
                  <div className="metric-details">
                    <span className="metric-label">Credit Used</span>
                    <span className="metric-value" style={{ color: "var(--red)" }}>
                      ৳{parseFloat(profile.metrics.credit_use).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Credit Available */}
                <div className="metric-card">
                  <div className="metric-icon-box credit">
                    <FaCreditCard />
                  </div>
                  <div className="metric-details">
                    <span className="metric-label">Credit Available</span>
                    <span className="metric-value" style={{ color: "var(--green)" }}>
                      ৳{parseFloat(profile.metrics.credit_available).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Total Sales */}
                <div className="metric-card">
                  <div className="metric-icon-box sales">
                    <FaChartLine />
                  </div>
                  <div className="metric-details">
                    <span className="metric-label">Total Sales</span>
                    <span className="metric-value">
                      ৳{parseFloat(profile.metrics.total_sales).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Sales Count */}
                <div className="metric-card">
                  <div className="metric-icon-box sales">
                    <FaChartLine style={{ transform: "rotate(45deg)" }} />
                  </div>
                  <div className="metric-details">
                    <span className="metric-label">Invoices Count</span>
                    <span className="metric-value">
                      {profile.metrics.sales_count}
                    </span>
                  </div>
                </div>

                {/* Customers Count */}
                <div className="metric-card">
                  <div className="metric-icon-box general">
                    <FaUsers />
                  </div>
                  <div className="metric-details">
                    <span className="metric-label">Customers</span>
                    <span className="metric-value">
                      {profile.metrics.customers_count}
                    </span>
                  </div>
                </div>

                {/* Subordinates Count (Conditional) */}
                {showSubordinatesCount && (
                  <div className="metric-card">
                    <div className="metric-icon-box general">
                      <FaSitemap />
                    </div>
                    <div className="metric-details">
                      <span className="metric-label">Subordinates</span>
                      <span className="metric-value">
                        {profile.metrics.subordinates_count}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3 & 4. EDIT FORMS ROW */}
          <div className="profile-forms-row">
            {/* Edit Profile Form */}
            <div className="profile-card">
              <div className="profile-card-header">
                <h3>Edit Profile Information</h3>
              </div>
              <div className="profile-card-body">
                <form onSubmit={handleProfileSubmit}>
                  <div className="form-grid-2">
                    {/* Name */}
                    <div className="form-group">
                      <label htmlFor="name">
                        Full Name <span>*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="profile-input"
                        placeholder="Enter full name"
                        value={editForm.name}
                        onChange={handleEditChange}
                      />
                    </div>

                    {/* Email */}
                    <div className="form-group">
                      <label htmlFor="email">
                        Email Address <span>*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="profile-input"
                        placeholder="Enter email address"
                        value={editForm.email}
                        onChange={handleEditChange}
                      />
                    </div>

                    {/* Phone */}
                    <div className="form-group">
                      <label htmlFor="phone">
                        Phone Number <span>*</span>
                      </label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        className="profile-input"
                        placeholder="Enter phone number"
                        value={editForm.phone}
                        onChange={handleEditChange}
                      />
                    </div>

                    {/* National ID */}
                    <div className="form-group">
                      <label htmlFor="national_id">National ID</label>
                      <input
                        type="text"
                        id="national_id"
                        name="national_id"
                        className="profile-input"
                        placeholder="Enter national ID (NID)"
                        value={editForm.national_id}
                        onChange={handleEditChange}
                      />
                    </div>

                    {/* Blood Group */}
                    <div className="form-group">
                      <label htmlFor="blood_group">Blood Group</label>
                      <select
                        id="blood_group"
                        name="blood_group"
                        className="profile-select"
                        value={editForm.blood_group}
                        onChange={handleEditChange}
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    {/* District */}
                    <div className="form-group">
                      <label htmlFor="district">
                        District <span>*</span>
                      </label>
                      <input
                        type="text"
                        id="district"
                        name="district"
                        className="profile-input"
                        placeholder="Enter district"
                        value={editForm.district}
                        onChange={handleEditChange}
                      />
                    </div>

                    {/* Territory */}
                    <div className="form-group">
                      <label htmlFor="territory">
                        Territory <span>*</span>
                      </label>
                      <input
                        type="text"
                        id="territory"
                        name="territory"
                        className="profile-input"
                        placeholder="Enter territory name"
                        value={editForm.territory}
                        onChange={handleEditChange}
                      />
                    </div>

                    {/* Profile Picture Upload */}
                    <div className="form-group full-width">
                      <label>Profile Picture</label>
                      <div className="file-upload-container">
                        <div className="file-upload-preview">
                          {imagePreview ? (
                            <img src={imagePreview} alt="Preview" />
                          ) : employee?.image ? (
                            <ImageViewer
                              src={employee.image}
                              width="100%"
                              height="100px"
                              border="none"
                              radius="6px"
                            />
                          ) : (
                            <img src={DummyImg} alt="Default Avatar" />
                          )}
                        </div>
                        <div className="file-upload-actions">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                          <span className="file-upload-tip">
                            Accepted: JPEG, PNG, JPG (Max 2MB)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="profile-submit-btn">
                      <FaUser /> Save Profile Details
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Change Password Form */}
            <div className="profile-card">
              <div className="profile-card-header">
                <h3>Change Password</h3>
              </div>
              <div className="profile-card-body">
                <form onSubmit={handlePasswordSubmit}>
                  {/* Current Password */}
                  <div className="form-group">
                    <label htmlFor="current_password">
                      Current Password <span>*</span>
                    </label>
                    <div className="password-input-wrapper">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        id="current_password"
                        name="current_password"
                        className="profile-input"
                        placeholder="Enter current password"
                        value={passwordForm.current_password}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="form-group">
                    <label htmlFor="new_password">
                      New Password <span>*</span>
                    </label>
                    <div className="password-input-wrapper">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="new_password"
                        name="new_password"
                        className="profile-input"
                        placeholder="Enter new password (min. 6 chars)"
                        value={passwordForm.new_password}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="form-group">
                    <label htmlFor="new_password_confirmation">
                      Confirm New Password <span>*</span>
                    </label>
                    <div className="password-input-wrapper">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="new_password_confirmation"
                        name="new_password_confirmation"
                        className="profile-input"
                        placeholder="Confirm your new password"
                        value={passwordForm.new_password_confirmation}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="profile-submit-btn">
                      <FaLock /> Update Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Profile;

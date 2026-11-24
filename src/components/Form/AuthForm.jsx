import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

//=> Css
import "./AuthForm.css";

//=> Icons
import { FaEye } from "react-icons/fa";
import { FaEyeSlash, FaArrowRight } from "react-icons/fa6";

//=> Additional utilities
import ApiConfig from "../../assets/js/ApiConfig";
import { Encryption } from "../../assets/js/Encryption";

const AuthForm = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    setIsAuthenticated,
    setUserRole,
    title,
    inputFields,
    api,
    setLoader,
  } = props;

  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [inputData, setInputData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const togglePasswordVisibility = (fieldName) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const handleInputValues = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value.trim() });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (api === "/login") {
      if (!inputData.email) {
        toast.error("Please enter email address");
        return;
      }
      if (!inputData.password) {
        toast.error("Please enter password");
        return;
      }
      if (inputData.password.length < 8) {
        toast.error("Password must be 8 characters or more");
        return;
      }

      const payload = {
        email: inputData.email,
        password: inputData.password,
      };

      setIsSubmitting(true);
      if (setLoader) setLoader(true);

      ApiConfig.post(api, payload)
        .then((response) => {
          const userData = response.data;
          if (userData.status === true) {
            toast.success(userData.message || "Login successful");

            setTimeout(() => {
              // Set user data
              if (setIsAuthenticated) setIsAuthenticated(userData.token);
              if (setUserRole) setUserRole(userData.permissions);

              // Set token in cookie
              document.cookie = `_Auth_AJS+c0mPanY-07@12#31_token=${Encryption(
                userData.token,
                import.meta.env.VITE_SECRET_KEY
              )}`;

              // Set user role in cookie
              document.cookie = `_Role_AJS+c0mPanY-07@12#31_user=${Encryption(
                userData.permissions,
                import.meta.env.VITE_SECRET_KEY
              )}`;

              // Set user id in cookie
              document.cookie = `_UID_AJS+c0mPanY-07@12#31_user=${userData.user?.employee?.id || ""}`;

              // Set employee id in cookie
              document.cookie = `_EMPID_AJS+c0mPanY-07@12#31_user=${userData.user?.employee?.employee_id || ""}`;

              // Set user name in cookie
              document.cookie = `_Unme_AJS+c0mPanY-07@12#31_user=${Encryption(
                userData.user?.employee?.name || "",
                import.meta.env.VITE_SECRET_KEY
              )}`;

              // Set user designation slug
              document.cookie = `_Des_AJS+c0mPanY-07@12#31_slg=${Encryption(
                userData.user?.employee?.designation?.slug || "",
                import.meta.env.VITE_SECRET_KEY
              )}`;

              // Set user image in cookie
              document.cookie = `_Uimg_AJS+c0mPanY-07@12#31_user=${Encryption(
                userData.user?.employee?.image || "",
                import.meta.env.VITE_SECRET_KEY
              )}`;

              setIsSubmitting(false);
              if (setLoader) setLoader(false);
              navigate(from, { replace: true });
            }, 1000);
          } else {
            setIsSubmitting(false);
            if (setLoader) setLoader(false);
            toast.error(userData.message || "Invalid credentials");
          }
        })
        .catch((err) => {
          setIsSubmitting(false);
          if (setLoader) setLoader(false);
          toast.error(err.response?.data?.message || "Login failed. Please try again.");
        });
    } else if (api === "/signup") {
      if (!inputData.name) {
        toast.error("Please enter your name.");
        return;
      }
      if (!inputData.email) {
        toast.error("Please enter email address.");
        return;
      }
      if (!inputData.password) {
        toast.error("Please enter password.");
        return;
      }
      if (inputData.password !== inputData.confirmPassword) {
        toast.error("Password not matched.");
        return;
      }

      toast.success("Account created successfully");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  };

  return (
    <div className="w-full">
      {/* 1. Card Title */}
      <h2 className="text-2xl font-bold tracking-tight text-white text-center mb-6 drop-shadow-md">
        {title || "Log In"}
      </h2>

      {/* 2. Form */}
      <form onSubmit={submit} className="space-y-4">
        {inputFields &&
          inputFields.map((item, index) => {
            const isPassword = item.field === "password" || item.field === "confirmPassword";
            const isVisible = visiblePasswords[item.field];
            const inputType = isPassword ? (isVisible ? "text" : "password") : item.type;
            const labelText = item.field === "email" ? "Email" : item.field === "password" ? "Password" : item.field;

            return (
              <div key={index} className="space-y-1.5">
                {/* Field Label (30% Secondary structure & clarity) */}
                <label
                  htmlFor={item.field}
                  className="block text-xs font-semibold text-white/95 tracking-wide drop-shadow-sm"
                >
                  {labelText}
                </label>

                {/* Input Container (60% Surface) */}
                <div className="relative rounded-lg shadow-sm">
                  <input
                    id={item.field}
                    type={inputType}
                    name={item.field}
                    placeholder={item.placeholder}
                    onChange={handleInputValues}
                    autoComplete={item.autoCompleteAttr || "off"}
                    className={`block w-full rounded-lg border border-white/60 bg-white/95 py-2.5 px-3.5 text-sm text-slate-800 placeholder-slate-400 shadow-inner transition-all duration-150 hover:bg-white focus:bg-white focus:border-[#3B5898] focus:outline-none focus:ring-2 focus:ring-[#3B5898]/30 ${
                      isPassword ? "pr-10" : ""
                    }`}
                  />

                  {/* Password Show/Hide Toggle */}
                  {isPassword && (
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(item.field)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-700 focus:outline-none"
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {isVisible ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  )}
                </div>

                {/* Forgot Password Link */}
                {isPassword && api === "/login" && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => toast.info("Please contact system administrator to reset password.")}
                      className="text-xs text-white/90 hover:text-white underline-offset-2 hover:underline focus:outline-none font-medium drop-shadow-sm"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}
              </div>
            );
          })}

        {/* 3. Remember Me Checkbox */}
        {api === "/login" && (
          <div className="pt-1.5">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded bg-white/90 border border-white/60 text-[#3B5898] focus:ring-[#3B5898]/30 cursor-pointer"
              />
              <span className="text-xs text-white font-medium drop-shadow-sm">Remember Me</span>
            </label>
          </div>
        )}

        {/* 4. Log In Button (10% Accent - Radiant Orange #F48726 matching 60-30-10 Design System) */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#F48726] hover:bg-[#DD6B10] py-3 px-4 text-sm font-bold text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#F48726]/50 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Log In</span>
                <FaArrowRight size={13} />
              </>
            )}
          </button>
        </div>
      </form>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default AuthForm;

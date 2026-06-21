import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

//=>>> Css
import "./AuthForm.css";

//=>>> Icons
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";

//=>>> Additional utilities
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
    loginOrSingupUrl,
    loginOrSingup,
    setLoader,
  } = props;
  const [inputTypes, setInputTypes] = useState(false);
  const [inputData, setInputData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const handleInputValues = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value.trim() });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (api == "/login") {
      if (inputData.email == "") {
        toast.error("Please enter email address");
      } else if (inputData.password == "") {
        toast.error("Please enter password");
      } else if (inputData.password.length < 8) {
        toast.error("Password must be 8 characters or more");
      } else {
        const payload = {
          email: inputData.email,
          password: inputData.password,
        };
        setLoader(true);
        ApiConfig.post(api, payload)
          .then((response) => {
            const userData = response.data;
            if (userData.status == true) {
              toast.success(userData.message);

              setTimeout(() => {
                //=>>> Set user data
                setIsAuthenticated(userData.token);
                setUserRole(userData.permissions);

                //=>>> Set token in cookie
                document.cookie = `_Auth_AJS+c0mPanY-07@12#31_token=${Encryption(
                  userData.token,
                  import.meta.env.VITE_SECRET_KEY
                )}`;

                //=>>> Set user role in cookie
                document.cookie = `_Role_AJS+c0mPanY-07@12#31_user=${Encryption(
                  userData.permissions,
                  import.meta.env.VITE_SECRET_KEY
                )}`;

                //=>>> Set user id in cookie
                document.cookie = `_UID_AJS+c0mPanY-07@12#31_user=${userData.user.employee.id}`;

                //=>>> Set employee id in cookie
                document.cookie = `_EMPID_AJS+c0mPanY-07@12#31_user=${userData.user.employee.employee_id}`;

                //=>>> Set user name in cookie
                document.cookie = `_Unme_AJS+c0mPanY-07@12#31_user=${Encryption(
                  userData.user.employee.name,
                  import.meta.env.VITE_SECRET_KEY
                )}`;

                //=>>> Set user designation slug
                document.cookie = `_Des_AJS+c0mPanY-07@12#31_slg=${Encryption(
                  userData.user.employee.designation.slug,
                  import.meta.env.VITE_SECRET_KEY
                )}`;

                //=>>> Set user image in cookie
                document.cookie = `_Uimg_AJS+c0mPanY-07@12#31_user=${Encryption(
                  userData.user.employee.image,
                  import.meta.env.VITE_SECRET_KEY
                )}`;

                setLoader(false);
                // console.log(userData);
                // localStorage.setItem(
                //   "User data",
                //   JSON.stringify(userData)
                // );
                navigate(from, { replace: true });
              }, 1000);
            } else {
              // console.clear();
              setLoader(false);
              toast.error(userData.message);
            }
          })
          .catch((err) => {
            setLoader(false);
            toast.error(err.response.data.message);
          });
      }
    } else if (api == "/signup") {
      if (inputData.name == "") {
        toast.error("Please enter your name.");
      } else if (inputData.email == "") {
        toast.error("Please enter email address.");
      } else if (inputData.password == "") {
        toast.error("Please enter password.");
      } else if (inputData.password != inputData.confirmPassword) {
        toast.error("Password not matched.");
      } else {
        const payload = {
          name: inputData.name,
          email: inputData.email,
          password: inputData.password,
        };
        toast.success("Account created");

        setTimeout(() => {
          console.log(payload);
          redirect("/login");
        }, 1000);
      }
    }
  };

  return (
    <div className="form_box">
      <h3 className="title">{title}</h3>
      <form onSubmit={submit}>
        {inputFields.map((items, index) => (
          <div className="inputBox" key={index}>
            <input
              type={items.type}
              className={items.className}
              name={items.field}
              placeholder={items.placeholder}
              onChange={handleInputValues}
              autoComplete={items.autoCompleteAttr}
            />
            <div
              className={items.field != "password" ? "d-none" : "showHide"}
              onClick={() => {
                if (inputTypes == false) {
                  setInputTypes(true);
                  items.type = "text";
                } else if (inputTypes == true) {
                  setInputTypes(false);
                  items.type = "password";
                }
              }}
            >
              <FaEye
                size={20}
                className={inputTypes == false ? "d-none" : "c-pointer"}
              />
              <FaEyeSlash
                size={20}
                className={inputTypes == true ? "d-none" : "c-pointer"}
              />
            </div>
          </div>
        ))}
        <div className="next_button">
          <button className="button">next</button>
        </div>
      </form>

      <div className="d-flex form_bottom">
        {/* <p>
          {loginOrSingupUrl == "/signup"
            ? "Don't have an account? "
            : "Already have an account? "}{" "}
          <Link to={loginOrSingupUrl}>{loginOrSingup}</Link>
        </p> */}
        {loginOrSingupUrl == "/signup" ? (
          <p>
            <Link href="#">Forgot password</Link>
          </p>
        ) : (
          ""
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
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

import { lazy, Suspense, useState } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

//=>>> Css
import "./Login.css";

//=>>> Components
import Loader from "../../components/Loader/Loader";
const AuthForm = lazy(() => import("../../components/Form/AuthForm"));

const Login = (props) => {
  const { setIsAuthenticated, setUserRole } = props;
  const [loader, setLoader] = useState(false);

  const inputField = [
    {
      field: "email",
      type: "email",
      placeholder: "Enter your email",
      className: "inputBox",
      autoCompleteAttr: "on",
    },
    {
      field: "password",
      type: "password",
      placeholder: "Enter your password",
      className: "inputBox d-flex",
      autoCompleteAttr: "off",
    },
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>Login</title>
        <meta name="description" content="Agrovet software" />
      </Helmet>

      {loader && <Loader />}
      <div className="d-flex loginContainer animated fadeInDown">
        <div className="d-flex login">
          <Suspense fallback={<Loader />}>
            <AuthForm
              title={"Sign in"}
              inputFields={inputField}
              api={"/login"}
              loginOrSingupUrl={"/signup"}
              loginOrSingup={"Sign up"}
              // For authentication
              setIsAuthenticated={setIsAuthenticated}
              setUserRole={setUserRole}
              setLoader={setLoader}
            />
          </Suspense>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Login;

// Email : shovon@mail.com
// pass : 12345678

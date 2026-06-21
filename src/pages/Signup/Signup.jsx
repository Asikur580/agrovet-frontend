import { lazy, Suspense } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

//___ Css ___//
import "./Signup.css";

//___ Components ___//
import Loader from "../../components/Loader/Loader";
const AuthForm = lazy(() => import("../../components/Form/AuthForm"));

export const metadata = {
  title: "Sign up",
  description: "Agro-vet software",
};

const Signup = () => {
  const inputField = [
    {
      field: "name",
      type: "text",
      placeholder: "Enter your name",
      className: "inputBox",
    },
    {
      field: "email",
      type: "email",
      placeholder: "Enter your email",
      className: "inputBox",
    },
    {
      field: "password",
      type: "password",
      placeholder: "Enter your password",
      className: "inputBox d-flex",
    },
    {
      field: "confirmPassword",
      type: "password",
      placeholder: "Please confirm password",
      className: "inputBox d-flex",
    },
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>Signup</title>
        <meta name="description" content="Agrovet software" />
      </Helmet>

      <div className="d-flex signupContainer animated fadeInDown">
        <div className="d-flex signup">
          <Suspense fallback={<Loader />}>
            <AuthForm
              title={"Sign up"}
              inputFields={inputField}
              api={"/signup"}
              loginOrSingupUrl={"/login"}
              loginOrSingup={"Sign in"}
            />
          </Suspense>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Signup;

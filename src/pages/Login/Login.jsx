import { lazy, Suspense, useState } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { FaSeedling } from "react-icons/fa6";

//=> Background Image (Aqua, Cattle & Poultry)
import agrovetBg from "../../assets/images/agrovet-login-bg.jpg";

//=> Css
import "./Login.css";

//=> Components
import Loader from "../../components/Loader/Loader";
const AuthForm = lazy(() => import("../../components/Form/AuthForm"));

const Login = (props) => {
  const { setIsAuthenticated, setUserRole } = props;
  const [loader, setLoader] = useState(false);

  const inputField = [
    {
      field: "email",
      type: "email",
      placeholder: "name@company.com",
      autoCompleteAttr: "email",
    },
    {
      field: "password",
      type: "password",
      placeholder: "••••••••",
      autoCompleteAttr: "current-password",
    },
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>Login | Radiant Agrovet</title>
        <meta
          name="description"
          content="Radiant Agrovet Management System - Aqua, Cattle and Poultry Solutions"
        />
      </Helmet>

      {loader && <Loader />}

      <div
        className="login-viewport relative min-h-screen w-full flex flex-col justify-between items-center py-6 px-4 bg-cover bg-center bg-no-repeat overflow-hidden select-none"
        style={{
          backgroundImage: `url(${agrovetBg})`,
        }}
      >
        {/* Soft daylight ambient overlay to balance contrast */}
        <div className="absolute inset-0 bg-sky-950/15 backdrop-brightness-[0.98] pointer-events-none" />

        {/* 1. Top Bar: App Logo & Sector Tags (Aqua • Cattle • Poultry) */}
        <header className="relative z-10 w-full flex flex-col justify-center items-center pt-2">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/25 backdrop-blur-md border border-white/40 shadow-sm text-white">
            <span className="p-1.5 rounded-full bg-[#F48726] text-white shadow-sm">
              <FaSeedling size={14} />
            </span>
            <span className="text-base font-bold tracking-wide drop-shadow-sm">
              Radiant Agrovet
            </span>
          </div>
        </header>

        {/* 2. Center: Glassmorphism Frosted Login Card (60% Canvas / Surface) */}
        <main className="relative z-10 w-full flex justify-center items-center my-auto py-6">
          <div className="glass-login-card w-full max-w-[400px] rounded-2xl p-7 sm:p-9">
            <Suspense fallback={<Loader />}>
              <AuthForm
                title={"Log In"}
                inputFields={inputField}
                api={"/login"}
                loginOrSingupUrl={"/signup"}
                loginOrSingup={"Sign up"}
                setIsAuthenticated={setIsAuthenticated}
                setUserRole={setUserRole}
                setLoader={setLoader}
              />
            </Suspense>
          </div>
        </main>

        {/* 3. Bottom Footer: Prominent Copyright Notice */}
        <footer className="relative z-10 w-full text-center pb-4 pt-2">
          <p className="text-sm sm:text-base text-white font-semibold tracking-wide drop-shadow-lg">
            Copyright © 2026 Radiant Agrovet. All Rights Reserved.
          </p>
        </footer>
      </div>
    </HelmetProvider>
  );
};

export default Login;

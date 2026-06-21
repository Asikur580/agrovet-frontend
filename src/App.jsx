import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SecurityProvider from "./context/SystemSecurity";

//=>>> Css
import "./assets/css/globals.css";
import "./assets/css/AntdStyle.css";
import "./assets/css/variables.css";

//=>>> Routes
import AdminRoutes from "./routes/AdminRoutes";
import PublicRoute from "./routes/PublicRoute";

//=>>> Components

//=>>> Pages
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import NotFound from "./pages/NotFound/NotFound";

//=>>> Utilities
import { GetCookie } from "./assets/js/GetCookie";
import { Decryption } from "./assets/js/Encryption";

const App = () => {
  // Get auth token from cookie
  const [isAuthenticated, setIsAuthenticated] = useState(
    Decryption(
      GetCookie("_Auth_AJS+c0mPanY-07@12#31_token") || "",
      import.meta.env.VITE_SECRET_KEY
    ) || ""
  );

  // Get user role from cookie
  const [userRole, setUserRole] = useState(
    GetCookie("_Role_AJS+c0mPanY-07@12#31_user")
      ? Decryption(
          GetCookie("_Role_AJS+c0mPanY-07@12#31_user") || [],
          import.meta.env.VITE_SECRET_KEY
        ).split(",")
      : []
  );

  // React.useEffect(() => {
  //   // console.log(
  //   //   `Decrypted token = ${Decryption(
  //   //     GetCookie("_Auth_AJS+c0mPanY-07@12#31_token") || "",
  //   //     import.meta.env.VITE_SECRET_KEY
  //   //   )}`
  //   // );
  //   console.log(userRole);
  // }, []);

  return (
    <SecurityProvider>
      <Router>
        <Routes>
          {/* Public route for login */}
          <Route
            path="/login"
            element={
              <PublicRoute isAuthenticated={isAuthenticated}>
                <Login
                  setIsAuthenticated={setIsAuthenticated}
                  setUserRole={setUserRole}
                />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute isAuthenticated={isAuthenticated}>
                <Signup
                // setIsAuthenticated={setIsAuthenticated}
                // setUserRole={setUserRole}
                />
              </PublicRoute>
            }
          />

          {/* Protected admin routes */}
          <Route
            path="/*"
            element={
              <AdminRoutes
                userRole={userRole}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </SecurityProvider>
  );
};

export default App;

// localhost:3000
// admin@gmail.com / shovon@gmail.com
// 12345678

export const TableStyles = () => {
  const customStyles = {
    rows: {
      style: {
        minHeight: "55px",
        border: "var(--table-border)",
        "&:nth-child(1)": {
          borderTop: "none",
        },
        "&:last-child": {
          borderBottom: "none",
        },
      },
    },
    headCells: {
      style: {
        textTransform: "capitalize",
        background: "var(--main-clr)",
        color: "var(--light-1)",
        fontSize: "1rem !important",
        justifyContent: "center",

        borderRight: "1px solid var(--main-clr)",
        "&:last-child": {
          borderRight: "none",
        },
      },
    },
    cells: {
      style: {
        justifyContent: "center",
        fontSize: "0.90rem",

        borderRight: "var(--table-border)",
        "&:last-child": {
          borderRight: "none",
        },
      },
    },
  };

  return customStyles;
};

export const rowPerPage = [10, 20, 30, 40, 50, 100, 500, 1000];

//=>>> Offline available urls
export const OfflineUrls = [
  "/",
  // "/index.html",
  // "/manifest.json",
  // "/Prifile.png",
  // "/src/main.jsx",
  // "/src/App.jsx",
  // "/src/context/AuthContext.jsx",
  // "/@vite/client",

  // //==> Routes
  // "/src/routes/AdminRoutes.jsx",
  // //=> Css
  // "/src/assets/css/App.css",
  // "/src/assets/css/globals.css",
  // "/src/assets/css/variables.css",
  // "/src/assets/css/AntdStyle.css",
  // "/src/assets/css/DataTable.css",
  // "/src/components/Modal/CommonModal/CommonModal.css",
  // "/src/components/Header/Header.css",
  // "/src/pages/Home/Home.css",
  // "/src/components/Sidenav/sidenav.css",
  // //==> Js
  // "/src/assets/js/Encryption.js",
  // //==> Components
  // "/src/components/Header/Header.jsx",
  // "/src/components/Sidenav/Sidenav.jsx",
  // "/src/components/Footer/Footer.jsx",
  // "/src/pages/Home/HomeComponents/DueInvoice.jsx",
  // //==> Pages
  // "/src/pages/Home/Home.jsx",
];

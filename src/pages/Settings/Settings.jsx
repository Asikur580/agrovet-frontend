import { useRef, lazy, Suspense } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { useReactToPrint } from "react-to-print";

// const PriceCalculator = lazy(() =>
//   import("../../components/Modal/Calculator/PriceCalculator")
// );

const Settings = () => {
  const contentRef = useRef();
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <HelmetProvider>
      <Helmet>
        <title>Settings</title>
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
        <h1 className="page-title">Settings</h1>

        <div className="bg-blue-900 text-white p-5">
          <h1>Content 1</h1>
        </div>

        <div className="bg-cyan-800 text-white p-5" ref={contentRef}>
          <h1>Content 2</h1>
        </div>

        <button onClick={() => reactToPrintFn()} className="button mt-5">
          Print
        </button>

        {/* <Suspense fallback="...">
          <PriceCalculator
            slug={`Calculate price`}
            ModalOpenBtnTitle="Calculate price"
            className="addBtn"
            // identifier={identifier}
          />
        </Suspense> */}
      </div>
    </HelmetProvider>
  );
};

export default Settings;

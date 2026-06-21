import { HelmetProvider, Helmet } from "react-helmet-async";

//___ CSS ___//
import "./NotFoundPage.css";

const NotFoundPage = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Not found</title>
        <meta name="description" content="Agrovet software" />
      </Helmet>

      <div className="NotFoundPage content animated fadeInDown">
        <h1 className="title">404 - Page not found</h1>
        <h3 className="description">Please go back</h3>

        {/* <h1>Oops!</h1>
      <h2>404 - Page not found</h2> */}
        {/* <button
        className="button"
        onClick={() => {
          window.history.back();
          window.location.replace("/");
        }}
      >
        Go back
      </button> */}
      </div>
    </HelmetProvider>
  );
};

export default NotFoundPage;

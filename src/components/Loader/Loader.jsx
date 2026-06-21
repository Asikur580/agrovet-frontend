//___ Css ___//
import "./Loader.css";

const Loader = () => {
  return (
    <>
      <div id="loader" className="LoadingOverlay">
        <div className="Line-Progress">
          <div className="indeterminate"></div>
        </div>
      </div>
    </>
  );
};

export default Loader;

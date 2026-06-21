// import { useNavigate } from "react-router-dom";

//___ Icons ___//
import { LuLogOut } from "react-icons/lu";

//___ Additional utility ___//
// import ApiConfig from "../../assets/js/ApiConfig";
import Logout from "../../assets/js/Logout";

const LogoutBtn = (props) => {
  const { headers } = props;

  return (
    <button className="button d-flex" onClick={() => Logout(headers)}>
      Logout
      <LuLogOut style={{ marginLeft: "10px" }} />
    </button>
  );
};

export default LogoutBtn;

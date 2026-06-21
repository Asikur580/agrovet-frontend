import * as React from "react";
import Switch from "@mui/material/Switch";

//___ Css ___//
import "./Switch.css";

export default function UserPermissionSwitch(props) {
  const { permission, setPermission, identifier, data } = props;

  const handleChange = (e) => {
    // setInputValue({ ...inputValue, [e.target.name]: e.target.checked });
    // console.log("/*** Show checked value ***/");
    // console.log(`${e.target.name} = ${e.target.checked}`);
    // console.log("/*** Show checked values data type ***/");
    // console.log(`${e.target.name} = ${typeof e.target.checked}`);
  };

  const handleSwitch = (e, id) => {
    setPermission({
      ...permission,
      [id]: e.target.checked,
    });
    // console.log(`${e.target.name}: ${e.target.checked}`);
  };

  return (
    <>
      {identifier == "userStore" || identifier == "userUpdate" ? (
        <>
          <h3 className="switch-box-title">Permissions</h3>
          <div className="main-switch-box d-flex gap-10">
            {Array.isArray(data) &&
              data.map((item, index) => {
                // console.log(item);
                return (
                  <div className="swith-box" key={index}>
                    <h3 className="label">{item.name}</h3>
                    <Switch
                      checked={permission[item.id] || false}
                      name={item.name}
                      onChange={(e) => handleSwitch(e, item.id)}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  </div>
                );
              })}
          </div>
        </>
      ) : (
        ""
        // <div className="main-switch-box d-flex gap-10">
        //   {/* <h3 className="switch-box-title">Permissions</h3> */}
        //   <div className="swith-box">
        //     <h3 className="label">Create</h3>
        //     <Switch
        //       checked={inputValue.create}
        //       name="create"
        //       onChange={handleChange}
        //       inputProps={{ "aria-label": "controlled" }}
        //     />
        //   </div>
        //   <div className="swith-box">
        //     <h3 className="label">View</h3>
        //     <Switch
        //       checked={inputValue.view}
        //       name="view"
        //       onChange={handleChange}
        //       inputProps={{ "aria-label": "controlled" }}
        //     />
        //   </div>
        //   <div className="swith-box">
        //     <h3 className="label">Edit</h3>
        //     <Switch
        //       checked={inputValue.edit}
        //       name="edit"
        //       onChange={handleChange}
        //       inputProps={{ "aria-label": "controlled" }}
        //     />
        //   </div>
        //   <div className="swith-box">
        //     <h3 className="label">Delete</h3>
        //     <Switch
        //       checked={inputValue.deletee}
        //       name="deletee"
        //       onChange={handleChange}
        //       inputProps={{ "aria-label": "controlled" }}
        //     />
        //   </div>
        //   <div className="swith-box">
        //     <h3 className="label">Report</h3>
        //     <Switch
        //       checked={inputValue.report}
        //       name="report"
        //       onChange={handleChange}
        //       inputProps={{ "aria-label": "controlled" }}
        //     />
        //   </div>
        // </div>
      )}
    </>
  );
}

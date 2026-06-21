//===> Seperate by word
import React, { useEffect, useState, useMemo } from "react";
import { Tree } from "antd";

const UserPermissionCheckbox = (props) => {
  const { permission, setPermission, data, identifier } = props;

  // Group data by the first word of the name (up to '-' or space)
  const groupedByFirstWord = useMemo(() => {
    const grouped = {};
    data.forEach((item) => {
      // Extract the first word (up to '-' or space)
      const firstWord = item.name.split(/[- ]/)[0].toLowerCase();
      if (!grouped[firstWord]) {
        grouped[firstWord] = [];
      }
      grouped[firstWord].push(item);
    });
    return grouped;
  }, [data]);

  // Create treeData based on groupedByFirstWord
  const treeData = useMemo(() => {
    const treeNodes = Object.keys(groupedByFirstWord).map((key) => ({
      title: key.toUpperCase(), // Use the first word as the title
      key: `group-${key}`, // Unique key for the group
      children: groupedByFirstWord[key].map((item) => ({
        title: item.name,
        key: item.id,
      })),
    }));

    return [
      {
        title: "All Permissions",
        key: "all",
        children: treeNodes, // Add grouped nodes as children
      },
    ];
  }, [groupedByFirstWord]);

  const [expandedKeys, setExpandedKeys] = useState(["all"]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue) => {
    const updatedCheckedKeys = [9, ...checkedKeysValue]; // Add a default key (e.g., 9)
    setCheckedKeys(updatedCheckedKeys);
    setPermission(updatedCheckedKeys);
  };

  useEffect(() => {
    const checkedPermission = permission ? Object.values(permission) : [];
    onCheck(checkedPermission);
  }, [permission]);

  return (
    <div className="UserPermissionCheckbox w-full">
      <h1 className="text-center text-xl mb-3">Permissions</h1>

      <Tree
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        treeData={treeData}
      />
    </div>
  );
};

export default UserPermissionCheckbox;

//===> Seperate by charecter
// import React, { useEffect, useState, useMemo } from "react";
// import { Tree } from "antd";

// const UserPermissionCheckbox = (props) => {
//   const { permission, setPermission, data, identifier } = props;

//   // Group data by the first letter of the name
//   const groupedByFirstLetter = useMemo(() => {
//     const grouped = {};
//     data.forEach((item) => {
//       const firstLetter = String(item.name)[0].toLowerCase();
//       if (!grouped[firstLetter]) {
//         grouped[firstLetter] = [];
//       }
//       grouped[firstLetter].push(item);
//     });
//     return grouped;
//   }, [data]);

//   // Create treeData based on groupedByFirstLetter
//   const treeData = useMemo(() => {
//     const treeNodes = Object.keys(groupedByFirstLetter).map((key) => ({
//       title: key.toUpperCase(), // Use the first letter as the title
//       key: `group-${key}`, // Unique key for the group
//       children: groupedByFirstLetter[key].map((item) => ({
//         title: item.name,
//         key: item.id,
//       })),
//     }));

//     return [
//       {
//         title: "All Permissions",
//         key: "all",
//         children: treeNodes, // Add grouped nodes as children
//       },
//     ];
//   }, [groupedByFirstLetter]);

//   const [expandedKeys, setExpandedKeys] = useState(["all"]);
//   const [checkedKeys, setCheckedKeys] = useState([]);
//   const [autoExpandParent, setAutoExpandParent] = useState(true);

//   const onExpand = (expandedKeysValue) => {
//     setExpandedKeys(expandedKeysValue);
//     setAutoExpandParent(false);
//   };

//   const onCheck = (checkedKeysValue) => {
//     const updatedCheckedKeys = [9, ...checkedKeysValue]; // Add a default key (e.g., 9)
//     setCheckedKeys(updatedCheckedKeys);
//     setPermission(updatedCheckedKeys);
//   };

//   useEffect(() => {
//     const checkedPermission = permission ? Object.values(permission) : [];
//     onCheck(checkedPermission);
//   }, [permission]);

//   return (
//     <div className="UserPermissionCheckbox w-full">
//       <h1 className="text-center text-xl mb-3">Permissions</h1>

//       <Tree
//         checkable
//         onExpand={onExpand}
//         expandedKeys={expandedKeys}
//         autoExpandParent={autoExpandParent}
//         onCheck={onCheck}
//         checkedKeys={checkedKeys}
//         treeData={treeData}
//       />
//     </div>
//   );
// };

// export default UserPermissionCheckbox;

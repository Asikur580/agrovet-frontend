import React from "react";
import {
  FaUsers,
  FaUserGroup,
  FaUserTie,
  FaUserCheck,
  FaMapLocationDot,
} from "react-icons/fa6";
import "../Sale/Sales/SalesCards.css";

const EmployeesCards = ({
  metrics = {
    totalCount: 0,
    officerCount: 0,
    managerCount: 0,
    userAccountCount: 0,
    territoryCount: 0,
    districtCount: 0,
  },
  selectedRole = "all", // 'all' | 'officer' | 'manager' | designation_id
  selectedUserStatus = "all", // 'all' | 'has_user' | 'no_user'
  onSelectAll,
  onToggleOfficers,
  onToggleManagers,
  onToggleUsers,
}) => {
  const isAllActive = selectedRole === "all" && selectedUserStatus === "all";
  const isOfficerActive = selectedRole === "officer";
  const isManagerActive = selectedRole === "manager" || selectedRole === "rsm";
  const isUserActive = selectedUserStatus === "has_user";

  return (
    <div className="SalesCardsGrid">
      {/* 1. Total Employees */}
      <div
        className={`SalesCard card-all ${isAllActive ? "is-active" : ""}`}
        onClick={onSelectAll}
        title="Click to view all employees"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">Total Employees</span>
            {isAllActive && (
              <span className="SalesCardActiveBadge badge-all">Active</span>
            )}
          </div>
          <div className="SalesCardIconWrap icon-all">
            <FaUsers />
          </div>
        </div>
        <div className="SalesCardValue value-all">
          {metrics.totalCount} Staff
        </div>
        <div className="SalesCardFooter">
          <span>All registered profiles</span>
          <span className="filterHint">
            {isAllActive ? "Showing All" : "Reset"}
          </span>
        </div>
      </div>

      {/* 2. Field Officers */}
      <div
        className={`SalesCard card-today ${isOfficerActive ? "is-active" : ""}`}
        onClick={onToggleOfficers}
        title="Click to filter field officers"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">Field Officers</span>
            {isOfficerActive && (
              <span className="SalesCardActiveBadge badge-today">Active</span>
            )}
          </div>
          <div className="SalesCardIconWrap icon-today">
            <FaUserGroup />
          </div>
        </div>
        <div className="SalesCardValue value-today">
          {metrics.officerCount} Officers
        </div>
        <div className="SalesCardFooter">
          <span>Direct sales & field staff</span>
          <span className="filterHint">
            {isOfficerActive ? "Click to clear" : "Filter"}
          </span>
        </div>
      </div>

      {/* 3. Managers & RSM */}
      <div
        className={`SalesCard card-active-order ${isManagerActive ? "is-active" : ""}`}
        onClick={onToggleManagers}
        title="Click to filter managers and RSMs"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">Managers & RSM</span>
            {isManagerActive && (
              <span className="SalesCardActiveBadge badge-active-order">Active</span>
            )}
          </div>
          <div className="SalesCardIconWrap icon-active-order">
            <FaUserTie />
          </div>
        </div>
        <div className="SalesCardValue value-active-order">
          {metrics.managerCount} Managers
        </div>
        <div className="SalesCardFooter">
          <span>Supervisory & regional roles</span>
          <span className="filterHint">
            {isManagerActive ? "Click to clear" : "Filter"}
          </span>
        </div>
      </div>

      {/* 4. App Login Accounts */}
      <div
        className={`SalesCard card-month ${isUserActive ? "is-active" : ""}`}
        onClick={onToggleUsers}
        title="Click to filter employees with app login access"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">App User Accounts</span>
            {isUserActive && (
              <span className="SalesCardActiveBadge badge-month">Active</span>
            )}
          </div>
          <div className="SalesCardIconWrap icon-month">
            <FaUserCheck />
          </div>
        </div>
        <div className="SalesCardValue value-month">
          {metrics.userAccountCount} Users
        </div>
        <div className="SalesCardFooter">
          <span>{metrics.totalCount - metrics.userAccountCount} without user login</span>
          <span className="filterHint">
            {isUserActive ? "Click to clear" : "Filter"}
          </span>
        </div>
      </div>

      {/* 5. Territories & Districts Coverage */}
      <div
        className="SalesCard card-credit"
        title="Territories and districts covered"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">Regional Coverage</span>
          </div>
          <div className="SalesCardIconWrap icon-credit">
            <FaMapLocationDot />
          </div>
        </div>
        <div className="SalesCardValue value-credit">
          {metrics.territoryCount} Territories
        </div>
        <div className="SalesCardFooter">
          <span>Across {metrics.districtCount} districts</span>
          <span className="filterHint">Coverage</span>
        </div>
      </div>
    </div>
  );
};

export default EmployeesCards;


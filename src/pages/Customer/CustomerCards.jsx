import React from "react";
import {
  FaUsers,
  FaMoneyBillWave,
  FaCircleCheck,
  FaCommentSms,
  FaReceipt,
} from "react-icons/fa6";
import "../Sale/Sales/SalesCards.css";

const CustomerCards = ({
  metrics = {
    totalCount: 0,
    dueCount: 0,
    clearCount: 0,
    totalDueAmount: 0,
    smsActiveCount: 0,
  },
  selectedDueStatus = "all", // 'all' | 'due' | 'clear'
  selectedSmsStatus = "all", // 'all' | 'enabled' | 'disabled'
  onSelectAll,
  onToggleDue,
  onToggleClear,
  onToggleSms,
}) => {
  const formatCurrency = (val) => {
    const num = Number(val || 0);
    return (
      "Tk " +
      num.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  const isAllActive = selectedDueStatus === "all" && selectedSmsStatus === "all";
  const isDueActive = selectedDueStatus === "due";
  const isClearActive = selectedDueStatus === "clear";
  const isSmsActive = selectedSmsStatus === "enabled";

  return (
    <div className="SalesCardsGrid">
      {/* 1. Total Customers */}
      <div
        className={`SalesCard card-all ${isAllActive ? "is-active" : ""}`}
        onClick={onSelectAll}
        title="Click to view all customers"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">Total Customers</span>
            {isAllActive && (
              <span className="SalesCardActiveBadge badge-all">Active</span>
            )}
          </div>
          <div className="SalesCardIconWrap icon-all">
            <FaUsers />
          </div>
        </div>
        <div className="SalesCardValue value-all">
          {metrics.totalCount} Accounts
        </div>
        <div className="SalesCardFooter">
          <span>All registered profiles</span>
          <span className="filterHint">
            {isAllActive ? "Showing All" : "Reset"}
          </span>
        </div>
      </div>

      {/* 2. Customers With Due */}
      <div
        className={`SalesCard card-pending ${isDueActive ? "is-active" : ""}`}
        onClick={onToggleDue}
        title="Click to filter customers with outstanding due"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">With Due Balance</span>
            {isDueActive && (
              <span className="SalesCardActiveBadge badge-pending">Active</span>
            )}
          </div>
          <div className="SalesCardIconWrap icon-pending">
            <FaMoneyBillWave />
          </div>
        </div>
        <div className="SalesCardValue value-pending">
          {metrics.dueCount} Accounts
        </div>
        <div className="SalesCardFooter">
          <span>Accounts with balance</span>
          <span className="filterHint">
            {isDueActive ? "Click to clear" : "Filter"}
          </span>
        </div>
      </div>

      {/* 3. Zero Due / Clear Accounts */}
      <div
        className={`SalesCard card-active-order ${isClearActive ? "is-active" : ""}`}
        onClick={onToggleClear}
        title="Click to filter clear accounts (no outstanding due)"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">Zero Due (Clear)</span>
            {isClearActive && (
              <span className="SalesCardActiveBadge badge-active-order">Active</span>
            )}
          </div>
          <div className="SalesCardIconWrap icon-active-order">
            <FaCircleCheck />
          </div>
        </div>
        <div className="SalesCardValue value-active-order">
          {metrics.clearCount} Accounts
        </div>
        <div className="SalesCardFooter">
          <span>Fully settled accounts</span>
          <span className="filterHint">
            {isClearActive ? "Click to clear" : "Filter"}
          </span>
        </div>
      </div>

      {/* 4. Total Outstanding Due Amount */}
      <div
        className={`SalesCard card-credit ${isDueActive ? "is-active" : ""}`}
        onClick={onToggleDue}
        title="Click to filter customers with outstanding due"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">Total Due Amount</span>
          </div>
          <div className="SalesCardIconWrap icon-credit">
            <FaReceipt />
          </div>
        </div>
        <div className="SalesCardValue value-credit">
          {formatCurrency(metrics.totalDueAmount)}
        </div>
        <div className="SalesCardFooter">
          <span>From {metrics.dueCount} customers</span>
          <span className="filterHint">
            {isDueActive ? "Filtered" : "Filter"}
          </span>
        </div>
      </div>

      {/* 5. SMS Alerts Active */}
      <div
        className={`SalesCard card-today ${isSmsActive ? "is-active" : ""}`}
        onClick={onToggleSms}
        title="Click to filter customers with automated SMS enabled"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">SMS Alerts Active</span>
            {isSmsActive && (
              <span className="SalesCardActiveBadge badge-today">Active</span>
            )}
          </div>
          <div className="SalesCardIconWrap icon-today">
            <FaCommentSms />
          </div>
        </div>
        <div className="SalesCardValue value-today">
          {metrics.smsActiveCount} Accounts
        </div>
        <div className="SalesCardFooter">
          <span>Auto notifications enabled</span>
          <span className="filterHint">
            {isSmsActive ? "Click to clear" : "Filter"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomerCards;


import React from "react";
import {
  FaCalendarDay,
  FaChartLine,
  FaClipboardList,
  FaClock,
  FaCircleCheck,
} from "react-icons/fa6";
import "../../Sale/Sales/SalesCards.css";

const OrdersCards = ({
  todayMetrics = { count: 0 },
  monthMetrics = { count: 0 },
  currentViewMetrics = {
    totalCount: 0,
    pendingCount: 0,
    activeCount: 0,
  },
  dateVal = { start: "", end: "" },
  selectedStatus = "all",
  todayStr = "",
  monthStartStr = "",
  monthEndStr = "",
  onSelectToday,
  onSelectMonth,
  onSelectAllTime,
  onTogglePending,
  onToggleActive,
}) => {
  const isTodayActive =
    Boolean(dateVal.start) &&
    dateVal.start === todayStr &&
    dateVal.end === todayStr;
  const isMonthActive =
    Boolean(dateVal.start) &&
    dateVal.start === monthStartStr &&
    dateVal.end === monthEndStr;
  const isAllTimeActive =
    !dateVal.start && !dateVal.end && selectedStatus === "all";
  const isPendingActive = selectedStatus === "pending";
  const isActiveActive = selectedStatus === "active";

  // Label for Period / All Time card based on current date range
  let periodLabel = "All Orders";
  if (isTodayActive) periodLabel = "Today's Filtered";
  else if (isMonthActive) periodLabel = "Month's Filtered";
  else if (dateVal.start && dateVal.end) periodLabel = "Selected Period";

  return (
    <div className="SalesCardsGrid">
      {/* 1. Today's Orders */}
      <div
        className={`SalesCard card-today ${isTodayActive ? "is-active" : ""}`}
        onClick={onSelectToday}
        title="Click to filter by today's orders"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">Today's Orders</span>
            {isTodayActive && (
              <span className="SalesCardActiveBadge badge-today">Active</span>
            )}
          </div>
          <div className="SalesCardIconWrap icon-today">
            <FaCalendarDay />
          </div>
        </div>
        <div className="SalesCardValue value-today">
          {todayMetrics.count} Orders
        </div>
        <div className="SalesCardFooter">
          <span>Today's submissions</span>
          <span className="filterHint">
            {isTodayActive ? "Click to clear" : "Filter"}
          </span>
        </div>
      </div>

      {/* 2. This Month's Orders */}
      <div
        className={`SalesCard card-month ${isMonthActive ? "is-active" : ""}`}
        onClick={onSelectMonth}
        title="Click to filter by this month's orders"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">Month's Orders</span>
            {isMonthActive && (
              <span className="SalesCardActiveBadge badge-month">Active</span>
            )}
          </div>
          <div className="SalesCardIconWrap icon-month">
            <FaChartLine />
          </div>
        </div>
        <div className="SalesCardValue value-month">
          {monthMetrics.count} Orders
        </div>
        <div className="SalesCardFooter">
          <span>This month to date</span>
          <span className="filterHint">
            {isMonthActive ? "Click to clear" : "Filter"}
          </span>
        </div>
      </div>

      {/* 3. Total / Filtered Scope */}
      <div
        className={`SalesCard card-all ${isAllTimeActive ? "is-active" : ""}`}
        onClick={onSelectAllTime}
        title="Click to reset filters and view all orders"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">{periodLabel}</span>
            {isAllTimeActive && (
              <span className="SalesCardActiveBadge badge-all">All</span>
            )}
          </div>
          <div className="SalesCardIconWrap icon-all">
            <FaClipboardList />
          </div>
        </div>
        <div className="SalesCardValue value-all">
          {currentViewMetrics.totalCount} Orders
        </div>
        <div className="SalesCardFooter">
          <span>Current view count</span>
          <span className="filterHint">
            {isAllTimeActive ? "Active" : "Reset"}
          </span>
        </div>
      </div>

      {/* 4. Pending Orders */}
      <div
        className={`SalesCard card-pending ${isPendingActive ? "is-active" : ""}`}
        onClick={onTogglePending}
        title="Click to toggle filter for pending orders"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">Pending Orders</span>
            {isPendingActive && (
              <span className="SalesCardActiveBadge badge-pending">Active</span>
            )}
          </div>
          <div className="SalesCardIconWrap icon-pending">
            <FaClock />
          </div>
        </div>
        <div className="SalesCardValue value-pending">
          {currentViewMetrics.pendingCount} Pending
        </div>
        <div className="SalesCardFooter">
          <span>Awaiting approval</span>
          <span className="filterHint">
            {isPendingActive ? "Click to clear" : "Filter"}
          </span>
        </div>
      </div>

      {/* 5. Approved Orders */}
      <div
        className={`SalesCard card-active-order ${isActiveActive ? "is-active" : ""}`}
        onClick={onToggleActive}
        title="Click to toggle filter for approved orders"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">Approved Orders</span>
            {isActiveActive && (
              <span className="SalesCardActiveBadge badge-active-order">Active</span>
            )}
          </div>
          <div className="SalesCardIconWrap icon-active-order">
            <FaCircleCheck />
          </div>
        </div>
        <div className="SalesCardValue value-active-order">
          {currentViewMetrics.activeCount} Approved
        </div>
        <div className="SalesCardFooter">
          <span>Ready for delivery</span>
          <span className="filterHint">
            {isActiveActive ? "Click to clear" : "Filter"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrdersCards;


import React from "react";
import {
  FaCalendarDay,
  FaChartLine,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaCreditCard,
} from "react-icons/fa6";
import "./SalesCards.css";

const SalesCards = ({
  todayMetrics = { total: 0, count: 0 },
  monthMetrics = { total: 0, count: 0 },
  currentViewMetrics = {
    totalSales: 0,
    totalCount: 0,
    cashSales: 0,
    cashCount: 0,
    creditSales: 0,
    creditCount: 0,
  },
  dateVal = { start: "", end: "" },
  selectedInvoiceType = "all",
  todayStr = "",
  monthStartStr = "",
  monthEndStr = "",
  onSelectToday,
  onSelectMonth,
  onSelectAllTime,
  onToggleCash,
  onToggleCredit,
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

  const isTodayActive =
    Boolean(dateVal.start) &&
    dateVal.start === todayStr &&
    dateVal.end === todayStr;
  const isMonthActive =
    Boolean(dateVal.start) &&
    dateVal.start === monthStartStr &&
    dateVal.end === monthEndStr;
  const isAllTimeActive =
    !dateVal.start && !dateVal.end && selectedInvoiceType === "all";
  const isCashActive = selectedInvoiceType === "cash";
  const isCreditActive = selectedInvoiceType === "credit";

  // Label for Period / All Time card based on current date range
  let periodLabel = "All Time Sales";
  if (isTodayActive) periodLabel = "Today's Filtered";
  else if (isMonthActive) periodLabel = "Month's Filtered";
  else if (dateVal.start && dateVal.end) periodLabel = "Selected Period";

  return (
    <div className="SalesCardsGrid">
      {/* 1. Today's Sales */}
      <div
        className={`SalesCard card-today ${isTodayActive ? "is-active" : ""}`}
        onClick={onSelectToday}
        title="Click to filter by today's sales"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">Today's Sales</span>
            {isTodayActive && (
              <span className="SalesCardActiveBadge badge-today">Active</span>
            )}
          </div>
          <div className="SalesCardIconWrap icon-today">
            <FaCalendarDay />
          </div>
        </div>
        <div className="SalesCardValue value-today">
          {formatCurrency(todayMetrics.total)}
        </div>
        <div className="SalesCardFooter">
          <span>{todayMetrics.count} Invoices Today</span>
          <span className="filterHint">
            {isTodayActive ? "Click to clear" : "Filter"}
          </span>
        </div>
      </div>

      {/* 2. This Month's Sales */}
      <div
        className={`SalesCard card-month ${isMonthActive ? "is-active" : ""}`}
        onClick={onSelectMonth}
        title="Click to filter by this month's sales"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">This Month's Sales</span>
            {isMonthActive && (
              <span className="SalesCardActiveBadge badge-month">Active</span>
            )}
          </div>
          <div className="SalesCardIconWrap icon-month">
            <FaChartLine />
          </div>
        </div>
        <div className="SalesCardValue value-month">
          {formatCurrency(monthMetrics.total)}
        </div>
        <div className="SalesCardFooter">
          <span>{monthMetrics.count} Invoices This Month</span>
          <span className="filterHint">
            {isMonthActive ? "Click to clear" : "Filter"}
          </span>
        </div>
      </div>

      {/* 3. Filtered Total / All Time Sales */}
      <div
        className={`SalesCard card-all ${isAllTimeActive ? "is-active" : ""}`}
        onClick={onSelectAllTime}
        title="Click to reset filters and view all sales"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">{periodLabel}</span>
            {isAllTimeActive && (
              <span className="SalesCardActiveBadge badge-all">All</span>
            )}
          </div>
          <div className="SalesCardIconWrap icon-all">
            <FaFileInvoiceDollar />
          </div>
        </div>
        <div className="SalesCardValue value-all">
          {formatCurrency(currentViewMetrics.totalSales)}
        </div>
        <div className="SalesCardFooter">
          <span>{currentViewMetrics.totalCount} Invoices</span>
          <span className="filterHint">Show All</span>
        </div>
      </div>

      {/* 4. Cash Sales */}
      <div
        className={`SalesCard card-cash ${isCashActive ? "is-active" : ""}`}
        onClick={onToggleCash}
        title="Click to filter by Cash invoices"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">Cash Sales</span>
            {isCashActive && (
              <span className="SalesCardActiveBadge badge-cash">Active</span>
            )}
          </div>
          <div className="SalesCardIconWrap icon-cash">
            <FaMoneyBillWave />
          </div>
        </div>
        <div className="SalesCardValue value-cash">
          {formatCurrency(currentViewMetrics.cashSales)}
        </div>
        <div className="SalesCardFooter">
          <span>{currentViewMetrics.cashCount} Invoices</span>
          <span className="filterHint">
            {isCashActive ? "Clear type" : "Filter cash"}
          </span>
        </div>
      </div>

      {/* 5. Credit Sales */}
      <div
        className={`SalesCard card-credit ${isCreditActive ? "is-active" : ""}`}
        onClick={onToggleCredit}
        title="Click to filter by Credit invoices"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">Credit Sales</span>
            {isCreditActive && (
              <span className="SalesCardActiveBadge badge-credit">Active</span>
            )}
          </div>
          <div className="SalesCardIconWrap icon-credit">
            <FaCreditCard />
          </div>
        </div>
        <div className="SalesCardValue value-credit">
          {formatCurrency(currentViewMetrics.creditSales)}
        </div>
        <div className="SalesCardFooter">
          <span>{currentViewMetrics.creditCount} Invoices</span>
          <span className="filterHint">
            {isCreditActive ? "Clear type" : "Filter credit"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SalesCards);


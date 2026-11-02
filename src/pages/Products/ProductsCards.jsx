import React from "react";
import {
  FaBoxesStacked,
  FaCircleCheck,
  FaTriangleExclamation,
  FaBan,
  FaWarehouse,
} from "react-icons/fa6";
import "../Sale/Sales/SalesCards.css";

const ProductsCards = ({
  metrics = {
    totalCount: 0,
    inStockCount: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalUnits: 0,
    categoryCount: 0,
  },
  stockFilter = "all", // 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'
  onSelectAll,
  onToggleInStock,
  onToggleLowStock,
  onToggleOutOfStock,
}) => {
  const isAllActive = stockFilter === "all";
  const isInStockActive = stockFilter === "in_stock";
  const isLowStockActive = stockFilter === "low_stock";
  const isOutOfStockActive = stockFilter === "out_of_stock";

  return (
    <div className="SalesCardsGrid">
      {/* 1. Total Products */}
      <div
        className={`SalesCard card-all ${isAllActive ? "is-active" : ""}`}
        onClick={onSelectAll}
        title="Click to view all products"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">Total Products</span>
            {isAllActive && (
              <span className="SalesCardActiveBadge badge-all">Active</span>
            )}
          </div>
          <div className="SalesCardIconWrap icon-all">
            <FaBoxesStacked />
          </div>
        </div>
        <div className="SalesCardValue value-all">
          {metrics.totalCount} Items
        </div>
        <div className="SalesCardFooter">
          <span>All catalog products</span>
          <span className="filterHint">
            {isAllActive ? "Showing All" : "Reset"}
          </span>
        </div>
      </div>

      {/* 2. In Stock */}
      <div
        className={`SalesCard card-today ${isInStockActive ? "is-active" : ""}`}
        onClick={onToggleInStock}
        title="Click to filter products with healthy stock (> 10)"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">In Stock (&gt; 10)</span>
            {isInStockActive && (
              <span className="SalesCardActiveBadge badge-today">Active</span>
            )}
          </div>
          <div className="SalesCardIconWrap icon-today">
            <FaCircleCheck />
          </div>
        </div>
        <div className="SalesCardValue value-today">
          {metrics.inStockCount} Items
        </div>
        <div className="SalesCardFooter">
          <span>Adequate inventory level</span>
          <span className="filterHint">
            {isInStockActive ? "Click to clear" : "Filter"}
          </span>
        </div>
      </div>

      {/* 3. Low Stock Alert */}
      <div
        className={`SalesCard card-pending ${isLowStockActive ? "is-active" : ""}`}
        onClick={onToggleLowStock}
        title="Click to filter low stock items (1 to 10 units)"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">Low Stock (&le; 10)</span>
            {isLowStockActive && (
              <span className="SalesCardActiveBadge badge-pending">Active</span>
            )}
          </div>
          <div className="SalesCardIconWrap icon-pending">
            <FaTriangleExclamation />
          </div>
        </div>
        <div className="SalesCardValue value-pending">
          {metrics.lowStockCount} Items
        </div>
        <div className="SalesCardFooter">
          <span>Reorder needed soon</span>
          <span className="filterHint">
            {isLowStockActive ? "Click to clear" : "Filter"}
          </span>
        </div>
      </div>

      {/* 4. Out of Stock */}
      <div
        className={`SalesCard card-credit ${isOutOfStockActive ? "is-active" : ""}`}
        onClick={onToggleOutOfStock}
        title="Click to filter completely out-of-stock items (0 units)"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">Out of Stock</span>
            {isOutOfStockActive && (
              <span className="SalesCardActiveBadge" style={{ background: "#fee2e2", color: "#b91c1c" }}>Active</span>
            )}
          </div>
          <div className="SalesCardIconWrap" style={{ background: "#fee2e2", color: "#b91c1c" }}>
            <FaBan />
          </div>
        </div>
        <div className="SalesCardValue" style={{ color: "#b91c1c" }}>
          {metrics.outOfStockCount} Items
        </div>
        <div className="SalesCardFooter">
          <span>Zero inventory units</span>
          <span className="filterHint">
            {isOutOfStockActive ? "Click to clear" : "Filter"}
          </span>
        </div>
      </div>

      {/* 5. Total Stock Units */}
      <div
        className="SalesCard card-month"
        title="Total physical units in stock"
      >
        <div className="SalesCardHeader">
          <div className="SalesCardTitleWrap">
            <span className="SalesCardLabel">Total Inventory</span>
          </div>
          <div className="SalesCardIconWrap icon-month">
            <FaWarehouse />
          </div>
        </div>
        <div className="SalesCardValue value-month">
          {metrics.totalUnits.toLocaleString("en-IN")} Units
        </div>
        <div className="SalesCardFooter">
          <span>Across {metrics.categoryCount} categories</span>
          <span className="filterHint">Total Stock</span>
        </div>
      </div>
    </div>
  );
};

export default ProductsCards;


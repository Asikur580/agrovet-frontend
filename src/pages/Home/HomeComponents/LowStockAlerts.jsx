import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaTriangleExclamation } from "react-icons/fa6";
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";
import { formatNumber, readCache } from "../dashboardUtils";

//=>>> Components
import { WidgetSkeleton, WidgetEmpty, StaleBadge } from "./WidgetStates";

const VISIBLE_LIMIT = 10;

const LowStockAlerts = ({ canManageProducts = true }) => {
  const { headers } = useContext(AuthContext);
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);

  //==> Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ApiConfig.get("/low_stock_alerts", { headers });
      const datas = response.data.status ? response.data.low_stock_alerts || [] : [];
      setApiData(datas);
      setIsStale(false);
      //==> For offline use
      localStorage.setItem("LowStockAlerts", JSON.stringify(datas));
    } catch (error) {
      console.error("Error fetching low stock alerts:", error);
      //==> For offline use
      const cachedData = readCache("LowStockAlerts");
      if (cachedData) {
        setApiData(cachedData);
        setIsStale(true);
      }
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  //=>>> Out of stock first, then lowest stock
  const sorted = useMemo(
    () => [...apiData].sort((a, b) => (Number(a.current_stock) || 0) - (Number(b.current_stock) || 0)),
    [apiData]
  );
  const outOfStock = sorted.filter((i) => Number(i.current_stock) <= 0).length;

  return (
    <div className="Home-inventory-alert-card">
      <div className="Home-inventory-header">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-2 text-rose-700 font-bold text-sm">
            <FaTriangleExclamation size={15} />
            <span>Low Stock Alerts ({sorted.length})</span>
          </span>
          {outOfStock > 0 && (
            <span className="HomeStock-pill stock-out">{outOfStock} out of stock</span>
          )}
          <StaleBadge show={isStale} />
        </div>
        {canManageProducts && (
          <Link
            to="/products?filter=low_stock"
            className="HomeWidget-link"
            title="View all low stock products"
          >
            View all &rarr;
          </Link>
        )}
      </div>

      <div className="Home-inventory-body">
        {loading && apiData.length === 0 ? (
          <WidgetSkeleton rows={4} />
        ) : sorted.length > 0 ? (
          <>
            <div className="HomeStock-grid">
              {sorted.slice(0, VISIBLE_LIMIT).map((item, index) => {
                const stock = Number(item.current_stock) || 0;
                const isOut = stock <= 0;
                const name = item.pack_size
                  ? `${item.product_name} (${item.pack_size})`
                  : item.product_name;
                return (
                  <div className="HomeStock-row" key={`${item.product_name}-${index}`}>
                    <p className="HomeRow-title" title={name}>
                      {name}
                    </p>
                    <span className={`HomeStock-pill ${isOut ? "stock-out" : "stock-low"}`}>
                      {isOut ? "Out of stock" : `${formatNumber(stock)} left`}
                    </span>
                  </div>
                );
              })}
            </div>
            {sorted.length > VISIBLE_LIMIT && canManageProducts && (
              <Link to="/products?filter=low_stock" className="HomeWidget-viewall">
                View all {sorted.length} low stock products &rarr;
              </Link>
            )}
          </>
        ) : (
          <WidgetEmpty title="All products sufficiently stocked" />
        )}
      </div>
    </div>
  );
};

export default React.memo(LowStockAlerts);

import React from "react";
import { FaInbox, FaCloudArrowDown, FaRotateRight } from "react-icons/fa6";

//=>>> Shared loading / empty / stale states for dashboard widgets

export const WidgetSkeleton = ({ rows = 4 }) => (
  <div className="HomeSkeleton" aria-busy="true" aria-label="Loading">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="HomeSkeleton-row" />
    ))}
  </div>
);

export const WidgetEmpty = ({ title, hint, onRetry }) => (
  <div className="HomeEmpty">
    <FaInbox size={22} className="HomeEmpty-icon" />
    <p className="HomeEmpty-title">{title}</p>
    {hint && <p className="HomeEmpty-hint">{hint}</p>}
    {onRetry && (
      <button type="button" className="HomeEmpty-retry" onClick={onRetry}>
        <FaRotateRight size={10} />
        <span>Retry</span>
      </button>
    )}
  </div>
);

// Shown when the API failed and the widget fell back to cached data
export const StaleBadge = ({ show }) =>
  show ? (
    <span
      className="HomeStaleBadge"
      title="Could not reach the server. Showing last saved data."
    >
      <FaCloudArrowDown size={10} />
      <span>Offline data</span>
    </span>
  ) : null;

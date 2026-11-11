import React from "react";
import SalesShareList from "./SalesShareList";
import { formatCurrency, formatNumber } from "../dashboardUtils";

const tableHead = ["Sl", "Customer name", "phone", "Invoices", "Old due", "Purchases", "Payments", "Due"];

const getId = (i) => i.customer_id;
const getName = (i) => i.customer_name;
const getValue = (i) => Number(i.total_purchases) || 0;
const getSub = (i) =>
  `${formatNumber(i.total_invoices)} invoices • Due ${formatCurrency(i.total_due)}`;

const CustomerWiseSales = ({ dateRange }) => (
  <SalesShareList
    dateRange={dateRange}
    title="Customer wise sales"
    endpoint="/customerWiseSalesReport"
    cacheKey="CustomerWiseSales"
    printKey="printCustomerWiseSales"
    slug="Customer wise sales"
    modalIdentifier="CustomerWiseSales"
    tableHead={tableHead}
    getId={getId}
    getName={getName}
    getValue={getValue}
    getSub={getSub}
  />
);

export default React.memo(CustomerWiseSales);

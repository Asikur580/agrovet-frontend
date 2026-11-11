import React from "react";
import SalesShareList from "./SalesShareList";
import { formatNumber } from "../dashboardUtils";

const tableHead = ["Sl", "Product name", "Pack size", "Total invoice", "Total quantity", "Total amount"];

const getId = (i) => i.id;
const getName = (i) => (i.pack_size ? `${i.product_name} (${i.pack_size})` : i.product_name);
const getValue = (i) => Number(i.total_amount) || 0;
const getSub = (i) =>
  `Qty ${formatNumber(i.total_quantity)} • ${formatNumber(i.total_invoice)} invoices`;

const ProductWiseSales = ({ dateRange }) => (
  <SalesShareList
    dateRange={dateRange}
    title="Product wise sales"
    endpoint="/productWiseSalesReport"
    cacheKey="ProductWiseSales"
    printKey="printProductWiseSales"
    slug="Product wise sales"
    modalIdentifier="ProductWiseSales"
    tableHead={tableHead}
    getId={getId}
    getName={getName}
    getValue={getValue}
    getSub={getSub}
  />
);

export default React.memo(ProductWiseSales);

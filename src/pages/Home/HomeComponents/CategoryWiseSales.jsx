import React from "react";
import SalesShareList from "./SalesShareList";
import { formatNumber } from "../dashboardUtils";

const tableHead = ["Sl", "Category name", "Total invoice", "Total quantity", "Total amount"];

const getId = (i) => i.id;
const getName = (i) => i.category_name;
const getValue = (i) => Number(i.total_amount) || 0;
const getSub = (i) =>
  `Qty ${formatNumber(i.total_quantity)} • ${formatNumber(i.total_invoice)} invoices`;

const CategoryWiseSales = ({ dateRange }) => (
  <SalesShareList
    dateRange={dateRange}
    title="Category wise sales"
    endpoint="/categoryWiseSalesReport"
    cacheKey="CategoryWiseSales"
    printKey="printCategoryWiseSales"
    slug="Category wise sales"
    modalIdentifier="CategoryWiseSales"
    tableHead={tableHead}
    getId={getId}
    getName={getName}
    getValue={getValue}
    getSub={getSub}
  />
);

export default React.memo(CategoryWiseSales);

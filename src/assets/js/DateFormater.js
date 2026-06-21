export const DateFormater = (param) => {
  const paramDate = new Date(param).toLocaleDateString();
  const fullDateArr = paramDate.split("/");
  const fullDate = `${fullDateArr[2]}-${
    fullDateArr[0].length == 1 ? `0${fullDateArr[0]}` : fullDateArr[0]
  }-${fullDateArr[1].length == 1 ? `0${fullDateArr[1]}` : fullDateArr[1]}`;
  return fullDate;
};

export const DateRange = (range) => {
  const today = new Date();
  let startDate, endDate;

  switch (String(range).toLowerCase()) {
    case "today":
      startDate = today;
      endDate = today;
      break;
    case "last-day":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 1);
      endDate = new Date(today);
      endDate.setDate(today.getDate() - 1);
      break;
    case "week":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      endDate = new Date(today);
      break;
    case "month":
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 1);
      endDate = new Date(today);
      break;
    case "year":
      startDate = new Date(today);
      startDate.setFullYear(today.getFullYear() - 1);
      endDate = new Date(today);
      break;
    case "100-years":
      startDate = new Date(today);
      startDate.setFullYear(today.getFullYear() - 100);
      endDate = new Date(today);
      break;
    default:
      startDate = today;
      endDate = today;
  }

  const formattedStartDate = FormatDate(startDate);
  const formattedEndDate = FormatDate(endDate);

  return { formattedStartDate, formattedEndDate };
};

const FormatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const daysPrevToToday = (daysAgo = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const modifiedDate = date.toISOString().split("T")[0];
  return modifiedDate;
};

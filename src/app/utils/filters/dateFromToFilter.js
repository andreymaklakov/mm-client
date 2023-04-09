import { getStartOfMonth, toDateFormat } from "../date";

export function dateFromToFilter(filterData, item, period) {
  const dateFrom = new Date(toDateFormat(filterData.dateFrom));
  const dateTo = new Date(toDateFormat(filterData.dateTo));
  const itemDate = new Date(item.date);

  if (filterData.dateFrom && filterData.dateTo) {
    return itemDate >= dateFrom && itemDate <= dateTo;
  } else if (filterData.dateFrom && !filterData.dateTo) {
    return itemDate >= dateFrom;
  } else if (filterData.dateTo && !filterData.dateFrom) {
    return itemDate <= dateTo;
  } else if (period === "All Time") {
    return true;
  } else {
    return Date.now() - itemDate <= getStartOfMonth();
  }
}

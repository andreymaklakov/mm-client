import { mSecInOneYear } from "../constantMSecData";
import { toDateFormat } from "../date";

export function dateFromIsMoreThanOneYearAgo(filterData) {
  return (
    Date.now() - new Date(toDateFormat(filterData.dateFrom)) > mSecInOneYear
  );
}

export function dateFromDateToDifferenceIsLessThanOneYear(filterData) {
  return (
    new Date(toDateFormat(filterData.dateTo)) -
      new Date(toDateFormat(filterData.dateFrom)) <
    mSecInOneYear
  );
}

export function dateFromDate(filterData) {
  return filterData.dateFrom.slice(8, 9) === "0"
    ? Number(filterData.dateFrom.slice(9))
    : Number(filterData.dateFrom.slice(8));
}

export function dateFromMonth(filterData) {
  return filterData.dateFrom.slice(5, 6) === "0"
    ? Number(filterData.dateFrom.slice(6, 7))
    : Number(filterData.dateFrom.slice(5, 7));
}

export function dateToDate(filterData) {
  return filterData.dateTo.slice(8, 9) === "0"
    ? Number(filterData.dateTo.slice(9))
    : Number(filterData.dateTo.slice(8));
}

export function dateToMonth(filterData) {
  return filterData.dateTo.slice(5, 6) === "0"
    ? Number(filterData.dateTo.slice(6, 7))
    : Number(filterData.dateTo.slice(5, 7));
}

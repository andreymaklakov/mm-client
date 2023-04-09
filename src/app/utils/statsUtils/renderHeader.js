import { toUsersReadableDateFormat } from "../date";
import {
  dateFromDateToDifferenceIsLessThanOneYear,
  dateFromIsMoreThanOneYearAgo
} from "./differentDateData";

export function renderHeader(
  isLineChart,
  showExpenses,
  filterData,
  accountName,
  itemName,
  showIncomes,
  period
) {
  return (
    (showExpenses
      ? filterData.accounts
        ? filterData.items
          ? `${accountName} to ${itemName} Expenses `
          : showIncomes
          ? `${accountName} Incomes & Expenses `
          : `${accountName} Expenses `
        : filterData.items
        ? `${itemName} Expenses `
        : showIncomes
        ? `Incomes & Expenses `
        : `Expenses `
      : showIncomes
      ? filterData.accounts
        ? `${accountName} Incomes `
        : `Incomes `
      : ``) +
    (period
      ? isLineChart
        ? period === "All Time"
          ? "Last Year"
          : period
        : period
      : `${
          filterData.dateFrom
            ? "from " + toUsersReadableDateFormat(filterData.dateFrom) + " to "
            : isLineChart
            ? "One Year Back from "
            : "from Begining to "
        }${
          filterData.dateTo
            ? isLineChart
              ? filterData.dateFrom &&
                !dateFromDateToDifferenceIsLessThanOneYear(filterData)
                ? "One Year Forward"
                : toUsersReadableDateFormat(filterData.dateTo)
              : toUsersReadableDateFormat(filterData.dateTo)
            : isLineChart
            ? dateFromIsMoreThanOneYearAgo(filterData)
              ? "One Year Forward"
              : "Today"
            : "Today"
        }`)
  );
}

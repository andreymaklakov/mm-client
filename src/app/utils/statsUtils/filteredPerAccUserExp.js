import { dateFromToFilter } from "../filters";

export function filteredPerAccountUserExpenses(
  userExpensesFromHistory,
  filterData,
  period
) {
  let result = userExpensesFromHistory
    ? userExpensesFromHistory
        .filter((data) => dateFromToFilter(filterData, data, period))
        .map((exp) => ({
          ...exp
        }))
        .filter((data) =>
          filterData.accounts ? data.account === filterData.accounts : true
        )
    : [];

  return result;
}

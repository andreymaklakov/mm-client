import { dateFromToFilter } from "./dateFromToFilter";

export function historyFiltration(
  filterData,
  incomesExpenses,
  period,
  userHistory,
  userMoney,
  userExpenses,
  items,
  accounts
) {
  let commonHistory = [];

  if (userHistory.expenses || userHistory.incomes) {
    if (userHistory.expenses && userHistory.incomes) {
      commonHistory = [...userHistory.expenses, ...userHistory.incomes];
    }
    if (userHistory.expenses && !userHistory.incomes) {
      commonHistory = [...userHistory.expenses];
    }
    if (userHistory.incomes && !userHistory.expenses) {
      commonHistory = [...userHistory.incomes];
    }
  }

  const history = commonHistory
    ? commonHistory.map((item) => ({
        ...item,
        accountName: userMoney?.filter((acc) => acc._id === item.account)[0]
          ? userMoney.filter((acc) => acc._id === item.account)[0].name
          : accounts?.filter((acc) => acc._id === item.account)[0].name,
        currency: (!item.item
          ? userHistory.incomes
          : userHistory.expenses
        ).filter((acc) => acc.currency === item.currency)[0]?.currency,
        itemName: userExpenses?.filter(
          (expense) => expense._id === item.item
        )[0]
          ? userExpenses.filter((expense) => expense._id === item.item)[0].name
          : items?.filter((exp) => exp._id === item.item)[0]?.name
      }))
    : [];

  let filteredHistory = history.filter((history) => {
    if (filterData.incomesExpenses) {
      return filterData.incomesExpenses === incomesExpenses[1]._id
        ? !history.item
          ? history
          : null
        : history.item
        ? history
        : null;
    }
    return true;
  });
  filteredHistory = filteredHistory.filter((history) => {
    if (filterData.accounts) {
      return history.account === filterData.accounts;
    }
    return true;
  });
  filteredHistory = filteredHistory.filter((history) => {
    if (filterData.items) {
      return history.item === filterData.items;
    }
    return true;
  });
  filteredHistory = filteredHistory.filter((history) =>
    dateFromToFilter(filterData, history, period)
  );

  return filteredHistory;
}

import { getStartOfMonth } from "../../utils";

export function incomeExpenseTimeFilter(
  selectedPeriod,
  userHistory,
  data,
  expenses = false
) {
  let difference;

  if (selectedPeriod.name === "This Month") {
    difference = getStartOfMonth();
  }
  if (selectedPeriod.name === "Half Year") {
    difference = 15811200000;
  }
  if (selectedPeriod.name === "Last Year") {
    difference = 31536000000;
  }
  if (selectedPeriod.name === "All Time") {
    difference = Date.now();
  }

  const userData = data.map((prevState) => ({
    ...prevState,
    amount: userHistory
      ? userHistory
          .filter(
            (data) => (expenses ? data.item : data.account) === prevState._id
          )
          .filter((data) => Date.now() - new Date(data.date) <= difference)
          .reduce((accum, data) => accum + data.amount, 0)
      : 0
  }));

  return userData;
}

import React, { useState, useEffect } from "react";
import {
  allUsersMoneyIfAccountsAreDeleted,
  dateFromToFilter,
  totalCalc,
  allUsersExpensesIfExpensesAreDeleted,
  filteredPerAccountUserExpenses,
  zeroExpense
} from "../../utils";
import FiltrationBar from "../filtrationBar";
import Loader from "../loader";

import "@progress/kendo-theme-material/dist/all.css";
import "hammerjs";
import ChartsRender from "./chartsRender";

import { useSelector, useDispatch } from "react-redux";
import { getSignedUser } from "../../store/user";
import { getHistory } from "../../store/history";
import { getMoney } from "../../store/money";
import { getExpenses } from "../../store/expenses";
import {
  changeFilter,
  clearFilterAndSetPeriod,
  getFilterData,
  getIncomesExpenses,
  getPeriod,
  setPeriod,
  setPeriodAllTime,
  setPeriodThisMonth
} from "../../store/filtration";

const StatsPage = () => {
  const signedUser = useSelector(getSignedUser());
  const userHistory = useSelector(getHistory());
  const userMoney = useSelector(getMoney());
  const userExpenses = useSelector(getExpenses());
  const filterData = useSelector(getFilterData());
  const incomesExpenses = useSelector(getIncomesExpenses());
  const period = useSelector(getPeriod());

  const [accounts, setAccounts] = useState();
  const [items, setItems] = useState();

  const noFilter = { _id: "", name: "All" };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPeriod("This Month"));
  }, []);

  useEffect(() => {
    userHistory &&
      userMoney &&
      setAccounts([
        noFilter,
        ...allUsersMoneyIfAccountsAreDeleted(userHistory, userMoney)
      ]);
  }, [userMoney]);

  useEffect(() => {
    userHistory &&
      userExpenses &&
      setItems([
        noFilter,
        ...allUsersExpensesIfExpensesAreDeleted(userHistory, userExpenses)
      ]);
  }, [userExpenses]);

  const renderHeader = () => {
    return (
      (filterData.accounts &&
        filterData.items &&
        accounts?.filter((acc) => acc._id === filterData.accounts)[0]?.name +
          " to " +
          items?.filter((exp) => exp._id === filterData.items)[0]?.name) ||
      accounts?.filter((acc) => acc._id === filterData.accounts)[0]?.name ||
      items?.filter((exp) => exp._id === filterData.items)[0]?.name ||
      ""
    );
  };

  const renderIncomes = () => {
    const userIncomes = allUsersMoneyIfAccountsAreDeleted(
      userHistory,
      userMoney
    ).map((prevState) => ({
      ...prevState,
      amount: userHistory.incomes
        ? userHistory.incomes
            .filter((data) => data.account === prevState._id)
            .filter((data) => {
              return dateFromToFilter(filterData, data, period);
            })
            .reduce((accum, data) => accum + data.amount, 0)
        : 0
    }));

    const filteredUserMoney = userIncomes.filter(
      (acc) => acc._id === filterData.accounts
    );

    const incomes = totalCalc(
      filteredUserMoney.length ? filteredUserMoney : userIncomes
    ).map((acc) => acc.join("") + " ");

    return incomes.length ? incomes : [`0.00${signedUser.currency}`];
  };

  const renderExpenses = () => {
    let filteredPerAccUserExp = filteredPerAccountUserExpenses(
      userHistory.expenses,
      filterData,
      period
    );

    filteredPerAccUserExp.length
      ? true
      : (filteredPerAccUserExp = zeroExpense(filterData, accounts, items));

    const filteredPerExpenseUserExpenses = filteredPerAccUserExp.filter(
      (exp) => exp.item === filterData.items
    );

    const expenses = totalCalc(
      filterData.items
        ? filteredPerExpenseUserExpenses.length
          ? filteredPerExpenseUserExpenses
          : zeroExpense(filterData, accounts, items)
        : filteredPerAccUserExp
    ).map((arr) => arr.join("") + " ");

    return expenses.length ? expenses : [`0.00${signedUser.currency}`];
  };

  const handleChange = (target) => {
    dispatch(changeFilter(target));
  };

  const handleThisMonthHistoryOrStats = () => {
    dispatch(setPeriodThisMonth());
  };

  const handleAllTimeHistoryOrStats = () => {
    dispatch(setPeriodAllTime());
  };

  const handleClearHistoryOrStatsFilters = (data) => {
    dispatch(clearFilterAndSetPeriod(data));
  };

  if (
    incomesExpenses &&
    userHistory &&
    userExpenses &&
    userMoney &&
    (userMoney.length
      ? accounts
      : userHistory.incomes.length
      ? accounts
      : true) &&
    (incomesExpenses.length
      ? items
      : userHistory.expenses.length
      ? items
      : true)
  ) {
    const showIncomes = () => {
      if (
        !filterData.items &&
        (filterData.incomesExpenses === String(incomesExpenses[1]._id) ||
          filterData.incomesExpenses === "")
      ) {
        return true;
      } else {
        return false;
      }
    };

    const showExpenses = () => {
      if (
        filterData.incomesExpenses === String(incomesExpenses[2]._id) ||
        filterData.incomesExpenses === ""
      ) {
        return true;
      } else {
        return false;
      }
    };

    return (
      <div className="flex justify-center">
        <div className="bg-white dark:bg-[#40444b] dark:text-slate-300 md:min-w-[750px] w-[430px] mt-[60px] rounded-2xl shadow-xl">
          <div className="text-center">
            <h1 className="text-center font-medium	text-xl pt-3">Statistics</h1>
            <br />

            <FiltrationBar
              data={filterData}
              onChange={handleChange}
              incomesExpenses={incomesExpenses}
              accounts={accounts}
              items={items}
              onClear={() => handleClearHistoryOrStatsFilters("stats")}
              onThisMonth={handleThisMonthHistoryOrStats}
              onAllTime={handleAllTimeHistoryOrStats}
              period={period}
            />

            <br />

            <div className="text-left ml-5  mb-5">
              <h1 className="text-lg font-medium">{renderHeader()}</h1>

              <h1 className={showIncomes() ? "" : "hidden"}>
                Incomes: {renderIncomes()}
              </h1>

              <h1 className={showExpenses() ? "" : "hidden"}>
                Expenses: {renderExpenses()}
              </h1>
            </div>

            <div className="w-[600px] m-auto mb-9">
              <ChartsRender
                expensesData={renderExpenses()}
                incomesData={renderIncomes()}
                filterData={filterData}
                showIncomes={showIncomes()}
                showExpenses={showExpenses()}
                period={period}
                accounts={accounts?.filter((item) => item.currency)}
                items={items?.filter((item) => item.currency)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <Loader />;
};

export default StatsPage;

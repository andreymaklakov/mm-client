import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SelectField from "../forms/selectField";
import AddExpenseModal from "./addExpenseModal";
import ExpenseModal from "./expenseModal";
import { incomeExpenseTimeFilter, totalCalc } from "../../utils";
import Loader from "../loader";
import useWindowWidth from "../../hooks/useWindowWidth";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { currencies } from "../../constantData/currencies";
import { getSignedUser } from "../../store/user";
import { getHistory } from "../../store/history";
import {
  periods,
  incomesExpensesFilterData
} from "../../constantData/filterData";
import { getExpenses, getExpensesIsLoading } from "../../store/expenses";
import { icons } from "../../constantData/icons";
import {
  clearFilterAndSetPeriod,
  openItemHistory
} from "../../store/filtration";
import configFile from "../../config.json";

const ExpensesPage = () => {
  const [addModalIsHidden, setAddModalIsHidden] = useState(true);
  const [expenseModalIsHidden, setExpenseModalIsHidden] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState();
  const [userExpensesState, setUserExpensesState] = useState([]);
  const [pageSize, setPageSize] = useState();
  const [selectedPeriod, setSelectedPeriod] = useState();

  const sortBy = { path: "expenseTimeStamp", order: "asc" };
  const currenciesSelectOptions = currencies;
  const selectOptions = periods;

  const iconsLink = `${configFile.imageApi}/icons/`;

  const windowWidth = useWindowWidth();
  const dispatch = useDispatch();

  const signedUser = useSelector(getSignedUser());
  const userHistory = useSelector(getHistory());
  const userExpenses = useSelector(getExpenses());
  const isLoading = useSelector(getExpensesIsLoading());

  useEffect(() => {
    setSelectedPeriod(periods[0]);
  }, []);

  useEffect(() => {
    windowWidth && setPageSize(windowWidth < 768 ? 5 : 13);
  }, [windowWidth]);

  useEffect(() => {
    selectedPeriod &&
      userHistory &&
      userExpenses &&
      setUserExpensesState(
        incomeExpenseTimeFilter(
          selectedPeriod,
          userHistory.expenses,
          userExpenses,
          true
        )
      );
  }, [selectedPeriod, userHistory, signedUser, userExpenses]);

  const prevRef = useRef(userExpensesState.length);
  useEffect(() => {
    prevRef.current = userExpensesState.length;
  }, [userExpensesState.length]);
  const prevLength = prevRef.current;

  const handleChange = ({ target }) => {
    setSelectedPeriod({ name: target.value });
  };

  const handleModalOpen = (isAdd, expense) => {
    expense && setSelectedExpense(expense);

    isAdd ? setAddModalIsHidden(false) : setExpenseModalIsHidden(false);
  };

  const handleModalClose = () => {
    setAddModalIsHidden(true);
    setExpenseModalIsHidden(true);
  };

  const handleIncreasePageSize = () => {
    if (userExpensesState.length > pageSize) {
      setPageSize((prevState) => prevState + (windowWidth < 768 ? 6 : 7));
    }
  };

  const handleShowAllExpenses = () => {
    setPageSize(userExpensesState.length);
  };

  const handleOpenItemHistory = (data) => {
    dispatch(openItemHistory(data));
  };

  const handleClearHistoryOrStatsFilters = () => {
    dispatch(clearFilterAndSetPeriod());
  };

  if (
    pageSize < userExpensesState.length &&
    prevLength + 1 === userExpensesState.length
  ) {
    handleShowAllExpenses();
  }

  let sortedUserExpenses = _.orderBy(
    userExpensesState,
    [sortBy.path],
    [sortBy.order]
  );

  const paginatedUserExpenses = sortedUserExpenses.filter(
    (exp, index) => index < pageSize
  );

  if (
    selectOptions &&
    selectedPeriod &&
    icons &&
    incomesExpensesFilterData &&
    currenciesSelectOptions &&
    !isLoading
  ) {
    return (
      <div className="flex justify-center">
        <div className="bg-white dark:bg-[#40444b] dark:text-slate-300  md:min-w-[680px] w-[400px] mt-[60px] rounded-2xl shadow-xl">
          <div className="text-center">
            <h1 className="text-center font-medium	text-xl pt-3">Expenses</h1>
            <br />
            <table className="table-auto border-spacing-x-10 border-separate">
              <tbody>
                <tr>
                  <td className="text-left text-lg font-medium  pb-5">
                    Period
                  </td>
                  <td className="text-lg font-medium  pb-5">
                    <div className="inline-block relative w-30 ">
                      <SelectField
                        options={selectOptions}
                        name="period"
                        value={selectedPeriod.name}
                        onChange={handleChange}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="text-left text-lg">Total Spent</td>
                  <td className="text-lg">
                    {userExpensesState && userExpensesState.length
                      ? totalCalc(userExpensesState).map(
                          (arr) => arr.join("") + " "
                        )
                      : 0 + `$`}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="grid grid-cols-3 md:grid-cols-7 gap-4 justify-items-center m-5">
              {paginatedUserExpenses &&
                paginatedUserExpenses.map((expense) => (
                  <button
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title={expense.name}
                    className="flex flex-col items-center cursor-pointer  hover:-translate-y-1 hover:scale-110 transition duration-300 ease-in-out"
                    key={expense._id}
                    onClick={() => {
                      handleModalOpen(false, expense);
                    }}
                  >
                    <h1 className="max-w-[90px] overflow-hidden whitespace-nowrap overflow-ellipsis">
                      {expense.name}
                    </h1>
                    <img src={`${iconsLink}${expense.icon}.png`} alt="icon" />
                    <p>
                      {expense.amount.toFixed(2)}
                      {expense.currency}
                    </p>
                  </button>
                ))}

              <button
                className="flex flex-col items-center cursor-pointer  hover:-translate-y-1 hover:scale-110 transition duration-300 ease-in-out"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Add new expense"
                onClick={() => {
                  handleModalOpen(true);
                }}
              >
                <h1 className="opacity-0">add</h1>
                <img src={`${iconsLink}${icons.add}.png`} alt="icon" />
                <p className="opacity-0">add</p>
              </button>
            </div>

            <button
              disabled={userExpensesState.length < pageSize + 1}
              className={
                "hover:text-stone-400" +
                (userExpensesState.length < pageSize + 1
                  ? " text-stone-400"
                  : "")
              }
              onClick={handleIncreasePageSize}
            >
              Show More
            </button>

            <br />

            <button
              disabled={userExpensesState.length < pageSize + 1}
              className={
                "hover:text-stone-400" +
                (userExpensesState.length < pageSize + 1
                  ? " text-stone-400"
                  : "")
              }
              onClick={handleShowAllExpenses}
            >
              Show All
            </button>

            <div className="m-10 mt-0 font-medium hover:text-stone-400 hover:border-[1px] hover:border-black dark:hover:border-stone-500 rounded 2xl w-[140px] h-[32px]">
              <button
                onClick={() => {
                  handleClearHistoryOrStatsFilters();
                  handleOpenItemHistory({
                    incomesExpenses: incomesExpensesFilterData[1]._id
                  });
                }}
              >
                <Link to={`/history`}>
                  <h1 className="p-1">Expenses History</h1>
                </Link>
              </button>
            </div>
          </div>
        </div>
        <AddExpenseModal
          modalIsHidden={addModalIsHidden}
          closeModal={handleModalClose}
          selectOptions={currenciesSelectOptions}
          icons={icons}
          iconsLink={iconsLink}
        />

        <ExpenseModal
          modalIsHidden={expenseModalIsHidden}
          closeModal={handleModalClose}
          expense={selectedExpense}
          selectOptions={selectOptions}
          icons={icons}
          iconsLink={iconsLink}
        />
      </div>
    );
  }
  return <Loader />;
};

export default ExpensesPage;

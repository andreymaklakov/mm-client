import React, { useState, useEffect } from "react";
import {
  allUsersExpensesIfExpensesAreDeleted,
  allUsersMoneyIfAccountsAreDeleted,
  historyFiltration,
  todayDate,
  toInputFormat
} from "../../utils";
import ChangeExpenseModal from "../expenses/changeExpenseModal";
import IncomeModal from "../income/incomeModal";
import _ from "lodash";
import HistoryTableBody from "./historyTableBody";
import HistoryTableHead from "./historyTableHead";
import FiltrationBar from "../filtrationBar";
import Loader from "../loader";
import { addSpentExpToHistory, getHistory } from "../../store/history";
import { useSelector, useDispatch } from "react-redux";
import { getMoney } from "../../store/money";
import { getExpenses } from "../../store/expenses";
import {
  changeFilter,
  clearFilterAndSetPeriod,
  getFilterData,
  getIncomesExpenses,
  getPageSize,
  getPeriod,
  increasePageSize,
  setPeriod,
  setPeriodAllTime,
  setPeriodThisMonth
} from "../../store/filtration";

const HistoryPage = () => {
  const [modalIsHidden, setModalIsHidden] = useState(true);
  const [modalIsPlus, setmodalIsPlus] = useState();
  const [sortBy, setSortBy] = useState({ path: "timeStamp", order: "desc" });
  const [expenseChangeModalIsHidden, setExpenseChangeModalIsHidden] =
    useState(true);
  const [accountParams, setAccountParams] = useState({
    accId: "",
    amount: "",
    comment: "",
    date: "",
    _id: "",
    name: "",
    timeStamp: ""
  });
  const [expenseParams, setExpenseParams] = useState({
    account: "",
    amount: "",
    comment: "",
    currency: "",
    date: "",
    expId: "",
    _id: "",
    name: "",
    timeStamp: ""
  });

  const dispatch = useDispatch();

  const userHistory = useSelector(getHistory());
  const userMoney = useSelector(getMoney());
  const userExpenses = useSelector(getExpenses());
  const filterData = useSelector(getFilterData());
  const incomesExpenses = useSelector(getIncomesExpenses());
  const period = useSelector(getPeriod());
  const pageSize = useSelector(getPageSize());

  const [accounts, setAccounts] = useState();
  const [items, setItems] = useState();

  const noFilter = { _id: "", name: "All" };

  useEffect(() => {
    dispatch(setPeriod("All Time"));
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

  const handleModalOpen = (item, symbol) => {
    item.item
      ? (setExpenseChangeModalIsHidden(false),
        setExpenseParams({
          account: item.account,
          amount: item.amount,
          comment: item.comment,
          currency: item.currency,
          date: toInputFormat(item.date),
          expId: item.item,
          _id: item._id,
          name: item.name,
          timeStamp: item.timeStamp
        }))
      : (setModalIsHidden(false),
        setmodalIsPlus(symbol),
        setAccountParams({
          accId: item.account,
          account: item.accountName,
          amount: item.amount,
          comment: item.comment,
          currency: item.currency,
          date: toInputFormat(item.date),
          _id: item._id,
          timeStamp: item.timeStamp
        }));
  };

  const handleModalClose = (setData) => {
    setData
      ? (setModalIsHidden(true),
        setData({ amount: "", comment: "", date: todayDate() }))
      : setExpenseChangeModalIsHidden(true);
  };

  const handleSpentChangeExpense = (data, expId) => {
    dispatch(addSpentExpToHistory(expId, userMoney, userExpenses, data));
  };

  const columns = {
    item: { path: "itemName", name: "Item" },
    amount: { path: "amount", name: "Amount" },
    date: { path: "timeStamp", name: "Date" },
    account: { path: "accountName", name: "Account" },
    comment: { path: "comment", name: "Comments" }
  };

  const handleSort = (item) => {
    if (sortBy.path === item) {
      setSortBy({
        ...sortBy,
        order: sortBy.order === "asc" ? "desc" : "asc"
      });
    } else {
      setSortBy({ path: item, order: "asc" });
    }
  };

  const handleChange = (target) => {
    dispatch(changeFilter(target));
  };

  const handleIncreasePageSize = (sortedHistory) => {
    dispatch(increasePageSize(sortedHistory));
  };

  const handleThisMonthHistoryOrStats = () => {
    dispatch(setPeriodThisMonth());
  };

  const handleAllTimeHistoryOrStats = () => {
    dispatch(setPeriodAllTime());
  };

  const handleClearHistoryOrStatsFilters = () => {
    dispatch(clearFilterAndSetPeriod());
  };

  if (
    incomesExpenses &&
    filterData &&
    userHistory &&
    userMoney &&
    userExpenses
  ) {
    let sortedHistory = _.orderBy(
      historyFiltration(
        filterData,
        incomesExpenses,
        period,
        userHistory,
        userMoney,
        userExpenses,
        items,
        accounts
      ),
      [sortBy.path],
      [sortBy.order]
    );

    const paginatedSortedHistory = sortedHistory.filter(
      (h, index) => index < pageSize
    );

    return (
      <div className="flex justify-center">
        <div className="bg-white dark:bg-[#40444b] dark:text-slate-300 md:min-w-[750px] w-[450px] mt-[60px] rounded-2xl shadow-xl">
          <div className="text-center">
            <h1 className="text-center font-medium	text-xl pt-3">History</h1>
            <br />

            <FiltrationBar
              data={filterData}
              onChange={handleChange}
              incomesExpenses={incomesExpenses}
              accounts={accounts}
              items={items}
              onClear={handleClearHistoryOrStatsFilters}
              onThisMonth={handleThisMonthHistoryOrStats}
              onAllTime={handleAllTimeHistoryOrStats}
              period={period}
            />

            <br />
            {paginatedSortedHistory.length ? (
              <>
                <table className="table-fixed md:border-spacing-x-10 border-spacing-x-2  border-separate text-left mb-5">
                  <HistoryTableHead
                    columns={columns}
                    onSort={handleSort}
                    sortBy={sortBy}
                  />

                  <HistoryTableBody
                    sortedHistory={paginatedSortedHistory}
                    handleModalOpen={handleModalOpen}
                  />
                </table>

                <button
                  disabled={paginatedSortedHistory.length < pageSize}
                  className={
                    "hover:text-stone-400 mb-3" +
                    (sortedHistory.length <= pageSize ? " text-stone-400" : "")
                  }
                  onClick={() => handleIncreasePageSize(sortedHistory)}
                >
                  Show More
                </button>
              </>
            ) : (
              <h1 className="text-center pb-4">You do not have history</h1>
            )}
          </div>
        </div>

        <IncomeModal
          modalIsHidden={modalIsHidden}
          modalIsPlus={modalIsPlus}
          closeModal={handleModalClose}
          accountParams={accountParams}
        />

        <ChangeExpenseModal
          modalIsHidden={expenseChangeModalIsHidden}
          closeModal={handleModalClose}
          expense={expenseParams}
          onClick={handleSpentChangeExpense}
        />
      </div>
    );
  }
  return <Loader />;
};

export default HistoryPage;

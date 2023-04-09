import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainPageIncomeAccountIcon from "./mainPageIncomeAccountIcon";
import { getStartOfMonth } from "../../utils";
import MainPageExpenses from "./mainPageExpenses";
import Loader from "../loader";
import { useSelector } from "react-redux";
import { getSignedUser } from "../../store/user";
import { getHistory, getHistoryIsLoading } from "../../store/history";
import { getMoney, getMoneyIsLoading } from "../../store/money";
import { getExpenses, getExpensesIsLoading } from "../../store/expenses";
import { icons } from "../../constantData/icons";
import { defExpenses } from "../../constantData/defaultExpenses";
import configFile from "../../config.json";

const MainPage = () => {
  const [userIncomes, setUserIncomes] = useState([]);
  const [userExpensesState, setUserExpensesState] = useState();

  const signedUser = useSelector(getSignedUser());
  const userHistory = useSelector(getHistory());
  const historyLoading = useSelector(getHistoryIsLoading());
  const userMoney = useSelector(getMoney());
  const moneyLoading = useSelector(getMoneyIsLoading());
  const userExpenses = useSelector(getExpenses());
  const expensesLoading = useSelector(getExpensesIsLoading());

  const iconsLink = `${configFile.imageApi}/icons/`;

  useEffect(() => {
    !historyLoading &&
      !moneyLoading &&
      userHistory &&
      userMoney &&
      setUserIncomes(
        userMoney
          ? userMoney.map((account) => ({
              ...account,
              amount: userHistory.incomes
                ? userHistory.incomes
                    .filter((income) => income.account === account._id)
                    .filter(
                      (income) =>
                        Date.now() - new Date(income.date) <= getStartOfMonth()
                    )
                    .reduce((accum, income) => accum + income.amount, 0)
                : 0
            }))
          : []
      );
  }, [userMoney, userHistory, signedUser]);

  useEffect(() => {
    !historyLoading &&
      !expensesLoading &&
      userHistory &&
      userExpenses &&
      setUserExpensesState(
        userExpenses
          ? userExpenses.map((expense) => ({
              ...expense,
              amount: userHistory.expenses
                ? userHistory.expenses
                    .filter((expenses) => expenses.item === expense._id)
                    .filter(
                      (expenses) =>
                        Date.now() - new Date(expenses.date) <=
                        getStartOfMonth()
                    )
                    .reduce((accum, expenses) => accum + expenses.amount, 0)
                : 0
            }))
          : []
      );
  }, [userHistory, signedUser, userExpenses]);

  if (
    signedUser
      ? icons && defExpenses && !expensesLoading && !moneyLoading && userIncomes
      : icons && defExpenses
  ) {
    return (
      <>
        <div className="grid md:grid-cols-2 sm:grid-cols-1 md:gap-[50px] gap-3 pt-10">
          <Link
            to={signedUser ? `/income` : "/login"}
            className={
              "justify-self-center md:justify-self-end" +
              (signedUser ? "" : " cursor-auto")
            }
          >
            <MainPageIncomeAccountIcon
              name="Income"
              isSigned={signedUser}
              data={userIncomes}
            />
          </Link>

          <Link
            to={signedUser ? `/accounts` : "/login"}
            className={
              "justify-self-center md:justify-self-start" +
              (signedUser ? "" : " cursor-auto")
            }
          >
            <MainPageIncomeAccountIcon
              name="Accounts"
              isSigned={signedUser}
              data={userMoney}
            />
          </Link>

          <MainPageExpenses
            userExpenses={userExpensesState}
            icons={icons}
            iconsLink={iconsLink}
            defExpenses={defExpenses}
          />
        </div>
      </>
    );
  }
  return <Loader />;
};

export default MainPage;

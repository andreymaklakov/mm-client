import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import Loader from "../loader";
import localStorageService from "../../service/localStorage.service";
import { getSignedUser, getUser, getUserIsLoading } from "../../store/user";
import {
  getHistory,
  getHistoryIsLoading,
  loadHistory
} from "../../store/history";
import {
  getMoney,
  getMoneyAmmountFromHistory,
  getMoneyIsLoading,
  loadMoney
} from "../../store/money";
import {
  getExpenses,
  getExpensesAmmountFromHistory,
  getExpensesIsLoading,
  loadExpenses
} from "../../store/expenses";

const AppLoader = ({ children }) => {
  const dispatch = useDispatch();

  const userIsLoading = useSelector(getUserIsLoading());
  const historyIsLoading = useSelector(getHistoryIsLoading());
  const moneyIsLoading = useSelector(getMoneyIsLoading());
  const userHistory = useSelector(getHistory());
  const expensesIsLoading = useSelector(getExpensesIsLoading());
  const userMoney = useSelector(getMoney());
  const userExpenses = useSelector(getExpenses());
  const signedUser = useSelector(getSignedUser());

  useEffect(() => {
    if (localStorageService.getAccessToken()) {
      dispatch(getUser());
    }
  }, []);

  useEffect(() => {
    if (signedUser) {
      dispatch(loadHistory());
      dispatch(loadMoney());
      dispatch(loadExpenses());
    }
  }, [signedUser?._id]);

  useEffect(() => {
    if (
      signedUser &&
      userMoney &&
      userMoney.length &&
      userHistory &&
      !moneyIsLoading
    ) {
      dispatch(getMoneyAmmountFromHistory());
    }
  }, [signedUser, userHistory?.incomes, userHistory?.expenses, moneyIsLoading]);

  useEffect(() => {
    if (
      signedUser &&
      userExpenses &&
      userExpenses.length &&
      userHistory &&
      !expensesIsLoading
    ) {
      dispatch(getExpensesAmmountFromHistory());
    }
  }, [signedUser, userHistory?.expenses, expensesIsLoading]);

  if (userIsLoading && historyIsLoading && moneyIsLoading && expensesIsLoading)
    return <Loader />;
  return children;
};
AppLoader.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default AppLoader;

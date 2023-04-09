import { createSlice, createAction } from "@reduxjs/toolkit";
import historyService from "../service/history.service";
import { getAccessToken } from "../service/localStorage.service";
import { toDateFormat, todayDate } from "../utils";
import { getSignedUser } from "./user";

const initialState = getAccessToken()
  ? {
      entities: null,
      isLoading: true,
      error: null
    }
  : {
      entities: null,
      isLoading: false,
      error: null
    };

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    historyRequested(state) {
      state.isLoading = true;
    },
    historyRecieved(state, action) {
      state.entities = action.payload;
      state.isLoading = false;
    },
    historyRequestFailed(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    historyDeleteRequested(state) {
      state.isLoading = true;
    },
    historyDeleteSuccessed(state, action) {
      state.entities[action.payload.itemName] = state.entities[
        action.payload.itemName
      ].filter((it) => it._id !== action.payload.item._id);
      state.isLoading = false;
    },
    historyDeleteFailed(state) {
      state.isLoading = false;
    },
    historyAddRequested(state) {
      state.isLoading = true;
    },
    historyAddFailed(state) {
      state.isLoading = false;
    },
    historyAddExpenseSuccessed(state, action) {
      state.entities.expenses = action.payload.expense._id
        ? state.entities.expenses.map((exp) =>
            exp._id === action.payload.expense._id
              ? action.payload.content
              : exp
          )
        : state.entities.expenses
        ? [...state.entities.expenses, action.payload.content]
        : [action.payload.content];

      state.isLoading = false;
    },
    historyAddIncomeSuccessed(state, action) {
      state.entities.incomes = action.payload.isChange
        ? state.entities.incomes.map((inc) =>
            inc._id === action.payload.historyId ? action.payload.content : inc
          )
        : state.entities.incomes
        ? [...state.entities.incomes, action.payload.content]
        : [action.payload.content];

      state.isLoading = false;
    },
    historyClearWhenLogoutSuccessed(state) {
      state.error = null;
      state.entities = null;
    }
  }
});

const { reducer: historyReducer, actions } = historySlice;
const {
  historyRequested,
  historyRecieved,
  historyRequestFailed,
  historyDeleteRequested,
  historyDeleteSuccessed,
  historyDeleteFailed,
  historyAddRequested,
  historyAddFailed,
  historyAddExpenseSuccessed,
  historyAddIncomeSuccessed,
  historyClearWhenLogoutSuccessed
} = actions;

const historyClearWhenLogoutRequested = createAction(
  "history/historyClearWhenLogoutRequested"
);

export const getHistory = () => (state) => state.history.entities;
export const getHistoryIsLoading = () => (state) => state.history.isLoading;

export const loadHistory = () => async (dispatch, getState) => {
  dispatch(historyRequested());

  try {
    let { content } = await historyService().get(
      getSignedUser()(getState())._id
    );

    let expenses = [];
    let incomes = [];

    content.map((item) => {
      if (item.item) {
        expenses.push(item);
      } else {
        incomes.push(item);
      }
    });

    content = { expenses, incomes };

    if (content) {
      content = {
        expenses: content.expenses?.length
          ? content.expenses.map((exp) => {
              delete exp.userId;
              return exp;
            })
          : [],
        incomes: content.incomes?.length
          ? content.incomes.map((inc) => {
              delete inc.userId;
              return inc;
            })
          : []
      };
    }

    content
      ? dispatch(historyRecieved(content))
      : dispatch(
          historyRecieved({
            expenses: [],
            incomes: []
          })
        );
  } catch (error) {
    dispatch(historyRequestFailed(error.message));
  }
};

export const addNewUserHistory = () => (dispatch) => {
  dispatch(historyRequested());

  dispatch(
    historyRecieved({
      expenses: [],
      incomes: []
    })
  );
};

export const deleteHistory = (item, itemName) => async (dispatch) => {
  dispatch(historyDeleteRequested());

  try {
    const { content } = await historyService().deleteHistory(item._id);

    if (!content) {
      dispatch(historyDeleteSuccessed({ item, itemName }));
    }
  } catch (error) {
    dispatch(historyDeleteFailed(error.message));
  }
};

export const addSpentExpToHistory =
  (data, userMoney, userExpenses, expense) => async (dispatch, getState) => {
    dispatch(historyAddRequested());

    let changedExpense;

    const spentData = {
      ...data,
      currency:
        userMoney.filter((acc) => acc._id === data.account)[0]?.currency ||
        expense.currency,
      name:
        userExpenses.filter((exp) => exp._id === data.item)[0]?.name ||
        expense.name,
      timeStamp: expense._id
        ? ((changedExpense = getHistory()(getState()).expenses.find(
            (exp) => exp._id === data._id
          )),
          changedExpense.date === data.date
            ? changedExpense.timeStamp
            : Date.parse(data.date))
        : toDateFormat(todayDate()) === data.date
        ? Date.now()
        : Date.parse(data.date),
      userId: getSignedUser()(getState())._id
    };

    try {
      delete spentData._id;

      if (expense._id) {
        await historyService().deleteHistory(expense._id);
      }

      const { content } = await historyService().putHistory(spentData);

      delete content.userId;

      dispatch(historyAddExpenseSuccessed({ content, expense }));
    } catch (error) {
      dispatch(historyAddFailed(error.message));
    }
  };

export const addIncomeToHistory =
  (historyId, accId, data, accName, accCurrency, userMoney, isChange) =>
  async (dispatch, getState) => {
    dispatch(historyAddRequested());

    let changedIncome;

    const incomeData = {
      ...data,
      account: accId,
      currency:
        userMoney.filter((acc) => acc._id === accId)[0]?.currency ||
        accCurrency,
      name: userMoney.filter((acc) => acc._id === accId)[0]?.name || accName,
      timeStamp: isChange
        ? ((changedIncome = getHistory()(getState()).incomes.find(
            (inc) => inc._id === historyId
          )),
          changedIncome.date === data.date
            ? changedIncome.timeStamp
            : Date.parse(data.date))
        : toDateFormat(todayDate()) === data.date
        ? Date.now()
        : Date.parse(data.date),
      userId: getSignedUser()(getState())._id
    };

    try {
      if (isChange) {
        await historyService().deleteHistory(historyId);
      }

      const { content } = await historyService().putHistory(incomeData);

      delete content.userId;

      dispatch(historyAddIncomeSuccessed({ content, isChange, historyId }));
    } catch (error) {
      dispatch(historyAddFailed(error.message));
    }
  };

export const clearHistoryWhenLogout = () => (dispatch) => {
  dispatch(historyClearWhenLogoutRequested());

  dispatch(historyClearWhenLogoutSuccessed());
};

export default historyReducer;

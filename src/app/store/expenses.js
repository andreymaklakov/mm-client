import { createSlice, createAction } from "@reduxjs/toolkit";
import { defExpenses } from "../constantData/defaultExpenses";
import expensesService from "../service/expenses.service";
import { getAccessToken } from "../service/localStorage.service";
import { getHistory } from "./history";
import { getSignedUser } from "./user";

const initialState = getAccessToken()
  ? {
      entities: [],
      isLoading: true,
      error: null
    }
  : {
      entities: null,
      isLoading: false,
      error: null
    };

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    expensesRequested(state) {
      state.isLoading = true;
    },
    expensesRecieved(state, action) {
      if (action.payload === null) {
        state.entities = [];
      } else {
        state.entities = action.payload;
      }

      state.isLoading = false;
    },
    expensesRequestFailed(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    expensesFromHistoryRecieved(state, action) {
      state.entities = state.entities.map((exp) => ({
        ...exp,
        amount: action.payload.expenses
          ? action.payload.expenses
              .filter((expense) => expense.item === exp._id)
              .reduce((accum, expense) => accum + expense.amount, 0)
          : 0
      }));
      state.isLoading = false;
    },
    expensesFromHistoryRequested(state) {
      state.isLoading = true;
    },
    newUserExpensesCreateRequested(state) {
      state.isLoading = true;
    },
    newUserExpensesCreateFailed(state) {
      state.isLoading = false;
    },
    newUserExpensesCreateSuccessed(state, action) {
      state.entities = action.payload;
      state.isLoading = false;
    },
    expenseDeleteRequested(state) {
      state.isLoading = true;
    },
    expenseDeleteFailed(state) {
      state.isLoading = false;
    },
    expenseDeleteSuccessed(state, action) {
      state.entities = state.entities.filter(
        (exp) => exp._id !== action.payload
      );
      state.isLoading = false;
    },
    expenseParamsChangeRequested(state) {
      state.isLoading = true;
    },
    expenseParamsChangeFailed(state) {
      state.isLoading = false;
    },
    expenseParamsChangeSuccessed(state, action) {
      state.entities = state.entities.map((expense) =>
        expense._id === action.payload._id ? action.payload : expense
      );
      state.isLoading = false;
    },
    expenseCreateRequested(state) {
      state.isLoading = true;
    },
    expenseCreateFailed(state) {
      state.isLoading = false;
    },
    expenseCreateSuccessed(state, action) {
      state.entities = state.entities
        ? [...state.entities, action.payload]
        : [action.payload];

      state.isLoading = false;
    },
    expensesClearWhenLogoutSuccessed(state) {
      state.error = null;
      state.entities = null;
    }
  }
});

const { reducer: expensesReducer, actions } = expensesSlice;
const {
  expensesRequested,
  expensesRecieved,
  expensesRequestFailed,
  expensesFromHistoryRecieved,
  expensesFromHistoryRequested,
  newUserExpensesCreateFailed,
  newUserExpensesCreateRequested,
  newUserExpensesCreateSuccessed,
  expenseDeleteRequested,
  expenseDeleteFailed,
  expenseDeleteSuccessed,
  expenseParamsChangeRequested,
  expenseParamsChangeFailed,
  expenseParamsChangeSuccessed,
  expenseCreateRequested,
  expenseCreateFailed,
  expenseCreateSuccessed,
  expensesClearWhenLogoutSuccessed
} = actions;

const expensesClearWhenLogoutRequested = createAction(
  "expenses/expensesClearWhenLogoutRequested"
);

export const loadExpenses = () => async (dispatch, getState) => {
  dispatch(expensesRequested());

  try {
    let { content } = await expensesService().get(
      getSignedUser()(getState())._id
    );

    if (content) {
      content = content.map((expense) => {
        delete expense.userId;
        return expense;
      });
    }

    dispatch(expensesRecieved(content));
  } catch (error) {
    dispatch(expensesRequestFailed(error.message));
  }
};

export const getExpensesAmmountFromHistory = () => (dispatch, getState) => {
  dispatch(expensesFromHistoryRequested());

  dispatch(expensesFromHistoryRecieved(getHistory()(getState())));
};

export const createNewUserExp = () => async (dispatch, getState) => {
  dispatch(newUserExpensesCreateRequested());

  const defaultExpenses = defExpenses.map((expense) => ({
    ...expense,
    currency: getSignedUser()(getState()).currency
  }));

  const contentArray = [];

  try {
    for (const exp of defaultExpenses) {
      delete exp._id;

      const { content } = await expensesService().createExpense({
        ...exp,
        expenseTimeStamp: Date.now(),
        userId: getSignedUser()(getState())._id
      });
      delete content.userId;
      contentArray.push(content);
    }

    dispatch(newUserExpensesCreateSuccessed(contentArray));
  } catch (error) {
    dispatch(newUserExpensesCreateFailed(error.message));
  }
};

export const deleteExpense = (data) => async (dispatch) => {
  dispatch(expenseDeleteRequested());

  try {
    const { content } = await expensesService().deleteExpense(data._id);

    if (!content) {
      dispatch(expenseDeleteSuccessed(data._id));
    }
  } catch (error) {
    dispatch(expenseDeleteFailed(error.message));
  }
};

export const changeExpeseParams = (data) => async (dispatch) => {
  dispatch(expenseParamsChangeRequested());

  try {
    const id = data._id;
    delete data._id;

    let { content } = await expensesService().changeExpenseParams(data, id);

    Array.isArray(content) ? (content = content[0]) : content;

    delete content.userId;

    dispatch(expenseParamsChangeSuccessed(content));
  } catch (error) {
    dispatch(expenseParamsChangeFailed(error.message));
  }
};

export const createExpense = (data) => async (dispatch, getState) => {
  dispatch(expenseCreateRequested());

  try {
    let { content } = await expensesService().createExpense({
      ...data,
      expenseTimeStamp: Date.now(),
      userId: getSignedUser()(getState())._id
    });

    Array.isArray(content) ? (content = content[0]) : content;

    delete content.userId;

    dispatch(expenseCreateSuccessed(content));
  } catch (error) {
    dispatch(expenseCreateFailed(error.message));
  }
};

export const clearExpensesWhenLogout = () => (dispatch) => {
  dispatch(expensesClearWhenLogoutRequested());

  dispatch(expensesClearWhenLogoutSuccessed());
};

export const getExpenses = () => (state) => state.expenses.entities;
export const getExpensesIsLoading = () => (state) => state.expenses.isLoading;

export default expensesReducer;

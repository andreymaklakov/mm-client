import { createSlice, createAction } from "@reduxjs/toolkit";
import { getAccessToken } from "../service/localStorage.service";
import usersMoneyService from "../service/usersMoney.service";
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

const moneySlice = createSlice({
  name: "money",
  initialState,
  reducers: {
    moneyRequested(state) {
      state.isLoading = true;
    },
    moneyRecieved(state, action) {
      if (action.payload === null) {
        state.entities = [];
      } else {
        state.entities = action.payload;
      }

      state.isLoading = false;
    },
    moneyRequestFailed(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    moneyFromHistoryRecieved(state, action) {
      state.entities = state.entities.map((account) => ({
        ...account,
        amount:
          (action.payload.incomes
            ? action.payload.incomes
                .filter((income) => income.account === account._id)
                .reduce((accum, income) => accum + income.amount, 0)
            : 0) -
          (action.payload.expenses
            ? action.payload.expenses
                .filter((expense) => expense.account === account._id)
                .reduce((accum, expense) => accum + expense.amount, 0)
            : 0)
      }));
      state.isLoading = false;
    },
    moneyFromHistoryRequested(state) {
      state.isLoading = true;
    },
    newUserAccsCreateRequested(state) {
      state.isLoading = true;
    },
    newUserAccsCreateFailed(state) {
      state.isLoading = false;
    },
    newUserAccsCreateSuccessed(state, action) {
      state.entities = action.payload;
      state.isLoading = false;
    },
    accountDeleteRequested(state) {
      state.isLoading = true;
    },
    accountDeleteFailed(state) {
      state.isLoading = false;
    },
    accountDeleteSuccessed(state, action) {
      state.entities = state.entities.filter(
        (acc) => acc._id !== action.payload
      );
      state.isLoading = false;
    },
    accountRenameRequested(state) {
      state.isLoading = true;
    },
    accountRenameFailed(state) {
      state.isLoading = false;
    },
    accountRenameSuccessed(state, action) {
      state.entities = state.entities.map((account) =>
        account._id === action.payload._id
          ? { ...account, name: action.payload.name }
          : { ...account }
      );
      state.isLoading = false;
    },
    accountCreateRequested(state) {
      state.isLoading = true;
    },
    accountCreateFailed(state) {
      state.isLoading = false;
    },
    accountCreateSuccessed(state, action) {
      state.entities = state.entities
        ? [...state.entities, action.payload]
        : [action.payload];

      state.isLoading = false;
    },
    moneyClearWhenLogoutSuccessed(state) {
      state.error = null;
      state.entities = null;
    }
  }
});

const { reducer: moneyReducer, actions } = moneySlice;
const {
  moneyRequested,
  moneyRecieved,
  moneyRequestFailed,
  moneyFromHistoryRecieved,
  moneyFromHistoryRequested,
  newUserAccsCreateFailed,
  newUserAccsCreateRequested,
  newUserAccsCreateSuccessed,
  accountDeleteRequested,
  accountDeleteFailed,
  accountDeleteSuccessed,
  accountRenameRequested,
  accountRenameFailed,
  accountRenameSuccessed,
  accountCreateRequested,
  accountCreateFailed,
  accountCreateSuccessed,
  moneyClearWhenLogoutSuccessed
} = actions;

const moneyClearWhenLogoutRequested = createAction(
  "money/moneyClearWhenLogoutRequested"
);

export const loadMoney = () => async (dispatch, getState) => {
  dispatch(moneyRequested());

  try {
    let { content } = await usersMoneyService().get(
      getSignedUser()(getState())._id
    );

    if (content) {
      content = content.map((account) => {
        delete account.userId;
        return account;
      });
    }

    dispatch(moneyRecieved(content));
  } catch (error) {
    dispatch(moneyRequestFailed(error.message));
  }
};

export const getMoneyAmmountFromHistory = () => (dispatch, getState) => {
  dispatch(moneyFromHistoryRequested());

  dispatch(moneyFromHistoryRecieved(getHistory()(getState())));
};

export const createNewUserAccs = (data) => async (dispatch, getState) => {
  dispatch(newUserAccsCreateRequested());

  const contentArray = [];

  try {
    for (const acc of data) {
      const { content } = await usersMoneyService().createAccount({
        ...acc,
        accountTimeStamp: Date.now(),
        userId: getSignedUser()(getState())._id
      });
      delete content.userId;
      contentArray.push(content);
    }

    dispatch(newUserAccsCreateSuccessed(contentArray));
  } catch (error) {
    dispatch(newUserAccsCreateFailed(error.message));
  }
};

export const deleteAccount = (id) => async (dispatch) => {
  dispatch(accountDeleteRequested());

  try {
    const { content } = await usersMoneyService().deleteAccount(id);

    if (!content) {
      dispatch(accountDeleteSuccessed(id));
    }
  } catch (error) {
    dispatch(accountDeleteFailed(error.message));
  }
};

export const renameAccount = (data) => async (dispatch) => {
  dispatch(accountRenameRequested());

  try {
    const id = data._id;
    delete data._id;

    let { content } = await usersMoneyService().renameAccount(data, id);

    Array.isArray(content) ? (content = content[0]) : content;

    delete content.userId;

    dispatch(accountRenameSuccessed(content));
  } catch (error) {
    dispatch(accountRenameFailed(error.message));
  }
};

export const createAccount = (data) => async (dispatch, getState) => {
  dispatch(accountCreateRequested());

  try {
    let { content } = await usersMoneyService().createAccount({
      ...data,
      accountTimeStamp: Date.now(),
      userId: getSignedUser()(getState())._id
    });

    Array.isArray(content) ? (content = content[0]) : content;

    delete content.userId;

    dispatch(accountCreateSuccessed(content));
  } catch (error) {
    dispatch(accountCreateFailed(error.message));
  }
};

export const clearMoneyWhenLogout = () => (dispatch) => {
  dispatch(moneyClearWhenLogoutRequested());

  dispatch(moneyClearWhenLogoutSuccessed());
};

export const getMoney = () => (state) => state.money.entities;
export const getMoneyIsLoading = () => (state) => state.money.isLoading;

export default moneyReducer;

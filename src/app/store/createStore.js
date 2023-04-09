import { combineReducers, configureStore } from "@reduxjs/toolkit";
import expensesReducer from "./expenses";
import filtrationReducer from "./filtration";
import historyReducer from "./history";
import moneyReducer from "./money";
import userReducer from "./user";

const rootReducer = combineReducers({
  user: userReducer,
  history: historyReducer,
  money: moneyReducer,
  expenses: expensesReducer,
  filtration: filtrationReducer
});

function createStore() {
  return configureStore({
    reducer: rootReducer,
    // eslint-disable-next-line no-undef
    devTools: process.env.NODE_ENV !== "production"
  });
}

export default createStore;

import { createSlice, createAction } from "@reduxjs/toolkit";
import { incomesExpensesFilterData } from "../constantData/filterData";

const noFilter = { _id: "", name: "All" };

const filtrationSlice = createSlice({
  name: "filtration",
  initialState: {
    incomesExpenses: [noFilter, ...incomesExpensesFilterData],
    period: "",
    pageSize: 10,
    filterData: {
      accounts: "",
      dateFrom: "",
      dateTo: "",
      incomesExpenses: "",
      items: ""
    }
  },
  reducers: {
    filterClearSuccessed(state) {
      state.filterData = {
        accounts: "",
        dateFrom: "",
        dateTo: "",
        incomesExpenses: "",
        items: ""
      };
    },
    itemHistoryOpenSuccessed(state, action) {
      state.filterData = { ...state.filterData, ...action.payload };
    },
    filterChangeSuccessed(state, action) {
      state.filterData = {
        ...state.filterData,
        [action.payload.name]: action.payload.value
      };

      if (
        action.payload.name === "dateTo" ||
        action.payload.name === "dateFrom"
      ) {
        state.period = "";
      }

      state.pageSize = 10;
    },
    periodSetSuccessed(state, action) {
      state.period = action.payload;
    },
    pageSizeIncreaseSuccessed(state, action) {
      if (action.payload.length > state.pageSize) {
        state.pageSize = state.pageSize + 10;
      }
    },
    dateClearSuccessed(state) {
      state.filterData = { ...state.filterData, dateFrom: "", dateTo: "" };
    }
  }
});

const { reducer: filtrationReducer, actions } = filtrationSlice;
const {
  filterClearSuccessed,
  itemHistoryOpenSuccessed,
  filterChangeSuccessed,
  periodSetSuccessed,
  pageSizeIncreaseSuccessed,
  dateClearSuccessed
} = actions;

const filterClearRequested = createAction("filtration/filterClearRequested");
const itemHistoryOpenRequested = createAction(
  "filtration/itemHistoryOpenRequested"
);
const filterChangeRequested = createAction("filtration/filterChangeRequested");
const periodSetRequested = createAction("filtration/periodSetRequested");
const pageSizeIncreaseRequested = createAction(
  "filtration/pageSizeIncreaseRequested"
);

const clearFilter = () => (dispatch) => {
  dispatch(filterClearRequested());

  dispatch(filterClearSuccessed());
};

export const openItemHistory = (data) => (dispatch) => {
  dispatch(itemHistoryOpenRequested());

  dispatch(filterClearSuccessed());
  dispatch(itemHistoryOpenSuccessed(data));
};

export const changeFilter =
  ({ target }) =>
  (dispatch) => {
    dispatch(filterChangeRequested());

    dispatch(filterChangeSuccessed({ name: target.name, value: target.value }));
  };

export const setPeriodThisMonth = () => (dispatch) => {
  dispatch(periodSetRequested());

  dispatch(periodSetSuccessed("This Month"));
  dispatch(dateClearSuccessed());
};

export const setPeriodAllTime = () => (dispatch) => {
  dispatch(periodSetRequested());

  dispatch(periodSetSuccessed("All Time"));
  dispatch(dateClearSuccessed());
};

export const clearFilterAndSetPeriod = (historyOrStats) => (dispatch) => {
  dispatch(filterClearRequested());

  dispatch(clearFilter());

  dispatch(
    periodSetSuccessed(historyOrStats === "stats" ? "This Month" : "All Time")
  );
};

export const increasePageSize = (sortedHistory) => (dispatch) => {
  dispatch(pageSizeIncreaseRequested());

  dispatch(pageSizeIncreaseSuccessed(sortedHistory));
};

export const setPeriod = (data) => (dispatch) => {
  dispatch(periodSetRequested());

  dispatch(periodSetSuccessed(data));
};

export const getIncomesExpenses = () => (state) =>
  state.filtration.incomesExpenses;
export const getFilterData = () => (state) => state.filtration.filterData;
export const getPeriod = () => (state) => state.filtration.period;
export const getPageSize = () => (state) => state.filtration.pageSize;

export default filtrationReducer;

import React from "react";
import SelectField from "./forms/selectField";
import TextField from "./forms/textField";
import PropTypes from "prop-types";

const FiltrationBar = ({
  data,
  onChange,
  incomesExpenses,
  accounts,
  items,
  onClear,
  onThisMonth,
  onAllTime,
  period
}) => {
  return (
    <>
      <div className="md:justify-between justify-center flex md:flex-row flex-wrap items-center w-auto mx-5">
        <div className="block md:inline-block mr-2 mb-2">
          <SelectField
            options={incomesExpenses}
            name="incomesExpenses"
            value={data.incomesExpenses}
            onChange={onChange}
            defaultOption={"Select Inc/Exp"}
          />
        </div>

        <div className="block md:inline-block md:mr-2 mb-2">
          <SelectField
            options={accounts}
            name="accounts"
            value={data.accounts}
            onChange={onChange}
            defaultOption={"Select Account"}
          />
        </div>

        <div className="block md:inline-block mr-2  md:mt-[-7px]">
          <SelectField
            options={items}
            name="items"
            value={data.items}
            onChange={onChange}
            defaultOption={"Select Expense"}
          />
        </div>

        <div className="block md:inline-block md:mt-[-7px]">
          <button
            onClick={onClear}
            className="inline-block appearance-none bg-gray-300 dark:bg-gray-600 border-gray-400 hover:border-gray-500 px-4 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline cursor-pointer border py-2"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="md:justify-between justify-center flex md:flex-row flex-wrap items-center w-auto mx-5">
        <div className="flex">
          <div className="inline mr-2">
            <TextField
              label="Date From"
              type="date"
              name="dateFrom"
              value={data.dateFrom}
              onChange={onChange}
            />
          </div>

          <TextField
            label="Date To"
            type="date"
            name="dateTo"
            value={data.dateTo}
            onChange={onChange}
          />
        </div>

        <div className="flex">
          <div className="block md:inline-block md:mt-6 mr-2">
            <button
              onClick={onThisMonth}
              className={
                "inline-block appearance-none px-4 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline cursor-pointer border py-2" +
                (period === "This Month"
                  ? " border-blue-600 dark:border-gray-600 bg-blue-300 dark:bg-stone-700"
                  : " border-gray-400 dark:border-gray-400 bg-gray-400 hover:border-blue-600 dark:hover:border-stone-500 hover:bg-blue-200 dark:hover:bg-stone-700")
              }
            >
              This Month
            </button>
          </div>

          <div className="block md:inline-block md:mt-6">
            <button
              onClick={onAllTime}
              className={
                "inline-block appearance-none px-4 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline cursor-pointer border py-2" +
                (period === "All Time"
                  ? " border-blue-600 dark:border-gray-600 bg-blue-300 dark:bg-stone-700"
                  : " border-gray-400 dark:border-gray-400 bg-gray-400 hover:border-blue-600 dark:hover:border-stone-500 hover:bg-blue-200 dark:hover:bg-stone-700")
              }
            >
              All Time
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

FiltrationBar.propTypes = {
  data: PropTypes.object,
  onChange: PropTypes.func,
  incomesExpenses: PropTypes.array,
  accounts: PropTypes.array,
  items: PropTypes.array,
  onClear: PropTypes.func,
  onThisMonth: PropTypes.func,
  onAllTime: PropTypes.func,
  period: PropTypes.string,
  page: PropTypes.string
};

export default FiltrationBar;

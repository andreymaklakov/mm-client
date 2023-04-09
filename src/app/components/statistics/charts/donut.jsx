import React from "react";
import {
  Chart,
  ChartTitle,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
  ChartSeriesLabels,
  ChartTooltip
} from "@progress/kendo-react-charts";
import { filteredPerAccountUserExpenses, getRandomColor } from "../../../utils";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getHistory } from "../../../store/history";

const Donut = ({ filterData, period, renderHeader, items }) => {
  const userHistory = useSelector(getHistory());

  let filteredPerAccUserExp = filteredPerAccountUserExpenses(
    userHistory.expenses,
    filterData,
    period
  );

  const repeatedItems = [
    ...new Set(
      filteredPerAccUserExp
        .map((exp) => exp.item)
        .filter((exp, i, arr) => arr.indexOf(exp) !== arr.lastIndexOf(exp))
    )
  ];

  let calculatedExpensesData = [];

  if (!repeatedItems.length) {
    calculatedExpensesData = [...filteredPerAccUserExp];
  }

  filteredPerAccUserExp.map((expense) => {
    if (
      !repeatedItems.includes(expense.item) &&
      !JSON.stringify(calculatedExpensesData).includes(JSON.stringify(expense))
    ) {
      calculatedExpensesData.push(expense);
    }
  });

  for (let i = 0; i < repeatedItems.length; i++) {
    const array = filteredPerAccUserExp.filter(
      (exp) => exp.item === repeatedItems[i]
    );
    const result = {
      ...array[0],
      amount: array.reduce((accum, data) => accum + data.amount, 0)
    };
    if (
      !JSON.stringify(calculatedExpensesData).includes(JSON.stringify(result))
    ) {
      calculatedExpensesData.push(result);
    }
  }

  const data = [
    ...calculatedExpensesData.map((expense) => ({
      status: expense.name,
      value: expense.amount.toFixed(2),
      color: getRandomColor()
    }))
  ];

  const labelContent = (e) => e.category;

  const renderTooltip = (context) => {
    const { category, value } = context.point || context;

    return (
      <div>
        {category}: {value}
        {items[0]?.currency}
      </div>
    );
  };

  return (
    <Chart>
      <ChartTitle text={renderHeader} />

      <ChartLegend visible={true} />

      <ChartTooltip render={renderTooltip} />

      <ChartSeries>
        <ChartSeriesItem
          type="donut"
          data={data}
          categoryField="status"
          field="value"
        >
          <ChartSeriesLabels background="white" content={labelContent} />
        </ChartSeriesItem>
      </ChartSeries>
    </Chart>
  );
};

Donut.propTypes = {
  filterData: PropTypes.object,
  period: PropTypes.string,
  renderHeader: PropTypes.string,
  items: PropTypes.array
};

export default Donut;

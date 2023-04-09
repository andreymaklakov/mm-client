import React, { useEffect, useState } from "react";
import {
  Chart,
  ChartTitle,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartCategoryAxisTitle
} from "@progress/kendo-react-charts";
import PropTypes from "prop-types";

const Column = ({
  expensesData,
  incomesData,
  showIncomes,
  showExpenses,
  filterData,
  renderHeader
}) => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const incomes = {
      color: "#2564EB",
      data: incomesData.map((item) =>
        Number(
          item
            .split("")
            .splice(0, item.length - 2)
            .join("")
        ).toFixed(2)
      ),
      name: "Incomes"
    };
    const expenses = {
      color: "#B91C1C",
      data: expensesData.map((item) =>
        Number(
          item
            .split("")
            .splice(0, item.length - 2)
            .join("")
        ).toFixed(2)
      ),
      name: "Expenses"
    };

    if (showIncomes && showExpenses) {
      setData([{ ...incomes }, { ...expenses }]);
    } else if (showExpenses && !showIncomes) {
      setData([{ ...expenses }]);
    } else if (!showExpenses && showIncomes) {
      setData([{ ...incomes }]);
    } else if (!showExpenses && filterData.items) {
      setData([]);
    }

    showIncomes
      ? setCategories([
          ...incomesData.map((item) =>
            item.split("").splice(item.length - 2, 1)
          )
        ])
      : setCategories([
          ...expensesData.map((item) =>
            item.split("").splice(item.length - 2, 1)
          )
        ]);
  }, [expensesData, incomesData, showIncomes, showExpenses]);

  const dataLabels = {
    visible: true,
    padding: 3,
    font: "normal 16px Arial, sans-serif",
    position: "center"
  };

  return (
    <Chart>
      <ChartTitle text={renderHeader} />
      <ChartLegend position="top" visible={true} />
      <ChartCategoryAxis>
        <ChartCategoryAxisItem categories={categories}>
          <ChartCategoryAxisTitle text="Currencies" />
        </ChartCategoryAxisItem>
      </ChartCategoryAxis>

      <ChartSeries>
        {data.map((item, i) => (
          <ChartSeriesItem
            key={i}
            type="column"
            gap={5}
            spacing={1}
            tooltip={{ visible: true }}
            labels={dataLabels}
            data={item.data}
            name={item.name}
            color={item.color}
          />
        ))}
      </ChartSeries>
    </Chart>
  );
};

Column.propTypes = {
  expensesData: PropTypes.array,
  incomesData: PropTypes.array,
  showIncomes: PropTypes.bool,
  showExpenses: PropTypes.bool,
  filterData: PropTypes.object,
  renderHeader: PropTypes.string
};

export default Column;

import React, { useEffect, useState } from "react";
import {
  Chart,
  ChartTitle,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
  ChartValueAxis,
  ChartValueAxisItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem
} from "@progress/kendo-react-charts";
import PropTypes from "prop-types";
import {
  dateFromDateToDifferenceIsLessThanOneYear,
  dateFromIsMoreThanOneYearAgo,
  dateFromMonth,
  dateToMonth,
  monthsData,
  toDateFormat
} from "../../../utils";
import { useSelector } from "react-redux";
import { getHistory } from "../../../store/history";
import { getMoney } from "../../../store/money";
import { getExpenses } from "../../../store/expenses";

const Line = ({
  period,
  filterData,
  showIncomes,
  showExpenses,
  renderHeader,
  accounts,
  items
}) => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currency, setCurrency] = useState("");

  const userHistory = useSelector(getHistory());
  const userMoney = useSelector(getMoney());
  const userExpenses = useSelector(getExpenses());

  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    if (filterData.accounts) {
      setCurrency(
        accounts.filter((acc) => acc._id === filterData.accounts)[0]?.currency
      );
      return;
    } else if (filterData.items) {
      setCurrency(
        items.filter((exp) => exp._id === filterData.items)[0]?.currency
      );
      return;
    } else {
      setCurrency(accounts[0]?.currency);
    }
  }, [filterData]);

  const calculatedMonthsData = monthsData(
    filterData,
    currentMonth,
    showIncomes,
    showExpenses,
    userHistory,
    userMoney,
    userExpenses
  );

  const sortedMonthsDataPerMonth = () => {
    if (
      dateFromIsMoreThanOneYearAgo(filterData) &&
      !dateFromDateToDifferenceIsLessThanOneYear(filterData)
    ) {
      const monthsAfterDateFromMonth = calculatedMonthsData.filter(
        (month) => month.index >= dateFromMonth(filterData)
      );
      const monthsBeforeDateFromMonth = calculatedMonthsData.filter(
        (month) => month.index < dateFromMonth(filterData)
      );

      return [...monthsAfterDateFromMonth, ...monthsBeforeDateFromMonth];
    } else if (filterData.dateTo) {
      const monthsAfterDateToMonth = calculatedMonthsData.filter(
        (month) => month.index > dateToMonth(filterData)
      );
      const monthsBeforeDateToMonth = calculatedMonthsData.filter(
        (month) => month.index <= dateToMonth(filterData)
      );

      return [...monthsAfterDateToMonth, ...monthsBeforeDateToMonth];
    } else {
      const monthsBeforeCurrentMonth = calculatedMonthsData.filter(
        (month) => month.index <= currentMonth
      );
      const monthsAfterCurrentMonth = calculatedMonthsData.filter(
        (month) => month.index > currentMonth
      );

      return [...monthsAfterCurrentMonth, ...monthsBeforeCurrentMonth];
    }
  };

  const sortedDataPerTimePeriod = () => {
    if (period === "This Month") {
      return sortedMonthsDataPerMonth().filter(
        (month) => month.index === currentMonth
      );
    }
    if (period === "All Time" || (filterData.dateTo && !filterData.dateFrom)) {
      return sortedMonthsDataPerMonth();
    }
    if (filterData.dateFrom) {
      if (
        new Date(toDateFormat(filterData.dateFrom)) - Date.now() > 0 ||
        new Date(toDateFormat(filterData.dateFrom)) -
          new Date(toDateFormat(filterData.dateTo)) >
          0
      ) {
        return sortedMonthsDataPerMonth().filter(
          (month) => month.index === 100
        );
      } else {
        const index = sortedMonthsDataPerMonth()
          .map((month, i) => {
            if (month.index === dateFromMonth(filterData)) {
              return i;
            }
          })
          .filter((i) => i)
          .join("");

        return sortedMonthsDataPerMonth().slice(Number(index));
      }
    }
  };

  useEffect(() => {
    sortedDataPerTimePeriod() &&
      setData([
        showIncomes && {
          color: "#2564EB",
          data: sortedDataPerTimePeriod().map((month) =>
            month.incomesAmount.toFixed(2)
          ),
          name: "Incomes"
        },
        showExpenses && {
          color: "#B91C1C",
          data: sortedDataPerTimePeriod().map((month) =>
            month.expensesAmount.toFixed(2)
          ),
          name: "Expenses"
        }
      ]);

    setCategories(sortedDataPerTimePeriod().map((month) => month.name));
  }, [period, filterData]);

  return (
    <Chart>
      <ChartTitle text={renderHeader} />
      <ChartLegend position="top" orientation="horizontal" />

      <ChartValueAxis>
        <ChartValueAxisItem title={{ text: `Amount in ${currency}` }} min={0} />
      </ChartValueAxis>

      <ChartCategoryAxis>
        <ChartCategoryAxisItem categories={categories} />
      </ChartCategoryAxis>

      <ChartSeries>
        {data.map((item, i) => (
          <ChartSeriesItem
            key={i}
            type="line"
            tooltip={{ visible: true }}
            data={item.data}
            name={item.name}
          />
        ))}
      </ChartSeries>
    </Chart>
  );
};

Line.propTypes = {
  period: PropTypes.string,
  filterData: PropTypes.object,
  showIncomes: PropTypes.bool,
  showExpenses: PropTypes.bool,
  renderHeader: PropTypes.string,
  accounts: PropTypes.array,
  items: PropTypes.array
};

export default Line;

import React, { useEffect, useState } from "react";
import Column from "./charts/column";
import Line from "./charts/line";
import Donut from "./charts/donut";
import PropTypes from "prop-types";
import { currencyIsOnlyOne, renderHeader } from "../../utils";
import ChartsChooseBar from "./chartsChooseBar";

const ChartsRender = ({
  expensesData,
  incomesData,
  filterData,
  showIncomes,
  showExpenses,
  period,
  accounts,
  items
}) => {
  const [accountName, setAccountName] = useState("");
  const [itemName, setItemName] = useState("");
  const [showColumnChart, setShowColumnChart] = useState(true);
  const [showLineChart, setShowLineChart] = useState(false);
  const [showDonutChart, setShowDonutChart] = useState(false);
  const [lineChartIsDisabled, setLineChartIsDisabled] = useState(false);
  const [donutChartIsDisabled, setDonutChartIsDisabled] = useState(false);

  const accountsCurrencyIsOnlyOne = () => {
    return currencyIsOnlyOne(accounts);
  };
  const expensesCurrencyIsOnlyOne = () => {
    return currencyIsOnlyOne(items);
  };

  useEffect(() => {
    filterData.accounts &&
      setAccountName(
        accounts.filter((acc) => acc._id === filterData.accounts)[0]?.name
      );

    filterData.items &&
      setItemName(items.filter((exp) => exp._id === filterData.items)[0]?.name);

    setLineChartIsDisabled(() => {
      if (
        showIncomes &&
        showExpenses &&
        !filterData.accounts &&
        !filterData.items &&
        (!accountsCurrencyIsOnlyOne() || !expensesCurrencyIsOnlyOne())
      ) {
        showLineChart && (setShowColumnChart(true), setShowLineChart(false));
        return true;
      } else if (
        showIncomes &&
        !showExpenses &&
        !filterData.accounts &&
        !accountsCurrencyIsOnlyOne()
      ) {
        showLineChart && (setShowColumnChart(true), setShowLineChart(false));
        return true;
      } else if (
        !showIncomes &&
        showExpenses &&
        !filterData.items &&
        !filterData.accounts &&
        !expensesCurrencyIsOnlyOne()
      ) {
        showLineChart && (setShowColumnChart(true), setShowLineChart(false));
        return true;
      } else {
        return false;
      }
    });

    setDonutChartIsDisabled(() => {
      if (showIncomes || filterData.items) {
        showDonutChart && (setShowColumnChart(true), setShowDonutChart(false));
        return true;
      } else if (
        !showIncomes &&
        showExpenses &&
        !filterData.accounts &&
        !expensesCurrencyIsOnlyOne()
      ) {
        showDonutChart && (setShowColumnChart(true), setShowDonutChart(false));
        return true;
      } else {
        return false;
      }
    });
  }, [filterData]);

  const handleShowColumnChart = () => {
    setShowColumnChart(true);
    setShowLineChart(false);
    setShowDonutChart(false);
  };

  const handleShowLineChart = () => {
    setShowLineChart(true);
    setShowColumnChart(false);
    setShowDonutChart(false);
  };

  const handleShowDonutChart = () => {
    setShowDonutChart(true);
    setShowColumnChart(false);
    setShowLineChart(false);
  };

  return (
    <>
      <ChartsChooseBar
        handleShowColumnChart={handleShowColumnChart}
        showColumnChart={showColumnChart}
        handleShowLineChart={handleShowLineChart}
        showLineChart={showLineChart}
        lineChartIsDisabled={lineChartIsDisabled}
        handleShowDonutChart={handleShowDonutChart}
        showDonutChart={showDonutChart}
        donutChartIsDisabled={donutChartIsDisabled}
      />

      <div className="mt-3 md:w-auto w-[400px]">
        {showColumnChart && (
          <Column
            expensesData={expensesData}
            incomesData={incomesData}
            filterData={filterData}
            showIncomes={showIncomes}
            showExpenses={showExpenses}
            renderHeader={renderHeader(
              false,
              showExpenses,
              filterData,
              accountName,
              itemName,
              showIncomes,
              period
            )}
          />
        )}

        {showLineChart && (
          <Line
            filterData={filterData}
            period={period}
            showIncomes={showIncomes}
            showExpenses={showExpenses}
            renderHeader={renderHeader(
              true,
              showExpenses,
              filterData,
              accountName,
              itemName,
              showIncomes,
              period
            )}
            accounts={accounts}
            items={items}
          />
        )}

        {showDonutChart && (
          <Donut
            filterData={filterData}
            period={period}
            renderHeader={renderHeader(
              false,
              showExpenses,
              filterData,
              accountName,
              itemName,
              showIncomes,
              period
            )}
            items={items}
          />
        )}
      </div>
    </>
  );
};

ChartsRender.propTypes = {
  expensesData: PropTypes.array,
  incomesData: PropTypes.array,
  showIncomes: PropTypes.bool,
  showExpenses: PropTypes.bool,
  filterData: PropTypes.object,
  period: PropTypes.string,
  accounts: PropTypes.array,
  items: PropTypes.array
};

export default ChartsRender;

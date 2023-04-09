import React from "react";
import PropTypes from "prop-types";

const ChartsChooseBar = ({
  handleShowColumnChart,
  showColumnChart,
  handleShowLineChart,
  showLineChart,
  lineChartIsDisabled,
  handleShowDonutChart,
  showDonutChart,
  donutChartIsDisabled
}) => {
  return (
    <div className="mx-[25px] md:mx-[0px] md:justify-center flex flex-wrap">
      <div className="block md:inline-block md:mt-6 mr-2 md:w-auto w-[120px]">
        <button
          onClick={handleShowColumnChart}
          className={
            "inline-block appearance-none px-4 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline cursor-pointer border py-2" +
            (showColumnChart
              ? " border-red-600 bg-red-300 dark:border-zinc-300 dark:bg-zinc-600 "
              : " border-gray-400 bg-gray-300 hover:border-red-600 hover:bg-red-200 dark:bg-zinc-400 dark:border-zinc-300 dark:hover:bg-zinc-500")
          }
        >
          Column Chart
        </button>
      </div>

      <div className="block md:inline-block md:mt-6 mr-2 md:w-auto w-[120px]">
        <button
          onClick={handleShowLineChart}
          className={
            "inline-block appearance-none px-4 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline border py-2" +
            (!lineChartIsDisabled
              ? showLineChart
                ? " cursor-pointer border-red-600 bg-red-300 dark:border-zinc-300 dark:bg-zinc-600 "
                : " cursor-pointer border-gray-400 bg-gray-300 hover:border-red-600 hover:bg-red-200 dark:bg-zinc-400 dark:border-zinc-300 dark:hover:bg-zinc-500"
              : lineChartIsDisabled
              ? " cursor-auto border-gray-300 dark:border-zinc-200 bg-gray-200 dark:bg-zinc-200 hover:border-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-200 "
              : "")
          }
          disabled={lineChartIsDisabled}
        >
          Line Chart
        </button>
      </div>

      <div className="block md:inline-block md:mt-6 md:w-auto w-[120px]">
        <button
          onClick={handleShowDonutChart}
          className={
            "inline-block appearance-none px-4 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline border py-2" +
            (!donutChartIsDisabled
              ? showDonutChart
                ? " cursor-pointer border-red-600 bg-red-300 dark:border-zinc-300 dark:bg-zinc-600 "
                : " cursor-pointer border-gray-400 bg-gray-300 hover:border-red-600 hover:bg-red-200 dark:bg-zinc-400 dark:border-zinc-300 dark:hover:bg-zinc-500"
              : donutChartIsDisabled
              ? " cursor-auto border-gray-300 dark:border-zinc-200 bg-gray-200 dark:bg-zinc-200 hover:border-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-200 "
              : "")
          }
          disabled={donutChartIsDisabled}
        >
          Donut Chart
        </button>
      </div>
    </div>
  );
};

ChartsChooseBar.propTypes = {
  handleShowColumnChart: PropTypes.func,
  showColumnChart: PropTypes.bool,
  handleShowLineChart: PropTypes.func,
  showLineChart: PropTypes.bool,
  lineChartIsDisabled: PropTypes.bool,
  handleShowDonutChart: PropTypes.func,
  showDonutChart: PropTypes.bool,
  donutChartIsDisabled: PropTypes.bool
};

export default ChartsChooseBar;

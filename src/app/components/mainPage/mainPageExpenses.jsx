import React from "react";
import { totalCalc } from "../../utils";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import _ from "lodash";
import { getSignedUser } from "../../store/user";

const MainPageExpenses = ({ userExpenses, icons, iconsLink, defExpenses }) => {
  const signedUser = useSelector(getSignedUser());

  const sortBy = { path: "expenseTimeStamp", order: "asc" };

  let sortedUserExpenses = _.orderBy(
    userExpenses,
    [sortBy.path],
    [sortBy.order]
  );

  return (
    <div
      className={
        "dark:text-slate-300  md:col-start-1 md:col-end-3 justify-self-center dark:bg-[#40444b] bg-white md:w-[680px] w-[300px] max-h-[310px] overflow-y-hidden rounded-2xl shadow-xl py-3 m-5 my-4 md:my-0" +
        (signedUser
          ? " hover:-translate-y-1 hover:scale-110 transition duration-300 ease-in-out"
          : "")
      }
    >
      <Link
        to={signedUser ? `/expenses` : "/login"}
        className={signedUser ? "" : "cursor-auto"}
      >
        <div>
          <h1 className="text-center font-medium	text-xl">Expenses</h1>
          <br />
          <table className="table-auto border-spacing-x-10 border-separate ">
            <tbody>
              <tr>
                <td className="text-lg font-medium">Total Spent</td>
                <td className="text-lg font-medium">
                  {signedUser
                    ? sortedUserExpenses && sortedUserExpenses.length
                      ? totalCalc(sortedUserExpenses).map(
                          (arr) => arr.join("") + " "
                        )
                      : 0 + `$`
                    : 0 + `$`}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="grid grid-cols-3 md:grid-cols-7 gap-4 justify-items-center m-5">
            {(signedUser ? sortedUserExpenses : defExpenses)?.map((expense) => (
              <div className="flex flex-col items-center" key={expense._id}>
                <h1 className="max-w-[90px] overflow-hidden whitespace-nowrap overflow-ellipsis">
                  {expense.name}
                </h1>
                <img src={`${iconsLink}${expense.icon}.png`} alt="icon" />
                <p>
                  {expense.amount?.toFixed(2)}
                  {expense.currency}
                </p>
              </div>
            ))}
            <div className="flex flex-col items-center">
              <h1 className="opacity-0">add</h1>
              <img src={`${iconsLink}${icons.add}.png`} alt="icon" />
              <p className="opacity-0">add</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

MainPageExpenses.propTypes = {
  userExpenses: PropTypes.array,
  icons: PropTypes.object,
  defExpenses: PropTypes.array,
  iconsLink: PropTypes.string
};

export default MainPageExpenses;

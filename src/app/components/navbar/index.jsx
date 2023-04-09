import React from "react";
import { Link } from "react-router-dom";
import { getSignedUser, logOut } from "../../store/user";
import { useSelector, useDispatch } from "react-redux";
import { clearFilterAndSetPeriod } from "../../store/filtration";
import { clearHistoryWhenLogout } from "../../store/history";
import { clearMoneyWhenLogout } from "../../store/money";
import { clearExpensesWhenLogout } from "../../store/expenses";
import configFile from "../../config.json";

const NavBar = () => {
  const signedUser = useSelector(getSignedUser());

  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(logOut());
    dispatch(clearHistoryWhenLogout());
    dispatch(clearMoneyWhenLogout());
    dispatch(clearExpensesWhenLogout());
  };

  const handleClearHistoryOrStatsFilters = (data) => {
    dispatch(clearFilterAndSetPeriod(data));
  };

  return (
    <nav className="bg-white dark:bg-[#202225] flex items-center justify-between flex-wrap p-1 shadow-md">
      <div className="h-12 w-40 flex items-center flex-shrink-0 mt-[3px] mr-6">
        <button>
          <Link to={"/main"}>
            <img
              src={`${configFile.imageApi}/logo/logo.png`}
              alt="logo"
              className="opacity-100 dark:opacity-50 rounded-none dark:rounded-md"
            />
          </Link>
        </button>
      </div>
      <div className="w-full block flex-grow md:flex md:items-center md:w-auto">
        <div className="md:flex-grow">
          <Link
            to={"/main"}
            className=" dark:text-slate-300 dark:hover:text-stone-400 block mt-2 text-lg md:inline-block md:mt-0 hover:text-stone-400  md:mr-4 border-b-[1px] border-black dark:border-stone-500 md:border-0"
          >
            Main
          </Link>

          <div
            className={
              " dark:hover:text-stone-400 dark:text-slate-300 block mt-2 text-lg md:inline-block md:mt-0 hover:text-stone-400 md:mr-4 border-b-[1px] border-black dark:border-stone-500 md:border-0" +
              (signedUser ? "" : " text-stone-400 dark:text-stone-500")
            }
          >
            <button className="cursor-auto">
              <Link
                to={`/history`}
                className={signedUser ? "" : " cursor-auto "}
                onClick={handleClearHistoryOrStatsFilters}
              >
                Payment history
              </Link>
            </button>
          </div>

          <div
            className={
              "  dark:hover:text-stone-400 dark:text-slate-300 block mt-2 text-lg md:inline-block md:mt-0 hover:text-stone-400 md:mr-4 border-b-[1px] border-black dark:border-stone-500 md:border-0" +
              (signedUser ? "" : " text-stone-400 dark:text-stone-500")
            }
          >
            <button className="cursor-auto">
              <Link
                to={`/stats`}
                className={signedUser ? "" : " cursor-auto "}
                onClick={() => handleClearHistoryOrStatsFilters("stats")}
              >
                Statistics
              </Link>
            </button>
          </div>
        </div>

        {signedUser ? (
          <div>
            <Link
              to={`/settings`}
              className=" dark:text-slate-300 dark:hover:text-stone-400 block mt-2 text-lg md:inline-block md:mt-0 hover:text-stone-400 md:px-4 border-b-[1px] border-black dark:border-stone-500 md:border-0"
            >
              {signedUser.name} {signedUser.surname}
            </Link>

            <div
              className=" dark:text-slate-300 dark:hover:text-stone-400 block mt-2 text-lg md:inline-block md:mt-0 hover:text-stone-400 md:px-4 border-b-[1px] border-black dark:border-stone-500 md:border-0 cursor-pointer"
              onClick={handleLogOut}
            >
              Log Out
            </div>
          </div>
        ) : (
          <div>
            <Link
              className=" dark:text-slate-300 dark:hover:text-stone-400 block mt-2 text-lg md:inline-block md:mt-0 hover:text-stone-400 md:px-4 border-b-[1px] border-black dark:border-stone-500 md:border-0"
              to="/login"
            >
              Log In
            </Link>

            <Link
              to="/signup"
              className=" dark:text-slate-300 dark:hover:text-stone-400 block mt-2 text-lg md:inline-block md:mt-0 hover:text-stone-400 md:px-4 border-b-[1px] border-black dark:border-stone-500 md:border-0"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

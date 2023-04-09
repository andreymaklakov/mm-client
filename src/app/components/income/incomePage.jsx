import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import IncomeModal from "./incomeModal";
import { minusIcon, plusIcon } from "../../common/svg";
import SelectField from "../forms/selectField";
import UserMoneyTable from "../userMoneyTable";
import { incomeExpenseTimeFilter, todayDate } from "../../utils";
import Loader from "../loader";
import { useSelector, useDispatch } from "react-redux";
import {
  periods,
  incomesExpensesFilterData
} from "../../constantData/filterData";
import { getSignedUser } from "../../store/user";
import { getHistory } from "../../store/history";
import { getMoney } from "../../store/money";
import {
  clearFilterAndSetPeriod,
  openItemHistory
} from "../../store/filtration";
import _ from "lodash";

const IncomePage = () => {
  const [modalIsHidden, setModalIsHidden] = useState(true);
  const [modalIsPlus, setmodalIsPlus] = useState();
  const [accountParams, setAccountParams] = useState({
    accId: "",
    account: "",
    currency: ""
  });
  const [userMoneyState, setUserMoneyState] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState();
  const selectOptions = periods;
  const sortBy = { path: "accountTimeStamp", order: "asc" };

  const signedUser = useSelector(getSignedUser());
  const userHistory = useSelector(getHistory());
  const userMoney = useSelector(getMoney());

  const dispatch = useDispatch();

  useEffect(() => {
    setSelectedPeriod(periods[0]);
  }, []);

  useEffect(() => {
    selectedPeriod &&
      userHistory &&
      userMoney &&
      setUserMoneyState(
        incomeExpenseTimeFilter(selectedPeriod, userHistory.incomes, userMoney)
      );
  }, [selectedPeriod, userHistory, signedUser, userMoney]);

  const handleChange = ({ target }) => {
    setSelectedPeriod({ name: target.value });
  };

  const handleModalOpen = (id, name, symbol, currency) => {
    setModalIsHidden(false);
    setmodalIsPlus(symbol);
    setAccountParams({ accCurrency: currency, accId: id, account: name });
  };

  const handleModalClose = (setData) => {
    setModalIsHidden(true);
    setData({ amount: "", comment: "", date: todayDate() });
  };

  const handleOpenItemHistory = (data) => {
    dispatch(openItemHistory(data));
  };

  const handleClearHistoryOrStatsFilters = () => {
    dispatch(clearFilterAndSetPeriod());
  };

  let sortedUserMoney = _.orderBy(
    userMoneyState,
    [sortBy.path],
    [sortBy.order]
  );

  if (selectedPeriod && selectOptions && incomesExpensesFilterData) {
    return (
      <div className="flex justify-center">
        <div className="bg-white dark:bg-[#40444b] dark:text-slate-300  w-auto m-5 rounded-2xl shadow-xl min-w-[360px] mt-[60px] relative">
          <h1 className="text-center font-medium	text-xl mt-4">Income</h1>
          <br />

          <table className="table-auto border-spacing-x-10 border-separate">
            <tbody>
              <tr>
                <td className="text-lg font-medium pb-5">Period</td>
                <td className="text-lg font-medium pb-5">
                  <div className="inline-block relative w-30 ">
                    <SelectField
                      options={selectOptions}
                      name="period"
                      value={selectedPeriod.name}
                      onChange={handleChange}
                    />
                  </div>
                </td>
              </tr>
              <UserMoneyTable
                userMoney={sortedUserMoney}
                deleteAccOrIncomeModalOpen={handleModalOpen}
                deleteOrPlusIcon={plusIcon}
                penOrMinusIcon={minusIcon}
                page="income"
                selectedPeriod={selectedPeriod.name}
              />
            </tbody>
          </table>

          <button
            onClick={() => {
              handleClearHistoryOrStatsFilters();
              handleOpenItemHistory({
                incomesExpenses: incomesExpensesFilterData[0]._id
              });
            }}
            className="m-[34px] mt-2 font-medium hover:text-stone-400 hover:border-[1px] hover:border-black dark:hover:border-stone-500 rounded 2xl w-[125px] h-[32px]"
          >
            <Link to={`/history`}>
              <h1 className="p-1">Income History</h1>
            </Link>
          </button>
        </div>

        <IncomeModal
          modalIsHidden={modalIsHidden}
          modalIsPlus={modalIsPlus}
          closeModal={handleModalClose}
          accountParams={accountParams}
        />
      </div>
    );
  }
  return <Loader />;
};

export default IncomePage;

import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { closeIcon, deleteIcon, penIcon, plusIcon } from "../../common/svg";
import SelectField from "../forms/selectField";
import ExpenseIconsModal from "./expenseIconsModal";
import ExpenseRenameModal from "./expenseRenameModal";
import ChangeExpenseModal from "./changeExpenseModal";
import { incomeExpenseTimeFilter } from "../../utils";
import { useSelector, useDispatch } from "react-redux";
import { getSignedUser } from "../../store/user";
import { addSpentExpToHistory, getHistory } from "../../store/history";
import { getMoney } from "../../store/money";
import {
  changeExpeseParams,
  deleteExpense,
  getExpenses
} from "../../store/expenses";
import { openItemHistory } from "../../store/filtration";

const ExpenseModal = ({
  modalIsHidden,
  closeModal,
  expense,
  selectOptions,
  icons,
  iconsLink
}) => {
  const [expenseChangeModalIsHidden, setExpenseChangeModalIsHidden] =
    useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(selectOptions[0]);
  const [iconsModalIsHidden, setIconsModalIsHidden] = useState(true);
  const [renameModalIsHidden, setRenameModalIsHidden] = useState(true);
  const [data, setData] = useState({
    amount: "",
    currency: "",
    icon: "more",
    _id: "",
    name: ""
  });
  const [userExpense, setUserExpense] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState();

  const signedUser = useSelector(getSignedUser());
  const userHistory = useSelector(getHistory());
  const userMoney = useSelector(getMoney());
  const userExpenses = useSelector(getExpenses());

  const modalRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    expense &&
      setSelectedExpense(
        ...userExpenses.filter((exp) => exp._id === expense._id)
      );
  }, [userExpenses, expense]);

  useEffect(() => {
    selectedExpense &&
      userExpenses &&
      setUserExpense(
        incomeExpenseTimeFilter(
          selectedPeriod,
          userHistory.expenses,
          userExpenses,
          true
        ).filter((exp) => exp._id === selectedExpense._id)
      );

    selectedExpense &&
      setData({
        amount: selectedExpense.amount,
        currency: selectedExpense.currency,
        icon: selectedExpense.icon,
        _id: selectedExpense._id,
        name: selectedExpense.name
      });
  }, [selectedPeriod, userHistory, signedUser, modalIsHidden, selectedExpense]);

  const handleModalOpen = (modal) => {
    if (modal === "rename") {
      setRenameModalIsHidden(false);
    } else if (modal === "change") {
      setExpenseChangeModalIsHidden(false);
    } else {
      setIconsModalIsHidden(false);
    }
  };

  const handleModalClose = (modal) => {
    if (modal === "rename") {
      setRenameModalIsHidden(true);
    } else if (modal === "change") {
      setExpenseChangeModalIsHidden(true);
    } else {
      setIconsModalIsHidden(true);
    }
  };

  const handleChange = ({ target }) => {
    setSelectedPeriod({ name: target.value });
  };

  const handleChoosenIcon = (icon) => {
    dispatch(
      changeExpeseParams({
        ...selectedExpense,
        icon: icon,
        name: data.name
      })
    );

    setData((prevState) => ({ ...prevState, icon: icon }));

    handleModalClose();
  };

  const handleChangeExpenseName = (data) => {
    dispatch(changeExpeseParams({ ...selectedExpense, name: data.name }));

    setData((prevState) => ({ ...prevState, name: data.name }));
  };

  const handleSpentChangeExpense = (data, expId) => {
    dispatch(addSpentExpToHistory(expId, userMoney, userExpenses, data));
  };

  const handleCloseThisModal = () => {
    closeModal();

    setSelectedPeriod(selectOptions[0]);
  };

  const handleDeleteExpense = (expense) => {
    dispatch(deleteExpense(expense));
    handleCloseThisModal();
  };

  const handleOpenItemHistory = (data) => {
    dispatch(openItemHistory(data));
  };

  return (
    <div
      ref={modalRef}
      className={
        "flex flex-col justify-center items-center absolute bg-black bg-opacity-50 w-[100vw] h-[110vh]" +
        (modalIsHidden ? " hidden" : "")
      }
      onClick={(event) => {
        event.target === modalRef.current && handleCloseThisModal();
      }}
    >
      <div className="bg-white dark:bg-[#40444b] dark:text-slate-300 absolute top-[100px] h-auto w-auto min-w-[300px] m-5 rounded-2xl shadow-xl">
        {selectedExpense && (
          <>
            <h1 className="text-center font-medium	text-xl mt-4">{data.name}</h1>

            <div
              className="cursor-pointer absolute top-4 right-4 text-stone-800 hover:text-stone-400"
              onClick={() => {
                handleCloseThisModal();
              }}
            >
              {closeIcon()}
            </div>

            <table className="table-auto border-spacing-x-10 border-separate mt-9 mb-4">
              <tbody>
                <tr>
                  <td className="text-lg font-medium  pb-5">Period</td>
                  <td className="text-lg font-medium  pb-5">
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

                <tr>
                  <td className="text-lg">Spent</td>
                  <td className="text-lg">
                    {userExpense[0]?.amount.toFixed(2)}
                    {data.currency}
                  </td>
                  <td>
                    <button
                      className="relative ml-[-120px] mt-1"
                      onClick={() => {
                        handleModalOpen("change");
                      }}
                    >
                      {plusIcon("expense")}
                    </button>

                    <button
                      className="relative"
                      onClick={() => {
                        handleDeleteExpense(expense);
                      }}
                    >
                      {deleteIcon("expense")}
                    </button>

                    <button
                      className="relative"
                      onClick={() => {
                        handleModalOpen("rename");
                      }}
                    >
                      {penIcon("expense")}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex items-center justify-between mb-9">
              <button
                className="mx-9 mt-[-2px] text-gray-700 dark:text-slate-300 text-sm font-bold rounded 2xl h-[40px] w-[60px] p-1  hover:text-stone-400  dark:hover:text-stone-400 hover:border-[1px] hover:border-black dark:hover:border-stone-500"
                onClick={() => {
                  handleOpenItemHistory({
                    items: expense._id
                  });
                }}
              >
                <Link to={`/history`}>History</Link>
              </button>
              <div>
                <button
                  className="mr-[70px] text-gray-700 dark:text-slate-300 text-sm font-bold hover:text-stone-400 dark:hover:text-stone-400  hover:border-[1px] hover:border-black dark:hover:border-stone-500 rounded 2xl w-[150px] h-[40px] p-1"
                  onClick={(e) => {
                    e.preventDefault();
                    handleModalOpen();
                  }}
                >
                  Change Icon
                  <img
                    className="inline-block pl-2"
                    src={`${iconsLink}${data.icon}.png`}
                    alt="icon"
                  />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <ExpenseIconsModal
        modalIsHidden={iconsModalIsHidden}
        closeModal={handleModalClose}
        data={data.icon}
        onClick={handleChoosenIcon}
        icons={icons}
        iconsLink={iconsLink}
      />

      <ExpenseRenameModal
        modalIsHidden={renameModalIsHidden}
        closeModal={() => handleModalClose("rename")}
        name={data.name}
        id={data._id}
        onChange={handleChangeExpenseName}
      />

      <ChangeExpenseModal
        modalIsHidden={expenseChangeModalIsHidden}
        closeModal={() => handleModalClose("change")}
        expense={selectedExpense}
        onClick={handleSpentChangeExpense}
      />
    </div>
  );
};

ExpenseModal.propTypes = {
  modalIsHidden: PropTypes.bool,
  closeModal: PropTypes.func,
  expense: PropTypes.object,
  onChange: PropTypes.func,
  selectOptions: PropTypes.array,
  icons: PropTypes.object,
  iconsLink: PropTypes.string
};

export default ExpenseModal;

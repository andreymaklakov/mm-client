import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import TextField from "../forms/textField";
import {
  validator,
  isValid,
  toDateFormat,
  todayDate,
  idGenerator
} from "../../utils";
import { closeIcon } from "../../common/svg";
import TextareaField from "../forms/textareaField";
import SelectField from "../forms/selectField";
import { getMoney } from "../../store/money";
import { useSelector } from "react-redux";
import { getExpenses } from "../../store/expenses";

const ChangeExpenseModal = ({
  modalIsHidden,
  closeModal,
  expense,
  onClick
}) => {
  const [data, setData] = useState({
    account: "",
    amount: "",
    comment: "",
    date: todayDate()
  });
  const [haveAccount, setHaveAccount] = useState(true);
  const [errors, setErrors] = useState({});

  const modalRef = useRef();

  const userMoney = useSelector(getMoney());
  const userExpenses = useSelector(getExpenses());

  const noAcc = [{ _id: "noAcc", name: "No account with such currency" }];

  expense &&
    (expense?.expId
      ? expense
      : ((expense = { ...expense, expId: expense?._id }), delete expense?._id));

  useEffect(() => {
    setHaveAccount(true);
  }, [expense]);

  useEffect(() => {
    expense?.expId &&
      setHaveAccount(
        expense.currency
          ? true
          : userMoney.filter(
              (account) =>
                account.currency ===
                userExpenses.filter((exp) => exp._id === expense.expId)[0]
                  ?.currency
            ).length
          ? true
          : false
      );
  }, [expense?.expId, modalIsHidden]);

  useEffect(() => {
    expense?.expId &&
      (expense._id
        ? setData({
            account: expense.account,
            amount: String(expense.amount),
            comment: expense.comment,
            date: expense.date
          })
        : setData((prevState) => ({
            ...prevState,
            account: userMoney?.filter(
              (account) =>
                account.currency ===
                userExpenses?.filter((exp) => exp._id === expense.expId)[0]
                  .currency
            )[0]?._id
          })));
  }, [expense?.expId, modalIsHidden]);

  const validatorConfig = {
    amount: {
      isRequired: { message: "Amount is required" }
    },
    account: {
      noAccount: { message: "Please first add account with such currency" }
    },
    date: {
      isNotFuture: { message: "Date can not be more than today" },
      isRequired: { message: "Date is required" }
    }
  };

  useEffect(() => {
    validate(data, setErrors, validatorConfig);
  }, [data]);

  const validate = useCallback((data, setErrors, validatorConfig) => {
    const errors = validator(data, validatorConfig);

    setErrors(errors);

    return Object.keys(errors).length === 0;
  }, []);

  const handleChange = useCallback(({ target }) => {
    setData((prevState) => ({ ...prevState, [target.name]: target.value }));
  }, []);

  const handleClose = () => {
    closeModal();

    setData({
      account:
        expense.account ||
        userMoney.filter(
          (account) =>
            account.currency ===
            userExpenses.filter((exp) => exp._id === expense.expId)[0].currency
        )[0]?._id,
      amount: "",
      comment: "",
      date: todayDate()
    });

    setHaveAccount(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validate(data, setErrors, validatorConfig);

    if (!isValid) return;

    if (
      userMoney.filter((account) => account._id === data.account)[0]?.amount -
        data.amount <
      0
    ) {
      alert("You do not have such amount on this account");
      return;
    }

    await onClick(expense, {
      ...data,
      account: data.account,
      amount: Number(data.amount),
      date: toDateFormat(data.date),
      item: expense.expId,
      _id: expense._id ? expense._id : idGenerator()
    });

    handleClose();
  };

  isValid(errors);

  return (
    <div
      ref={modalRef}
      className={
        "flex flex-col justify-center items-center absolute bg-black bg-opacity-50 w-[100vw] h-[110vh]" +
        (modalIsHidden ? " hidden" : "")
      }
      onClick={(event) => {
        event.target === modalRef.current && handleClose();
      }}
    >
      <div className="bg-white dark:bg-[#40444b] dark:text-slate-300 h-auto absolute top-[100px] w-auto min-w-[300px] m-5 rounded-2xl shadow-xl ">
        <h1 className="text-center font-medium	text-xl mt-4">{expense?.name}</h1>

        <button
          className="cursor-pointer absolute top-4 right-4 text-stone-800 hover:text-stone-400"
          onClick={() => handleClose()}
        >
          {closeIcon()}
        </button>

        <form
          action=""
          method="post"
          className="px-8 pt-6 pb-8 mb-4 w-[416px]"
          onSubmit={handleSubmit}
        >
          <TextField
            label="Amount:"
            type="number"
            name="amount"
            value={data.amount}
            onChange={handleChange}
            placeholder="Enter amount..."
            error={errors.amount}
            autoFocus
          />

          <div className="block relative">
            <h1 className="block text-gray-700 dark:text-slate-300 text-sm font-bold  m-2 ml-0">
              Choose Account:
            </h1>

            <SelectField
              options={haveAccount ? userMoney : noAcc}
              name="account"
              value={haveAccount ? data.account : noAcc[0]._id}
              onChange={handleChange}
              disabledCheck={expense?.currency}
              error={errors.account}
            />
          </div>

          <TextareaField
            name="comment"
            value={data.comment}
            onChange={handleChange}
            placeholder="Enter your comment..."
          />

          <TextField
            type="date"
            name="date"
            value={data.date}
            onChange={handleChange}
            error={errors.date}
          />

          <div className="flex justify-center mt-8">
            <button
              className={
                "m-10 mt-0 font-medium rounded 2xl w-[130px] h-[32px] p-1" +
                (!isValid(errors)
                  ? " text-stone-400 dark:text-stone-500"
                  : " hover:text-stone-400 hover:border-[1px] hover:border-black dark:hover:border-stone-500")
              }
              type="submit"
              disabled={!isValid(errors)}
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ChangeExpenseModal.propTypes = {
  modalIsHidden: PropTypes.bool,
  closeModal: PropTypes.func,
  expense: PropTypes.object,
  onClick: PropTypes.func
};

export default ChangeExpenseModal;

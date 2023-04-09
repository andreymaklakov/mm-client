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
import { addIncomeToHistory } from "../../store/history";
import { useDispatch, useSelector } from "react-redux";
import { getMoney } from "../../store/money";

const IncomeModal = ({
  modalIsHidden,
  modalIsPlus,
  closeModal,
  accountParams
}) => {
  const [data, setData] = useState({
    amount: "",
    comment: "",
    date: todayDate()
  });
  const [errors, setErrors] = useState({});

  const userMoney = useSelector(getMoney());

  const modalRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    let res;

    accountParams._id &&
      setData({
        amount: accountParams.amount
          ? accountParams.amount > 0
            ? String(accountParams.amount)
            : (((res = String(accountParams.amount).split("")), res.shift()),
              res.join(""))
          : "",
        comment: accountParams.comment,
        date: accountParams.date
      });
  }, [accountParams]);

  useEffect(() => {
    validate(data, setErrors);
  }, [data]);

  const validate = useCallback((data, setErrors) => {
    const errors = validator(data);

    setErrors(errors);

    return Object.keys(errors).length === 0;
  }, []);

  const handleChange = useCallback(({ target }) => {
    setData((prevState) => ({ ...prevState, [target.name]: target.value }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validate(data, setErrors);

    if (!isValid) return;

    if (
      !modalIsPlus &&
      userMoney.filter((account) => account._id === accountParams.accId)[0]
        .amount -
        data.amount <
        0
    ) {
      alert("You can not remove more than you have");
      return;
    }

    dispatch(
      addIncomeToHistory(
        accountParams._id ? accountParams._id : idGenerator(),
        accountParams.accId,
        {
          ...data,
          amount: modalIsPlus ? Number(data.amount) : Number(-data.amount),
          comment: data.comment,
          date: toDateFormat(data.date)
        },
        accountParams.account,
        accountParams.accCurrency,
        userMoney,
        accountParams._id ? true : false
      )
    );

    closeModal(setData);
  };

  isValid(errors);

  return (
    <div
      ref={modalRef}
      className={
        "flex flex-col justify-center items-center absolute bg-black  bg-opacity-50 w-[100vw] h-[110vh]" +
        (modalIsHidden ? " hidden" : "")
      }
      onClick={(event) => {
        event.target === modalRef.current && closeModal(setData);
      }}
    >
      <div className="bg-white dark:bg-[#40444b] dark:text-slate-300 h-auto w-auto absolute top-[100px] min-w-[300px] m-5 rounded-2xl shadow-xl">
        <h1 className="text-center font-medium	text-xl mt-4">
          {accountParams.account}
        </h1>

        <button
          className="cursor-pointer absolute top-4 right-4 text-stone-800 hover:text-stone-400"
          onClick={() => closeModal(setData)}
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
              {modalIsPlus ? "Add Income" : "Remove Income"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

IncomeModal.propTypes = {
  modalIsHidden: PropTypes.bool,
  modalIsPlus: PropTypes.bool,
  closeModal: PropTypes.func,
  accountParams: PropTypes.object
};

export default IncomeModal;

import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import ExpenseIconsModal from "./expenseIconsModal";
import { closeIcon } from "../../common/svg";
import TextField from "../forms/textField";
import { validator, isValid } from "../../utils";
import SelectField from "../forms/selectField";
import { useSelector, useDispatch } from "react-redux";
import { getSignedUser } from "../../store/user";
import { createExpense } from "../../store/expenses";

const AddExpenseModal = ({
  modalIsHidden,
  closeModal,
  selectOptions,
  icons,
  iconsLink
}) => {
  const [iconsModalIsHidden, setIconsModalIsHidden] = useState(true);

  const signedUser = useSelector(getSignedUser());

  const [data, setData] = useState({
    amount: 0,
    currency: selectOptions.filter((cur) => cur.name === signedUser.currency)[0]
      ._id,
    icon: "more",
    name: ""
  });
  const [errors, setErrors] = useState({});

  const modalRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    setData({
      amount: 0,
      currency: selectOptions.filter(
        (cur) => cur.name === signedUser.currency
      )[0]._id,
      icon: "more",
      name: ""
    });
  }, [modalIsHidden]);

  useEffect(() => {
    validate(data, setErrors, validatorConfig);
  }, [data]);

  const validatorConfig = {
    name: {
      isRequired: { message: "Name is required" }
    }
  };

  const validate = useCallback((data, setErrors, validatorConfig) => {
    const errors = validator(data, validatorConfig);

    setErrors(errors);

    return Object.keys(errors).length === 0;
  }, []);

  const handleChange = useCallback(({ target }) => {
    setData((prevState) => ({ ...prevState, [target.name]: target.value }));
  }, []);

  const handleModalOpen = () => {
    setIconsModalIsHidden(false);
  };

  const handleModalClose = () => {
    setIconsModalIsHidden(true);
  };

  const handleChoosenIcon = (icon) => {
    setData((prevState) => ({ ...prevState, icon: icon }));

    handleModalClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validate(data, setErrors, validatorConfig);

    if (!isValid) return;

    dispatch(
      createExpense({
        ...data,
        currency: selectOptions.filter((cur) => cur._id === data.currency)[0]
          .name
      })
    );

    closeModal();
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
        event.target === modalRef.current && closeModal();
      }}
    >
      <div className="bg-white dark:bg-[#40444b] dark:text-slate-300 h-auto w-auto absolute top-[100px] min-w-[300px] m-5 rounded-2xl shadow-xl">
        <h1 className="text-center font-medium	text-xl mt-4">New Expense</h1>

        <div
          className="cursor-pointer absolute top-4 right-4 text-stone-800 hover:text-stone-400"
          onClick={() => {
            closeModal();
          }}
        >
          {closeIcon()}
        </div>

        <form
          method="post"
          className="px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          <TextField
            label="Expense Name:"
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="Enter Expense Name..."
            error={errors.name}
            autoFocus
          />

          <div className="inline-block relative">
            <h1 className="inline-block text-gray-700 dark:text-slate-300 text-sm font-bold mr-5 ">
              Currency:
            </h1>

            <SelectField
              options={selectOptions}
              name="currency"
              value={data.currency}
              onChange={handleChange}
            />
          </div>

          <div className="mt-6">
            <button
              className="mt-0 ml-[-14px] text-gray-700 dark:text-slate-300 text-sm font-bold hover:text-stone-400 hover:border-[1px] hover:border-black dark:hover:border-stone-500 rounded 2xl w-[150px] h-[40px] p-1"
              onClick={(e) => {
                e.preventDefault();
                handleModalOpen();
              }}
            >
              Choose Icon
              <img
                className="inline-block pl-2"
                src={`${iconsLink}${data.icon}.png`}
                alt="icon"
              />
            </button>
          </div>

          <div className="flex justify-center mt-5">
            <button
              className={
                "mx-10 font-medium rounded 2xl w-[125px] p-1 h-[32px]" +
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
      <ExpenseIconsModal
        modalIsHidden={iconsModalIsHidden}
        closeModal={handleModalClose}
        data={data.icon}
        onClick={handleChoosenIcon}
        icons={icons}
        iconsLink={iconsLink}
      />
    </div>
  );
};

AddExpenseModal.propTypes = {
  modalIsHidden: PropTypes.bool,
  closeModal: PropTypes.func,
  selectOptions: PropTypes.array,
  icons: PropTypes.object,
  iconsLink: PropTypes.string
};

export default AddExpenseModal;

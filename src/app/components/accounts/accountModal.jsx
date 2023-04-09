import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import SelectField from "../forms/selectField";
import { closeIcon } from "../../common/svg";
import TextField from "../forms/textField";
import { validator, isValid } from "../../utils";
import { useSelector, useDispatch } from "react-redux";
import { getSignedUser } from "../../store/user";
import { createAccount } from "../../store/money";

const AccountModal = ({ modalIsHidden, closeModal, selectOptions }) => {
  const [data, setData] = useState({ name: "", currency: "" });
  const [errors, setErrors] = useState({});

  const modalRef = useRef();
  const dispatch = useDispatch();

  const signedUser = useSelector(getSignedUser());

  useEffect(() => {
    setData({
      amount: 0,
      currency: selectOptions.filter(
        (cur) => cur.name === signedUser.currency
      )[0]._id,
      name: ""
    });
  }, []);

  const validatorConfig = {
    name: {
      isRequired: { message: "Name is required" }
    }
  };

  const handleChange = useCallback(({ target }) => {
    setData((prevState) => ({ ...prevState, [target.name]: target.value }));
  }, []);

  useEffect(() => {
    validate(data, setErrors, validatorConfig);
  }, [data]);

  const validate = useCallback((data, setErrors, validatorConfig) => {
    const errors = validator(data, validatorConfig);

    setErrors(errors);

    return Object.keys(errors).length === 0;
  }, []);

  const handleClose = () => {
    closeModal();

    setData({
      amount: 0,
      currency: selectOptions.filter(
        (cur) => cur.name === signedUser.currency
      )[0]._id,
      name: ""
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validate(data, setErrors, validatorConfig);

    if (!isValid) return;

    dispatch(
      createAccount({
        ...data,
        currency: selectOptions.filter((cur) => cur._id === data.currency)[0]
          .name
      })
    );

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
      <div className="bg-white dark:bg-[#40444b] dark:text-slate-300  h-auto w-auto absolute top-[100px] min-w-[300px] m-5 rounded-2xl shadow-xl">
        <h1 className="text-center font-medium	text-xl mt-4">New Account</h1>

        <button
          className="cursor-pointer absolute top-4 right-4 text-stone-800 hover:text-stone-400"
          onClick={() => {
            handleClose();
          }}
        >
          {closeIcon()}
        </button>

        <form
          method="post"
          className="px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          <TextField
            label="Account Name:"
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="Enter Account Name..."
            error={errors.name}
            autoFocus
          />
          <div className="inline-block relative mt-10">
            <h1 className="inline-block text-gray-700 dark:text-slate-300  text-sm font-bold mr-5 ">
              Currency:
            </h1>

            <SelectField
              options={selectOptions}
              name="currency"
              value={data.currency}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-center mt-8">
            <button
              className={
                "m-10 mt-0 font-medium rounded 2xl w-[125px] h-[32px] p-1" +
                (isValid(errors)
                  ? " hover:text-stone-400 hover:border-[1px] hover:border-black dark:hover:border-stone-500"
                  : " text-stone-400 dark:text-stone-500")
              }
              type="submit"
              disabled={!isValid(errors)}
            >
              Add Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AccountModal.propTypes = {
  modalIsHidden: PropTypes.bool,
  closeModal: PropTypes.func,
  account: PropTypes.object,
  selectOptions: PropTypes.array
};

export default AccountModal;

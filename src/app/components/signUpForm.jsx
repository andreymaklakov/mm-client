import React, { useState, useEffect, useCallback } from "react";
import TextField from "./forms/textField";
import { validator, isValid } from "../utils";
import { useHistory } from "react-router-dom";
import SelectField from "./forms/selectField";
import Loader from "./loader";
import { currencies } from "../constantData/currencies";
import { useDispatch, useSelector } from "react-redux";
import { getAuthError, getSignedUser, signUp } from "../store/user";
import { addNewUserHistory } from "../store/history";
import { createNewUserAccs } from "../store/money";
import { createNewUserExp } from "../store/expenses";

const SingUpForm = () => {
  const [data, setData] = useState({
    currency: "$",
    email: "",
    name: "",
    password: "",
    passwordConfirm: "",
    surname: ""
  });
  const [errors, setErrors] = useState({});

  const selectOptions = currencies;

  const history = useHistory();
  const dispatch = useDispatch();

  const authError = useSelector(getAuthError());
  const signedUser = useSelector(getSignedUser());

  const handleChange = useCallback(({ target }) => {
    setData((prevState) => ({ ...prevState, [target.name]: target.value }));
  }, []);

  useEffect(() => {
    validate(data, setErrors);
  }, [data]);

  useEffect(() => {
    signedUser &&
      dispatch(createNewUserExp()) &&
      dispatch(
        createNewUserAccs([
          {
            amount: 0,
            currency:
              data.currency === "$"
                ? data.currency
                : selectOptions.filter((cur) => cur._id === data.currency)[0]
                    .name,
            name: "Cash"
          },
          {
            amount: 0,
            currency:
              data.currency === "$"
                ? data.currency
                : selectOptions.filter((cur) => cur._id === data.currency)[0]
                    .name,
            name: "Bank Account"
          }
        ])
      ) &&
      handleLogIn(signedUser._id);
  }, [signedUser]);

  const validate = useCallback((data, setErrors) => {
    const errors = validator(data);

    setErrors(errors);

    return Object.keys(errors).length === 0;
  }, []);

  const handleLogIn = () => {
    history.replace(`/main`);
  };

  const handleKeyDown = useCallback((e) => {
    if (e.keyCode === 9) {
      e.preventDefault();

      const form = e.target.form;
      const indexField = Array.prototype.indexOf.call(form, e.target);

      form.elements[indexField + 2].focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validate(data, setErrors);

    if (!isValid) return;

    const dataWithoutPassConfirm = JSON.parse(JSON.stringify(data));
    delete dataWithoutPassConfirm.passwordConfirm;

    dispatch(
      signUp({
        ...dataWithoutPassConfirm,
        currency:
          data.currency === "$"
            ? data.currency
            : selectOptions.filter((cur) => cur._id === data.currency)[0].name
      })
    );

    dispatch(addNewUserHistory());
  };

  isValid(errors);

  if (selectOptions) {
    return (
      <div className="flex flex-col justify-center items-center pt-10">
        <h1 className="dark:text-slate-300 text-center font-medium	text-xl">
          Sign Up
        </h1>
        <div className="bg-white dark:bg-[#40444b] h-auto w-auto min-w-[300px] m-5 rounded-2xl shadow-xl">
          <form
            action=""
            method="post"
            className="px-8 pt-6 pb-8 mb-4"
            onSubmit={handleSubmit}
          >
            <TextField
              label="Name:"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter your Name..."
              error={errors.name}
              autoFocus
            />

            <TextField
              label="Surname:"
              name="surname"
              value={data.surname}
              onChange={handleChange}
              placeholder="Enter your Surname..."
              error={errors.surname}
            />

            <div>
              <h1 className="inline-block text-gray-700 dark:text-slate-300 text-sm font-bold mr-5 ">
                Select Default Currency:
              </h1>

              <SelectField
                options={selectOptions}
                name="currency"
                value={data.currency}
                onChange={handleChange}
              />
            </div>

            <TextField
              label="Email:"
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your Email..."
              error={errors.email}
            />

            <TextField
              label="Password:"
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Enter your password..."
              error={errors.password}
              onKeyDown={handleKeyDown}
            />

            <TextField
              label="Confirm your Password:"
              type="password"
              name="passwordConfirm"
              value={data.passwordConfirm}
              onChange={handleChange}
              placeholder="Enter your password..."
              error={errors.passwordConfirm}
            />

            <div className="flex justify-end mt-8">
              <button
                className={
                  "bg-blue-500 dark:bg-[#2e3136] text-white dark:text-slate-200 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" +
                  (!isValid(errors)
                    ? " bg-blue-400 dark:bg-[#383b41]"
                    : " hover:bg-blue-700 dark:hover:bg-stone-500")
                }
                type="submit"
                disabled={!isValid(errors)}
              >
                Sign Up
              </button>
            </div>

            {authError &&
              (authError.includes("||") ? (
                authError.split("||").map((part, i) => (
                  <p key={i} className="text-sm text-red-500 overflow-auto">
                    {part}
                  </p>
                ))
              ) : (
                <p className="text-sm text-red-500 overflow-auto">
                  {authError}
                </p>
              ))}
          </form>
        </div>
        <p className="text-center text-gray-500 text-xs">
          &copy;2022 Money Manager. All rights reserved.
        </p>
      </div>
    );
  }
  return <Loader />;
};

export default SingUpForm;
